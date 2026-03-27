// src/components/AuthScreen.tsx
import React from 'react';
import { Box, Paper, Typography, Button, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: '40px',
  width: 360,
  textAlign: 'center',
  backgroundColor: '#141519',
  border: '1px solid #2a2b35',
  borderRadius: 16,
  boxShadow: 'none',
}));

const Logo = styled(Typography)(({ theme }) => ({
  fontFamily: '"Barlow Condensed", sans-serif',
  fontSize: 36,
  fontWeight: 800,
  letterSpacing: '1px',
  marginBottom: 4,
  '& span': {
    color: '#ff4655',
  },
}));

interface AuthScreenProps {
  onLogin: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#0d0e10',
        position: 'fixed',
        inset: 0,
        zIndex: 200,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <StyledPaper elevation={0}>
          <Logo variant="h1">
            VAL<span>5TH</span>
          </Logo>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#9aa0b8', 
              fontSize: 14,
              marginBottom: '28px',
              lineHeight: 1.5
            }}
          >
            The fastest way to find your fifth for Valorant Competitive. OAuth2 secured — no passwords needed.
          </Typography>
          <Stack spacing={1.5}>
            <Button
              variant="contained"
              onClick={onLogin}
              startIcon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              }
              sx={{ 
                width: '100%', 
                py: '13px',
                fontSize: 16,
                backgroundColor: '#ff4655',
                '&:hover': { backgroundColor: '#ff6b78' }
              }}
            >
              Sign in with Riot (RSO)
            </Button>
            <Button
              variant="outlined"
              onClick={onLogin}
              startIcon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                </svg>
              }
              sx={{ 
                width: '100%', 
                py: '13px',
                fontSize: 16,
                backgroundColor: '#1c1d22',
                color: '#9aa0b8',
                borderColor: '#2a2b35',
                '&:hover': { 
                  color: '#e8eaf0', 
                  borderColor: '#363742',
                  backgroundColor: '#1c1d22'
                }
              }}
            >
              Try Demo Mode
            </Button>
          </Stack>
          <Typography 
            variant="caption" 
            sx={{ 
              fontSize: 12,
              color: '#5c6070',
              display: 'block',
              marginTop: '16px',
              lineHeight: 1.5
            }}
          >
            By signing in you agree to our Terms of Service. This app is not affiliated with Riot Games.
          </Typography>
        </StyledPaper>
      </motion.div>
    </Box>
  );
};