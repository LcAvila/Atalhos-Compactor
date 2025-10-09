import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { NextResponse } from 'next/server';

const DOWNLOAD_ROOT = process.env.DOWNLOAD_ROOT || path.join(process.cwd(), 'download');
const SERVER_TOKEN = process.env.SERVER_DOWNLOAD_TOKEN || '';
const SIGN_KEY = process.env.DOWNLOAD_SIGNING_KEY || '';

function safeJoin(base: string, target: string) {
  const targetPath = path.normalize(path.join(base, target));
  if (!targetPath.startsWith(base)) throw new Error('Path traversal');
  return targetPath;
}

function verifySignatureForFile(filePath: string, sig: string, exp: string) {
  if (!SIGN_KEY) return false;
  const expNum = parseInt(exp, 10);
  if (Number.isNaN(expNum)) return false;
  if (Date.now() > expNum) return false;
  try {
    const h = crypto.createHmac('sha256', SIGN_KEY);
    h.update(`${filePath}:${exp}`);
    const expected = h.digest('hex');
    const a = Buffer.from(expected, 'hex');
    const b = Buffer.from(sig, 'hex');
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch (e) {
    return false;
  }
}

export async function GET(request: Request, context: { params?: { file?: string[] } }) {
  try {
  // Next may provide params as a promise-like value; await params specifically
  const ctx = context as any;
  const params = (await ctx.params) || {};
  const fileParts = params.file || [];
    if (fileParts.length === 0) return NextResponse.json({ error: 'Missing file' }, { status: 400 });
    const filePath = fileParts.join('/');

    // If the request contains a signature and expiry, validate it using the signing key
    const reqUrl = new URL(request.url);
    const sig = reqUrl.searchParams.get('sig') || '';
    const exp = reqUrl.searchParams.get('exp') || '';
    if (sig && exp) {
      const ok = verifySignatureForFile(filePath, sig, exp);
      if (!ok) return NextResponse.json({ error: 'Forbidden - invalid signature' }, { status: 403 });
    } else {
      // Optional check: if a server token is configured, require header
      if (SERVER_TOKEN) {
        const auth = request.headers.get('authorization') || '';
        if (!auth.startsWith('Bearer ') || auth.slice('Bearer '.length) !== SERVER_TOKEN) {
          return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
      }
    }

    const full = safeJoin(DOWNLOAD_ROOT, filePath);
    const stat = await fs.promises.stat(full);
    if (!stat.isFile()) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const buffer = await fs.promises.readFile(full);
  const headers = new Headers();
  // Set a sensible Content-Type for known extensions (JNLP for Java Web Start)
  const ext = path.extname(full || filePath).toLowerCase();
  let contentType = 'application/octet-stream';
  if (ext === '.jnlp') contentType = 'application/x-java-jnlp-file';
  else if (ext === '.zip') contentType = 'application/zip';
  else if (ext === '.pdf') contentType = 'application/pdf';
  headers.set('Content-Type', contentType);
    headers.set('Content-Length', String(buffer.length));
    headers.set('Content-Disposition', `attachment; filename="${path.basename(full)}"`);

  const uint8 = new Uint8Array(buffer as any);
  return new NextResponse(uint8, { headers });
  } catch (e: any) {
    if (e.code === 'ENOENT') return NextResponse.json({ error: 'Not found' }, { status: 404 });
    console.error('Download error', e);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
