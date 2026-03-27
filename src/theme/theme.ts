// src/theme/theme.ts
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ff4655',
      light: '#ff6b78',
      dark: '#cc3844',
    },
    secondary: {
      main: '#a78bfa',
    },
    background: {
      default: '#0d0e10',
      paper: '#141519',
    },
    grey: {
      800: '#1c1d22',
      700: '#252630',
      600: '#2a2b35',
      500: '#363742',
      400: '#5c6070',
      300: '#9aa0b8',
      200: '#e8eaf0',
    },
    success: {
      main: '#4ade80',
    },
    warning: {
      main: '#f5c842',
    },
    info: {
      main: '#4fc3f7',
    },
  },
  typography: {
    fontFamily: '"Barlow", sans-serif',
    fontSize: 15,
    h1: {
      fontFamily: '"Barlow Condensed", sans-serif',
      fontWeight: 800,
      fontSize: '28px',
      letterSpacing: '0.3px',
    },
    h4: {
      fontFamily: '"Barlow Condensed", sans-serif',
      fontWeight: 800,
      fontSize: '28px',
      letterSpacing: '0.3px',
    },
    h5: {
      fontFamily: '"Barlow Condensed", sans-serif',
      fontWeight: 700,
      fontSize: '22px',
      letterSpacing: '0.3px',
    },
    h6: {
      fontFamily: '"Barlow Condensed", sans-serif',
      fontWeight: 700,
      fontSize: '16px',
      letterSpacing: '0.5px',
    },
    subtitle1: {
      fontFamily: '"Barlow Condensed", sans-serif',
      fontWeight: 700,
      fontSize: '15px',
    },
    subtitle2: {
      fontFamily: '"Barlow Condensed", sans-serif',
      fontWeight: 700,
      fontSize: '14px',
    },
    body1: {
      fontFamily: '"Barlow", sans-serif',
      fontSize: '14px',
    },
    body2: {
      fontFamily: '"Barlow", sans-serif',
      fontSize: '13px',
    },
    button: {
      fontFamily: '"Barlow Condensed", sans-serif',
      fontWeight: 700,
      fontSize: '14px',
      letterSpacing: '0.5px',
      textTransform: 'none',
    },
    caption: {
      fontFamily: '"Barlow", sans-serif',
      fontSize: '12px',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#0d0e10',
          fontFamily: '"Barlow", sans-serif',
          fontSize: 15,
          color: '#e8eaf0',
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': {
            width: 6,
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#363742',
            borderRadius: 3,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#141519',
          border: '1px solid #2a2b35',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#141519',
          border: '1px solid #2a2b35',
          borderRadius: 12,
          '&:hover': {
            borderColor: '#ff4655',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: '"Barlow Condensed", sans-serif',
          fontWeight: 700,
          letterSpacing: '0.5px',
          borderRadius: 8,
          padding: '7px 18px',
          textTransform: 'none',
        },
        contained: {
          backgroundColor: '#ff4655',
          color: '#fff',
          '&:hover': {
            backgroundColor: '#ff6b78',
            transform: 'scale(1.02)',
          },
          '&:active': {
            transform: 'scale(0.98)',
          },
        },
        outlined: {
          borderColor: '#2a2b35',
          color: '#9aa0b8',
          '&:hover': {
            borderColor: '#363742',
            color: '#e8eaf0',
            backgroundColor: 'transparent',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: '"Barlow Condensed", sans-serif',
          fontWeight: 700,
          fontSize: 13,
          letterSpacing: '0.3px',
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          fontFamily: '"Barlow", sans-serif',
          fontSize: 13,
          fontWeight: 500,
          textTransform: 'none',
          borderColor: '#2a2b35',
          color: '#9aa0b8',
          '&.Mui-selected': {
            backgroundColor: 'rgba(255, 70, 85, 0.1)',
            borderColor: 'rgba(255, 70, 85, 0.4)',
            color: '#ff4655',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#1c1d22',
            '& fieldset': {
              borderColor: '#2a2b35',
            },
            '&:hover fieldset': {
              borderColor: '#363742',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#ff4655',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#9aa0b8',
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            fontFamily: '"Barlow Condensed", sans-serif',
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: '#1c1d22',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#2a2b35',
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontFamily: '"Barlow Condensed", sans-serif',
          fontWeight: 700,
        },
      },
    },
  },
});