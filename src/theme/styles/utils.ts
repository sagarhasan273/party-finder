// src/theme/utils.ts

// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------

interface ResponsiveFontSizes {
  sm: number;
  md: number;
  lg: number;
}

// ----------------------------------------------------------------------
// Constants
// ----------------------------------------------------------------------

export const BREAKPOINTS = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
} as const;

export const stylesMode = {
  light: '[data-mui-color-scheme="light"] &',
  dark: '[data-mui-color-scheme="dark"] &',
} as const;

export const mediaQueries = {
  upXs: `@media (min-width:${BREAKPOINTS.xs}px)`,
  upSm: `@media (min-width:${BREAKPOINTS.sm}px)`,
  upMd: `@media (min-width:${BREAKPOINTS.md}px)`,
  upLg: `@media (min-width:${BREAKPOINTS.lg}px)`,
  upXl: `@media (min-width:${BREAKPOINTS.xl}px)`,
  // Down queries
  downSm: `@media (max-width:${BREAKPOINTS.sm - 1}px)`,
  downMd: `@media (max-width:${BREAKPOINTS.md - 1}px)`,
  downLg: `@media (max-width:${BREAKPOINTS.lg - 1}px)`,
  downXl: `@media (max-width:${BREAKPOINTS.xl - 1}px)`,
  // Between queries
  betweenSmLg: `@media (min-width:${BREAKPOINTS.sm}px) and (max-width:${BREAKPOINTS.lg - 1}px)`,
  betweenMdLg: `@media (min-width:${BREAKPOINTS.md}px) and (max-width:${BREAKPOINTS.lg - 1}px)`,
} as const;

// ----------------------------------------------------------------------
// Font Utilities
// ----------------------------------------------------------------------

/**
 * Set font family with fallbacks
 * @example setFont('Inter') // returns '"Inter",-apple-system,...'
 */
export function setFont(fontName: string): string {
  return `"${fontName}",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"`;
}

/**
 * Get font stack with multiple fonts
 * @example getFontStack(['Inter', 'Roboto']) // returns '"Inter","Roboto",-apple-system,...'
 */
export function getFontStack(fontNames: string[]): string {
  const fonts = fontNames.map((f) => `"${f}"`).join(",");
  return `${fonts},-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif`;
}

// ----------------------------------------------------------------------
// Unit Conversion Utilities
// ----------------------------------------------------------------------

/**
 * Converts rem to px
 * @example remToPx('1.5rem') // returns 24
 */
export function remToPx(value: string): number {
  const parsed = parseFloat(value);
  if (Number.isNaN(parsed)) {
    throw new Error(`Invalid rem value: ${value}`);
  }
  return Math.round(parsed * 16);
}

/**
 * Converts px to rem
 * @example pxToRem(24) // returns '1.5rem'
 */
export function pxToRem(value: number): string {
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new Error(`Invalid px value: ${value}`);
  }
  return `${value / 16}rem`;
}

/**
 * Converts px to em
 * @example pxToEm(24) // returns '1.5em'
 */
export function pxToEm(value: number): string {
  return `${value / 16}em`;
}

/**
 * Converts px to vw (viewport width)
 * @example pxToVw(24) // returns '2.083vw' (based on 1152px viewport)
 */
export function pxToVw(value: number): string {
  return `${(value / 1152) * 100}vw`;
}

/**
 * Converts px to vh (viewport height)
 * @example pxToVh(24) // returns '2.222vh' (based on 1080px viewport)
 */
export function pxToVh(value: number): string {
  return `${(value / 1080) * 100}vh`;
}

/**
 * Clamp value between min and max
 * @example clamp(1.5, 1, 2) // returns 1.5
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// ----------------------------------------------------------------------
// Responsive Utilities
// ----------------------------------------------------------------------

/**
 * Responsive font sizes with breakpoints
 * @example responsiveFontSizes({ sm: 14, md: 16, lg: 18 })
 * // returns { '@media (min-width:600px)': { fontSize: '0.875rem' }, ... }
 */
export function responsiveFontSizes({ sm, md, lg }: ResponsiveFontSizes) {
  return {
    [mediaQueries.upSm]: { fontSize: pxToRem(sm) },
    [mediaQueries.upMd]: { fontSize: pxToRem(md) },
    [mediaQueries.upLg]: { fontSize: pxToRem(lg) },
  };
}

