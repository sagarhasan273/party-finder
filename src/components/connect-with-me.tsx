import React, { useState } from "react";

import { Box, Chip, Button, Typography } from "@mui/material";
import {
  Code as CodeIcon,
  Check as CheckIcon,
  Reddit as RedditIcon,
  PersonPin as BioIcon,
  Twitter as TwitterIcon,
  ContentCopy as CopyIcon,
  WhatsApp as WhatsAppIcon,
  Facebook as FacebookIcon,
  LinkedIn as LinkedInIcon,
  Telegram as TelegramIcon,
  Sensors as BroadcastIcon,
  OpenInNew as ExternalIcon,
} from "@mui/icons-material";

import { PERSONAL_LINKS } from "../@mock";

const SYSTEM_FONT =
  'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

interface SharePlatform {
  name: string;
  url: string;
  icon: React.ReactElement;
  accent: string;
}

// const TECH_STACK: string[] = [
//   "React + MUI",
//   "Node.js + Express",
//   "WebRTC P2P",
//   "MongoDB",
//   "Socket.io",
// ];

export default function ConnectAndShare(): JSX.Element {
  const [copied, setCopied] = useState<boolean>(false);

  const currentAppUrl: string =
    typeof window !== "undefined"
      ? window.location.href
      : "https://www.val5th-finder.com";

  const sharePitch: string =
    "Looking for a 5th teammate for ranked Valorant? Check out this instant matchmaking & WebRTC lobby tool built by Sagar Hasan:";

  const SHARE_PLATFORMS: SharePlatform[] = [
    {
      name: "WhatsApp",
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${sharePitch} ${currentAppUrl}`)}`,
      icon: <WhatsAppIcon sx={{ fontSize: 18 }} />,
      accent: "#25D366",
    },
    {
      name: "Facebook",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentAppUrl)}&quote=${encodeURIComponent(sharePitch)}`,
      icon: <FacebookIcon sx={{ fontSize: 18 }} />,
      accent: "#1877F2",
    },
    {
      name: "X",
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(sharePitch)}&url=${encodeURIComponent(currentAppUrl)}&hashtags=Valorant,LFG,WebRTC`,
      icon: <TwitterIcon sx={{ fontSize: 18 }} />,
      accent: "#1DA1F2",
    },
    {
      name: "Telegram",
      url: `https://t.me/share/url?url=${encodeURIComponent(currentAppUrl)}&text=${encodeURIComponent(sharePitch)}`,
      icon: <TelegramIcon sx={{ fontSize: 18 }} />,
      accent: "#229ED9",
    },
    {
      name: "Reddit",
      url: `https://reddit.com/submit?url=${encodeURIComponent(currentAppUrl)}&title=${encodeURIComponent("Valorant 5th Player Finder (WebRTC & Socket.io)")}`,
      icon: <RedditIcon sx={{ fontSize: 18 }} />,
      accent: "#FF4500",
    },
    {
      name: "LinkedIn",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentAppUrl)}`,
      icon: <LinkedInIcon sx={{ fontSize: 18 }} />,
      accent: "#0A66C2",
    },
  ];

  const handleCopy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(currentAppUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* Fallback for disabled permissions */
    }
  };

  return (
    <Box
      sx={{
        mt: 4,
        display: "flex",
        flexDirection: "column",
        gap: 2.5,
        fontFamily: SYSTEM_FONT,
      }}
    >
      <Box
        sx={{
          p: { xs: 2, sm: 2.5 },
          bgcolor: "#17212B",
          borderRadius: "8px",
          border: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
          <BroadcastIcon sx={{ color: "#FF4655", fontSize: 20 }} />
          <Typography
            sx={{
              fontFamily: SYSTEM_FONT,
              fontWeight: 600,
              fontSize: { xs: "0.95rem", sm: "1.05rem" },
              color: "#F0F3F6",
            }}
          >
            Share with friends
          </Typography>
        </Box>

        <Typography
          sx={{
            fontFamily: SYSTEM_FONT,
            color: "#8E9AA8",
            fontSize: "0.75rem",
            mb: 2,
          }}
        >
          Click any platform to post a direct invite link to your feed or chat:
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, 1fr)",
              sm: "repeat(3, 1fr)",
              md: "repeat(6, 1fr)",
            },
            gap: 1,
          }}
        >
          {SHARE_PLATFORMS.map((platform, idx) => (
            <Button
              key={idx}
              component="a"
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              variant="outlined"
              sx={{
                py: 1,
                px: 1.2,
                display: "flex",
                alignItems: "center",
                gap: 0.8,
                bgcolor: "#141D26",
                borderColor: "rgba(255, 255, 255, 0.08)",
                color: "#F0F3F6",
                borderRadius: "6px",
                textTransform: "none",
                fontFamily: SYSTEM_FONT,
                fontSize: "0.75rem",
                fontWeight: 500,
                transition: "all 0.15s ease",
                "&:hover": {
                  borderColor: platform.accent,
                  bgcolor: "rgba(255, 255, 255, 0.04)",
                },
              }}
            >
              <Box sx={{ color: platform.accent, display: "flex" }}>
                {platform.icon}
              </Box>
              <Typography
                sx={{
                  fontFamily: SYSTEM_FONT,
                  fontSize: "0.75rem",
                  fontWeight: 500,
                }}
              >
                {platform.name}
              </Typography>
            </Button>
          ))}
        </Box>

        <Box
          sx={{
            mt: 2,
            p: 1.2,
            bgcolor: "#141D26",
            borderRadius: "6px",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1.5,
          }}
        >
          <Typography
            sx={{
              fontFamily: SYSTEM_FONT,
              color: "#8E9AA8",
              fontSize: "0.75rem",
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            {currentAppUrl}
          </Typography>
          <Button
            size="small"
            variant="contained"
            onClick={handleCopy}
            startIcon={
              copied ? (
                <CheckIcon sx={{ fontSize: 14 }} />
              ) : (
                <CopyIcon sx={{ fontSize: 14 }} />
              )
            }
            sx={{
              flexShrink: 0,
              py: 0.4,
              px: 1.5,
              fontSize: "0.72rem",
              fontFamily: SYSTEM_FONT,
              fontWeight: 600,
              textTransform: "none",
              borderRadius: "4px",
              boxShadow: "none",
              bgcolor: copied ? "#2ED573" : "#FF4655",
              color: copied ? "#0E151D" : "#FFFFFF",
              "&:hover": {
                bgcolor: copied ? "#26AF5F" : "#E03B49",
                boxShadow: "none",
              },
            }}
          >
            {copied ? "Copied" : "Copy Link"}
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          p: { xs: 2, sm: 2.5 },
          bgcolor: "#17212B",
          borderRadius: "8px",
          border: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <BioIcon sx={{ color: "#2ED573", fontSize: 20 }} />
          <Typography
            sx={{
              fontFamily: SYSTEM_FONT,
              fontWeight: 600,
              fontSize: { xs: "0.95rem", sm: "1.05rem" },
              color: "#F0F3F6",
            }}
          >
            About Sagar Hasan
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.3fr 1fr" },
            gap: 2,
          }}
        >
          <Box
            sx={{
              p: 2,
              bgcolor: "#141D26",
              borderRadius: "6px",
              border: "1px solid rgba(255, 255, 255, 0.05)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 1,
                mb: 1.2,
              }}
            >
              <CodeIcon sx={{ color: "#FF4655", fontSize: 18 }} />
              <Typography
                sx={{
                  fontFamily: SYSTEM_FONT,
                  fontWeight: 600,
                  fontSize: "0.92rem",
                  color: "#F0F3F6",
                }}
              >
                Sagar Hasan
              </Typography>
              <Chip
                label="Solo Developer"
                size="small"
                sx={{
                  height: 20,
                  borderRadius: "4px",
                  bgcolor: "rgba(46, 213, 115, 0.12)",
                  color: "#2ED573",
                  border: "1px solid rgba(46, 213, 115, 0.3)",
                  fontFamily: SYSTEM_FONT,
                  fontSize: "0.68rem",
                  fontWeight: 500,
                }}
              />
            </Box>

            <Typography
              sx={{
                fontFamily: SYSTEM_FONT,
                color: "#CBD5E1",
                lineHeight: 1.6,
                mb: 1.8,
                fontSize: "0.82rem",
              }}
            >
              Hello! I&apos;m <strong>Sagar Hasan</strong>. I designed and
              developed this Valorant Player Finder project entirely on my own.
              Tired of having solo-queue throwers or struggling to find the 5th
              player to fill out a full competitive stack, I built this platform
              using real-time WebRTC audio streams, direct P2P data channels,
              and smart matchmaking so players can jump into voice comms, agree
              on the team, and share their party codes instantly.
            </Typography>

            {/* <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8 }}>
              {TECH_STACK.map((tech) => (
                <Chip
                  key={tech}
                  label={tech}
                  size="small"
                  sx={{
                    height: 22,
                    borderRadius: "4px",
                    bgcolor: "rgba(255, 255, 255, 0.05)",
                    color: "#8E9AA8",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    fontFamily: SYSTEM_FONT,
                    fontSize: "0.72rem",
                  }}
                />
              ))}
            </Box> */}
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography
              sx={{
                fontFamily: SYSTEM_FONT,
                color: "#8E9AA8",
                fontSize: "0.75rem",
                fontWeight: 500,
              }}
            >
              Connect with me
            </Typography>

            {PERSONAL_LINKS.map((item, idx) => (
              <Box
                key={idx}
                component="a"
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  px: 1.5,
                  py: 1,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  textDecoration: "none",
                  bgcolor: "#141D26",
                  borderRadius: "6px",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                  transition: "all 0.15s ease",
                  "&:hover": {
                    borderColor: item.accent,
                    bgcolor: "rgba(255, 255, 255, 0.04)",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                  <Box sx={{ color: item.accent, display: "flex" }}>
                    {item.icon}
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        fontFamily: SYSTEM_FONT,
                        fontWeight: 600,
                        color: "#F0F3F6",
                        fontSize: "0.8rem",
                        lineHeight: 1.2,
                      }}
                    >
                      {item.name}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: SYSTEM_FONT,
                        color: "#8E9AA8",
                        fontSize: "0.72rem",
                      }}
                    >
                      {item.handle}
                    </Typography>
                  </Box>
                </Box>
                <ExternalIcon sx={{ fontSize: 15, color: "#8E9AA8" }} />
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
