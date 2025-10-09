import crypto from 'crypto';
import { NextResponse } from 'next/server';
import path from 'path';

const SIGN_KEY = process.env.DOWNLOAD_SIGNING_KEY || '';
const DOWNLOAD_PREFIX = '/api/download/wms/';

function makeSignature(filePath: string, expMs: number) {
  const exp = String(expMs);
  const h = crypto.createHmac('sha256', SIGN_KEY);
  h.update(`${filePath}:${exp}`);
  return { sig: h.digest('hex'), exp };
}

export async function POST(request: Request) {
  if (!SIGN_KEY) return NextResponse.json({ error: 'Signing not configured' }, { status: 500 });
  try {
    const body = await request.json().catch(() => ({}));
    const file = String(body.file || '');
    if (!file) return NextResponse.json({ error: 'Missing file' }, { status: 400 });
    // Normalize file to avoid ../
    const normalized = path.posix.normalize(file).replace(/^\.\//, '').replace(/^\//, '');
    // expiry default: 5 minutes
    const ttl = Number(body.ttl) || 5 * 60 * 1000;
    const exp = Date.now() + ttl;
    const { sig, exp: expStr } = makeSignature(normalized, exp);
    const url = `${DOWNLOAD_PREFIX}${encodeURIComponent(normalized)}?sig=${sig}&exp=${expStr}`;
    return NextResponse.json({ url });
  } catch (e: any) {
    console.error('sign error', e);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
