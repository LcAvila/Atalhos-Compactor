"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogActions, Button, Box, Typography, MobileStepper, LinearProgress, Alert, IconButton, Divider } from '@mui/material';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import CloseIcon from '@mui/icons-material/Close';
import { motion } from 'framer-motion';

interface StepItem {
  src: string;
  caption?: string;
}

interface TutorialModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  steps?: StepItem[];
  downloading?: boolean;
  progress?: number | null; // 0-100 or null for indeterminate
  error?: string | null;
  onRetry?: () => void;
  onDownload?: () => void;
  fileName?: string;
  fileSize?: string | number;
  success?: boolean;
}

export default function TutorialModal({ open, onClose, title = 'Tutorial', steps = [], downloading = false, progress = null, error = null, onRetry, onDownload, fileName, fileSize, success = false }: TutorialModalProps) {
  const [activeStep, setActiveStep] = useState(0);
  const downloadRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) setActiveStep(0);
  }, [open]);

  const maxSteps = steps.length;
  const disableNav = downloading === true;

  useEffect(() => {
    if (open) {
      // when opening modal, focus the download button if present
      setTimeout(() => {
        downloadRef.current?.focus();
      }, 80);
    } else {
      setActiveStep(0);
    }
  }, [open]);
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <Box sx={{ background: 'linear-gradient(90deg,#ffcc00,#ffb400)', px: 3, py: 1, borderTopLeftRadius: 8, borderTopRightRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box component="img" src="/Logos/Logo Compactor.svg" alt="logo" sx={{ height: 36, opacity: 0.95 }} />
          <Typography variant="h6" sx={{ color: '#111', fontWeight: 700 }}>{title}</Typography>
        </Box>
        <IconButton aria-label="close" onClick={onClose} sx={{ color: '#111' }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent sx={{ background: '#f8f6f0' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 1 }}>
            {/* file info */}
            {(fileName || fileSize) && (
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', px: 1 }}>
                {fileName && <Typography variant="subtitle2" sx={{ color: '#555' }}>{fileName}</Typography>}
                {fileSize && <Typography variant="caption" sx={{ color: '#777' }}>• {String(fileSize)}</Typography>}
              </Box>
            )}

            {maxSteps > 0 && (
              <Box sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
                <Box sx={{ width: '100%', height: { xs: 220, md: 360 }, bg: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
                  <motion.div key={activeStep} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }} style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={steps[activeStep].src} alt={steps[activeStep].caption || `${title} ${activeStep + 1}`} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block' }} />
                  </motion.div>
                </Box>
                {steps[activeStep].caption && (
                  <Box sx={{ p: 2, background: '#fff' }}>
                    <Typography variant="body1" sx={{ color: '#333' }}>{steps[activeStep].caption}</Typography>
                  </Box>
                )}
              </Box>
            )}

          {/* Progress / status area */}
          <Box sx={{ width: '100%' }}>
            {downloading && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  {progress === null ? (
                    <LinearProgress sx={{ height: 8, borderRadius: 99 }} />
                  ) : (
                    <LinearProgress variant="determinate" value={Math.max(0, Math.min(100, progress))} sx={{ height: 8, borderRadius: 99 }} />
                  )}
                </Box>
                <Box sx={{ minWidth: 80 }}>
                  <Typography variant="body2">{progress === null ? 'Baixando...' : `${Math.round(progress)}%`}</Typography>
                </Box>
              </Box>
            )}

            {error && (
              <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>
            )}
            {(!error && success) && (
              <Alert severity="success" sx={{ mt: 1 }}>Download concluído com sucesso</Alert>
            )}
          </Box>
        </Box>
      </DialogContent>

      <Divider />
      <DialogActions sx={{ justifyContent: 'space-between', px: 3, py: 2 }}>
        <MobileStepper
          variant="dots"
          steps={maxSteps || 1}
          position="static"
          activeStep={Math.max(0, Math.min(activeStep, Math.max(0, maxSteps - 1)))}
          nextButton={
            <Button size="small" onClick={() => setActiveStep((s) => Math.min(s + 1, Math.max(0, maxSteps - 1)))} disabled={activeStep >= maxSteps - 1 || disableNav} sx={{ color: '#333' }}>
              Próximo
              <KeyboardArrowRight />
            </Button>
          }
          backButton={
            <Button size="small" onClick={() => setActiveStep((s) => Math.max(s - 1, 0))} disabled={activeStep === 0 || disableNav} sx={{ color: '#333' }}>
              <KeyboardArrowLeft />
              Voltar
            </Button>
          }
        />

        <Box sx={{ display: 'flex', gap: 1 }}>
          {error && onRetry && (
            <Button onClick={onRetry} color="inherit">Tentar novamente</Button>
          )}
          {onDownload && (
            <Button onClick={onDownload} disabled={downloading || !!success} variant="contained" sx={{ bgcolor: '#ffcc00', color: '#111', '&:hover': { bgcolor: '#ffb400' } }}>Baixar</Button>
          )}
          <Button onClick={onClose}>Fechar</Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
