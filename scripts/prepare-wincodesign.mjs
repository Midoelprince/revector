// Gets electron-builder's Windows tool pack ("winCodeSign") ready before a build.
//
// Why: electron-builder downloads winCodeSign-2.6.0.7z and unpacks all of it, including two
// Mac-only symbolic links. Windows only lets administrators (or Developer Mode) create those,
// so on a normal account the unpack fails and no installer is made. This script unpacks the
// same archive without the Mac folder into the place electron-builder looks, so it finds the
// tools already there and skips its own unpack.
//
// It never fails the build: on any problem it says what happened and exits normally.

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const VERSION = "2.6.0";
const NAME = `winCodeSign-${VERSION}`;
const URL_7Z =
  (process.env.ELECTRON_BUILDER_BINARIES_MIRROR ||
    "https://github.com/electron-userland/electron-builder-binaries/releases/download/") +
  `${NAME}/${NAME}.7z`;

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const say = (text) => console.log(`[wincodesign] ${text}`);

// A folder is usable when the Windows tools are in it.
function usable(dir) {
  return (
    fs.existsSync(path.join(dir, "rcedit-x64.exe")) &&
    fs.existsSync(path.join(dir, "windows-10"))
  );
}

function unpack(archive, target, sevenZip) {
  fs.rmSync(target, { recursive: true, force: true });
  execFileSync(sevenZip, ["x", "-bd", "-y", "-xr!darwin", archive, `-o${target}`], {
    stdio: ["ignore", "ignore", "pipe"],
  });
}

async function main() {
  if (process.platform !== "win32") {
    say("not Windows, nothing to do.");
    return;
  }

  const cacheRoot =
    process.env.ELECTRON_BUILDER_CACHE ||
    path.join(
      process.env.LOCALAPPDATA || path.join(os.homedir(), "AppData", "Local"),
      "electron-builder",
      "Cache"
    );
  const cache = path.join(cacheRoot, "winCodeSign");
  const finalDir = path.join(cache, NAME);
  fs.mkdirSync(cache, { recursive: true });

  const entries = fs.readdirSync(cache, { withFileTypes: true });
  say(`cache folder: ${cache}`);
  for (const entry of entries) {
    const full = path.join(cache, entry.name);
    const note = entry.isDirectory()
      ? usable(full)
        ? "folder, has the Windows tools"
        : "folder, incomplete"
      : `file, ${fs.statSync(full).size} bytes`;
    say(`  ${entry.name} (${note})`);
  }

  if (usable(finalDir)) {
    say(`${NAME} is already in place.`);
    return;
  }

  const sevenZip = path.join(root, "node_modules", "7zip-bin", "win", "x64", "7za.exe");
  const staging = path.join(cache, `${NAME}.staging`);

  // 1. Unpack an archive: one left by an earlier try, or a fresh download.
  if (fs.existsSync(sevenZip)) {
    const archives = entries
      .filter((entry) => entry.isFile() && entry.name.endsWith(".7z"))
      .map((entry) => path.join(cache, entry.name));

    const fresh = path.join(cache, `${NAME}.download.7z`);
    try {
      say(`downloading ${URL_7Z}`);
      const response = await fetch(URL_7Z);
      if (!response.ok) throw new Error(`the server answered ${response.status}`);
      fs.writeFileSync(fresh, Buffer.from(await response.arrayBuffer()));
      archives.unshift(fresh);
    } catch (error) {
      say(`download didn't work (${error.message}); trying what is already here.`);
    }

    for (const archive of archives) {
      try {
        unpack(archive, staging, sevenZip);
        if (usable(staging)) {
          fs.rmSync(finalDir, { recursive: true, force: true });
          fs.renameSync(staging, finalDir);
          say(`unpacked ${path.basename(archive)} into ${NAME} (without the Mac folder).`);
          break;
        }
        say(`${path.basename(archive)} didn't hold the Windows tools.`);
      } catch (error) {
        say(`couldn't unpack ${path.basename(archive)}: ${String(error.message).split("\n")[0]}`);
      }
    }
    fs.rmSync(staging, { recursive: true, force: true });
    fs.rmSync(fresh, { force: true });
  } else {
    say("7za.exe isn't installed yet (run npm install first).");
  }

  // 2. Otherwise copy a folder an earlier try unpacked (it has everything but the Mac links).
  if (!usable(finalDir)) {
    const donor = entries
      .filter((entry) => entry.isDirectory() && entry.name !== NAME)
      .map((entry) => path.join(cache, entry.name))
      .find(usable);
    if (donor) {
      fs.rmSync(finalDir, { recursive: true, force: true });
      fs.cpSync(donor, finalDir, {
        recursive: true,
        filter: (source) => path.basename(source) !== "darwin",
      });
      say(`copied ${path.basename(donor)} to ${NAME}.`);
    }
  }

  say(
    usable(finalDir)
      ? "ready."
      : "couldn't prepare the tools. If the build stops at winCodeSign, turn on Windows Developer Mode or run the terminal as administrator."
  );
}

main().catch((error) => {
  say(`skipped: ${error.message}`);
});
