import type { TypographyVariantsOptions } from "@mui/material";

// Base font sizes
export const fontSize = {
  xs: "0.75rem", // 12px
  sm: "0.875rem", // 14px
  md: "1rem", // 16px
  lg: "1.125rem", // 18px
  xl: "1.25rem", // 20px
  "2xl": "1.5rem", // 24px
  "3xl": "1.875rem", // 30px
  "4xl": "2.25rem", // 36px
  "5xl": "3rem", // 48px
  "6xl": "3.75rem", // 60px
};

// Responsive typography helper
export const getResponsiveTypography = (
  baseSize: keyof typeof fontSize,
  responsiveSizes?: Partial<
    Record<"xs" | "sm" | "md" | "lg" | "xl", keyof typeof fontSize>
  >,
) => ({
  fontSize: fontSize[baseSize],
  ...(responsiveSizes?.xs
    ? { "@media (min-width:0px)": { fontSize: fontSize[responsiveSizes.xs] } }
    : {}),
  ...(responsiveSizes?.sm
    ? { "@media (min-width:600px)": { fontSize: fontSize[responsiveSizes.sm] } }
    : {}),
  ...(responsiveSizes?.md
    ? { "@media (min-width:900px)": { fontSize: fontSize[responsiveSizes.md] } }
    : {}),
  ...(responsiveSizes?.lg
    ? {
        "@media (min-width:1200px)": { fontSize: fontSize[responsiveSizes.lg] },
      }
    : {}),
  ...(responsiveSizes?.xl
    ? {
        "@media (min-width:1536px)": { fontSize: fontSize[responsiveSizes.xl] },
      }
    : {}),
});

export const typography: TypographyVariantsOptions = {
  fontFamily: '"DM Sans", "Helvetica Neue", Arial, sans-serif',

  // Heading sizes with responsive variants
  h1: {
    fontFamily: '"Rajdhani", sans-serif',
    fontWeight: 900,
    letterSpacing: "0.04em",
    fontSize: fontSize["5xl"],
    lineHeight: 1.2,
    [`@media (max-width:900px)`]: { fontSize: fontSize["4xl"] },
    [`@media (max-width:600px)`]: { fontSize: fontSize["3xl"] },
  },
  h2: {
    fontFamily: '"Rajdhani", sans-serif',
    fontWeight: 800,
    letterSpacing: "0.04em",
    fontSize: fontSize["4xl"],
    lineHeight: 1.25,
    [`@media (max-width:900px)`]: { fontSize: fontSize["3xl"] },
    [`@media (max-width:600px)`]: { fontSize: fontSize["2xl"] },
  },
  h3: {
    fontFamily: '"Rajdhani", sans-serif',
    fontWeight: 700,
    letterSpacing: "0.04em",
    fontSize: fontSize["3xl"],
    lineHeight: 1.3,
    [`@media (max-width:900px)`]: { fontSize: fontSize["2xl"] },
    [`@media (max-width:600px)`]: { fontSize: fontSize.xl },
  },
  h4: {
    fontFamily: '"Rajdhani", sans-serif',
    fontWeight: 700,
    letterSpacing: "0.04em",
    fontSize: fontSize["2xl"],
    lineHeight: 1.35,
    [`@media (max-width:600px)`]: { fontSize: fontSize.lg },
  },
  h5: {
    fontFamily: '"Rajdhani", sans-serif',
    fontWeight: 600,
    fontSize: fontSize.xl,
    lineHeight: 1.4,
    [`@media (max-width:600px)`]: { fontSize: fontSize.md },
  },
  h6: {
    fontFamily: '"Rajdhani", sans-serif',
    fontWeight: 600,
    fontSize: fontSize.lg,
    lineHeight: 1.4,
  },

  // Body text sizes
  body1: {
    fontFamily: '"DM Sans", sans-serif',
    fontSize: fontSize.md,
    lineHeight: 1.5,
  },
  body2: {
    fontFamily: '"DM Sans", sans-serif',
    fontSize: fontSize.sm,
    lineHeight: 1.5,
  },

  // Other variants
  overline: {
    fontFamily: '"Rajdhani", sans-serif',
    fontWeight: 700,
    letterSpacing: "0.1em",
    fontSize: fontSize.xs,
    textTransform: "uppercase",
  },
  button: {
    fontFamily: '"Rajdhani", sans-serif',
    fontWeight: 700,
    letterSpacing: "0.06em",
    fontSize: fontSize.sm,
    textTransform: "uppercase",
  },
  caption: {
    fontFamily: '"DM Sans", sans-serif',
    fontSize: fontSize.xs,
    lineHeight: 1.4,
  },
  subtitle1: {
    fontFamily: '"DM Sans", sans-serif',
    fontSize: fontSize.md,
    fontWeight: 500,
    lineHeight: 1.5,
  },
  subtitle2: {
    fontFamily: '"DM Sans", sans-serif',
    fontSize: fontSize.sm,
    fontWeight: 500,
    lineHeight: 1.5,
  },
};
