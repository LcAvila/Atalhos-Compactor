"use client";

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { Container, Box, Typography, TextField, InputAdornment, Radio } from '@mui/material';
import { Search, AccessTime, Computer, Phone, HelpOutline } from '@mui/icons-material';
import ModernCard from './components/ModernCard';
import FloatingParticles from './components/FloatingParticles';
import AnimatedBackground from './components/AnimatedBackground';
import RadioButtons from './components/RadioButtons';

export default function AtalhosPage() {
  const [time, setTime] = useState('00:00:00');

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
    
    if (!q) return; // Não pesquisa se estiver vazio
    
    if (q.toLowerCase() === 'forca') {
      window.location.href = '/Forca';
      return;
    }
    
    // Pesquisa no Google
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(q)}`;
    window.open(searchUrl, '_blank');
  }

  const shortcuts = [
    { 
      label: 'Ramais', 
      href: '#', 
      logo: null,
      icon: <Phone sx={{ fontSize: 32, color: '#FF0000' }} />
    },
    { 
      label: 'FAQ', 
      href: '#', 
      logo: null,
      icon: <HelpOutline sx={{ fontSize: 32, color: '#fb923c' }} />
    },
    { 
      label: 'CODI', 
      href: '#', 
      logo: '/Logos/Codi-logo.webp',
      icon: null
    },
    { 
      label: 'Portal AMIL', 
      href: '#', 
      logo: '/Logos/amil.png',
      icon: null
    },
    { 
      label: 'TOTVS Produção', 
      href: '#', 
      logo: '/Logos/totvs-logo.png',
      icon: null
    },
    { 
      label: 'TOTVS Teste', 
      href: '#', 
      logo: '/Logos/totvs-logo.png',
      icon: null
    },
    { 
      label: 'Portal RH', 
      href: '#', 
      logo: '/Logos/Meu RH.png',
      icon: null
    },
    { 
      label: 'Fusion Produção', 
      href: '#', 
      logo: '/Logos/Fusion.png',
      icon: null
    },
    { 
      label: 'Fusion Teste', 
      href: '#', 
      logo: '/Logos/Fusion.png',
      icon: null
    },
    { 
      label: 'Mercos', 
      href: '#', 
      logo: '/Logos/logo-mercos-colored.svg',
      icon: null
    },
    { 
      label: 'WMS Produção', 
      href: '#', 
      logo: '/Logos/WMS.svg',
      icon: null
    },
    { 
      label: 'WMS Teste', 
      href: '#', 
      logo: '/Logos/WMS.svg',
      icon: null
    },
  ];

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

      {/* Modern Top Bar */}
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
          background: 'linear-gradient(135deg, #ef4444 0%, #fb923c 20%, #ffcc00 100%)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), 0 4px 16px rgba(0, 0, 0, 0.15), inset 0 -1px 0 rgba(255, 255, 255, 0.2)',
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
            }}
          >
            {/* Relógio */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              style={{
                background: 'rgba(0, 0, 0, 0.2)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                padding: '12px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                minWidth: '160px',
                justifyContent: 'center',
              }}
            >
              <AccessTime sx={{ color: 'white', fontSize: 24 }} />
              <Typography
                sx={{
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '1.2rem',
                  fontFamily: 'monospace',
                }}
              >
                {time}
              </Typography>
            </motion.div>

            {/* Logo Compactor */}
            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <img
                src="/Logos/Logo Compactor.png"
                alt="Compactor"
                style={{ height: '35px', maxWidth: '100%', display: 'block' }}
              />
            </Box>

            {/* Nome do Computador */}
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
                padding: '12px 20px',
                cursor: 'pointer',
                minWidth: '160px',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                justifyContent: 'center',
              }}
            >
              <Computer sx={{ color: 'white', fontSize: 24 }} />
              <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '0.95rem' }}>
                Meu pc
              </Typography>
            </motion.div>
          </Box>
        </Container>
      </Box>

      {/* Conteúdo Principal */}
      <Box
        sx={{
          minHeight: '100vh',
          pt: 12,
          pb: 4,
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Container maxWidth="xl">
          {/* Google Logo */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
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

          {/* Pesquisa do Google */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginBottom: '24px' }}
          >
            <form onSubmit={onSearchSubmit}>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Box sx={{ position: 'relative', width: '100%', maxWidth: '650px' }}>
                  <TextField
                    name="q"
                    placeholder="Pesquise no Google"
                    variant="outlined"
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        background: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: '50px',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15), 0 6px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                        paddingRight: '10px',
                        height: '45px',
                        '& fieldset': {
                          borderColor: 'rgba(251, 146, 60, 0.3)',
                          borderWidth: '2px',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(251, 146, 60, 0.5)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#fb923c',
                        },
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search sx={{ color: '#fb923c' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Box
                    component="button"
                    type="submit"
                    sx={{
                      position: 'absolute',
                      right: '4px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'linear-gradient(135deg, #ffcc00 0%, #f59e0b 100%)',
                      color: '#1f2937',
                      border: 'none',
                      borderRadius: '50px',
                      padding: '10px 24px',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(251, 146, 60, 0.4), 0 2px 6px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-50%) scale(1.05)',
                        boxShadow: '0 6px 20px rgba(251, 146, 60, 0.5), 0 3px 10px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.7)',
                      },
                      '&:active': {
                        transform: 'translateY(-50%) scale(0.98)',
                      },
                    }}
                  >
                    Pesquisar
                  </Box>
                </Box>
              </Box>
            </form>
          </motion.div>

          <RadioButtons />

          {/* Grade de Atalhos */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Typography
              variant="h5"
              sx={{
                textAlign: 'center',
                fontSize: '1.4rem',
                fontWeight: 500,
                mb: 2,
                color: '#1f2937',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              Atalhos Rápidos
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'repeat(2, 1fr)',
                  sm: 'repeat(3, 1fr)',
                  md: 'repeat(4, 1fr)',
                  lg: 'repeat(6, 1fr)',
                },
                gap: 2,
                maxWidth: '1100px',
                margin: '0 auto',
              }}
            >
              {shortcuts.map((shortcut, index) => (
                <ModernCard
                  key={shortcut.label}
                  title={shortcut.label}
                  href={shortcut.href}
                  logo={shortcut.logo || undefined}
                  icon={shortcut.icon || undefined}
                  delay={index * 0.05}
                />
              ))}
            </Box>
          </motion.div>
        </Container>
      </Box>

      <style jsx global>{`
        body { 
          margin: 0;
          padding: 0;
          -webkit-font-smoothing: antialiased;
          font-family: 'Poppins', sans-serif;
          overflow-x: hidden;
        }
      `}</style>
    </>
  );
}