/**
 * Responsive spacing
 * @example responsiveSpacing({ xs: 1, sm: 2, md: 3, lg: 4 })
 * // returns spacing values based on theme spacing
 */
export function responsiveSpacing<T>(values: {
  xs: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
}): Record<string, T> {
  const result: Record<string, T> = {
    [mediaQueries.upXs]: values.xs,
  };

  if (values.sm) result[mediaQueries.upSm] = values.sm;
  if (values.md) result[mediaQueries.upMd] = values.md;
  if (values.lg) result[mediaQueries.upLg] = values.lg;
  if (values.xl) result[mediaQueries.upXl] = values.xl;

  return result;
}

/**
 * Responsive display helper
 * @example hideOn('sm') // returns { display: { xs: 'none', sm: 'block' } }
 */
export function hideOn(breakpoint: keyof typeof BREAKPOINTS) {
  const up =
    `up${breakpoint.charAt(0).toUpperCase() + breakpoint.slice(1)}` as keyof typeof mediaQueries;
  return {
    display: "none",
    [mediaQueries[up]]: { display: "block" },
  };
}

/**
 * Show only on specific breakpoint
 * @example showOn('md') // returns { display: { xs: 'none', md: 'block' } }
 */
export function showOn(breakpoint: keyof typeof BREAKPOINTS) {
  const up =
    `up${breakpoint.charAt(0).toUpperCase() + breakpoint.slice(1)}` as keyof typeof mediaQueries;
  return {
    display: "none",
    [mediaQueries[up]]: { display: "block" },
  };
}

// ----------------------------------------------------------------------
// Color Utilities
// ----------------------------------------------------------------------

/**
 * Converts a hex color to RGB channels
 * @example hexToRgbChannel('#00B8D9') // returns '0 184 217'
 */
export function hexToRgbChannel(hex: string): string {
  // Remove # if present
  const cleanHex = hex.replace("#", "");

  // Support shorthand hex (#FFF)
  if (cleanHex.length === 3) {
    const r = parseInt(cleanHex[0] + cleanHex[0], 16);
    const g = parseInt(cleanHex[1] + cleanHex[1], 16);
    const b = parseInt(cleanHex[2] + cleanHex[2], 16);
    return `${r} ${g} ${b}`;
  }

  // Support full hex (#FFFFFF)
  if (cleanHex.length === 6) {
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return `${r} ${g} ${b}`;
  }

  throw new Error(
    `Invalid hex color: ${hex}. Expected format: #RRGGBB or #RGB`,
  );
}

/**
 * Converts a hex color to RGB string
 * @example hexToRgb('#00B8D9') // returns 'rgb(0, 184, 217)'
 */
export function hexToRgb(hex: string): string {
  const channels = hexToRgbChannel(hex).split(" ");
  return `rgb(${channels[0]}, ${channels[1]}, ${channels[2]})`;
}

/**
 * Converts a hex color to RGBA string
 * @example hexToRgba('#00B8D9', 0.5) // returns 'rgba(0, 184, 217, 0.5)'
 */
export function hexToRgba(hex: string, alpha: number = 1): string {
  const channels = hexToRgbChannel(hex).split(" ");
  return `rgba(${channels[0]}, ${channels[1]}, ${channels[2]}, ${alpha})`;
}

/**
 * Creates palette channels for MUI theme
 * @example createPaletteChannel({ primary: '#FF4655', secondary: '#00B8D9' })
 * // returns { primary: '#FF4655', secondary: '#00B8D9', primaryChannel: '255 70 85', secondaryChannel: '0 184 217' }
 */
export function createPaletteChannel(hexPalette: Record<string, string>) {
  const channelPalette: Record<string, string> = {};

  Object.entries(hexPalette).forEach(([key, value]) => {
    try {
      channelPalette[`${key}Channel`] = hexToRgbChannel(value);
    } catch (error) {
      console.warn(`Failed to create channel for ${key}:`, error);
    }
  });

  return { ...hexPalette, ...channelPalette };
}

