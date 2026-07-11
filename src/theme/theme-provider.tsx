import type {} from "@mui/lab/themeAugmentation";
import type {} from "@mui/x-data-grid/themeAugmentation";
import type {} from "@mui/x-date-pickers/themeAugmentation";
import type {} from "@mui/material/themeCssVarsAugmentation";

import { Toaster } from "sonner";

import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";

import { createTheme } from "./create-theme";
import { schemeConfig } from "./scheme-config";
import { useSettingsContext } from "../components/settings";

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function ThemeProvider({ children }: Props) {
  const settings = useSettingsContext();

  const theme = createTheme(settings);

  return (
    <MuiThemeProvider
      theme={theme}
      defaultMode={schemeConfig.defaultMode}
      modeStorageKey={schemeConfig.modeStorageKey}
    >
      <CssBaseline />
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            border: "1px solid rgba(255, 255, 255, 0.94)",
            color: "#ffffff",
            background: "rgba(13, 15, 26, 0.95)",
            borderRadius: "4px",
            backdropFilter: "blur(10px)",
            fontFamily: '"Rajdhani", sans-serif',
            fontWeight: 600,
            fontSize: "0.90rem",
            padding: "16px 16px",
          },
        }}
      />
    </MuiThemeProvider>
  );
}
