import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve('dist');
const mime = {'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.png':'image/png','.woff2':'font/woff2','.ico':'image/x-icon'};
const server = http.createServer((req,res)=>{
  let pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  if (pathname === '/') pathname = '/index.html';
  let file = path.join(root, pathname.replace(/^\//,''));
  if (file !== root && !file.startsWith(root + path.sep)) { res.writeHead(403); return res.end(); }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!path.extname(file) && fs.existsSync(file + '.html')) file += '.html';
  if (!fs.existsSync(file)) {
    const lowerRoute = pathname.toLowerCase();
    if (lowerRoute === '/setlocale') file = path.join(root, 'setLocale', 'index.html');
  }
  if (!fs.existsSync(file)) { res.writeHead(404); return res.end('Not found'); }
  res.writeHead(200, {'Content-Type':mime[path.extname(file)] || 'application/octet-stream'});
  fs.createReadStream(file).pipe(res);
});
server.listen(4173,'127.0.0.1',()=>console.log('Revector server listening on http://127.0.0.1:4173'));
