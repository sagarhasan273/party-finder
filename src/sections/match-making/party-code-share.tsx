import React, { useRef, useState, useEffect } from "react";

import { ContentCopy, CheckCircle } from "@mui/icons-material";
import { Box, Button, TextField, Typography, IconButton } from "@mui/material";

import { tokens } from "../../theme/theme";
import { Panel } from "../../components/panel";

interface Props {
  receivedPartyCode: string;
  onSendPartyCode: (code: string) => void;
  disabled?: boolean;
}

export const PartyCodeShare: React.FC<Props> = ({
  receivedPartyCode,
  onSendPartyCode,
  disabled = false,
}) => {
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const code = input.trim();
    if (!code || disabled) return;
    onSendPartyCode(code);
    setInput("");
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(receivedPartyCode);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked: the code is still visible to copy by hand */
    }
  };

  return (
    <Panel title="Party code" subtitle="Talk first. Share your in-game invite code when you're ready.">
      {receivedPartyCode && (
        <Box
          role="status"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            mb: 2,
            p: 1.5,
            pl: 2,
            borderRadius: "6px",
            bgcolor: "rgba(61, 220, 151, 0.08)",
            border: "1px solid rgba(61, 220, 151, 0.35)",
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: "0.75rem", color: tokens.muted }}>Current code</Typography>
            <Typography
              sx={{
                fontFamily: '"Barlow Condensed", sans-serif',
                fontSize: "1.7rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                wordBreak: "break-all",
                lineHeight: 1.2,
              }}
            >
              {receivedPartyCode}
            </Typography>
          </Box>
          <IconButton onClick={copy} aria-label={copied ? "Copied" : "Copy party code"}>
            {copied ? <CheckCircle sx={{ color: tokens.live }} /> : <ContentCopy />}
          </IconButton>
        </Box>
      )}

      <Box component="form" onSubmit={send} sx={{ display: "flex", gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Paste your party code"
          value={input}
          disabled={disabled}
          onChange={(e) => setInput(e.target.value)}
          inputProps={{ "aria-label": "Party code", maxLength: 40 }}
        />
        <Button type="submit" variant="contained" disabled={disabled || !input.trim()}>
          Share
        </Button>
      </Box>
    </Panel>
  );
};
