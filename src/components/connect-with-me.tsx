import { Box, Link, Typography } from "@mui/material";

import { tokens } from "../theme/theme";

export default function ConnectWithMe() {
  return (
    <Box sx={{ mt: 3, textAlign: "center" }}>
      <Typography sx={{ color: tokens.muted, fontSize: "0.78rem" }}>
        <Link
          href="https://discord.com"
          target="_blank"
          rel="noopener noreferrer"
          sx={{ color: tokens.accent }}
        >
          Join the community
        </Link>
      </Typography>
    </Box>
  );
}
