// src/pages/PlayersPage.tsx
import React, { useState } from 'react';
import { Box, Typography, ToggleButtonGroup, ToggleButton, Stack } from '@mui/material';
import { PlayerCard } from '../components/PlayerCard';
import { Player } from '../types';

const mockPlayers: Player[] = [
  { id: '1', name: "TacticalMid", tag: "#NA4", rank: "Gold III", rankNum: 2, region: "NA", role: "Duelist", style: "comp", agents: ["Jett", "Reyna"], matches: 312, winRate: "57%", karma: 4.8, labels: ["Great Entry", "Good Comms", "Clutch"], online: true, avatarInitials: "TM" },
  { id: '2', name: "SmokeScreen", tag: "#EU3", rank: "Platinum I", rankNum: 2, region: "EU", role: "Controller", style: "mid", agents: ["Omen", "Clove"], matches: 228, winRate: "52%", karma: 4.5, labels: ["Good Comms", "Chill Vibes"], online: true, avatarInitials: "SS" },
  { id: '3', name: "FlashPoint", tag: "#NA5", rank: "Gold I", rankNum: 2, region: "NA", role: "Initiator", style: "mid", agents: ["Breach", "Fade"], matches: 189, winRate: "50%", karma: 3.9, labels: ["Good Entry"], online: true, avatarInitials: "FP" },
  { id: '4', name: "AnchorDown", tag: "#KR2", rank: "Diamond II", rankNum: 1, region: "KR", role: "Sentinel", style: "comp", agents: ["Killjoy", "Cypher"], matches: 445, winRate: "61%", karma: 4.7, labels: ["Clutch", "Consistent"], online: true, avatarInitials: "AD" },
  { id: '5', name: "CalmRifle", tag: "#NA6", rank: "Silver II", rankNum: 3, region: "NA", role: "Duelist", style: "chill", agents: ["Jett", "Neon"], matches: 97, winRate: "48%", karma: 4.2, labels: ["Chill Vibes", "Good Comms"], online: true, avatarInitials: "CR" },
  { id: '6', name: "NightFox", tag: "#EU4", rank: "Gold II", rankNum: 2, region: "EU", role: "Initiator", style: "comp", agents: ["Sova", "KAY/O"], matches: 203, winRate: "55%", karma: 4.0, labels: ["Good Info", "Entry"], online: false, avatarInitials: "NF" },
];

const roleFilters = ['All', 'Duelist', 'Controller', 'Initiator', 'Sentinel'];

export const PlayersPage: React.FC = () => {
  const [roleFilter, setRoleFilter] = useState('All');

  const filteredPlayers = roleFilter === 'All' 
    ? mockPlayers 
    : mockPlayers.filter(p => p.role === roleFilter);

  const handleRoleFilter = (event: React.MouseEvent<HTMLElement>, newFilter: string | null) => {
    if (newFilter !== null) setRoleFilter(newFilter);
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontSize: 28, fontWeight: 800, fontFamily: '"Barlow Condensed", sans-serif', letterSpacing: '0.3px' }}>
          Browse Players
        </Typography>
        <Typography sx={{ fontSize: 14, color: '#9aa0b8', mt: 0.5 }}>
          Solo players actively looking for a party right now
        </Typography>
      </Box>

      <ToggleButtonGroup
        value={roleFilter}
        exclusive
        onChange={handleRoleFilter}
        size="small"
        sx={{ 
          mb: 2.5, 
          gap: 0.5,
          '& .MuiToggleButton-root': {
            px: 1.75,
            py: 0.75,
            borderRadius: 2,
            border: '1px solid #2a2b35',
            fontSize: 13,
            fontWeight: 500,
            fontFamily: '"Barlow", sans-serif',
            color: '#9aa0b8',
            '&.Mui-selected': {
              bgcolor: 'rgba(255, 70, 85, 0.1)',
              borderColor: 'rgba(255, 70, 85, 0.4)',
              color: '#ff4655',
            }
          }
        }}
      >
        {roleFilters.map(f => (
          <ToggleButton key={f} value={f}>
            {f}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      <Stack spacing={1.5}>
        {filteredPlayers.map(player => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </Stack>
    </Box>
  );
};