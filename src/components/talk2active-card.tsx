/**
 * talk2active-card.tsx: "Also from the maker" card that sends players to
 * Talk2Active (https://www.talk2active.com) and its Facebook group.
 *
 *   variant="full"   big card with a small website preview
 *   variant="strip"  one-line banner, for tight spots
 *
 * Players can hide it; that choice is remembered in this browser.
 */
import React, { useState } from "react";

import { alpha } from "@mui/material/styles";
import { Box, Button, IconButton, Typography } from "@mui/material";
import {
  Lock,
  Close,
  Language,
  Facebook,
  OpenInNew,
} from "@mui/icons-material";

import { fonts, tokens } from "../theme/theme";

export const TALK2ACTIVE_URL = "https://www.talk2active.com/";
export const FACEBOOK_GROUP_URL =
  "https://www.facebook.com/groups/1755831716185309";

const T2A = "#6C8CFF";
const FB_BLUE = "#1877F2";

const link = {
  component: "a",
  target: "_blank",
  rel: "noopener noreferrer",
} as const;

/** Decorative website preview: a browser bar with the address and wordmark. */
const SitePreview = () => (
  <Box
    aria-hidden
    sx={{
      display: { xs: "none", sm: "block" },
      width: { xs: "100%", md: 300 },
      maxWidth: 340,
      flexShrink: 0,
      alignSelf: "center",
      borderRadius: "6px",
      overflow: "hidden",
      bgcolor: tokens.inset,
      border: `1px solid ${alpha(T2A, 0.3)}`,
      boxShadow: `0 18px 40px rgba(0,0,0,0.4), 0 0 0 1px ${alpha(T2A, 0.06)}`,
      transform: { md: "rotate(1.5deg)" },
    }}
  >
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        px: 1.25,
        py: 0.9,
        borderBottom: `1px solid ${tokens.line}`,
        bgcolor: tokens.surfaceRaised,
      }}
    >
      <Box sx={{ display: "flex", gap: 0.5 }}>
        {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
          <Box
            key={c}
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor: alpha(c, 0.8),
            }}
          />
        ))}
      </Box>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          gap: 0.6,
          px: 1,
          py: 0.35,
          borderRadius: 99,
          bgcolor: tokens.inset,
          fontSize: "0.7rem",
          color: tokens.muted,
        }}
      >
        <Lock sx={{ fontSize: 11 }} />
        talk2active.com
      </Box>
    </Box>
    <Box
      sx={{
        position: "relative",
        px: 2,
        py: 3.5,
        textAlign: "center",
        backgroundImage: `radial-gradient(circle at 50% 0%, ${alpha(T2A, 0.22)}, transparent 70%)`,
      }}
    >
      <Typography
        sx={{
          fontFamily: fonts.display,
          fontWeight: 800,
          fontSize: "1.9rem",
          textTransform: "uppercase",
          lineHeight: 1,
          letterSpacing: "0.02em",
        }}
      >
        Talk
        <Box component="span" sx={{ color: T2A }}>
          2
        </Box>
        Active
      </Typography>
      <Box
        sx={{
          mx: "auto",
          mt: 1.5,
          width: "70%",
          height: 6,
          borderRadius: 1,
          bgcolor: alpha(tokens.text, 0.1),
        }}
      />
      <Box
        sx={{
          mx: "auto",
          mt: 0.75,
          width: "50%",
          height: 6,
          borderRadius: 1,
          bgcolor: alpha(tokens.text, 0.07),
        }}
      />
      <Box
        sx={{
          mx: "auto",
          mt: 2,
          width: 96,
          height: 26,
          borderRadius: "4px",
          bgcolor: T2A,
          boxShadow: `0 6px 16px ${alpha(T2A, 0.4)}`,
        }}
      />
    </Box>
  </Box>
);

