import fs from "node:fs";
for (const f of ["dist", "build", "out", "."]) {
  const p = `${f}/index.html`;
  console.log(p, fs.existsSync(p) ? `${fs.statSync(p).size} bytes, ${fs.statSync(p).mtime.toISOString()}` : "MISSING");
}
