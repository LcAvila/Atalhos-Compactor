import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const LOG_DIR = path.join(process.cwd(), 'logs');
const LOG_FILE = path.join(LOG_DIR, 'csp-reports.log');

async function ensureLogDir() {
  try {
    await fs.promises.mkdir(LOG_DIR, { recursive: true });
  } catch (e) {
    // ignore
  }
}

export async function POST(request: Request) {
  try {
    let report: any = null;
    try {
      report = await request.json();
    } catch (e) {
      // if it's not JSON, capture raw text
      try {
        const txt = await request.text();
        report = { raw: txt };
      } catch (e2) {
        report = { raw: '<unreadable>' };
      }
    }

    const envelope = { ts: new Date().toISOString(), report };
    try {
      await ensureLogDir();
      await fs.promises.appendFile(LOG_FILE, JSON.stringify(envelope) + '\n', { encoding: 'utf8' });
      console.warn('CSP REPORT saved');
    } catch (writeErr) {
      // Log the error server-side but return success to avoid client retries spamming us
      console.error('Failed to persist CSP report', writeErr);
    }

    // Respond 204 No Content to stop browsers from retrying aggressively
    return new NextResponse(null, { status: 204 });
  } catch (e) {
    // Unexpected server error: log and return 204 to avoid causing client-side retry storms
    console.error('Unexpected error handling CSP report', e);
    return new NextResponse(null, { status: 204 });
  }
}

// Also support GET to retrieve recent reports (for local admins)
export async function GET() {
  try {
    await ensureLogDir();
    const exists = fs.existsSync(LOG_FILE);
    if (!exists) return NextResponse.json({ reports: [] });

    const content = await fs.promises.readFile(LOG_FILE, 'utf8');
    const lines = content.trim().split('\n').filter(Boolean);
    const last = lines.slice(-200).map((l) => {
      try { return JSON.parse(l); } catch { return null; }
    }).filter(Boolean);
    return NextResponse.json({ reports: last });
  } catch (e) {
    console.error('Failed to read CSP reports', e);
    return NextResponse.json({ reports: [] }, { status: 500 });
  }
}
