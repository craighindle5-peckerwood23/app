import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Button } from "../components/ui/button";
import { openPdf, organize, pageImage, paintCorrection, toWord, visualPdf } from "../pdf/documents";

const modes = {
  edit: ["Correct text", "Drag a box around one line, then enter its replacement. Each corrected page becomes an image on export."],
  word: ["Convert to Word", "Export editable paragraphs. English OCR is available for one scanned page per export. Review recognized names and dates in Word."],
  pages: ["Organize pages", "Extract, reorder, rotate or merge pages. Add files in the order you want them joined."],
  repair: ["Recover a PDF", "Rebuild visible pages from a damaged file. Recovery requires readable page content. The copy loses searchable text, links, signatures and interactive fields."],
};
const field = "block w-full rounded-lg border border-slate-300 bg-white px-3 py-2";
const limit = 10 * 1024 * 1024;

function usageKey(mode) {
  return "filesolved.pdf." + (mode === "word" ? "conversion" : "manipulation") + "." + new Date().toLocaleDateString("en-CA");
}

function Preview({ doc, page, edits, selection, setSelection, onError }) {
  const canvasRef = useRef(null), start = useRef(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let current = true;
    setReady(false);
    pageImage(doc, page).then(({ canvas }) => {
      if (current) {
        edits.filter(e => e.page === page).forEach(e => paintCorrection(canvas, e));
        const target = canvasRef.current;
        target.width = canvas.width;
        target.height = canvas.height;
        target.getContext("2d").drawImage(canvas, 0, 0);
        setReady(true);
      }
      canvas.width = canvas.height = 0;
    }).catch(error => { if (current) onError(error.message); });
    return () => { current = false; };
  }, [doc, page, edits, onError]);
  const point = e => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clamp = value => Math.max(0, Math.min(1, value));
    return { x: clamp((e.clientX - rect.left) / rect.width), y: clamp((e.clientY - rect.top) / rect.height) };
  };
  const drag = e => {
    if (!start.current) return;
    const end = point(e), begin = start.current;
    setSelection({ x: Math.min(begin.x, end.x), y: Math.min(begin.y, end.y),
      width: Math.abs(end.x - begin.x), height: Math.abs(end.y - begin.y) });
  };
  return <div className="relative w-fit max-w-full border border-slate-300 bg-slate-100">
    <canvas ref={canvasRef} aria-label="Page preview. Drag to select a line to correct."
      className="block max-w-full h-auto touch-none cursor-crosshair"
      onPointerDown={e => { if (!ready) return; e.currentTarget.setPointerCapture(e.pointerId); start.current = point(e); setSelection(null); }}
      onPointerMove={drag} onPointerCancel={() => { start.current = null; setSelection(null); }}
      onPointerUp={e => { drag(e); start.current = null; }} />
    {selection && <div className="absolute pointer-events-none border-2 border-blue-600 bg-blue-500/15"
      style={{ left: selection.x * 100 + "%", top: selection.y * 100 + "%", width: selection.width * 100 + "%", height: selection.height * 100 + "%" }} />}
  </div>;
}

