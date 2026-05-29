export const PRIMARY = "#ff1c2f"; // Valorant red
export const BG_DARKEST = "#0d0f1a";
export const BG_CARD = "#161926";
export const BG_CARD2 = "#1c2030";
export const BORDER = "rgba(255,255,255,0.08)";

export const palette = {
  mode: "dark" as const,
  primary: {
    main: PRIMARY,
    light: "#f74553",
    dark: "#cf1023",
    contrastText: "#fff",
  },
  secondary: {
    main: "#7289DA",
    light: "#8fa1e4",
    dark: "#5c72c0",
    contrastText: "#fff",
  },
  background: {
    default: BG_DARKEST,
    paper: BG_CARD,
  },
  text: {
    primary: "#e8ecf0",
    secondary: "#7a8499",
  },
  divider: BORDER,
  success: { main: "#22c55e" },
  error: { main: PRIMARY },
  warning: { main: "#f59e0b" },
};
