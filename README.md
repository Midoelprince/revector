# ⚛️ Revector: High-Precision Offline Image-to-Vector Converter

Turn blurry, pixelated images (PNG, JPG, WebP, GIF, BMP) into crisp, resolution-independent vector graphics (SVG, EPS, PDF, DXF) entirely on your local device. Your images never leave your machine.

***

## ✨ Revector Highlights

*   **✅ Private by Design:** All processing happens offline. No uploads. No accounts required.
*   **⚡️ Fully Automatic Tracing:** Detailed level detection is managed automatically, with manual controls for expert tuning.
*   **🧠 Local Edge Reconstruction (1.1.0):** Pictures under 800 px are rebuilt at 4x before tracing — bilateral denoising, Otsu snapping of blurred edge pixels, and signed-distance-field interpolation of every colour region — so pixel staircases and anti-aliasing halos vanish and round shapes become true Bézier curves. No model download, no API key, no configuration.
*   **🖼️ Universal Input:** Opens PNG, JPG, WebP, GIF and BMP by picking, dragging or pasting. Pictures larger than 4096 px on a side are reduced to 4096 px before tracing.
*   **📐 Real Vector Output:** Downloads standards-compliant SVG, EPS, PDF, and DXF files that scale perfectly.
*   **🌐 Multi-Lingual:** Supports Arabic & English UI; the switcher in the top bar flips the whole interface, including the converter, to a right-to-left layout.

***

## 🛠️ Guided Workflow: Getting Started

Follow these steps to get Revector running:

### 1. Setup (Local Development/Execution)
You must have Node.js installed.

```bash
# 1. Navigate into the project directory
cd revector 

# 2. Install dependencies
npm install

# 3. Build the site into dist/ (the build is checked automatically afterwards)
npm run build

# 4. Serve dist/ locally at http://127.0.0.1:4173
node scripts/serve.mjs
```

### 2. Operating the Converter (The Core Task)
This is the primary user interaction flow:

1.  **Open:** Pick, drag and drop, or paste (Ctrl+V) a picture. The editor opens and tracing starts automatically.
2.  **Review:** Compare pixels and vectors with the split view. The panel shows the number of colours, shapes and curve segments.
3.  **Refine (optional):** Change the number of colours, detail, corners, layering or symmetry; merge, recolour or remove colours; crop; or click shapes away in edit mode. Undo/redo with Ctrl+Z / Ctrl+Y.
4.  **Download:** Save SVG, PDF, EPS, DXF or PNG.

### 3. Building the Desktop Application
To create a user-friendly application installer:

```bash
# 1. Build the site files first
npm run build

# 2. Package the Electron desktop app with electron-builder
npm run dist
```
This command outputs the installer (`Revector-Setup-<version>.exe`), the portable executable (`Revector-Portable-<version>.exe`), the `.blockmap` and `latest.yml` into the `/release` folder.

On Linux the packager needs Wine with 32-bit support and a display: `apt install wine32 xvfb`, then `xvfb-run -a npm run dist`.

### 4. Publishing a Release
Bump `"version"` in `package.json`, merge it to `main`, then create a tag that matches it (for example `v1.2.0`) — from the GitHub UI (*Releases → Draft a new release → choose a new tag*) or with `git tag v1.2.0 && git push origin v1.2.0`. The **Release** workflow (`.github/workflows/release.yml`) builds the Windows installer and portable app on a Windows runner and attaches them, with the `.blockmap` and `latest.yml` the in-app updater reads, to the release.

***

## 📚 Technical Notes & Troubleshooting

**❓ Error: Tracing Fails**
If the result is poor, set the number of colours by hand, raise the detail, or crop to the part you need. Photos with many soft gradients trace into many shapes; logos, icons and flat artwork give the cleanest results. If the background tracing helper cannot load, Revector shows a notice and keeps tracing on the page itself.

**⚙️ Development Deep Dive**
*   The core vectorizer logic resides in `src/js/vectorize.js`; `src/js/worker.js` runs it off the main thread.
*   The desktop application shell is managed by `electron/main.cjs` and `electron/preload.cjs`.
*   `src/pages/` holds the site pages (home and set-locale), `build.mjs` renders them into `dist/`, and `features.mjs` supplies the feature cards.

## 📜 License
This project is released under the MIT License. See the `LICENSE` file for details.
