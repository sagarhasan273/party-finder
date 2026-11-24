/**
 * connect-with-me.tsx: "Share with friends" + "About the maker".
 * Styled with the shared Panel / tokens so it matches the rest of the app.
 */
import React, { useRef, useState, useEffect } from "react";

import { alpha } from "@mui/material/styles";
import { Box, Button, Typography } from "@mui/material";
import {
  Check as CheckIcon,
  Share as ShareIcon,
  Reddit as RedditIcon,
  Twitter as TwitterIcon,
  ContentCopy as CopyIcon,
  WhatsApp as WhatsAppIcon,
  Facebook as FacebookIcon,
  LinkedIn as LinkedInIcon,
  Telegram as TelegramIcon,
  OpenInNew as ExternalIcon,
} from "@mui/icons-material";

import { fonts, tokens } from "../theme/theme";
import { Pill, Panel } from "../sections/lobby-ui";
import { PERSONAL_LINKS } from "../_@mock/constant";

interface SharePlatform {
  name: string;
  url: string;
  icon: React.ReactElement;
  accent: string;
  /** Discord has no share URL: copy the invite first, then open Discord. */
  copyFirst?: boolean;
}

const DiscordIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="17"
    height="17"
    fill="currentColor"
    viewBox="0 0 16 16"
    aria-hidden
  >
    <path d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612" />
  </svg>
);

/**
 * Your live site. Shares always use this address, so links sent from
 * localhost or a preview build still point people to the real page.
 * Set it to your real domain (it must match og:url in index.html).
 */
export const SITE_URL = "https://www.val5th-finder.com/";

const SHARE_TITLE = "Valorant 5th Finder: your stack is one short";

/** The text that goes with the link when people post or send it. */
const SHARE_PITCH =
  "Need a 5th for ranked Valorant? 🎯 Get matched by rank and server, talk on voice first, then share your party code.";

const appUrl = (): string => SITE_URL;

const buildPlatforms = (url: string): SharePlatform[] => {
  const u = encodeURIComponent(url);
  const pitch = encodeURIComponent(SHARE_PITCH);
  return [
    {
      name: "WhatsApp",
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${SHARE_PITCH}\n\n👉 ${url}`)}`,
      icon: <WhatsAppIcon sx={{ fontSize: 18 }} />,
      accent: "#25D366",
    },
    {
      name: "Discord",
      url: "https://discord.com/channels/@me",
      icon: <DiscordIcon />,
      accent: "#5865F2",
      copyFirst: true,
    },
    // Facebook and LinkedIn ignore custom text: the card comes from the og: tags.
    {
      name: "Facebook",
      url: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
      icon: <FacebookIcon sx={{ fontSize: 18 }} />,
      accent: "#1877F2",
    },
    {
      name: "X",
      url: `https://twitter.com/intent/tweet?text=${pitch}&url=${u}&hashtags=Valorant,LFG`,
      icon: <TwitterIcon sx={{ fontSize: 18 }} />,
      accent: "#E7E9EA",
    },
    {
      name: "Telegram",
      url: `https://t.me/share/url?url=${u}&text=${pitch}`,
      icon: <TelegramIcon sx={{ fontSize: 18 }} />,
      accent: "#229ED9",
    },
    {
      name: "Reddit",
      url: `https://reddit.com/submit?url=${u}&title=${encodeURIComponent(SHARE_TITLE)}`,
      icon: <RedditIcon sx={{ fontSize: 18 }} />,
      accent: "#FF4500",
    },
    {
      name: "LinkedIn",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
      icon: <LinkedInIcon sx={{ fontSize: 18 }} />,
      accent: "#0A66C2",
    },
  ];
};

const tileSx = (accent: string) => ({
  minHeight: 44,
  justifyContent: "flex-start",
  gap: 1,
  px: 1.4,
  bgcolor: tokens.inset,
  border: `1px solid ${tokens.line}`,
  color: tokens.text,
  fontFamily: fonts.body,
  fontSize: "0.8rem",
  fontWeight: 600,
  letterSpacing: 0,
  textTransform: "none" as const,
  "&:hover": { borderColor: accent, bgcolor: alpha(accent, 0.08) },
});

