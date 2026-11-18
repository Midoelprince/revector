# Test plan (replica-test)

Run it on the built site: `npm run build`, then `node scripts/serve.mjs` (port 4173). Check it in English and in Arabic, at desktop width and at 375 px.

| # | area | case | pass when |
| --- | --- | --- | --- |
| 1 | input | Open a PNG and a JPG with the file picker | The editor opens and the trace shows |
| 2 | input | Drag a picture onto the drop zone | Same as 1 |
| 3 | input | Paste a picture (Ctrl+V) | Same as 1 |
| 4 | input | Open a `.txt` file, with the editor closed and with it open | A clear error shows in both cases |
| 5 | input | Open a corrupt PNG | A clear error, and no console error |
| 6 | input | Open a 1×1 picture and a transparent PNG | Traces, or an empty result, without crashing |
| 7 | tracing | Change presets and colour count | The trace updates and the stats change |
| 8 | editing | Remove background, then undo and redo | The background goes and comes back |
| 9 | editing | Regions: click a shape, then undo and redo | The shape hides and returns; the stats follow |
| 10 | editing | Recolour, merge and split a palette colour | The preview and the stats follow |
| 11 | viewing | Split view, outlines, zoom, pan | No jumps, and the overlay stays aligned |
| 12 | output | Download SVG, PDF, EPS, DXF and PNG | Every file opens; the SVG parses and has no `NaN` |
| 13 | output | Export after removing a shape | The removed shape is not in the file |
| 14 | output | Gap filler on, then export | Known: preview only (see `bugs.md`) |
| 15 | i18n | Arabic, every editor panel | Every string is translated and RTL is correct |
| 16 | layout | 375 px width | No sideways scroll and the buttons can be reached |
| 17 | engine | `__bench`, `__shapeTest`, `__signSuite(Revector)` (AGENTS.md) | Clean art is byte-identical to `main` |
| 18 | desktop | Electron app: open, trace, save, auto-update | Not covered in this pass |
