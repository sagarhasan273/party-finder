import { createTheme } from "@mui/material/styles";

import { shape } from "./shape";
import { palette } from "./palette";
import { components } from "./components";
import { breakpoints } from "./breakpoints";
import { typography, getResponsiveTypography } from "./typography";

export const theme = createTheme({
  palette,
  typography,
  breakpoints,
  shape,
  components,
});

// Export responsive typography helper
export { getResponsiveTypography };
