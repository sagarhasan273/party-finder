import React from "react";
import { Crosshair } from "lucide-react";

import { Box, Stack, Typography } from "@mui/material";

import { tokens } from "../theme/theme";
import { GoogleSignIn } from "../auth/google-sign-in";
import { SquadSlots } from "../components/squad-slots";

export function LoginPage(): React.JSX.Element {
  return (
    <Box
      sx={{
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        px: { xs: 2.5, sm: 6 },
        py: { xs: 2.5, sm: 4 },
      }}
    >
      <Stack direction="row" alignItems="center" gap={1.2}>
        <Box
          sx={{
            width: 30,
            height: 30,
            borderRadius: "6px",
            bgcolor: tokens.accent,
            display: "grid",
            placeItems: "center",
          }}
        >
          <Crosshair size={17} color="#fff" aria-hidden />
        </Box>
        <Typography variant="h6" component="span">
          Valorant 5th Finder
        </Typography>
      </Stack>

      <Box
        component="main"
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          py: { xs: 6, sm: 8 },
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 520 }}>
          {/* The hero is the product: four seats taken, one still open. */}
          <SquadSlots filled={4} searching size={52} />

          <Typography
            variant="h1"
            sx={{
              mt: 4,
              fontSize: { xs: "3.4rem", sm: "4.8rem" },
              color: tokens.text,
            }}
          >
            Your stack is one short.
          </Typography>

          <Typography
            sx={{
              mt: 2.5,
              maxWidth: 440,
              fontSize: { xs: "1rem", sm: "1.1rem" },
              lineHeight: 1.55,
              color: tokens.muted,
            }}
          >
            Pick your rank range and server. We match you with a player who
            fits, and you talk on voice before you ever share a party code.
          </Typography>

          <Box sx={{ mt: 4, maxWidth: 360 }}>
            <GoogleSignIn />
            <Typography
              sx={{ mt: 1.5, fontSize: "0.78rem", color: tokens.faint }}
            >
              Google is only used to sign you in. Your browser asks for
              microphone access when a match starts.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
