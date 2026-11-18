# Bugs and findings (replica-test, 2026-11-18)

Tested on the local site (`npm run build`, `node scripts/serve.mjs`, port 4173) in the in-app Chromium at 1024×768 and 375×812, in English and Arabic.

Cases run:
- Open by file picker.
- Every export format: SVG, PDF, EPS, DXF and PNG all download; the SVG parses and has no NaN.
- A text file, a corrupt PNG, a 1×1 picture and a transparent PNG.
- Remove background, then undo and redo.
- Regions: click to remove, undo, redo, then export.
- The Arabic editor panels.
- Phone width: no sideways scroll.

## Fixed on `claude/replica-review`

### B1 · S2 · Clicking a shape in Regions never removed it
- **Steps:** open a picture, open Regions, tick "Click shapes to remove them", click a shape.
- **Expected:** the shape disappears.
- **Actual:** nothing happens. On `pointerdown` the canvas captures the pointer, so on `pointerup` `e.target` is the canvas, never the `path`.
- **Fix:** `src/js/app.js` now finds the shape with `document.elementFromPoint`.
- **Checked:** with real clicks, the stats go from 3 to 2 shapes, undo and redo work, and the SVG export has 2 paths.

### B2 · S3 · Opening a bad file while the editor is open shows no message
- **Steps:** with the editor open, drop or paste a `.txt` file or a broken PNG.
- **Expected:** an error.
- **Actual:** the message goes to the drop zone's status line, which is hidden behind the editor.
- **Fix:** with the editor open it now also shows in the editor's error dialog.
- **Checked:** both cases show the dialog.

### B3 · S4 · "1 colors · 1 shapes"
- **Fix:** singular forms, with Arabic "لون / شكل / مقطع منحنى".
- **Checked:** the stats read "1 color · 1 shape".

### B4 · Copy · Dialog headings copied word for word from vectorizer.ai
- "Network Error", "Fatal Error :-(", "Please help us improve!" and "Thank you - please share the love!" appear verbatim on vectorizer.ai's page. "All tools" does too.
- **Fix:** they are rewritten as "Tracing on this page", "This picture didn't trace" and "Back to tools". The feedback and thanks dialogs are removed, because they stored the answer nowhere: asking for feedback that goes nowhere is worse than not asking.

## To check (not fixed, the owner decides)

- **Gap filler is preview only.** The "Gap filler (hides hairline seams)" checkbox changes only the on-screen preview. Exports are fill-only on purpose (`sanitizeExport` in `vectorize.js` says "Illustrator-safe"), so a downloaded SVG/PDF can still show hairline seams in viewers that anti-alias. Either say "preview only" in the label, or add a fill-safe gap option to the exports.
- **Arabic dual.** "2 ألوان" would read better as "لونان". This is cosmetic.
- **Not covered here:** the Electron app, drag and drop with a real mouse, paste from the real clipboard, and pictures larger than 4096 px.
