# ⚛️ Revector: High-Precision Offline Image-to-Vector Converter

Turn blurry, pixelated images (PNG, JPG, WebP) into crisp, resolution-independent vector graphics (SVG, EPS, PDF, DXF) entirely on your local device. Your images never leave your machine.

***

## ✨ Revector Highlights

*   **✅ Private by Design:** All processing happens offline. No uploads. No accounts required.
*   **⚡️ Fully Automatic Tracing:** Detailed level detection is managed automatically, with manual controls for expert tuning.
*   **🖼️ Universal Input:** Supports PNG, JPG, and WebP (up to 4096 pixels).
*   **📐 Real Vector Output:** Downloads standards-compliant SVG, EPS, PDF, and DXF files that scale perfectly.
*   **🌐 Multi-Lingual:** Supports Arabic & English UI.

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
This command outputs the installer (`Revector-Setup-<version>.exe`) and portable executable (`Revector-Portable-<version>.exe`) into the `/release` folder.

***

## 📚 Technical Notes & Troubleshooting

**❓ Error: Tracing Fails**
If the conversion fails, check the **Confidence Score**. Low scores indicate the image complexity exceeds the automated detection capabilities. Use the manual controls provided in the GUI to refine the tracing process.

**⚙️ Development Deep Dive**
*   The core vectorizer logic resides in `src/js/vectorizer.js`.
*   The desktop application shell is managed by `electron/main.js` and `electron/preload.js`.
*   For advanced integration, see the `/API` page for endpoint specifications.

## 📜 License
This project is released under the MIT License. See the `LICENSE` file for details.