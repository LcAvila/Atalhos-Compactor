const fetch = require('node-fetch');
const crypto = require('crypto');

// Quick local test runner (requires Next dev or prod server running)
(async () => {
  const SIGN_KEY = process.env.DOWNLOAD_SIGNING_KEY || 'testkey';
  const filename = 'wms_producao.zip';
  try {
    const r = await fetch('http://localhost:3000/api/download/sign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file: filename, ttl: 60000 }),
    });
    const j = await r.json();
    console.log('sign response', j);
    if (!j.url) process.exit(2);
    // validate signature locally
    const url = new URL(j.url, 'http://localhost:3000');
    const sig = url.searchParams.get('sig');
    const exp = url.searchParams.get('exp');
    const h = crypto.createHmac('sha256', SIGN_KEY);
    h.update(`${filename}:${exp}`);
    const expected = h.digest('hex');
    console.log('expected', expected.slice(0,8), 'got', sig ? sig.slice(0,8) : null);
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
