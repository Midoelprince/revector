# Developing Revector

## Project layout

| Path | What it is |
| --- | --- |
| `src/js/vectorize.js` | The tracing engine and the SVG, PDF, EPS and DXF writers |
| `src/js/worker.js` | Runs the engine off the main thread |
| `src/js/app.js` | The editor |
| `src/js/i18n.js` | English and Arabic strings, and the right-to-left switch |
| `src/pages/` | The site pages (home and set-locale) |
| `build.mjs` | Renders the pages into `dist/`. `features.mjs` supplies the feature cards |
| `electron/main.cjs`, `electron/preload.cjs` | The Windows desktop shell and its updater |
| `scripts/` | The local server, the build check, engine tests, and the README hero generator |

## Run the site locally

```bash
npm install
npm run build          # must end with "Build check passed: 21 files in dist/."
node scripts/serve.mjs # http://127.0.0.1:4173
```

If the build fails with a missing font after you switch branches, run `npm install` again.

## Engine tests

After you change `src/js/vectorize.js`:

1. Copy `scripts/engine-bench.js`, `scripts/shapes-test.js` and `scripts/sign-test.js` into `dist/assets/`.
2. Serve the site.
3. Run `__bench`, `__shapeTest` and `__signSuite(Revector)` in the browser console.

To compare against `main`, run `git show main:src/js/vectorize.js > dist/assets/_vec_main.js`. Clean artwork must stay byte-identical to `main` unless the change is meant for it.

## Build the Windows app

```bash
npm run build
npm run dist
```

The installer (`Revector-Setup-<version>.exe`), the portable app (`Revector-Portable-<version>.exe`), the `.blockmap` and `latest.yml` are written to `release/`.

On Linux the packager needs Wine with 32-bit support and a display: `apt install wine32 xvfb`, then `xvfb-run -a npm run dist`.

## Publish a release

1. In a pull request, bump the version in `package.json` (line 3), `package-lock.json` (lines 3 and 9) and `README.md` if it names the version. The README badge updates by itself. Merge the pull request.
2. Tag the merge: `git tag vX.Y.Z && git push origin vX.Y.Z`.
3. The **Release** workflow (`.github/workflows/release.yml`) builds the installer and the portable app on Windows. It attaches them, with the `.blockmap` and the `latest.yml` that the in-app updater reads, to the GitHub release.
4. Check the result with `gh release view vX.Y.Z` and `gh api repos/Midoelprince/revector/releases/latest -q .tag_name`.

## README images

- `docs/img/before-after.png` is drawn by `scripts/readme-hero.html` from a real Revector trace. The steps are in its header comment.
- The screenshots in `docs/img/` were taken from the built site at 1440×900.

## Fonts

Only IBM Plex Sans Arabic and JetBrains Mono (both SIL Open Font License) may be committed. Never commit the Thmanyah or KO Okies fonts: their licences forbid it.
