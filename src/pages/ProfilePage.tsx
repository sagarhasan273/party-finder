// src/pages/ProfilePage.tsx
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
  Avatar,
  Chip,
  Rating,
  LinearProgress,
  Divider,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

const ranks = ['Iron I', 'Iron II', 'Iron III', 'Bronze I', 'Bronze II', 'Bronze III', 'Silver I', 'Silver II', 'Silver III', 'Gold I', 'Gold II', 'Gold III', 'Platinum I', 'Platinum II', 'Platinum III', 'Diamond I', 'Diamond II', 'Diamond III', 'Ascendant I', 'Ascendant II', 'Ascendant III', 'Immortal I', 'Immortal II', 'Immortal III', 'Radiant'];
const roles = ['Duelist', 'Initiator', 'Controller', 'Sentinel'];
const playstyles = ['😌 Chill', '⚖️ Balanced', '🔥 Tryhard'];
const agents = ['Sova', 'Fade', 'KAY/O', 'Breach', 'Jett', 'Reyna', 'Omen', 'Clove', 'Killjoy', 'Sage'];

export const ProfilePage: React.FC = () => {
  const { user, setUser } = useAuth();
  const { showToast } = useToast();
  const [rank, setRank] = useState('Gold II');
  const [rr, setRr] = useState(64);
  const [mainRole, setMainRole] = useState('Initiator');
  const [playstyle, setPlaystyle] = useState('⚖️ Balanced');
  const [selectedAgents, setSelectedAgents] = useState<string[]>(['Sova', 'Breach']);

  const handleAgentToggle = (agent: string) => {
    setSelectedAgents(prev =>
      prev.includes(agent) ? prev.filter(a => a !== agent) : [...prev, agent].slice(0, 3)
    );
  };

  const handleSave = () => {
    setUser({ ...user!, name: 'ProPlayer' });
    showToast('Profile saved successfully', 'success');
  };

  const rankColor = rank.split(' ')[0].toLowerCase();

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: '"Barlow Condensed", sans-serif' }}>
          My Profile
        </Typography>
        <Typography variant="body2" sx={{ color: 'grey.300' }}>
          Edit your Valorant identity and preferences
        </Typography>
      </Box>

      <Paper
        sx={{
          p: 3.5,
          bgcolor: 'background.paper',
          border: 1,
          borderColor: 'grey.600',
          borderRadius: 3,
          mb: 2,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
          <Avatar
            sx={{
              width: 72,
              height: 72,
              bgcolor: 'primary.main',
              fontSize: 24,
              fontWeight: 800,
              border: 3,
              borderColor: 'primary.main',
            }}
          >
            {user?.avatarInitials}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              {user?.name}
              <Typography component="span" sx={{ color: 'grey.400', fontWeight: 400, ml: 1 }}>
                {user?.tag}
              </Typography>
            </Typography>
            <Typography variant="body2" sx={{ color: 'grey.400', mb: 1 }}>
              Gold II · 247 matches
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Chip
                label={rank}
                sx={{
                  bgcolor: `rgba(245, 200, 66, 0.15)`,
                  color: '#f5c842',
                  border: 1,
                  borderColor: 'rgba(245, 200, 66, 0.3)',
                }}
              />
              <Box sx={{ flex: 1, maxWidth: 140 }}>
                <Typography variant="caption" sx={{ color: 'grey.400' }}>{rr} / 100 RR</Typography>
                <LinearProgress
                  variant="determinate"
                  value={rr}
                  sx={{ height: 6, borderRadius: 3, bgcolor: 'grey.700', '& .MuiLinearProgress-bar': { bgcolor: 'linear-gradient(90deg, #ff4655, #f5c842)' } }}
                />
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="caption" sx={{ color: 'grey.400' }}>Karma</Typography>
                <Rating value={4} readOnly size="small" sx={{ color: '#f5c842' }} />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <Chip label="Great Comms" size="small" sx={{ bgcolor: 'rgba(74, 222, 128, 0.1)', color: '#4ade80' }} />
              <Chip label="Good Entry" size="small" sx={{ bgcolor: 'rgba(74, 222, 128, 0.1)', color: '#4ade80' }} />
              <Chip label="Consistent" size="small" sx={{ bgcolor: 'rgba(74, 222, 128, 0.1)', color: '#4ade80' }} />
            </Box>
          </Box>
        </Box>
      </Paper>

      <Paper sx={{ p: 3, bgcolor: 'background.paper', border: 1, borderColor: 'grey.600', borderRadius: 2, mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Valorant Identity</Typography>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 2 }}>
          <TextField label="Riot ID" defaultValue="ProPlayer#NA1" fullWidth />
          <FormControl fullWidth>
            <InputLabel>Region</InputLabel>
            <Select label="Region" defaultValue="NA — North America">
              <MenuItem value="NA — North America">NA — North America</MenuItem>
              <MenuItem value="EU — Europe">EU — Europe</MenuItem>
              <MenuItem value="AP — Asia Pacific">AP — Asia Pacific</MenuItem>
              <MenuItem value="KR — Korea">KR — Korea</MenuItem>
            </Select>
          </FormControl>
        </Stack>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <FormControl fullWidth>
            <InputLabel>Current Rank</InputLabel>
            <Select label="Current Rank" value={rank} onChange={(e) => setRank(e.target.value)}>
              {ranks.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField label="RR Points" value={rr} onChange={(e) => setRr(Number(e.target.value))} type="number" fullWidth />
          <FormControl fullWidth>
            <InputLabel>Peak Rank</InputLabel>
            <Select label="Peak Rank" defaultValue="Platinum I">
              <MenuItem value="Silver III">Silver III</MenuItem>
              <MenuItem value="Platinum I">Platinum I</MenuItem>
              <MenuItem value="Diamond I">Diamond I</MenuItem>
            </Select>
          </FormControl>
          <TextField label="Win Rate (approx)" defaultValue="54%" fullWidth />
        </Stack>
      </Paper>

      <Paper sx={{ p: 3, bgcolor: 'background.paper', border: 1, borderColor: 'grey.600', borderRadius: 2, mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Playstyle & Agents</Typography>
        
        <Typography variant="caption" sx={{ color: 'grey.400', mb: 1, display: 'block' }}>Main Role</Typography>
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          {roles.map(role => (
            <Chip
              key={role}
              label={role}
              onClick={() => setMainRole(role)}
              color={mainRole === role ? 'primary' : 'default'}
              variant={mainRole === role ? 'filled' : 'outlined'}
              sx={{ cursor: 'pointer' }}
            />
          ))}
        </Stack>

        <Typography variant="caption" sx={{ color: 'grey.400', mb: 1, display: 'block' }}>Playstyle</Typography>
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          {playstyles.map(ps => (
            <Chip
              key={ps}
              label={ps}
              onClick={() => setPlaystyle(ps)}
              color={playstyle === ps ? 'primary' : 'default'}
              variant={playstyle === ps ? 'filled' : 'outlined'}
              sx={{ cursor: 'pointer' }}
            />
          ))}
        </Stack>

        <Typography variant="caption" sx={{ color: 'grey.400', mb: 1, display: 'block' }}>Main Agents (select up to 3)</Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ gap: 1 }}>
          {agents.map(agent => (
            <Chip
              key={agent}
              label={agent}
              onClick={() => handleAgentToggle(agent)}
              color={selectedAgents.includes(agent) ? 'primary' : 'default'}
              variant={selectedAgents.includes(agent) ? 'filled' : 'outlined'}
              sx={{ cursor: 'pointer' }}
            />
          ))}
        </Stack>

        <TextField
          label="Bio"
          multiline
          rows={3}
          defaultValue="Gold/Plat player, been playing since beta. Initiator main. Good comms, chill vibes. Active on weekends."
          fullWidth
          sx={{ mt: 2 }}
        />
      </Paper>

      <Paper sx={{ p: 3, bgcolor: 'background.paper', border: 1, borderColor: 'grey.600', borderRadius: 2, mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Social Links</Typography>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField label="Discord Username" defaultValue="proplayer#1234" fullWidth />
          <TextField label="Tracker.gg Profile" defaultValue="tracker.gg/valorant/profile/..." fullWidth />
        </Stack>
      </Paper>

      <Stack direction="row" spacing={2}>
        <Button variant="contained" onClick={handleSave} startIcon={<span>💾</span>}>
          Save Profile
        </Button>
        <Button variant="outlined" onClick={() => showToast('Synced with Riot API', 'info')}>
          Sync with Riot
        </Button>
      </Stack>
    </Box>
  );
};