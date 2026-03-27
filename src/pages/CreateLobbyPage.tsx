// src/pages/CreateLobbyPage.tsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Stack,
  Alert,
  Chip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useLobby } from '../contexts/LobbyContext';
import { useToast } from '../contexts/ToastContext';

const regions = ['NA — North America', 'EU — Europe', 'AP — Asia Pacific', 'KR — Korea', 'BR — Brazil'];
const ranks = ['Iron I – III', 'Bronze I – III', 'Silver I – III', 'Gold I – III', 'Platinum I – III', 'Diamond I – III', 'Ascendant I – III', 'Immortal I – III', 'Radiant'];
const roles = ['Any Role', 'Duelist', 'Controller / Smokes', 'Initiator / Flash', 'Sentinel'];

export const CreateLobbyPage: React.FC = () => {
  const navigate = useNavigate();
  const { postLobby } = useLobby();
  const { showToast } = useToast();
  const [rank, setRank] = useState('Gold I – III');
  const [playstyle, setPlaystyle] = useState('Chill');
  const [showWarning, setShowWarning] = useState(false);

  const handlePost = () => {
    const isHighRank = rank.includes('Diamond') || rank.includes('Immortal') || rank.includes('Radiant');
    if (isHighRank) {
      setShowWarning(true);
    }
    
    postLobby({
      host: 'YourHost',
      tag: '#NA1',
      rank: rank.split(' ')[0],
      rankNum: 1,
      style: playstyle.toLowerCase() as 'chill' | 'mid' | 'comp',
      region: 'NA',
      role: 'Any Role',
      desc: 'Looking for fifth!',
      players: ['Host'],
    });
    
    showToast('Lobby posted! You\'ll get notified when someone requests to join.', 'success');
    setTimeout(() => navigate('/lobbies'), 1500);
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontSize: 28, fontWeight: 800, fontFamily: '"Barlow Condensed", sans-serif', letterSpacing: '0.3px' }}>
          Create a Lobby
        </Typography>
        <Typography sx={{ fontSize: 14, color: '#9aa0b8', mt: 0.5 }}>
          Post your 4-stack — find your fifth in under 3 minutes
        </Typography>
      </Box>

      <Paper
        sx={{
          p: 3.5,
          bgcolor: '#141519',
          border: '1px solid #2a2b35',
          borderRadius: 3,
          maxWidth: 560,
        }}
      >
        <Stack spacing={2}>
          <TextField
            label="Your Riot ID"
            defaultValue="ProPlayer#NA1"
            fullWidth
            placeholder="Name#Tag"
          />
          <FormControl fullWidth>
            <InputLabel sx={{ fontFamily: '"Barlow Condensed", sans-serif', fontSize: 12, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              Region
            </InputLabel>
            <Select label="Region" defaultValue="NA — North America">
              {regions.map(r => (
                <MenuItem key={r} value={r}>{r}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel sx={{ fontFamily: '"Barlow Condensed", sans-serif', fontSize: 12, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              Rank Range (4 players)
            </InputLabel>
            <Select label="Rank Range (4 players)" value={rank} onChange={(e) => setRank(e.target.value)}>
              {ranks.map(r => (
                <MenuItem key={r} value={r}>{r}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel sx={{ fontFamily: '"Barlow Condensed", sans-serif', fontSize: 12, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              Needed Role
            </InputLabel>
            <Select label="Needed Role" defaultValue="Any Role">
              {roles.map(r => (
                <MenuItem key={r} value={r}>{r}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Box>
            <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#9aa0b8', letterSpacing: '0.5px', textTransform: 'uppercase', fontFamily: '"Barlow Condensed", sans-serif', mb: 1 }}>
              Playstyle
            </Typography>
            <Stack direction="row" spacing={1}>
              {['Chill', 'Balanced', 'Tryhard'].map(ps => (
                <Chip
                  key={ps}
                  label={ps}
                  onClick={() => setPlaystyle(ps)}
                  sx={{
                    cursor: 'pointer',
                    fontFamily: '"Barlow Condensed", sans-serif',
                    fontWeight: 600,
                    fontSize: 13,
                    letterSpacing: '0.3px',
                    bgcolor: playstyle === ps ? 'rgba(255, 70, 85, 0.1)' : '#1c1d22',
                    color: playstyle === ps ? '#ff4655' : '#9aa0b8',
                    border: playstyle === ps ? '1px solid rgba(255, 70, 85, 0.4)' : '1px solid #2a2b35',
                    '&:hover': {
                      bgcolor: playstyle === ps ? 'rgba(255, 70, 85, 0.15)' : '#252630',
                    }
                  }}
                />
              ))}
            </Stack>
          </Box>
          
          <TextField
            label="Description (optional)"
            multiline
            rows={3}
            placeholder="e.g. Gold 4-stack looking for a last-minute fill. Good comms. Discord optional."
            fullWidth
          />
          
          {showWarning && (
            <Alert 
              severity="warning" 
              sx={{ 
                bgcolor: 'rgba(245, 200, 66, 0.06)', 
                color: '#f5c842',
                border: '1px solid rgba(245, 200, 66, 0.25)',
                '& .MuiAlert-icon': { color: '#f5c842' }
              }}
            >
              Rank disparity may apply. Your 5th might receive reduced RR gains/losses depending on the rank gap.
            </Alert>
          )}
          
          <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
            <Button 
              variant="contained" 
              onClick={handlePost}
              startIcon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 2L11 13" />
                  <path d="M22 2L15 22l-4-9-9-4 20-7z" />
                </svg>
              }
            >
              Post Lobby
            </Button>
            <Button variant="outlined" onClick={() => navigate('/lobbies')}>
              Cancel
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
};