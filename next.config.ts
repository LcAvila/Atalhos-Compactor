import type { NextConfig } from "next";

// Redireciona determinadas rotas do Next (frontend) para o backend Express
// Permite testar o novo frontend (Next) enquanto mantém o backend atual em execução.
const EXPRESS_PORT = process.env.PORTA_PRINCIPAL || process.env.EXPRESS_PORT || '8080';

const nextConfig: NextConfig = {
  async headers() {
    const isProd = process.env.NODE_ENV === 'production';
    if (!isProd) {
      // Development: Be permissive to allow React refresh and corporate AV proxies like Kaspersky
      return [
        {
          source: '/:path*',
          headers: [
            { key: 'X-Frame-Options', value: 'DENY' },
            { key: 'X-Content-Type-Options', value: 'nosniff' },
            { key: 'Referrer-Policy', value: 'same-origin' },
            { key: 'Permissions-Policy', value: 'geolocation=(), microphone=()' },
            // Relaxed HSTS in dev (no HSTS)
            // Allow unsafe-eval and kaspersky proxy host seen in dev consoles
            { key: 'Content-Security-Policy', value: "default-src 'self' http://me.kes.v2.scr.kaspersky-labs.com ws://me.kes.v2.scr.kaspersky-labs.com 'unsafe-eval' 'unsafe-inline' data: blob:; img-src 'self' data: https:; script-src 'self' http://me.kes.v2.scr.kaspersky-labs.com ws://me.kes.v2.scr.kaspersky-labs.com 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https:; connect-src 'self' http://localhost:8080 ws:;" },
            // Keep report-only for stricter policy detection
            { key: 'Content-Security-Policy-Report-Only', value: "default-src 'self'; img-src 'self' data:; script-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'self' http://localhost:8080; report-uri /api/security/csp-report;" },
          ],
        },
      ];
    }

    // Production: stricter headers
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'same-origin' },
          { key: 'Permissions-Policy', value: 'geolocation=(), microphone=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Content-Security-Policy', value: "default-src 'self' data: blob:; img-src 'self' data: https:; script-src 'self'; style-src 'self' 'unsafe-inline' https:; connect-src 'self' http://localhost:8080 ws:;" },
          { key: 'Content-Security-Policy-Report-Only', value: "default-src 'self'; img-src 'self' data:; script-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'self' http://localhost:8080; report-uri /api/security/csp-report;" },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      // Páginas e rotas geradas pelo backend Express
      { source: '/Forca', destination: `http://localhost:${EXPRESS_PORT}/Forca` },
      { source: '/Faq', destination: `http://localhost:${EXPRESS_PORT}/Faq` },
      { source: '/Home/', destination: `http://localhost:${EXPRESS_PORT}/Home/` },
      { source: '/Agenda/', destination: `http://localhost:${EXPRESS_PORT}/Agenda/` },
      { source: '/Teste', destination: `http://localhost:${EXPRESS_PORT}/Teste` },

      // Download / abrir arquivos
      { source: '/abrir/:path*', destination: `http://localhost:${EXPRESS_PORT}/abrir/:path*` },
      { source: '/baixar/:path*', destination: `http://localhost:${EXPRESS_PORT}/baixar/:path*` },

      // APIs auxiliares
      { source: '/search', destination: `http://localhost:${EXPRESS_PORT}/search` },
      { source: '/Decripto/:encryptedIp', destination: `http://localhost:${EXPRESS_PORT}/Decripto/:encryptedIp` },

      // Static assets served by the old app (quando necessário)
      { source: '/Assets/:path*', destination: `http://localhost:${EXPRESS_PORT}/Assets/:path*` },
    ];
  },
};

export default nextConfig;
