"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

interface ModernCardProps {
  title: string;
  href?: string;
  logo?: string;
  icon?: React.ReactNode;
  delay?: number;
  onClick?: () => void;
}

const StyledCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  border: '2px solid rgba(255, 255, 255, 0.3)',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
  overflow: 'hidden',
  cursor: 'pointer',
  maxHeight: '90px',
  willChange: 'transform',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.1) 0%, rgba(239, 68, 68, 0.1) 100%)',
    opacity: 0,
    transition: 'opacity 0.2s ease',
    zIndex: 0,
    pointerEvents: 'none',
  },
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 20px 60px rgba(251, 146, 60, 0.3), 0 12px 24px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
    borderColor: 'rgba(251, 146, 60, 0.5)',
    '&::before': {
      opacity: 1,
    },
    '& img, & svg': {
      filter: 'grayscale(0%) opacity(1) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15))',
    },
  },
  '&:active': {
    transform: 'translateY(-2px)',
  },
}));

const GlowEffect = styled(Box)({
  position: 'absolute',
  top: '-50%',
  left: '-50%',
  width: '200%',
  height: '200%',
  background: 'radial-gradient(circle, rgba(251, 146, 60, 0.3) 0%, transparent 70%)',
  opacity: 0,
  transition: 'opacity 0.5s ease',
  pointerEvents: 'none',
  zIndex: 1,
});

const LogoContainer = styled(Box)({
  width: '50px',
  height: '50px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 8px',
  borderRadius: '12px',
  padding: '0',
  '& img': {
    width: '60px',
    height: '60px',
    objectFit: 'contain',
    filter: 'grayscale(100%) opacity(0.2)',
    transition: 'filter 0.2s ease',
    willChange: 'filter',
  },
  '& svg': {
    width: '60px',
    height: '60px',
    filter: 'grayscale(100%) opacity(0.4)',
    transition: 'filter 0.2s ease',
    willChange: 'filter',
  },
});

const ModernCard: React.FC<ModernCardProps> = ({ title, href, logo, icon, delay = 0, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      window.open(href, '_blank');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: delay,
        ease: 'easeOut',
      }}
    >
      <StyledCard onClick={handleClick}>
        <GlowEffect className="glow-effect" />
        <CardContent sx={{ position: 'relative', zIndex: 2, padding: '12px' }}>
          {logo && (
            <LogoContainer>
              <img 
                src={logo} 
                alt={title}
              />
            </LogoContainer>
          )}
          {icon && !logo && (
            <LogoContainer>
              {icon}
            </LogoContainer>
          )}
          <Typography 
            variant="body2" 
            component="div" 
            sx={{ 
              textAlign: 'center',
              fontWeight: 600,
              fontSize: '0.85rem',
              color: '#1f2937',
              letterSpacing: '0.3px',
              textShadow: '0 1px 2px rgba(0,0,0,0.05)',
              lineHeight: 0,
            }}
          >
            {title}
          </Typography>
        </CardContent>
      </StyledCard>
    </motion.div>
  );
};

export default ModernCard;
