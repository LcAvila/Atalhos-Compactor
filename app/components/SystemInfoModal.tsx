"use client";
import React from 'react';
import { Box, Typography, Button, Modal } from '@mui/material';

export default function SystemInfoModal({ open, onClose, hostname, ips }: {
  open: boolean;
  onClose: () => void;
  hostname: string | null;
  ips: string[];
}) {
  const handleCopy = async () => {
    const text = `Hostname: ${hostname || 'N/A'}\nIPs: ${ips.join(', ') || 'N/A'}`;
    try {
      await navigator.clipboard.writeText(text);
      // Small feedback could be added; keep simple
      onClose();
    } catch (e) {
      console.error('Copy failed', e);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', p: 3, borderRadius: 2, minWidth: 300 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Informações do Sistema</Typography>
        <Typography variant="body2"><strong>Nome do PC:</strong> {hostname || 'N/A'}</Typography>
        <Typography variant="body2" sx={{ mb: 2 }}><strong>IPs:</strong> {ips.length ? ips.join(', ') : 'N/A'}</Typography>
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
          <Button onClick={onClose}>Fechar</Button>
          <Button variant="contained" onClick={handleCopy}>Copiar</Button>
        </Box>
      </Box>
    </Modal>
  );
}
