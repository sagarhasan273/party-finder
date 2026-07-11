import React, { useState } from "react";
import { X, Loader2, Sparkles } from "lucide-react";

import {
  Box,
  Dialog,
  Button,
  Select,
  MenuItem,
  TextField,
  InputLabel,
  Typography,
  IconButton,
  DialogTitle,
  FormControl,
  DialogContent,
  DialogActions,
} from "@mui/material";

interface ProfileGeneratorProps {
  open: boolean;
  onClose: () => void;
  onGenerate: (data: {
    agent: string;
    playstyle: string;
    prompt: string;
  }) => Promise<void>;
  isLoading: boolean;
}

export const ProfileGenerator: React.FC<ProfileGeneratorProps> = ({
  open,
  onClose,
  onGenerate,
  isLoading,
}) => {
  const [agent, setAgent] = useState("Jett");
  const [playstyle, setPlaystyle] = useState("Aggressive Entry / IGL");
  const [prompt, setPrompt] = useState(
    "aggressive futuristic warrior agent with neon cyan visor mask",
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onGenerate({ agent, playstyle, prompt });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: "#0b1016",
          border: "1px solid rgba(0,243,197,0.4)",
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: "#111e30",
          borderBottom: "1px solid rgba(0,243,197,0.2)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Sparkles size={16} color="#00f3c5" />
            <Typography
              variant="h6"
              sx={{ fontWeight: 900, letterSpacing: "0.05em" }}
            >
              AI Profile Generator
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ color: "#6e7b8c" }}>
            <X size={16} />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ py: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <FormControl fullWidth>
              <InputLabel sx={{ fontSize: "0.7rem" }}>
                Preferred Agent
              </InputLabel>
              <Select
                value={agent}
                onChange={(e) => setAgent(e.target.value)}
                label="Preferred Agent"
                sx={{ bgcolor: "#121922" }}
              >
                <MenuItem value="Jett">Jett (Duelist)</MenuItem>
                <MenuItem value="Sage">Sage (Sentinel)</MenuItem>
                <MenuItem value="Omen">Omen (Controller)</MenuItem>
                <MenuItem value="Sova">Sova (Initiator)</MenuItem>
                <MenuItem value="Reyna">Reyna (Duelist)</MenuItem>
                <MenuItem value="Cypher">Cypher (Sentinel)</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Signature Playstyle"
              value={playstyle}
              onChange={(e) => setPlaystyle(e.target.value)}
              placeholder="e.g. Aggressive Entry fragger, Lurk master"
              fullWidth
              sx={{ bgcolor: "#121922" }}
              InputLabelProps={{ sx: { fontSize: "0.7rem" } }}
            />

            <TextField
              label="Imagen Avatar Art Prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. neon cyberpunk gaming avatar of an aggressive agent with dark mask"
              multiline
              rows={3}
              fullWidth
              sx={{ bgcolor: "#121922" }}
              InputLabelProps={{ sx: { fontSize: "0.7rem" } }}
              helperText="Compiles stylized vector profiles directly with Google's Imagen engine"
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2, borderTop: "1px solid #1b222d" }}>
          <Button onClick={onClose} sx={{ color: "#8c9ba5" }}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            sx={{
              bgcolor: "#00f3c5",
              color: "black",
              fontWeight: 900,
              "&:hover": { bgcolor: "#00d4ac" },
            }}
          >
            {isLoading ? (
              <>
                <Loader2
                  size={13}
                  className="animate-spin"
                  style={{ marginRight: 8 }}
                />
                Synthesizing...
              </>
            ) : (
              <>
                <Sparkles size={13} style={{ marginRight: 8 }} />
                Generate Card
              </>
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