export default function ConnectWithMe(): React.JSX.Element {
  const url = appUrl();
  const platforms = buildPlatforms(url);
  const [copied, setCopied] = useState<"link" | "discord" | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const canNativeShare =
    typeof navigator !== "undefined" && typeof navigator.share === "function";

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async (
    text: string,
    what: "link" | "discord",
  ): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(what);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(null), 2500);
      return true;
    } catch {
      return false; // clipboard blocked: the link is still visible to copy by hand
    }
  };

  const nativeShare = async () => {
    try {
      await navigator.share({ title: SHARE_TITLE, text: SHARE_PITCH, url });
    } catch {
      /* user closed the share sheet */
    }
  };

  return (
    <Box sx={{ mt: 2.5, display: "grid", gap: 2.5 }}>
      {/* ── Share ───────────────────────────────────────────────────────── */}
      <Panel
        eyebrow="SPREAD THE WORD"
        title="Share with friends"
        subtitle="Know someone who's always one short? Send them the link."
      >
        {canNativeShare && (
          <Button
            fullWidth
            variant="contained"
            startIcon={<ShareIcon />}
            onClick={nativeShare}
            sx={{ mb: 1.5, display: { md: "none" } }}
          >
            Share
          </Button>
        )}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, 1fr)",
              sm: "repeat(auto-fill, minmax(124px, 1fr))",
            },
            gap: 1,
          }}
        >
          {platforms.map((p) =>
            p.copyFirst ? (
              <Button
                key={p.name}
                onClick={async () => {
                  await copy(`${SHARE_PITCH}\n${url}`, "discord");
                  window.open(p.url, "_blank", "noopener,noreferrer");
                }}
                startIcon={
                  <Box
                    component="span"
                    sx={{ color: p.accent, display: "flex" }}
                  >
                    {p.icon}
                  </Box>
                }
                sx={tileSx(p.accent)}
              >
                {p.name}
              </Button>
            ) : (
              <Button
                key={p.name}
                component="a"
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                startIcon={
                  <Box
                    component="span"
                    sx={{ color: p.accent, display: "flex" }}
                  >
                    {p.icon}
                  </Box>
                }
                sx={tileSx(p.accent)}
              >
                {p.name}
              </Button>
            ),
          )}
        </Box>

        {copied === "discord" && (
          <Typography
            role="status"
            sx={{ mt: 1, fontSize: "0.78rem", color: tokens.live }}
          >
            Invite copied. Paste it into any Discord chat.
          </Typography>
        )}

        <Box
          sx={{
            mt: 2,
            p: 0.75,
            pl: 1.5,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            borderRadius: "4px",
            bgcolor: tokens.inset,
            border: `1px dashed ${tokens.lineStrong}`,
          }}
        >
          <Typography
            sx={{
              flex: 1,
              minWidth: 0,
              fontFamily: fonts.mono,
              fontSize: "0.78rem",
              color: tokens.muted,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {url}
          </Typography>
          <Button
            size="small"
            variant="contained"
            onClick={() => copy(url, "link")}
            startIcon={copied === "link" ? <CheckIcon /> : <CopyIcon />}
            aria-label={copied === "link" ? "Link copied" : "Copy link"}
            sx={{
              flexShrink: 0,
              ...(copied === "link" && {
                bgcolor: tokens.live,
                color: tokens.bg,
                "&:hover": { bgcolor: tokens.live },
              }),
            }}
          >
            {copied === "link" ? "Copied" : "Copy link"}
          </Button>
        </Box>
      </Panel>

      {/* ── About ───────────────────────────────────────────────────────── */}
      <Panel eyebrow="THE MAKER" title="About Sagar Hasan">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.35fr 1fr" },
            gap: { xs: 2, md: 2.5 },
          }}
        >
          <Box
            sx={{
              p: 2,
              borderRadius: "4px",
              bgcolor: tokens.inset,
              border: `1px solid ${tokens.line}`,
            }}
          >
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}
            >
              <Box
                aria-hidden
                sx={{
                  width: 40,
                  height: 40,
                  flexShrink: 0,
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <Box
                  sx={{
                    width: 30,
                    height: 30,
                    transform: "rotate(45deg)",
                    borderRadius: "3px",
                    bgcolor: tokens.accentSoft,
                    border: `1px solid ${alpha(tokens.accent, 0.5)}`,
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      transform: "rotate(-45deg)",
                      fontFamily: fonts.display,
                      fontWeight: 800,
                      color: tokens.accent,
                    }}
                  >
                    SH
                  </Box>
                </Box>
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontWeight: 700, fontSize: "0.95rem" }}>
                  Sagar Hasan
                </Typography>
                <Box sx={{ mt: 0.4 }}>
                  <Pill color={tokens.live}>Solo developer</Pill>
                </Box>
              </Box>
            </Box>
            <Typography
              sx={{
                color: tokens.muted,
                fontSize: "0.86rem",
                lineHeight: 1.65,
              }}
            >
              Hi, I&apos;m{" "}
              <Box component="strong" sx={{ color: tokens.text }}>
                Sagar
              </Box>
              . I designed and built Valorant 5th Finder on my own. I was tired
              of solo-queue throwers and of hunting for a fifth to fill a ranked
              stack, so I made a place where you get matched by rank and server,
              talk on live voice first, agree on the team, and only then share
              your party code.
            </Typography>
          </Box>

          <Box sx={{ display: "grid", gap: 1, alignContent: "start" }}>
            <Typography variant="subtitle2" component="h3" sx={{ mb: 0.25 }}>
              Connect with me
            </Typography>
            {PERSONAL_LINKS.map((item) => (
              <Box
                key={item.url}
                component="a"
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  position: "relative",
                  minHeight: 48,
                  px: 1.5,
                  pl: 1.75,
                  py: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 1.25,
                  overflow: "hidden",
                  textDecoration: "none",
                  color: "inherit",
                  borderRadius: "4px",
                  bgcolor: tokens.inset,
                  border: `1px solid ${tokens.line}`,
                  transition: "border-color 0.15s, background-color 0.15s",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 3,
                    bgcolor: item.accent,
                  },
                  "&:hover": {
                    borderColor: item.accent,
                    bgcolor: alpha(item.accent, 0.06),
                  },
                  "&:focus-visible": {
                    outline: `2px solid ${item.accent}`,
                    outlineOffset: 2,
                  },
                }}
              >
                <Box sx={{ color: item.accent, display: "flex" }}>
                  {item.icon}
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: "0.84rem",
                      lineHeight: 1.25,
                    }}
                  >
                    {item.name}
                  </Typography>
                  <Typography
                    noWrap
                    sx={{ fontSize: "0.74rem", color: tokens.muted }}
                  >
                    {item.handle}
                  </Typography>
                </Box>
                <ExternalIcon sx={{ fontSize: 15, color: tokens.faint }} />
              </Box>
            ))}
          </Box>
        </Box>
      </Panel>
    </Box>
  );
}
