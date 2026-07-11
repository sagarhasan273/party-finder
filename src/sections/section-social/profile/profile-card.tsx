import React from "react";
import { Wand2, Award } from "lucide-react";

import {
  Box,
  Chip,
  Grid,
  Paper,
  Avatar,
  Button,
  Typography,
} from "@mui/material";

interface ProfileCardProps {
  profile: {
    username: string;
    tagline: string;
    rank: string;
    rankIcon: string;
    role: string;
    status: string;
    winRate: string;
    headshotRate: string;
    favoriteMap: string;
    clutchWon: string;
    bio: string;
    avatarUrl: string | null;
    partySize: number;
  };
  partyCount: number;
  onEditProfile: () => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  partyCount,
  onEditProfile,
}) => (
  <Paper
    sx={{
      p: { xs: 2, md: 3 },
      border: "1px solid rgba(0,243,197,0.3)",
      position: "relative",
      overflow: "hidden",
    }}
    className="valorant-glow-cyan"
  >
    <Box
      sx={{
        height: 4,
        bgcolor: "linear-gradient(90deg, #ff4655, #00f3c5, #ff4655)",
      }}
    />

    <Grid container spacing={3} alignItems="stretch">
      {/* Avatar */}
      <Grid
        size={{
          xs: 12,
          md: 3,
          lg: 2,
        }}
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Box
          sx={{
            position: "relative",
            cursor: "pointer",
            "&:hover .avatar-overlay": { opacity: 1 },
          }}
          onClick={onEditProfile}
        >
          <Avatar
            src={profile.avatarUrl || undefined}
            sx={{
              width: { xs: 96, md: 128 },
              height: { xs: 96, md: 128 },
              bgcolor: "#121a24",
              border: "2px solid #00f3c5",
              fontSize: "2.5rem",
            }}
          >
            {!profile.avatarUrl && profile.rankIcon}
          </Avatar>
          <Box
            className="avatar-overlay"
            sx={{
              position: "absolute",
              inset: 0,
              bgcolor: "rgba(0,0,0,0.7)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              opacity: 0,
              transition: "opacity 0.3s",
            }}
          >
            <Wand2 size={18} style={{ color: "#00f3c5" }} />
            <Typography
              variant="caption"
              sx={{
                color: "white",
                fontWeight: 900,
                fontSize: "0.5rem",
                mt: 0.5,
              }}
            >
              GENERATE AVATAR
            </Typography>
          </Box>
        </Box>
        <Button
          onClick={onEditProfile}
          size="small"
          sx={{
            mt: 1.5,
            fontSize: "0.6rem",
            color: "#00f3c5",
            border: "1px solid rgba(0,243,197,0.3)",
            "&:hover": {
              bgcolor: "#ff4655",
              color: "white",
              borderColor: "transparent",
            },
          }}
        >
          <Wand2 size={10} style={{ marginRight: 4 }} />
          EDIT PROFILE
        </Button>
      </Grid>

      {/* Profile Info */}
      <Grid
        size={{
          xs: 12,
          md: 6,
          lg: 7,
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 900, color: "white" }}>
              {profile.username}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "#6e7b8c", fontFamily: "monospace" }}
            >
              #{profile.tagline}
            </Typography>
            <Chip
              label={profile.status}
              size="small"
              sx={{
                bgcolor: "rgba(0,243,197,0.1)",
                color: "#00f3c5",
                border: "1px solid rgba(0,243,197,0.3)",
                fontSize: "0.5rem",
                fontWeight: 900,
              }}
            />
          </Box>
          <Typography
            variant="body2"
            sx={{ color: "#8c9ba5", fontStyle: "italic", mt: 0.5 }}
          >
            &quot;{profile.bio}&quot;
          </Typography>

          <Grid container spacing={1} sx={{ mt: 1.5 }}>
            <Grid
              size={{
                xs: 6,
                md: 3,
              }}
            >
              <Paper
                sx={{ p: 1.5, bgcolor: "#121922", border: "1px solid #1e2736" }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: "#556375",
                    fontWeight: 700,
                    display: "block",
                    fontSize: "0.5rem",
                  }}
                >
                  WIN RATE
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ color: "#00f3c5", fontWeight: 900 }}
                >
                  {profile.winRate}
                </Typography>
              </Paper>
            </Grid>
            <Grid
              size={{
                xs: 6,
                md: 3,
              }}
            >
              <Paper
                sx={{ p: 1.5, bgcolor: "#121922", border: "1px solid #1e2736" }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: "#556375",
                    fontWeight: 700,
                    display: "block",
                    fontSize: "0.5rem",
                  }}
                >
                  HS RATIO
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ color: "white", fontWeight: 900 }}
                >
                  {profile.headshotRate}
                </Typography>
              </Paper>
            </Grid>
            <Grid
              size={{
                xs: 6,
                md: 3,
              }}
            >
              <Paper
                sx={{ p: 1.5, bgcolor: "#121922", border: "1px solid #1e2736" }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: "#556375",
                    fontWeight: 700,
                    display: "block",
                    fontSize: "0.5rem",
                  }}
                >
                  FAVORITE MAP
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ color: "#ff4655", fontWeight: 900, fontSize: "0.9rem" }}
                >
                  {profile.favoriteMap}
                </Typography>
              </Paper>
            </Grid>
            <Grid
              size={{
                xs: 6,
                md: 3,
              }}
            >
              <Paper
                sx={{ p: 1.5, bgcolor: "#121922", border: "1px solid #1e2736" }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: "#556375",
                    fontWeight: 700,
                    display: "block",
                    fontSize: "0.5rem",
                  }}
                >
                  CLUTCHES WON
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ color: "#60a5fa", fontWeight: 900 }}
                >
                  {profile.clutchWon}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Grid>

      {/* Party Status */}
      <Grid
        size={{
          xs: 12,
          lg: 3,
        }}
      >
        <Paper
          sx={{
            p: 2,
            bgcolor: "#121922",
            border: "1px solid #1e2736",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontWeight: 900,
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <Award size={13} color="#ff4655" />
              Your Party Lobby
            </Typography>
            <Chip
              label={`${partyCount + 1} / 5`}
              size="small"
              sx={{ fontSize: "0.5rem", fontWeight: 700, bgcolor: "#1b2533" }}
            />
          </Box>

          <Box sx={{ mt: 1 }}>
            <Typography
              variant="caption"
              sx={{
                color: "#556375",
                display: "block",
                textAlign: "center",
                fontSize: "0.65rem",
              }}
            >
              {partyCount === 0
                ? "Solo operative state. Find agents below to send invitations."
                : `${partyCount} agent${partyCount > 1 ? "s" : ""} in party`}
            </Typography>
          </Box>

          <Chip
            label="QUEUE: COMPETITIVE HIGH ELO"
            size="small"
            sx={{
              mt: 1,
              bgcolor: "rgba(0,243,197,0.05)",
              color: "#00f3c5",
              fontSize: "0.5rem",
              fontWeight: 900,
              textTransform: "uppercase",
              width: "100%",
            }}
          />
        </Paper>
      </Grid>
    </Grid>
  </Paper>
);
