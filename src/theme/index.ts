import { createTheme, alpha } from '@mui/material/styles';

const PRIMARY = '#FF4655'; // Valorant red
const BG_DARKEST = '#0d0f1a';
const BG_DARK = '#10131f';
const BG_CARD = '#161926';
const BG_CARD2 = '#1c2030';
const BORDER = 'rgba(255,255,255,0.08)';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: PRIMARY,
      light: '#ff6b77',
      dark: '#cc3544',
      contrastText: '#fff',
    },
    secondary: {
      main: '#7289DA',
      light: '#8fa1e4',
      dark: '#5c72c0',
      contrastText: '#fff',
    },
    background: {
      default: BG_DARKEST,
      paper: BG_CARD,
    },
    text: {
      primary: '#e8ecf0',
      secondary: '#7a8499',
    },
    divider: BORDER,
    success: { main: '#22c55e' },
    error: { main: PRIMARY },
    warning: { main: '#f59e0b' },
  },
  typography: {
    fontFamily: '"DM Sans", "Helvetica Neue", Arial, sans-serif',
    h1: { fontFamily: '"Rajdhani", sans-serif', fontWeight: 900, letterSpacing: '0.04em' },
    h2: { fontFamily: '"Rajdhani", sans-serif', fontWeight: 800, letterSpacing: '0.04em' },
    h3: { fontFamily: '"Rajdhani", sans-serif', fontWeight: 700, letterSpacing: '0.04em' },
    h4: { fontFamily: '"Rajdhani", sans-serif', fontWeight: 700, letterSpacing: '0.04em' },
    h5: { fontFamily: '"Rajdhani", sans-serif', fontWeight: 600 },
    h6: { fontFamily: '"Rajdhani", sans-serif', fontWeight: 600 },
    overline: { fontFamily: '"Rajdhani", sans-serif', fontWeight: 700, letterSpacing: '0.1em' },
    button: { fontFamily: '"Rajdhani", sans-serif', fontWeight: 700, letterSpacing: '0.06em' },
    body1: { fontFamily: '"DM Sans", sans-serif' },
    body2: { fontFamily: '"DM Sans", sans-serif' },
    caption: { fontFamily: '"DM Sans", sans-serif' },
  },
  shape: { borderRadius: 6 },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        *, *::before, *::after { box-sizing: border-box; }
        html, body, #root { height: 100%; }
        body {
          background: ${BG_DARKEST};
          color: #e8ecf0;
          font-family: "DM Sans", sans-serif;
        }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
        option { background: #1c2030; color: #e8ecf0; }
      `,
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: BG_CARD,
          border: `1px solid ${BORDER}`,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: BG_CARD,
          border: `1px solid ${BORDER}`,
          transition: 'border-color 0.2s, box-shadow 0.2s',
          '&:hover': {
            borderColor: 'rgba(255,70,85,0.25)',
            boxShadow: '0 4px 24px rgba(255,70,85,0.08)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'uppercase',
          fontFamily: '"Rajdhani", sans-serif',
          fontWeight: 700,
          letterSpacing: '0.06em',
          borderRadius: 4,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': { boxShadow: '0 0 20px rgba(255,70,85,0.35)' },
        },
        outlined: {
          borderColor: BORDER,
          '&:hover': { borderColor: alpha(PRIMARY, 0.5) },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: '"Rajdhani", sans-serif',
          fontWeight: 700,
          letterSpacing: '0.05em',
          fontSize: '0.7rem',
          height: 24,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: BG_CARD2,
            '& fieldset': { borderColor: BORDER },
            '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
            '&.Mui-focused fieldset': { borderColor: PRIMARY },
          },
          '& .MuiInputLabel-root': {
            fontFamily: '"Rajdhani", sans-serif',
            fontWeight: 700,
            letterSpacing: '0.06em',
            fontSize: '0.8rem',
            textTransform: 'uppercase',
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: BG_CARD2,
          '& .MuiOutlinedInput-notchedOutline': { borderColor: BORDER },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: PRIMARY },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontFamily: '"Rajdhani", sans-serif',
          fontWeight: 700,
          letterSpacing: '0.06em',
          fontSize: '0.8rem',
          textTransform: 'uppercase',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: BG_CARD2,
          border: `1px solid ${BORDER}`,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontFamily: '"DM Sans", sans-serif',
          '&:hover': { backgroundColor: 'rgba(255,70,85,0.08)' },
          '&.Mui-selected': {
            backgroundColor: 'rgba(255,70,85,0.12)',
            '&:hover': { backgroundColor: 'rgba(255,70,85,0.18)' },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(13,15,26,0.95)',
          borderBottom: `1px solid ${BORDER}`,
          backdropFilter: 'blur(12px)',
          boxShadow: 'none',
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: { minHeight: '64px !important' },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: BORDER },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { fontFamily: '"DM Sans", sans-serif' },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: BG_CARD2,
          border: `1px solid ${BORDER}`,
          fontFamily: '"DM Sans", sans-serif',
          fontSize: '0.75rem',
        },
        arrow: { color: BG_CARD2 },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: { fontFamily: '"DM Sans", sans-serif' },
      },
    },
  },
});
