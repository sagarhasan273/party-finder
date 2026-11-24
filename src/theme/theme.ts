import { alpha, createTheme } from "@mui/material/styles";

/**
 * Palette taken from the game's own UI: deep navy field, bone-white text,
 * one red accent. Green is reserved for "live" (voice, online).
 */
export const tokens = {
  bg: "#0F1923",
  surface: "#1A2530",
  inset: "#121C26",
  line: "rgba(236, 232, 225, 0.10)",
  lineStrong: "rgba(236, 232, 225, 0.22)",
  accent: "#FF4655",
  accentHover: "#E63A49",
  live: "#3DDC97",
  text: "#ECE8E1",
  muted: "#8B97A5",
  faint: "#5C6875",
} as const;

const display = '"Barlow Condensed", "Arial Narrow", sans-serif';
const body = 'Barlow, Inter, -apple-system, "Segoe UI", sans-serif';

export const gameTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: tokens.accent },
    success: { main: tokens.live },
    background: { default: tokens.bg, paper: tokens.surface },
    text: { primary: tokens.text, secondary: tokens.muted },
    divider: tokens.line,
  },
  shape: { borderRadius: 6 },
  typography: {
    fontFamily: body,
    h1: { fontFamily: display, fontWeight: 700, letterSpacing: "-0.01em", lineHeight: 1.02 },
    h2: { fontFamily: display, fontWeight: 700, letterSpacing: "-0.005em" },
    h6: { fontFamily: display, fontWeight: 600, fontSize: "1.25rem", letterSpacing: "0.01em" },
    subtitle2: { fontWeight: 600, fontSize: "0.82rem", color: tokens.muted },
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: tokens.bg },
        ":focus-visible": { outline: `2px solid ${tokens.accent}`, outlineOffset: 2 },
        "@media (prefers-reduced-motion: reduce)": {
          "*, *::before, *::after": {
            animationDuration: "0.01ms !important",
            animationIterationCount: "1 !important",
            transitionDuration: "0.01ms !important",
          },
        },
      },
    },
    MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 6 },
        containedPrimary: { "&:hover": { backgroundColor: tokens.accentHover } },
        outlined: {
          borderColor: tokens.lineStrong,
          color: tokens.text,
          "&:hover": { borderColor: tokens.accent, backgroundColor: alpha(tokens.accent, 0.08) },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: tokens.inset,
          "& .MuiOutlinedInput-notchedOutline": { borderColor: tokens.line },
          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: tokens.lineStrong },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: tokens.accent, borderWidth: 1 },
          "&.Mui-disabled": { opacity: 0.55 },
        },
      },
    },
    MuiInputLabel: { styleOverrides: { root: { fontSize: "0.9rem" } } },
    MuiMenu: {
      styleOverrides: {
        paper: { backgroundColor: tokens.surface, border: `1px solid ${tokens.line}` },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          color: tokens.muted,
          borderColor: tokens.line,
          backgroundColor: tokens.inset,
          "&.Mui-selected": {
            color: tokens.text,
            backgroundColor: alpha(tokens.accent, 0.16),
            borderColor: tokens.accent,
            "&:hover": { backgroundColor: alpha(tokens.accent, 0.22) },
          },
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: { color: tokens.accent },
        rail: { backgroundColor: tokens.lineStrong, opacity: 1 },
        markLabel: { fontSize: "0.7rem", color: tokens.faint },
        valueLabel: { backgroundColor: tokens.accent, fontWeight: 600 },
      },
    },
    MuiChip: { styleOverrides: { root: { borderRadius: 4, fontWeight: 600 } } },
  },
});