export default function PdfToolsPage() {
  const [mode, setMode] = useState("edit"), [files, setFiles] = useState([]), [doc, setDoc] = useState(null);
  const [page, setPage] = useState(1), [range, setRange] = useState(""), [angle, setAngle] = useState(0);
  const [selection, setSelection] = useState(null), [replacement, setReplacement] = useState(""), [edits, setEdits] = useState([]);
  const [forceOcr, setForceOcr] = useState(false), [busy, setBusy] = useState(false);
  const [error, setError] = useState(""), [status, setStatus] = useState(""), [result, setResult] = useState(null);
  const generation = useRef(0), locked = useRef(false);
  useEffect(() => () => { generation.current++; }, []);
  useEffect(() => () => { if (doc) doc.destroy(); }, [doc]);
  useEffect(() => () => { if (result) URL.revokeObjectURL(result.url); }, [result]);

  function invalidate() { setResult(null); setError(""); setStatus(""); }
  function reset() {
    generation.current++; invalidate(); setDoc(null); setFiles([]); setEdits([]); setPage(1);
    setRange(""); setAngle(0); setSelection(null); setReplacement(""); setForceOcr(false);
  }
  async function choose(list) {
    const adding = mode === "pages" && files.length > 0;
    invalidate();
    if (!list.length) return;
    if (!adding) reset();
    const selected = adding ? [...files, ...list] : list;
    if (selected.length > 12 || selected.reduce((sum, f) => sum + f.size, 0) > limit) {
      setError("Choose up to 12 PDFs totaling 10 MB or less."); return;
    }
    const id = ++generation.current;
    setBusy(true);
    try {
      let first;
      for (const file of list) {
        const next = await openPdf(file, mode === "repair");
        if (id !== generation.current) { await next.destroy(); return; }
        if (!adding && file === list[0]) { first = next; setDoc(next); }
        else await next.destroy();
      }
      setFiles(selected);
      if (first) setStatus(first.numPages + (first.numPages === 1 ? " page ready." : " pages ready."));
    } catch (err) {
      if (id === generation.current) { if (!adding) { setDoc(null); setFiles([]); } setError(err.message || "This PDF could not be read."); }
    } finally { if (id === generation.current) setBusy(false); }
  }
  async function run() {
    if (locked.current) return;
    locked.current = true; setBusy(true); invalidate();
    try {
      const key = usageKey(mode);
      if (Number(localStorage.getItem(key)) >= 3) throw new Error("You have used today's three on-device exports in this category.");
      let blob;
      if (mode === "word") blob = await toWord(doc, setStatus, forceOcr, 1);
      else if (mode === "pages") blob = await organize(files, range, angle);
      else blob = await visualPdf(doc, files[0], edits, mode === "repair", setStatus);
      const stem = files[0].name.replace(/\.pdf$/i, "");
      const suffix = { word: "-editable.docx", edit: "-corrected.pdf", repair: "-recovered.pdf", pages: "-organized.pdf" }[mode];
      localStorage.setItem(key, String(Number(localStorage.getItem(key)) + 1));
      setResult({ url: URL.createObjectURL(blob), name: stem + suffix });
      setStatus("Your copy is ready.");
    } catch (err) { setStatus(""); setError(err.message || "Export failed. Try a smaller file."); }
    finally { locked.current = false; setBusy(false); }
  }
  function recordEdit() {
    invalidate(); setEdits([...edits, { ...selection, page, text: replacement.trim() }]); setSelection(null); setReplacement("");
  }
  return <Layout title="PDF workspace">
    <main className="mx-auto max-w-4xl px-4 py-10 space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">PDF workspace</h1>
      <p className="text-slate-600">Work on a copy in this browser. Your documents stay on your device. Up to 10 MB per job and three daily exports each for conversion and page tools.</p>
      <fieldset disabled={busy} className="space-y-5">
        <label className="block font-medium">Tool<select aria-label="Tool" className={field} value={mode} onChange={e => { reset(); setMode(e.target.value); }}>
          {Object.entries(modes).map(([id, [title]]) => <option key={id} value={id}>{title}</option>)}</select></label>
        <p>{modes[mode][1]}</p>
        <label className="block font-medium">{mode === "pages" && files.length ? "Add PDFs" : "Choose PDF"}
          <input type="file" accept="application/pdf,.pdf" multiple={mode === "pages"} className={field}
            onChange={e => { choose(Array.from(e.target.files)); e.target.value = ""; }} /></label>
        {files.length > 0 && <div><ol className="list-decimal pl-6 break-words">{files.map((file, i) => <li key={i}>{file.name}</li>)}</ol>
          <button type="button" className="text-blue-700 underline mt-1" onClick={reset}>Clear files</button></div>}
        {doc && files.length > 0 && <>
          {mode === "edit" && <>
            <label className="block">Page<select aria-label="Page" className={field} value={page} onChange={e => { setPage(Number(e.target.value)); setSelection(null); setReplacement(""); }}>
              {Array.from({ length: doc.numPages }, (_, i) => <option key={i} value={i+1}>{i+1} of {doc.numPages}</option>)}</select></label>
            <Preview doc={doc} page={page} edits={edits} selection={selection} setSelection={setSelection} onError={setError} />
            <details><summary className="cursor-pointer text-blue-700">Set the selection by position</summary>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {Object.entries({ x: "Left", y: "Top", width: "Width", height: "Height" }).map(([key, label]) =>
                  <label key={key}>{label} (%)<input className={field} type="number" min="0" max="100" step="0.1"
                    value={Number(((selection?.[key] || 0) * 100).toFixed(1))} onChange={e => {
                      const box = { x: 0, y: 0, width: 0, height: 0, ...selection, [key]: Math.max(0, Math.min(100, Number(e.target.value))) / 100 };
                      box.width = Math.min(box.width, 1 - box.x); box.height = Math.min(box.height, 1 - box.y); setSelection(box);
                    }} /></label>)}
              </div>
            </details>
            {selection && <button className="text-blue-700 underline" onClick={() => { setSelection(null); setReplacement(""); }}>Clear selection</button>}
            <label className="block">Replacement text<input className={field} value={replacement} maxLength={500} onChange={e => setReplacement(e.target.value)} /></label>
            <div className="flex gap-3"><Button disabled={!selection || selection.width < 0.003 || selection.height < 0.003 || !replacement.trim()} onClick={recordEdit}>Apply correction</Button>
            {edits.length > 0 && <Button variant="outline" onClick={() => { invalidate(); setEdits(edits.slice(0,-1)); }}>Undo last correction</Button>}</div>
          </>}
          {mode === "pages" && <>
            {files.length === 1 && <label className="block">Pages to export, in order<input className={field} placeholder="All pages, or enter 3, 1-2" value={range} onChange={e => { invalidate(); setRange(e.target.value); }} /></label>}
            <label className="block">Clockwise rotation<select aria-label="Clockwise rotation" className={field} value={angle} onChange={e => { invalidate(); setAngle(Number(e.target.value)); }}>
              {[0,90,180,270].map(n => <option key={n} value={n}>{n}°</option>)}</select></label>
          </>}
          {mode === "word" && <label className="flex items-center gap-2"><input type="checkbox" checked={forceOcr} onChange={e => { invalidate(); setForceOcr(e.target.checked); }} />Use OCR even when the page contains selectable text</label>}
          <Button onClick={run} disabled={mode === "edit" && (!edits.length || selection !== null)}>{mode === "word" ? "Create Word document" : "Create PDF"}</Button>
        </>}
      </fieldset>
      <p role="status" className="text-slate-600">{busy && !status ? "Working…" : status}</p>
      {error && <p role="alert" className="text-red-700">{error}</p>}
      {result && <a className="inline-block rounded-lg bg-blue-700 px-5 py-3 text-white" href={result.url} download={result.name}>Download {result.name}</a>}
      <p><Link className="text-blue-700 underline" to="/services">All document services</Link></p>
    </main>
  </Layout>;
}
