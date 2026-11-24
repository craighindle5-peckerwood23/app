import { PDFDocument, degrees } from "pdf-lib";

const assets = "/pdf-assets/";
const maxPixels = 6000000;
const maxPages = 150;

async function readPdf(data) {
  const pdfjs = await import(/* webpackIgnore: true */ "/pdf-assets/pdf.mjs");
  pdfjs.GlobalWorkerOptions.workerSrc = assets + "pdf.worker.mjs";
  const task = pdfjs.getDocument({
    data, isEvalSupported: false,
    cMapUrl: assets + "cmaps/", cMapPacked: true, standardFontDataUrl: assets + "fonts/",
    wasmUrl: assets + "wasm/", iccUrl: assets + "iccs/", maxImageSize: -1,
  });
  try {
    // Reject explicitly on password prompts, including owner-restricted encrypted PDFs.
    const doc = await new Promise((resolve, reject) => {
      task.onPassword = () => reject(new Error("Open an unlocked copy of this PDF first."));
      task.promise.then(resolve, reject);
    });
    if (await doc.getPermissions() !== null) throw new Error("Open an unlocked copy of this PDF first.");
    if (!doc.numPages || doc.numPages > maxPages) throw new Error("Choose a PDF with 1–150 pages.");
    return doc;
  } catch (error) {
    await task.destroy();
    throw error;
  }
}

export async function openPdf(file, recover = false) {
  try {
    return await readPdf(new Uint8Array(await file.arrayBuffer()));
  } catch (error) {
    if (!recover || /unlocked|1–150/.test(error.message)) throw error;
    // A missing trailer can leave valid page objects that a fresh cross-reference table restores.
    const recovered = await PDFDocument.load(await file.arrayBuffer(), { throwOnInvalidObject: true });
    if (!recovered.getPageCount() || recovered.getPageCount() > maxPages) throw error;
    return readPdf(await recovered.save({ addDefaultPage: false }));
  }
}

export async function pageImage(doc, number) {
  const page = await doc.getPage(number);
  const size = page.getViewport({ scale: 1 });
  const scale = Math.min(2.5, Math.sqrt(maxPixels / (size.width * size.height)), 8192 / Math.max(size.width, size.height));
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(viewport.width));
  canvas.height = Math.max(1, Math.round(viewport.height));
  await page.render({ canvas, viewport, background: "white" }).promise;
  return { canvas, width: size.width, height: size.height };
}

export function paintCorrection(canvas, edit) {
  const ctx = canvas.getContext("2d");
  const x = edit.x * canvas.width, y = edit.y * canvas.height;
  const width = edit.width * canvas.width, height = edit.height * canvas.height;
  ctx.fillStyle = "white";
  ctx.fillRect(x, y, width, height);
  ctx.fillStyle = "black";
  let size = height * 0.82;
  ctx.font = size + "px sans-serif";
  const measured = ctx.measureText(edit.text).width;
  if (measured > width) size *= width / measured;
  ctx.font = size + "px sans-serif";
  ctx.textBaseline = "middle";
  ctx.fillText(edit.text, x, y + height / 2);
}

export function selectedPages(range, count) {
  if (!range.trim()) return Array.from({ length: count }, (_, i) => i);
  const pages = [];
  for (const part of range.split(",")) {
    const match = /^(\d+)(?:\s*-\s*(\d+))?$/.exec(part.trim());
    if (!match) throw new Error("Use page numbers or ranges, such as 3, 1-2.");
    const first = Number(match[1]), last = Number(match[2] || match[1]);
    if (first < 1 || last < first || last > count || pages.length + last - first + 1 > maxPages)
      throw new Error("Check the page range and keep the output within 150 pages.");
    for (let page = first; page <= last; page++) pages.push(page - 1);
  }
  return pages;
}

export async function organize(files, range, angle) {
  const output = await PDFDocument.create();
  for (const file of files) {
    const input = await PDFDocument.load(await file.arrayBuffer());
    const numbers = selectedPages(files.length === 1 ? range : "", input.getPageCount());
    if (output.getPageCount() + numbers.length > maxPages) throw new Error("The output exceeds 150 pages.");
    for (const page of await output.copyPages(input, numbers)) {
      page.setRotation(degrees((page.getRotation().angle + angle) % 360));
      output.addPage(page);
    }
  }
  return new Blob([await output.save()], { type: "application/pdf" });
}

export async function visualPdf(doc, file, edits, repair, progress) {
  const out = await PDFDocument.create();
  const original = repair ? null : await PDFDocument.load(await file.arrayBuffer());
  let imageBytes = 0;
  for (let n = 1; n <= doc.numPages; n++) {
    const changes = edits.filter(edit => edit.page === n);
    if (!repair && !changes.length) {
      const [untouched] = await out.copyPages(original, [n - 1]);
      out.addPage(untouched);
      continue;
    }
    progress("Rendering page " + n + " of " + doc.numPages);
    const { canvas, width, height } = await pageImage(doc, n);
    changes.forEach(edit => paintCorrection(canvas, edit));
    const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/png"));
    if (!blob) throw new Error("This page could not be saved.");
    imageBytes += blob.size;
    if (imageBytes > 48 * 1024 * 1024) throw new Error("This output is too large to rebuild on this device.");
    const image = await out.embedPng(await blob.arrayBuffer());
    const page = out.addPage([width, height]);
    page.drawImage(image, { x: 0, y: 0, width, height });
    canvas.width = canvas.height = 0;
  }
  return new Blob([await out.save()], { type: "application/pdf" });
}

export async function toWord(doc, progress, forceOcr, maxScans) {
  const { Document, Paragraph, Packer } = await import("docx");
  let worker, scans = 0;
  const paragraphs = [];
  let hasText = false;
  try {
    for (let n = 1; n <= doc.numPages; n++) {
      progress("Reading page " + n + " of " + doc.numPages);
      const page = await doc.getPage(n);
      const { items } = await page.getTextContent();
      let text = items.map(item => (item.str || "") + (item.hasEOL ? "\n" : " ")).join("").trim();
      if (!text || forceOcr) {
        if (++scans > maxScans) throw new Error("The on-device OCR trial accepts one scanned page per export. Select a single page in Organize pages first.");
        if (!worker) {
          const { createWorker } = await import("tesseract.js");
          worker = await createWorker("eng", 1, {
            workerPath: assets + "ocr-worker.js", corePath: assets + "tesseract-core-lstm.wasm.js",
            langPath: assets, workerBlobURL: false,
          });
        }
        progress("Recognizing English text on page " + n);
        const { canvas } = await pageImage(doc, n);
        try { text = (await worker.recognize(canvas)).data.text.trim(); }
        finally { canvas.width = canvas.height = 0; }
      }
      hasText ||= Boolean(text);
      text.split(/\r?\n/).forEach((line, index) => paragraphs.push(new Paragraph({ text: line, pageBreakBefore: n > 1 && index === 0 })));
    }
    if (!hasText) throw new Error("No readable text was found.");
    return Packer.toBlob(new Document({ sections: [{ children: paragraphs }] }));
  } finally {
    if (worker) await worker.terminate();
  }
}