export const Talk2ActiveCard: React.FC<{ variant?: "full" | "strip" }> = ({
  variant = "full",
}) => {
  const [hidden, setHidden] = useState(false);
  if (hidden) return null;

  const hide = () => {
    setHidden(true);
  };

  const closeBtn = (
    <IconButton
      size="small"
      onClick={hide}
      aria-label="Hide Talk2Active card"
      sx={{
        width: 30,
        height: 30,
        color: tokens.muted,
        "&:hover": { color: tokens.text, bgcolor: "rgba(255,255,255,0.06)" },
      }}
    >
      <Close sx={{ fontSize: 17 }} />
    </IconButton>
  );

  if (variant === "strip") {
    return (
      <Box
        component="aside"
        aria-label="Talk2Active"
        sx={{
          mt: 2.5,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          px: { xs: 1.5, sm: 2 },
          py: 1.25,
          borderRadius: "4px",
          bgcolor: tokens.surface,
          border: `1px solid ${alpha(T2A, 0.35)}`,
        }}
      >
        <Box
          sx={{
            width: 32,
            height: 32,
            flexShrink: 0,
            borderRadius: "4px",
            display: "grid",
            placeItems: "center",
            color: T2A,
            bgcolor: alpha(T2A, 0.15),
          }}
        >
          <Language sx={{ fontSize: 18 }} />
        </Box>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            sx={{ fontWeight: 700, fontSize: "0.85rem", lineHeight: 1.3 }}
          >
            Also by us: Talk2Active
          </Typography>
          <Typography
            sx={{
              fontSize: "0.74rem",
              color: tokens.muted,
              display: { xs: "none", sm: "block" },
            }}
          >
            Our other project. Connect with us there too.
          </Typography>
        </Box>
        <Button
          {...link}
          href={TALK2ACTIVE_URL}
          size="small"
          variant="outlined"
          endIcon={<OpenInNew sx={{ fontSize: 14 }} />}
          sx={{
            flexShrink: 0,
            color: T2A,
            borderColor: alpha(T2A, 0.5),
            "&:hover": { borderColor: T2A, bgcolor: alpha(T2A, 0.1) },
          }}
        >
          Visit
        </Button>
        {closeBtn}
      </Box>
    );
  }

  return (
    <Box
      component="aside"
      aria-label="Talk2Active"
      sx={{
        position: "relative",
        overflow: "hidden",
        mt: 2.5,
        p: { xs: 2, sm: 2.5 },
        borderRadius: "4px",
        bgcolor: tokens.surface,
        backgroundImage: `radial-gradient(circle at 100% 0%, ${alpha(T2A, 0.16)}, transparent 55%)`,
        border: `1px solid ${tokens.line}`,
        "&::before": {
          content: '""',
          position: "absolute",
          top: -1,
          left: -1,
          width: 36,
          height: 2,
          bgcolor: T2A,
        },
      }}
    >
      <Box sx={{ position: "absolute", top: 8, right: 8, zIndex: 1 }}>
        {closeBtn}
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { md: "center" },
          justifyContent: "space-between",
          gap: { xs: 2.5, md: 4 },
        }}
      >
        <Box sx={{ minWidth: 0, maxWidth: 560 }}>
          <Typography
            sx={{
              fontFamily: fonts.mono,
              fontSize: "0.7rem",
              color: T2A,
              letterSpacing: "0.08em",
              mb: 0.6,
            }}
          >
            ALSO FROM THE MAKER
          </Typography>
          <Typography
            variant="h6"
            component="h2"
            sx={{ fontSize: { xs: "1.25rem", sm: "1.4rem" }, pr: 4 }}
          >
            Connect with us on{" "}
            <Box component="span" sx={{ color: T2A }}>
              Talk2Active
            </Box>
          </Typography>
          <Typography
            sx={{
              mt: 1,
              color: tokens.muted,
              fontSize: "0.88rem",
              lineHeight: 1.6,
            }}
          >
            Talk2Active is our other project, built by the same team behind this
            app. Visit the site and connect with us there too, and follow along
            on Facebook for news and updates.
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 1.25,
              mt: 2.25,
            }}
          >
            <Button
              {...link}
              href={TALK2ACTIVE_URL}
              variant="contained"
              endIcon={<OpenInNew sx={{ fontSize: 16 }} />}
              sx={{
                clipPath: "none",
                bgcolor: T2A,
                color: "#fff",
                "&:hover": {
                  bgcolor: alpha(T2A, 0.85),
                  boxShadow: `0 6px 18px ${alpha(T2A, 0.35)}`,
                },
              }}
            >
              Visit talk2active.com
            </Button>
            <Button
              {...link}
              href={FACEBOOK_GROUP_URL}
              variant="outlined"
              startIcon={<Facebook />}
              sx={{
                color: "#7DB2FF",
                borderColor: alpha(FB_BLUE, 0.5),
                "&:hover": {
                  borderColor: FB_BLUE,
                  bgcolor: alpha(FB_BLUE, 0.1),
                },
              }}
            >
              Facebook group
            </Button>
          </Box>
          <Typography sx={{ mt: 1, fontSize: "0.72rem", color: tokens.faint }}>
            Both links open in a new tab.
          </Typography>
        </Box>

        <SitePreview />
      </Box>
    </Box>
  );
};

export default Talk2ActiveCard;
