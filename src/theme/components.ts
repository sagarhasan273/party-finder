import type { Components } from "@mui/material/styles";

import { alpha } from "@mui/material/styles";

import { BORDER, PRIMARY, BG_CARD, BG_CARD2, BG_DARKEST } from "./palette";

export const components: Components = {
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
        backgroundImage: "none",
        backgroundColor: BG_CARD,
        border: `1px solid ${BORDER}`,
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        backgroundImage: "none",
        backgroundColor: BG_CARD,
        border: `1px solid ${BORDER}`,
        transition: "border-color 0.2s, box-shadow 0.2s",
        "&:hover": {
          borderColor: "rgba(255,70,85,0.25)",
          boxShadow: "0 4px 24px rgba(255,70,85,0.08)",
        },
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: "uppercase",
        fontFamily: '"Rajdhani", sans-serif',
        fontWeight: 700,
        letterSpacing: "0.06em",
        borderRadius: 4,
        fontSize: "0.875rem",
      },
      contained: {
        boxShadow: "none",
        "&:hover": { boxShadow: "0 0 20px rgba(255,70,85,0.35)" },
      },
      outlined: {
        borderColor: BORDER,
        "&:hover": { borderColor: alpha(PRIMARY, 0.5) },
      },
      sizeSmall: {
        fontSize: "0.75rem",
      },
      sizeLarge: {
        fontSize: "1rem",
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        fontFamily: '"Rajdhani", sans-serif',
        fontWeight: 700,
        letterSpacing: "0.05em",
        fontSize: "0.7rem",
        height: 24,
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        "& .MuiOutlinedInput-root": {
          backgroundColor: BG_CARD2,
          "& fieldset": { borderColor: BORDER },
          "&:hover fieldset": { borderColor: "rgba(255,255,255,0.2)" },
          "&.Mui-focused fieldset": { borderColor: PRIMARY },
        },
        "& .MuiInputLabel-root": {
          fontFamily: '"Rajdhani", sans-serif',
          fontWeight: 700,
          letterSpacing: "0.06em",
          fontSize: "0.8rem",
          textTransform: "uppercase",
        },
      },
    },
  },
  MuiSelect: {
    styleOverrides: {
      root: {
        backgroundColor: BG_CARD2,
        "& .MuiOutlinedInput-notchedOutline": { borderColor: BORDER },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "rgba(255,255,255,0.2)",
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: PRIMARY,
        },
      },
    },
  },
  MuiInputLabel: {
    styleOverrides: {
      root: {
        fontFamily: '"Rajdhani", sans-serif',
        fontWeight: 700,
        letterSpacing: "0.06em",
        fontSize: "0.8rem",
        textTransform: "uppercase",
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
        fontSize: "0.875rem",
        "&:hover": { backgroundColor: "rgba(255,70,85,0.08)" },
        "&.Mui-selected": {
          backgroundColor: "rgba(255,70,85,0.12)",
          "&:hover": { backgroundColor: "rgba(255,70,85,0.18)" },
        },
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        backgroundImage: "none",
        backgroundColor: "rgba(13,15,26,0.95)",
        borderBottom: `1px solid ${BORDER}`,
        backdropFilter: "blur(12px)",
        boxShadow: "none",
      },
    },
  },
  MuiToolbar: {
    styleOverrides: {
      root: { minHeight: "64px !important" },
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
        fontSize: "0.75rem",
      },
      arrow: { color: BG_CARD2 },
    },
  },
  MuiFormHelperText: {
    styleOverrides: {
      root: { fontFamily: '"DM Sans", sans-serif', fontSize: "0.75rem" },
    },
  },
  MuiTypography: {
    styleOverrides: {
      root: {
        "&.text-xs": { fontSize: "0.75rem" },
        "&.text-sm": { fontSize: "0.875rem" },
        "&.text-md": { fontSize: "1rem" },
        "&.text-lg": { fontSize: "1.125rem" },
        "&.text-xl": { fontSize: "1.25rem" },
      },
    },
  },
};
