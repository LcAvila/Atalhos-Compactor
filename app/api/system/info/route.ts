import os from 'os';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const hostname = os.hostname();
    const interfaces = os.networkInterfaces();
    const ips: string[] = [];
    for (const name of Object.keys(interfaces)) {
      const addrs = interfaces[name] || [];
      for (const addr of addrs) {
        if (addr.family === 'IPv4' && !addr.internal) {
          ips.push(addr.address);
        }
      }
    }
    return NextResponse.json({ hostname, ips });
  } catch (e) {
    console.error('Failed to get system info', e);
    return NextResponse.json({ hostname: null, ips: [] }, { status: 500 });
  }
}
