const zlib = require('zlib');

const PARTS = [1, 2, 3, 4, 5, 6].map(
  (n) => `https://raw.githubusercontent.com/lolbeginnercourse/mainitiworakunisuru/oshiyado-production/oshiyado-preview/bundle.part${String(n).padStart(2, '0')}`
);
let cache;

async function loadBundle() {
  if (cache) return cache;
  const chunks = await Promise.all(
    PARTS.map(async (url) => {
      const response = await fetch(url, { headers: { 'User-Agent': 'oshiyado-preview' } });
      if (!response.ok) throw new Error(`bundle fetch failed: ${response.status} ${url}`);
      return response.text();
    })
  );
  cache = JSON.parse(
    zlib.brotliDecompressSync(Buffer.from(chunks.join(''), 'base64')).toString('utf8')
  );
  return cache;
}

function contentType(name) {
  if (name.endsWith('.html')) return 'text/html; charset=utf-8';
  if (name.endsWith('.json')) return 'application/json; charset=utf-8';
  if (name.endsWith('.txt')) return 'text/plain; charset=utf-8';
  if (name.endsWith('.xml')) return 'application/xml; charset=utf-8';
  return 'application/octet-stream';
}

module.exports = async (req, res) => {
  try {
    const files = await loadBundle();
    let path = String((req.query && req.query.path) || '').replace(/^\/+/, '');
    try { path = decodeURIComponent(path); } catch (_) {}
    if (!path) path = 'index.html';
    if (path.endsWith('/')) path += 'index.html';
    if (!files[path] && !path.includes('.') && files[`${path}/index.html`]) path += '/index.html';

    const found = Object.prototype.hasOwnProperty.call(files, path);
    const body = found ? files[path] : (files['404.html'] || 'Not Found');
    res.statusCode = found ? 200 : 404;
    res.setHeader('Content-Type', contentType(found ? path : '404.html'));
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    res.end(body);
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    res.end('Preview load error');
  }
};
