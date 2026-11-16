# Revector

Turn blurry, pixelated images into crisp, resolution-independent vector graphics — right in your browser, or on your desktop with the free Windows app.

Revector traces PNG, JPG, and WebP images into clean SVG vector files using fully automated detail detection. Your images never leave your device: everything runs locally, with no uploads and no accounts.

## Highlights

- **Upload anything** — PNG, JPG, or WebP up to 4096 pixels.
- **Fully automatic tracing** — detail level is detected for you, with manual overrides when you want them.
- **Local edge reconstruction (1.1.0)** — pictures under 800 px are rebuilt at 4x before tracing: bilateral denoising, Otsu snapping of blurred edge pixels, and signed-distance-field interpolation of every colour region, so pixel staircases and anti-aliasing halos vanish and round shapes become true Bézier curves. No model download, no API key, no configuration.
- **English and Arabic** — the switcher in the top bar flips the whole interface, including the converter, to a right-to-left Arabic layout.
- **Real vectors out** — download standards-compliant SVG files that scale to any size without losing quality.
- **Private by design** — all processing happens on your own machine.
- **Free desktop app** — the Windows converter is free, with a portable build that needs no installation.

## Project layout

- `src/pages/` — the site pages (home and set-locale).
- `src/js/` — browser code: the vectorizer, worker, and site scripts.
- `src/css/`, `src/img/` — styles and images.
- `electron/` — the desktop app shell (main process and preload).
- `build.mjs` — static site build script (writes `dist/`).
- `scripts/` — build and packaging helpers.

## Build the site

```sh
npm run build
```

This renders the pages into `dist/`, copies the CSS/JS/image assets, and verifies the output.

## Build the Windows app

```sh
npm run dist
```

This builds the site, then packages the Electron desktop app with electron-builder. On Linux the packager needs Wine with 32-bit support and a display (`apt install wine32 xvfb`, then `xvfb-run -a npm run dist`). The installer and portable executable are written to `release/`:

- `Revector-Setup-<version>.exe` — NSIS installer
- `Revector-Portable-<version>.exe` — portable build, no installation needed

## Development

Serve the built site locally:

```sh
node scripts/serve.mjs
```

## License

MIT — see [LICENSE](LICENSE).

---

Traced with care by a very meticulous robot.
