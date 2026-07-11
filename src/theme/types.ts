import type {
  ThemeOptions,
  CssVarsTheme,
  Theme as BaseTheme,
  CssVarsThemeOptions,
} from "@mui/material/styles";

// ----------------------------------------------------------------------

export type Theme = Omit<BaseTheme, "palette" | "applyStyles"> & CssVarsTheme;

// Mirrors createTheme()'s actual parameter shape:
// Omit<ThemeOptions, 'components'> & Pick<CssVarsThemeOptions, 'defaultColorScheme' | 'colorSchemes' | 'components'>
// & { cssVariables?: boolean | Pick<CssVarsThemeOptions, ...> }
// Built explicitly (rather than via `Parameters<typeof createTheme>[0]`) because that
// parameter is optional, so its inferred type includes `undefined`, and `Omit<...>`
// over a type that includes `undefined` silently drops properties like `components`.
export type ThemeUpdateOptions = Omit<ThemeOptions, "components"> &
  Pick<
    CssVarsThemeOptions,
    "defaultColorScheme" | "colorSchemes" | "components"
  > & {
    cssVariables?:
      | boolean
      | Pick<
          CssVarsThemeOptions,
          | "colorSchemeSelector"
          | "disableCssColorScheme"
          | "cssVarPrefix"
          | "shouldSkipGeneratingVar"
        >;
  };

export type ThemeComponents = NonNullable<ThemeUpdateOptions["components"]>;

export type ThemeColorScheme = "light" | "dark";

export type ThemeDirection = "ltr" | "rtl";

export type ThemeLocaleComponents = { components: ThemeComponents };
