/**
 * theme.ts: design tokens + the MUI theme.
 *
 * Look: a tactical HUD. Ink-navy background with a faint grid, one red accent,
 * mint for "live", tier colours for ranks, condensed uppercase headings.
 *
 * Fonts: add this to index.html <head>:
 *   <link rel="preconnect" href="https://fonts.googleapis.com" />
 *   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
 *   <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet" />
 */
import { alpha, createTheme } from "@mui/material/styles";

export const tokens = {
  bg: "#0A0E15",
  surface: "#111723",
  surfaceRaised: "#161E2D",
  inset: "#0C111A",
  line: "rgba(255, 255, 255, 0.08)",
  lineStrong: "rgba(255, 255, 255, 0.18)",
  text: "#F3EFE9",
  muted: "#98A1B1",
  faint: "#5D6677",
  accent: "#FF4655",
  accentHover: "#FF6170",
  accentSoft: "rgba(255, 70, 85, 0.12)",
  live: "#3DDC97",
  liveSoft: "rgba(61, 220, 151, 0.12)",
} as const;

export const fonts = {
  display: '"Barlow Condensed", "Arial Narrow", sans-serif',
  body: '"Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  mono: '"JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace',
};

/** Valorant-style cut corners (top-right and bottom-left). */
export const chamfer = (size = 10): string =>
  `polygon(0 0, calc(100% - ${size}px) 0, 100% ${size}px, 100% 100%, ${size}px 100%, 0 calc(100% - ${size}px))`;

export const gameTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: tokens.accent, contrastText: "#fff" },
    success: { main: tokens.live },
    background: { default: tokens.bg, paper: tokens.surfaceRaised },
    text: { primary: tokens.text, secondary: tokens.muted },
    divider: tokens.line,
  },
  shape: { borderRadius: 4 },
  typography: {
    fontFamily: fonts.body,
    h1: {
      fontFamily: fonts.display,
      fontWeight: 800,
      textTransform: "uppercase",
      lineHeight: 0.9,
      letterSpacing: "-0.01em",
    },
    h6: {
      fontFamily: fonts.display,
      fontWeight: 700,
      fontSize: "1.12rem",
      letterSpacing: "0.03em",
      textTransform: "uppercase",
      lineHeight: 1.1,
    },
    subtitle2: {
      fontSize: "0.74rem",
      fontWeight: 600,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: tokens.muted,
    },
    button: {
      fontFamily: fonts.display,
      fontWeight: 700,
      fontSize: "0.92rem",
      letterSpacing: "0.08em",
      textTransform: "uppercase",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: { WebkitTextSizeAdjust: "100%" },
        body: {
          backgroundColor: tokens.bg,
          backgroundImage: [
            `radial-gradient(1100px 600px at 90% -10%, ${alpha(tokens.accent, 0.13)}, transparent 60%)`,
            `radial-gradient(900px 520px at -10% 110%, ${alpha(tokens.live, 0.07)}, transparent 60%)`,
            "linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px)",
            "linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)",
          ].join(","),
          backgroundSize: "auto, auto, 44px 44px, 44px 44px",
          backgroundAttachment: "fixed",
          WebkitFontSmoothing: "antialiased",
          WebkitTapHighlightColor: "transparent",
        },
        "::selection": { background: alpha(tokens.accent, 0.4) },
        "@media (prefers-reduced-motion: reduce)": {
          "*, *::before, *::after": {
            animationDuration: "0.01ms !important",
            animationIterationCount: "1 !important",
            transitionDuration: "0.01ms !important",
          },
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { minHeight: 40, borderRadius: 3, paddingInline: 16 },
        sizeSmall: { minHeight: 32, fontSize: "0.8rem" },
        sizeLarge: { minHeight: 46, fontSize: "1rem" },
        containedPrimary: {
          clipPath: chamfer(10),
          "&:hover": { backgroundColor: tokens.accentHover },
          "&.Mui-disabled": {
            backgroundColor: alpha(tokens.accent, 0.25),
            color: alpha("#fff", 0.6),
          },
        },
        outlined: {
          borderColor: tokens.lineStrong,
          color: tokens.text,
          "&:hover": {
            borderColor: tokens.text,
            backgroundColor: "rgba(255,255,255,0.04)",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: tokens.inset,
          "& .MuiOutlinedInput-notchedOutline": { borderColor: tokens.line },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: tokens.lineStrong,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: tokens.accent,
            borderWidth: 1,
          },
        },
        // 16px stops iOS Safari from zooming in when an input gets focus.
        input: { fontSize: 16, "@media (min-width:600px)": { fontSize: 15 } },
      },
    },
    MuiInputLabel: {
      styleOverrides: { root: { "&.Mui-focused": { color: tokens.text } } },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          minHeight: 40,
          fontFamily: fonts.display,
          fontWeight: 700,
          fontSize: "0.88rem",
          letterSpacing: "0.06em",
          color: tokens.muted,
          backgroundColor: tokens.inset,
          "&:hover": { backgroundColor: tokens.surfaceRaised },
          "&.Mui-selected": {
            color: tokens.text,
            backgroundColor: tokens.accentSoft,
            "&:hover": { backgroundColor: alpha(tokens.accent, 0.18) },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: "none" },
        outlined: { borderColor: tokens.line },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: { border: `1px solid ${tokens.line}`, minWidth: 200 },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: tokens.surfaceRaised,
          border: `1px solid ${tokens.line}`,
          borderTop: `2px solid ${tokens.accent}`,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 4, alignItems: "center" },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: 44,
          fontFamily: fonts.display,
          fontWeight: 700,
          fontSize: "0.9rem",
          letterSpacing: "0.08em",
          color: tokens.muted,
          "&.Mui-selected": { color: tokens.text },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: tokens.surfaceRaised,
          border: `1px solid ${tokens.line}`,
        },
      },
    },
  },
});
