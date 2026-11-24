const { cpSync, mkdirSync } = require("node:fs");
const path = require("node:path");
const output = path.resolve(__dirname, "../public/pdf-assets");
mkdirSync(output, { recursive: true });
const sources = {
  "pdfjs-dist/legacy/build/pdf.min.mjs": "pdf.mjs",
  "pdfjs-dist/legacy/build/pdf.worker.min.mjs": "pdf.worker.mjs",
  "pdfjs-dist/cmaps": "cmaps",
  "pdfjs-dist/standard_fonts": "fonts",
  "pdfjs-dist/wasm": "wasm",
  "pdfjs-dist/iccs": "iccs",
  "tesseract.js/dist/worker.min.js": "ocr-worker.js",
  "tesseract.js-core/tesseract-core-lstm.wasm.js": "tesseract-core-lstm.wasm.js",
  "@tesseract.js-data/eng/4.0.0_best_int/eng.traineddata.gz": "eng.traineddata.gz",
};
for (const [from, to] of Object.entries(sources)) {
  cpSync(path.resolve(__dirname, "../node_modules", from), path.join(output, to), { recursive: true });
}
