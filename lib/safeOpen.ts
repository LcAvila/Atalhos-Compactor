export function isSafeUrl(url: string): boolean {
  try {
    const parsed = new URL(url, window.location.href);
    const protocol = parsed.protocol.toLowerCase().replace(':', '');
    // allow http, https, mailto (if needed) — block javascript:, data:, file:, vbscript:
    return ['http', 'https', 'mailto'].includes(protocol);
  } catch (e) {
    return false;
  }
}

export function safeOpen(url: string) {
  if (!isSafeUrl(url)) {
    console.warn('Blocked unsafe URL open attempt:', url);
    return null;
  }

  const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
  try {
    if (newWindow) newWindow.opener = null;
  } catch (e) {
    // ignore
  }
  return newWindow;
}
