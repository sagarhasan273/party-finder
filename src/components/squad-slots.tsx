import React from "react";

import { Box } from "@mui/material";
import { keyframes } from "@mui/material/styles";
import { Add, Person } from "@mui/icons-material";

import { tokens } from "../theme/theme";

const beckon = keyframes`
  0%, 100% { opacity: 0.45; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.06); }
`;

interface SquadSlotsProps {
  /** How many of the five seats are taken. */
  filled: number;
  total?: number;
  /** Pulse the empty seats one after another while the queue is running. */
  searching?: boolean;
  size?: number;
}

/**
 * The five seats of a Valorant stack. This is the product in one picture:
 * it shows up on the sign-in page, in the search form and inside the lobby.
 */
export const SquadSlots: React.FC<SquadSlotsProps> = ({
  filled,
  total = 5,
  searching = false,
  size = 40,
}) => (
  <Box
    role="img"
    aria-label={`${filled} of ${total} seats filled`}
    sx={{ display: "flex", gap: 1, alignItems: "center" }}
  >
    {Array.from({ length: total }, (_, i) => {
      const isFilled = i < filled;
      return (
        <Box
          key={i}
          sx={{
            width: size,
            height: size,
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
            bgcolor: isFilled ? tokens.text : "transparent",
            color: isFilled ? tokens.bg : tokens.accent,
            border: isFilled ? "none" : `1.5px dashed ${tokens.accent}`,
            animation:
              !isFilled && searching
                ? `${beckon} 1.6s ease-in-out ${(i - filled) * 0.25}s infinite`
                : "none",
          }}
        >
          {isFilled ? (
            <Person sx={{ fontSize: size * 0.55 }} />
          ) : (
            <Add sx={{ fontSize: size * 0.5 }} />
          )}
        </Box>
      );
    })}
  </Box>
);
