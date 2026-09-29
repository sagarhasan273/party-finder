import React, { useState } from "react";

import { ContentCopy, CheckCircle } from "@mui/icons-material";
import {
  Box,
  Alert,
  Button,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";

const SYSTEM_FONT =
  'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

interface PartyCodeShareProps {
  receivedPartyCode: string;
  onSendPartyCode: (code: string) => void;
}

export const PartyCodeShare: React.FC<PartyCodeShareProps> = ({
  receivedPartyCode,
  onSendPartyCode,
}) => {
  const [partyCodeInput, setPartyCodeInput] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const handleBroadcast = () => {
    if (!partyCodeInput.trim()) return;
    onSendPartyCode(partyCodeInput.trim().toUpperCase());
    setPartyCodeInput("");
  };

  const copyToClipboard = async (text: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      /* clipboard write rejected */
    }
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 2.5 },
        bgcolor: "#17212B",
        borderRadius: "8px",
        border: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      <Typography
        sx={{
          fontFamily: SYSTEM_FONT,
          fontWeight: 600,
          fontSize: { xs: "0.92rem", sm: "1rem" },
          color: "#F0F3F6",
          mb: 0.5,
        }}
      >
        Share Party Code
      </Typography>
      <Typography
        sx={{
          fontFamily: SYSTEM_FONT,
          color: "#8E9AA8",
          fontSize: "0.75rem",
          mb: 1.5,
        }}
      >
        Talk over voice first, then share your in-game invite code.
      </Typography>

      {receivedPartyCode && (
        <Alert
          severity="success"
          icon={<CheckCircle sx={{ color: "#2ED573", fontSize: 16 }} />}
          sx={{
            mb: 1.5,
            py: 0.4,
            px: 1.2,
            fontSize: "0.78rem",
            fontFamily: SYSTEM_FONT,
            borderRadius: "6px",
            bgcolor: "rgba(46, 213, 115, 0.1)",
            border: "1px solid rgba(46, 213, 115, 0.3)",
            color: "#F0F3F6",
            "& .MuiAlert-message": { py: 0.2 },
          }}
          action={
            <IconButton
              size="small"
              onClick={() => copyToClipboard(receivedPartyCode)}
            >
              <ContentCopy
                sx={{ color: isCopied ? "#2ED573" : "#8E9AA8", fontSize: 14 }}
              />
            </IconButton>
          }
        >
          Party Code: <strong>{receivedPartyCode}</strong>
        </Alert>
      )}

      <Box sx={{ display: "flex", gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Paste party code (#TAG)"
          value={partyCodeInput}
          onChange={(e) => setPartyCodeInput(e.target.value)}
          sx={{
            bgcolor: "#141D26",
            "& .MuiOutlinedInput-root": {
              color: "#F0F3F6",
              borderRadius: "6px",
              fontFamily: SYSTEM_FONT,
              fontSize: "0.82rem",
              "& fieldset": { borderColor: "rgba(255, 255, 255, 0.1)" },
            },
          }}
        />
        <Button
          variant="contained"
          onClick={handleBroadcast}
          sx={{
            px: 2,
            py: 0.8,
            fontSize: "0.78rem",
            fontFamily: SYSTEM_FONT,
            textTransform: "none",
            bgcolor: "#2ED573",
            color: "#0E151D",
            fontWeight: 600,
            borderRadius: "6px",
            boxShadow: "none",
            "&:hover": { bgcolor: "#26AF5F", boxShadow: "none" },
          }}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};
