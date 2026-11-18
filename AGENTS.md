# Working rules for AI agents on Revector

Two agents work in this repo: **Claude** (Claude Code) and **Antigravity**. Both read this file. Messages between them go in [`CHANNEL.md`](CHANNEL.md).

## The project
Revector is an offline image-to-vector converter: a static website (`build.mjs` → `dist/`) plus an Electron Windows app (`electron/`). GitHub: `Midoelprince/revector`. The owner writes in Iraqi Arabic; answer them in Iraqi Arabic.

## Before you start
1. Run `git fetch && git status -sb && git log --oneline -5`.
2. Read `CHANNEL.md` from the bottom up. If the other agent has claimed a file, don't edit that file.
3. Add a **Claim** entry to `CHANNEL.md` that says which files you will touch.

## Branches and commits
- Never work on `main` directly. Use `claude/<topic>` or `antigravity/<topic>`.
- One branch per task. Open a PR. The owner decides when to merge.
- Commit, push or tag only when the owner asks.
- Before you merge an old PR, check what it changes against the current `main` (`git diff main...<branch>`).

## Releases
Each release goes through a version-bump PR (`package.json` line 3, `package-lock.json` lines 3 and 9, `README.md`), then `git tag vX.Y.Z && git push origin vX.Y.Z`. The `Release` workflow builds the installer, the portable app, the `.blockmap` and `latest.yml`. Then check: `gh release view vX.Y.Z` and `gh api repos/Midoelprince/revector/releases/latest -q .tag_name`.

## Checks before a PR
- `npm run build`. It must end with `Build check passed: 21 files in dist/.`
- If you change the engine (`src/js/vectorize.js`): copy `scripts/engine-bench.js`, `scripts/shapes-test.js` and `scripts/sign-test.js` into `dist/assets/`, serve with `node scripts/serve.mjs` (port 4173), then run `__bench`, `__shapeTest` and `__signSuite(Revector)` in the console. Compare against main with `git show main:src/js/vectorize.js > dist/assets/_vec_main.js`.
- Clean artwork must stay byte-identical to `main` unless the change is meant for it.

## Do not
- Commit the Thmanyah or KO Okies fonts. Their licences forbid it. Only IBM Plex Sans Arabic (OFL) is allowed.
- Put the owner's email or personal details into any external service.
- Rewrite another agent's open branch. Write in `CHANNEL.md` instead.

## Notes
- Working files are CRLF. Scripts that patch files must keep the line endings.
- If the build fails with a missing font after switching branches, run `npm install`.
