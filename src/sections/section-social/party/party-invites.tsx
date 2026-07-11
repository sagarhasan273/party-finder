import React from "react";
import { Bell } from "lucide-react";

import { Box, Chip, Paper, Button, Typography } from "@mui/material";

import type { Invite } from "../../../types/type-social";

interface PartyInvitesProps {
  invites: Invite[];
  onAccept: (invite: Invite) => void;
  onDecline: (inviteId: string) => void;
  onClearAll: () => void;
}

export const PartyInvites: React.FC<PartyInvitesProps> = ({
  invites,
  onAccept,
  onDecline,
  onClearAll,
}) => (
  <Paper
    sx={{
      bgcolor: "#0b1016",
      border: "1px solid #1b222d",
      borderRadius: 1,
      p: 2,
      display: "flex",
      flexDirection: "column",
      gap: 2,
    }}
  >
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #1b222d",
        pb: 1,
      }}
    >
      <Typography
        variant="caption"
        sx={{
          fontWeight: "bold",
          textTransform: "uppercase",
          color: "#ffb000",
          display: "flex",
          alignItems: "center",
          gap: 0.5,
        }}
      >
        <Bell size={12} />
        Lobby Invitations ({invites.length})
      </Typography>
      {invites.length > 0 && (
        <Button
          onClick={onClearAll}
          sx={{
            fontSize: "0.5625rem",
            color: "#6e7b8c",
            "&:hover": { color: "white" },
            textTransform: "uppercase",
            fontWeight: "bold",
            letterSpacing: "0.05em",
          }}
        >
          Clear All
        </Button>
      )}
    </Box>

    {invites.length === 0 ? (
      <Typography
        variant="body2"
        sx={{
          fontSize: "0.6875rem",
          color: "#556375",
          textAlign: "center",
          py: 1,
          fontStyle: "italic",
        }}
      >
        No incoming party invitations pending
      </Typography>
    ) : (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {invites.map((invite) => (
          <Paper
            key={invite.id}
            sx={{
              bgcolor: "#121922",
              border: "1px solid rgba(255,176,0,0.25)",
              p: 1.5,
              borderRadius: 0.5,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Typography variant="h6" sx={{ fontSize: "1rem" }}>
                  {invite.sender.rankIcon}
                </Typography>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: "bold", color: "white" }}
                >
                  {invite.sender.username}
                </Typography>
                <Chip
                  label={invite.sender.mainAgent}
                  size="small"
                  sx={{
                    fontSize: "0.5625rem",
                    bgcolor: "#1e2736",
                    color: "#8c9ba5",
                    height: 18,
                  }}
                />
              </Box>
              <Typography
                variant="caption"
                sx={{ color: "#556375", fontSize: "0.5625rem" }}
              >
                {invite.time}
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{
                fontSize: "0.6875rem",
                color: "#8c9ba5",
                mt: 0.5,
                fontStyle: "italic",
              }}
            >
              &ldquo;{invite.message}&rdquo;
            </Typography>
            <Box sx={{ display: "flex", gap: 0.5, mt: 1.5 }}>
              <Button
                fullWidth
                size="small"
                onClick={() => onAccept(invite)}
                sx={{
                  bgcolor: "#00f3c5",
                  color: "black",
                  fontWeight: 900,
                  textTransform: "uppercase",
                  fontSize: "0.625rem",
                  letterSpacing: "0.05em",
                  "&:hover": { bgcolor: "#00d4ac" },
                }}
              >
                Accept
              </Button>
              <Button
                fullWidth
                size="small"
                onClick={() => onDecline(invite.id)}
                sx={{
                  bgcolor: "transparent",
                  color: "#8c9ba5",
                  border: "1px solid #1e2736",
                  textTransform: "uppercase",
                  fontSize: "0.625rem",
                  letterSpacing: "0.05em",
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.05)",
                    color: "white",
                  },
                }}
              >
                Decline
              </Button>
            </Box>
          </Paper>
        ))}
      </Box>
    )}
  </Paper>
);