/**
 * Color with alpha channel using CSS variables or RGB channels
 * @example varAlpha('255 70 85', 0.5) // returns 'rgba(255 70 85 / 0.5)'
 * @example varAlpha('var(--palette-primaryChannel)', 0.5) // returns 'rgba(var(--palette-primaryChannel) / 0.5)'
 */
export function varAlpha(color: string, opacity = 1): string {
  // Validate input
  const unsupported =
    color.startsWith("#") ||
    color.startsWith("rgb(") ||
    color.startsWith("rgba(") ||
    color.startsWith("hsl(") ||
    color.startsWith("hsla(");

  if (unsupported) {
    throw new Error(
      `[Alpha]: Unsupported color format "${color}".
       Supported formats are:
       - RGB channels: "0 184 217"
       - CSS variables with "Channel" prefix: "var(--palette-common-blackChannel, #000000)"
       
       Unsupported formats are:
       - Hex: "#00B8D9"
       - RGB: "rgb(0, 184, 217)"
       - RGBA: "rgba(0, 184, 217, 1)"
       - HSL: "hsl(200, 100%, 50%)"
       `,
    );
  }

  // If it's already an rgba with alpha, return as-is
  if (color.includes("rgba") && opacity === 1) {
    return color;
  }

  return `rgba(${color} / ${opacity})`;
}

/**
 * Lighten a color by percentage
 * @example lighten('#FF4655', 20) // returns lighter red
 */
export function lighten(hex: string, percent: number): string {
  const channels = hexToRgbChannel(hex).split(" ").map(Number);
  const lightened = channels.map((c) =>
    Math.min(255, c + (255 - c) * (percent / 100)),
  );
  return `rgb(${Math.round(lightened[0])}, ${Math.round(lightened[1])}, ${Math.round(lightened[2])})`;
}

/**
 * Darken a color by percentage
 * @example darken('#FF4655', 20) // returns darker red
 */
export function darken(hex: string, percent: number): string {
  const channels = hexToRgbChannel(hex).split(" ").map(Number);
  const darkened = channels.map((c) => Math.max(0, c - c * (percent / 100)));
  return `rgb(${Math.round(darkened[0])}, ${Math.round(darkened[1])}, ${Math.round(darkened[2])})`;
}

// ----------------------------------------------------------------------
// Spacing Utilities
// ----------------------------------------------------------------------

/**
 * Create spacing function for theme
 * @example createSpacing(8) // returns (factor) => `${factor * 8}px`
 */
export function createSpacing(factor: number = 8) {
  return (value: number | string) => {
    if (typeof value === "string") return value;
    return `${value * factor}px`;
  };
}

/**
 * Common spacing values
 */
export const spacing = {
  xs: pxToRem(4),
  sm: pxToRem(8),
  md: pxToRem(16),
  lg: pxToRem(24),
  xl: pxToRem(32),
  xxl: pxToRem(48),
  xxxl: pxToRem(64),
};

// ----------------------------------------------------------------------
// Shadow Utilities
// ----------------------------------------------------------------------

/**
 * Create box shadow with color
 * @example createShadow('0 4px 12px', '#000', 0.2) // returns '0 4px 12px rgba(0,0,0,0.2)'
 */
export function createShadow(
  shadow: string,
  color: string,
  opacity: number = 0.2,
): string {
  const rgba = hexToRgba(color, opacity);
  return shadow.replace(/rgba\(0,0,0,[\d.]+\)/, rgba);
}

/**
 * Common shadow values
 */
export const shadows = {
  none: "none",
  sm: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
  md: "0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)",
  lg: "0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)",
  xl: "0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04)",
  "2xl": "0 25px 50px rgba(0,0,0,0.25)",
  inner: "inset 0 2px 4px rgba(0,0,0,0.06)",
};

// ----------------------------------------------------------------------
// Export all utilities
// ----------------------------------------------------------------------

export default {
  BREAKPOINTS,
  stylesMode,
  mediaQueries,
  setFont,
  getFontStack,
  remToPx,
  pxToRem,
  pxToEm,
  pxToVw,
  pxToVh,
  clamp,
  responsiveFontSizes,
  responsiveSpacing,
  hideOn,
  showOn,
  hexToRgbChannel,
  hexToRgb,
  hexToRgba,
  createPaletteChannel,
  varAlpha,
  lighten,
  darken,
  createSpacing,
  spacing,
  createShadow,
  shadows,
};
