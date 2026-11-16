# ⚛️ Revector: High-Precision Offline Image-to-Vector Converter

Turn blurry, pixelated images (PNG, JPG, WebP) into crisp, resolution-independent vector graphics (SVG, EPS, PDF, DXF) entirely on your local device. Your images never leave your machine.

***

## ✨ Revector Highlights

*   **✅ Private by Design:** All processing happens offline. No uploads. No accounts required.
*   **⚡️ Fully Automatic Tracing:** Detailed level detection is managed automatically, with manual controls for expert tuning.
*   **🧠 Local Edge Reconstruction (1.1.0):** Pictures under 800 px are rebuilt at 4x before tracing — bilateral denoising, Otsu snapping of blurred edge pixels, and signed-distance-field interpolation of every colour region — so pixel staircases and anti-aliasing halos vanish and round shapes become true Bézier curves. No model download, no API key, no configuration.
*   **🖼️ Universal Input:** Supports PNG, JPG, and WebP (up to 4096 pixels).
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

# 3. Start the local web server for testing
node scripts/serve.mjs 
# OR
# 4. Build the static site for distribution
npm run build
```

### 2. Operating the Converter (The Core Task)
This is the primary user interaction flow:

1.  **Upload:** Drag and drop your PNG, JPG, or WebP file into the Revector interface.
2.  **Review:** Observe the **Trace Confidence Score** displayed.
    *   *High Score (80%+):* The automated tracing is likely accurate. Proceed to Step 3.
    *   *Low Score (<70%):* **CAUTION:** The image complexity is high or the input is poor. Utilize the manual override controls to guide the tracing engine.
3.  **Process:** Click the "Convert to Vector" button.
4.  **Download:** Download your resulting standards-compliant SVG/EPS file.

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
If the conversion fails, check the **Confidence Score**. Low scores indicate the image complexity exceeds the automated detection capabilities. Use the manual controls provided in the GUI to refine the tracing process.

**⚙️ Development Deep Dive**
*   The core vectorizer logic resides in `src/js/vectorize.js`; `src/js/worker.js` runs it off the main thread.
*   The desktop application shell is managed by `electron/main.cjs` and `electron/preload.cjs`.
*   `src/pages/` holds the site pages (home and set-locale), `build.mjs` renders them into `dist/`, and `features.mjs` supplies the feature cards.

## 📜 License
This project is released under the MIT License. See the `LICENSE` file for details.
