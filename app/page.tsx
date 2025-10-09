"use client";

import React, { useEffect, useState } from 'react';
import { isSafeUrl, safeOpen } from '../lib/safeOpen';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { Container, Box, Typography, TextField, InputAdornment } from '@mui/material';
import { Search, AccessTime, Computer, Phone, HelpOutline } from '@mui/icons-material';
import ModernCard from './components/ModernCard';
import TutorialModal from './components/TutorialModal';
import FloatingParticles from './components/FloatingParticles';
import AnimatedBackground from './components/AnimatedBackground';
import RadioButtons from './components/RadioButtons';

export default function AtalhosPage() {
  const [time, setTime] = useState('00:00:00');
  const [ambiente, setAmbiente] = useState<'producao' | 'homologacao'>('producao');
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const [tutorialImages, setTutorialImages] = useState<string[]>([]);
  const [tutorialSteps, setTutorialSteps] = useState<Array<{ src: string; caption?: string }>>([]);
  const [tutorialTitle, setTutorialTitle] = useState<string>('');
  const [tutorialFileName, setTutorialFileName] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [lastDownloadType, setLastDownloadType] = useState<'producao' | 'teste' | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  // ...existing state

  async function downloadWms(type: 'producao' | 'teste') {
    setDownloading(true);
    setDownloadProgress(0);
    setDownloadError(null);
    try {
  const filename = type === 'producao' ? 'WMS_PROD.jnlp' : 'WMS_TESTE.jnlp';
  // Force use of Next's internal download API to serve files from the app's download/ folder
  // This avoids proxying to legacy backend (/baixar) which may be down in local dev.
  const useNext = true;
  let url = useNext ? `/api/download/wms/${filename}` : `/baixar/${filename}`;
      const headers: Record<string, string> = {};
      if (process.env.NEXT_PUBLIC_DOWNLOAD_TOKEN) {
        headers['Authorization'] = `Bearer ${process.env.NEXT_PUBLIC_DOWNLOAD_TOKEN}`;
      }
      // If using Next's server download, request a signed URL first (recommended)
      if (useNext) {
        try {
          const signResp = await fetch('/api/download/sign', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ file: filename }),
          });
          if (signResp.ok) {
            const j = await signResp.json();
            if (j.url) url = j.url;
          } else {
            console.warn('Could not obtain signed URL, falling back to direct API');
          }
        } catch (e) {
          console.warn('Signing request failed', e);
        }
      }
      const resp = await fetch(url, { method: 'GET', headers });
      if (!resp.ok) {
        const text = await resp.text().catch(() => '');
        const msg = `Servidor retornou ${resp.status} ${resp.statusText}. ${text}`;
        setDownloadError(msg);
        setDownloading(false);
        setDownloadProgress(null);
        return;
      }

      const contentLength = resp.headers.get('Content-Length');
      const total = contentLength ? parseInt(contentLength, 10) : NaN;

      if (!resp.body) {
        // Fallback: no streaming
        const blob = await resp.blob();
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(link.href), 10000);
        setDownloading(false);
        setDownloadProgress(100);
        return;
      }

      const reader = resp.body.getReader();
      const chunks: Uint8Array[] = [];
      let received = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          chunks.push(value);
          received += value.length;
          if (!Number.isNaN(total)) {
            setDownloadProgress((received / total) * 100);
          } else {
            setDownloadProgress(null);
          }
        }
      }

  // chunks is Uint8Array[]; cast to any for Blob constructor to avoid TS mismatch
  const blob = new Blob(chunks as any);
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(link.href), 10000);
      setDownloading(false);
      setDownloadProgress(100);
      setDownloadSuccess(true);
    } catch (e) {
      console.error('Failed to download WMS file', e);
      setDownloadError(String(e));
      setDownloading(false);
      setDownloadProgress(null);
    }
  }

  function handleWmsClick(type: 'producao' | 'teste') {
    // Show tutorial modal with appropriate images then trigger download
    const base = '/assets/avisos';
    if (type === 'producao') {
      setTutorialTitle('WMS - Produção: como baixar');
      setTutorialSteps([
        { src: `${base}/WMS_PROD.png`, caption: 'Passo 1: Acesse o painel WMS' },
        { src: `${base}/WMS.png`, caption: 'Passo 2: Clique em "Download"' },
      ]);
    } else {
      setTutorialTitle('WMS - Teste: como baixar');
      setTutorialSteps([
        { src: `${base}/WMS_TESTE.png`, caption: 'Passo 1: Acesse o ambiente de testes' },
        { src: `${base}/WMS.png`, caption: 'Passo 2: Localize o arquivo e baixe' },
      ]);
    }
  setTutorialOpen(true);
  setLastDownloadType(type);
  setTutorialFileName(type === 'producao' ? 'WMS_PROD.jnlp' : 'WMS_TESTE.jnlp');
  // Start download immediately while the modal is shown (simultaneous behavior)
  // fire-and-forget so modal appears without waiting for download to finish
  void downloadWms(type);
  }

  useEffect(() => {
    function updateClock() {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setTime(`${hours}:${minutes}:${seconds}`);
    }

    updateClock();
    const id = setInterval(updateClock, 1000);
    return () => clearInterval(id);
  }, []);

  function onSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const q = String(data.get('q') || '').trim();

    if (!q) return;

    if (q.toLowerCase() === 'forca') {
      window.location.href = '/Forca';
      return;
    }

    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(q)}`;
    if (isSafeUrl(searchUrl)) safeOpen(searchUrl);
  }

  const shortcuts = [
    { label: 'Ramais', href: 'http://194.0.0.114:8080/Agenda/', 
      logo: null, icon: <Phone sx={{ fontSize: 32, color: '#FF0000' }} /> },

    { label: 'FAQ', href: 'http://194.0.0.114:8080/Faq', 
      logo: null, icon: <HelpOutline sx={{ fontSize: 32, color: '#fb923c' }} /> },

    { label: 'CODI', href: 'http://194.0.0.170:8080/auth/authorize', 
      logo: '/Logos/Codi-logo.svg', icon: null },

    { label: 'Portal AMIL', href: 'https://www.amil.com.br/beneficiario/#/', 
      logo: '/Logos/amil.svg', icon: null },

    { label: 'TOTVS Produção', href: 'http://wk2022a:8080/totvs-login/loginForm', 
      logo: '/Logos/totvs_logo.svg', icon: null },

    { label: 'TOTVS Teste', href: 'http://wk2022a:8180/totvs-login/loginForm', 
      logo: '/Logos/totvs_logo.svg', icon: null },

    { label: 'Portal RH', href: 'https://companhiade145352.rm.cloudtotvs.com.br/Corpore.Net/Login.aspx', 
      logo: '/Logos/Meu RH.svg', icon: null },

    { label: 'Fusion Produção', href: 'https://fusion.compactor.com.br/fusion/portal', 
      logo: '/Logos/Fusion.svg', icon: null },

    { label: 'Fusion Teste', href: 'https://hml.compactor.com.br/fusion/portal/action/Login/view/normal', 
      logo: '/Logos/Fusion.svg', icon: null },

    { label: 'Mercos', href: 'https://app.mercos.com/login/', 
      logo: '/Logos/mercos.svg', icon: null },

    { label: 'WMS Produção', href: '#', 
      logo: '/Logos/WMS.svg', icon: null, onClick: () => handleWmsClick('producao') },

    { label: 'WMS Teste', href: '#', 
      logo: '/Logos/WMS.svg', icon: null, onClick: () => handleWmsClick('teste') },

  ];

  // 🔹 Filtragem
  const filteredShortcuts = ambiente === 'homologacao'
    ? shortcuts.filter(s => s.label.includes('Teste'))
    : shortcuts.filter(s => !s.label.includes('Teste'));

  return (
    <>
      <Head>
        <title>Atalhos Compactor</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/next.svg" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <AnimatedBackground />
      <FloatingParticles />

      {/* Top Bar */}
      <Box
        component={motion.div}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: '#ffcc00',
          boxShadow:
            '0 8px 32px rgba(0, 0, 0, 0.2), 0 4px 16px rgba(0, 0, 0, 0.15), inset 0 -1px 0 rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              py: 1,
              gap: 1,
              flexWrap: 'wrap', // 🔑 permite quebrar linha se faltar espaço
            }}
          >
            {/* Relógio */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              style={{
                background: 'rgba(0, 0, 0, 0.2)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                padding: '8px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                minWidth: '120px',
                justifyContent: 'center',
                flex: '1 1 auto', // 🔑 se ajusta ao espaço disponível
                maxWidth: '200px',
              }}
            >
              <AccessTime sx={{ color: 'white', fontSize: { xs: 18, sm: 22, md: 24 } }} />
              <Typography
                sx={{
                  color: 'white',
                  fontWeight: 600,
                  fontSize: { xs: '0.9rem', sm: '1rem', md: '1.2rem' },
                  fontFamily: 'monospace',
                }}
              >
                {time}
              </Typography>
            </motion.div>

            {/* Logo */}
            <Box
              sx={{
                flex: '1 1 auto',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <a
                href="https://www.compactorstore.com.br/?gad_source=1&gad_campaignid=21162174469&gbraid=0AAAAA9Y1fBISe-z9M3TxOTHN9ppD9NtIj&gclid=CjwKCAjwxfjGBhAUEiwAKWPwDvYL6J84tpif0ieAt_7U1QV-w_BcM3Zmwqjguh9J-78pqRYhuBekSxoCI08QAvD_BwE"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/Logos/Logo Compactor.svg"
                  alt="Compactor"
                  style={{
                    height: '40px',
                    maxWidth: '100%',
                    objectFit: 'contain',
                  }}
                />
              </a>
            </Box>

            {/* Nome PC */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                navigator.clipboard
                  .writeText('Nome do PC: Meu PC Meu IP: 192.168.1.1')
                  .then(() => alert('Informações do Computador Copiadas'));
              }}
              style={{
                background: 'rgba(0, 0, 0, 0.2)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                padding: '8px 12px',
                cursor: 'pointer',
                minWidth: '120px',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                justifyContent: 'center',
                flex: '1 1 auto',
                maxWidth: '200px',
              }}
            >
              <Computer sx={{ color: 'white', fontSize: { xs: 18, sm: 22, md: 24 } }} />
              <Typography
                sx={{
                  color: 'white',
                  fontWeight: 700,
                  fontSize: { xs: '0.8rem', sm: '0.9rem', md: '0.95rem' },
                }}
              >
                Meu pc
              </Typography>
            </motion.div>
          </Box>
        </Container>
      </Box>


      {/* Conteúdo */}
      <Box
        sx={{
          minHeight: '100vh',
          pt: 12,
          pb: 2,
          position: 'relative',
          zIndex: 1,
          display: 'fixed',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Container maxWidth="xl">

          {/* Google Logo */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
            <motion.a
              href="https://www.google.com/"
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              style={{ display: 'inline-block' }}
            >
              <img
                src="/Logos/Google_2015_logo.svg.webp"
                alt="Google"
                style={{ width: '250px', maxWidth: '100%', display: 'block' }}
              />
            </motion.a>
          </Box>

          {/* Pesquisa */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginBottom: '24px' }}
          >
            <form onSubmit={onSearchSubmit}>
              <div className="flex justify-center">
                <div className="relative w-full max-w-[480px] bg-white rounded-2xl shadow-[0_5px_10px_rgb(0,0,0,0.30)] p-1 transition-all duration-150 ease-in-out hover:shadow-[0_12px_20px_rgb(250,150,0,0.35)]">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-[#ffcc00]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="q"
                    className="w-full pl-9 pr-24 py-2 text-sm text-gray-700 bg-transparent rounded-lg focus:outline-none"
                    placeholder="Pesquise no Google..."
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1 bottom-1 px-5 bg-[#ffcc00] text-gray-900 font-semibold text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ffcc00] hover:bg-[#f5c000] transition-all shadow-md hover:shadow-lg"
                  >
                    Pesquisar
                  </button>
                </div>
              </div>
            </form>
          </motion.div>

          {/* 🔹 RadioButtons funcionando */}
          <RadioButtons onChange={setAmbiente} />

          {/* Grade de Atalhos com altura fixa */}
          <Box
            sx={{
              minHeight: ambiente === 'producao' ? '380px' : '140px',
              transition: 'min-height 0.3s ease-in-out',
            }}
          >
            <motion.div
              key={ambiente}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Typography
                variant="h5"
                sx={{
                  textAlign: 'center',
                  fontSize: '1.4rem',
                  fontWeight: 500,
                  mb: 2,
                  color: '#1f2937',
                }}
              >
                Atalhos Rápidos
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: ambiente === 'producao'
                    ? 'repeat(3, 1fr)'
                    : 'repeat(3, 1fr)',
                  gap: 2,
                  maxWidth: ambiente === 'producao' ? '700px' : '700px',
                  margin: '0 auto',
                }}
              >
                {filteredShortcuts.map((shortcut, index) => (
                  <ModernCard
                    key={shortcut.label}
                    title={shortcut.label}
                    href={shortcut.href}
                    logo={shortcut.logo || undefined}
                    icon={shortcut.icon || undefined}
                    delay={index * 0.05}
                    onClick={shortcut.onClick}
                  />
                ))}
              </Box>
            </motion.div>
          </Box>
        </Container>
      </Box>
      <TutorialModal
        open={tutorialOpen}
        onClose={() => {
          setTutorialOpen(false);
          setDownloading(false);
          setDownloadProgress(null);
          setDownloadError(null);
          setDownloadSuccess(false);
        }}
        title={tutorialTitle}
        steps={tutorialSteps}
        downloading={downloading}
        progress={downloadProgress}
        error={downloadError}
        success={downloadSuccess}
        onRetry={() => {
          if (lastDownloadType) downloadWms(lastDownloadType);
        }}
        onDownload={() => {
          if (lastDownloadType) downloadWms(lastDownloadType);
        }}
        fileName={tutorialFileName || undefined}
      />
      {/* System modal removed per user request */}
    </>
  );
}