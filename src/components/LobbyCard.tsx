// src/components/LobbyCard.tsx
import React from 'react';
import { Card, Box, Typography, Chip, Button, Avatar, AvatarGroup, alpha } from '@mui/material';
import { AccessTime, Public } from '@mui/icons-material';
import { Lobby } from '../types';
import { motion } from 'framer-motion';
import { useToast } from '../contexts/ToastContext';

const getRankColor = (rank: string): string => {
  const rankLower = rank.toLowerCase();
  if (rankLower.includes('gold')) return '#f5c842';
  if (rankLower.includes('plat')) return '#4fc3f7';
  if (rankLower.includes('diamond')) return '#a78bfa';
  if (rankLower.includes('silver')) return '#94a3b8';
  if (rankLower.includes('iron')) return '#94a3b8';
  if (rankLower.includes('bronze')) return '#cd7f32';
  if (rankLower.includes('radiant')) return '#f5c842';
  return '#94a3b8';
};

const getStyleChip = (style: string) => {
  switch (style) {
    case 'chill':
      return { label: 'Chill', color: '#4ade80', bg: 'rgba(74, 222, 128, 0.1)', border: 'rgba(74, 222, 128, 0.25)' };
    case 'comp':
      return { label: 'Tryhard', color: '#ff4655', bg: 'rgba(255, 70, 85, 0.1)', border: 'rgba(255, 70, 85, 0.25)' };
    default:
      return { label: 'Balanced', color: '#f5c842', bg: 'rgba(245, 200, 66, 0.1)', border: 'rgba(245, 200, 66, 0.25)' };
  }
};

interface LobbyCardProps {
  lobby: Lobby;
  onJoin: (id: number) => void;
}

export const LobbyCard: React.FC<LobbyCardProps> = ({ lobby, onJoin }) => {
  const { showToast } = useToast();
  const rankColor = getRankColor(lobby.rank);
  const styleChip = getStyleChip(lobby.style);

  const handleJoin = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lobby.rank === 'Radiant') {
      showToast('Warning: Significant rank gap may reduce your RR gains', 'warning');
      setTimeout(() => showToast(`Request sent to ${lobby.host}! Check Discord.`, 'success'), 1500);
    } else {
      showToast(`Request sent to ${lobby.host}! They'll see it now.`, 'success');
    }
    onJoin(lobby.id);
  };

  return (
    <motion.div whileHover={{ y: -1 }} transition={{ duration: 0.2 }}>
      <Card
        sx={{
          bgcolor: '#141519',
          border: '1px solid #2a2b35',
          borderRadius: 2,
          p: 2.5,
          position: 'relative',
          overflow: 'hidden',
          cursor: 'pointer',
          transition: '0.2s',
          '&:hover': {
            borderColor: '#ff4655',
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 3,
            background: rankColor,
            borderRadius: '3px 0 0 3px',
          },
        }}
        onClick={() => handleJoin(new MouseEvent('click') as any)}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.75 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <AvatarGroup max={4} sx={{ 
              '& .MuiAvatar-root': { 
                width: 34, 
                height: 34, 
                fontSize: 12, 
                fontWeight: 700,
                border: '2px solid #0d0e10',
                fontFamily: '"Barlow Condensed", sans-serif'
              } 
            }}>
              {lobby.players.map((player, idx) => (
                <Avatar key={idx} sx={{ bgcolor: ['#ff4655', '#7c3aed', '#059669', '#d97706', '#db2777'][idx % 5] }}>
                  {player.slice(0, 2)}
                </Avatar>
              ))}
              {Array(4 - lobby.players.length).fill(0).map((_, idx) => (
                <Avatar key={`empty-${idx}`} sx={{ bgcolor: '#1c1d22', border: '2px dashed #363742', fontSize: 14 }}>
                  +
                </Avatar>
              ))}
            </AvatarGroup>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, fontFamily: '"Barlow Condensed", sans-serif', fontSize: 15 }}>
                {lobby.host}
                <Typography component="span" sx={{ color: '#5c6070', fontWeight: 400, ml: 0.5, fontFamily: '"Barlow", sans-serif' }}>
                  {lobby.tag}
                </Typography>
              </Typography>
              <Typography variant="caption" sx={{ color: '#5c6070', fontSize: 12 }}>
                {lobby.players.length}/4 players · {lobby.region}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Chip
              label={lobby.rank}
              size="small"
              sx={{
                bgcolor: alpha(rankColor, 0.15),
                color: rankColor,
                border: `1px solid ${alpha(rankColor, 0.3)}`,
                fontFamily: '"Barlow Condensed", sans-serif',
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: '0.3px',
                height: 26,
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5, justifyContent: 'flex-end' }}>
              <AccessTime sx={{ fontSize: 12, color: '#5c6070' }} />
              <Typography variant="caption" sx={{ color: '#5c6070', fontSize: 12 }}>
                {lobby.time}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, bgcolor: '#1c1d22', border: '1px solid #2a2b35', px: 1.25, py: 0.5, borderRadius: 20 }}>
            <Public sx={{ fontSize: 12, color: '#9aa0b8' }} />
            <Typography variant="caption" sx={{ color: '#9aa0b8', fontSize: 12 }}>
              {lobby.region}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, bgcolor: '#1c1d22', border: '1px solid #2a2b35', px: 1.25, py: 0.5, borderRadius: 20 }}>
            <AccessTime sx={{ fontSize: 12, color: '#9aa0b8' }} />
            <Typography variant="caption" sx={{ color: '#9aa0b8', fontSize: 12 }}>
              {lobby.role}
            </Typography>
          </Box>
          {lobby.rank === 'Radiant' && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, bgcolor: 'rgba(255, 70, 85, 0.1)', border: '1px solid rgba(255, 70, 85, 0.3)', px: 1.25, py: 0.5, borderRadius: 20 }}>
              <span style={{ fontSize: 12 }}>⚠</span>
              <Typography variant="caption" sx={{ color: '#ff4655', fontSize: 12 }}>
                Rank Disparity
              </Typography>
            </Box>
          )}
        </Box>

        <Typography variant="body2" sx={{ color: '#9aa0b8', fontSize: 13, lineHeight: 1.5, mb: 1.75 }}>
          {lobby.desc}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Chip
            label={styleChip.label}
            size="small"
            sx={{
              bgcolor: styleChip.bg,
              color: styleChip.color,
              border: `1px solid ${styleChip.border}`,
              fontFamily: '"Barlow Condensed", sans-serif',
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: '0.3px',
            }}
          />
          <Button
            variant="contained"
            size="small"
            onClick={handleJoin}
            sx={{
              fontFamily: '"Barlow Condensed", sans-serif',
              fontWeight: 700,
              fontSize: 14,
              letterSpacing: '0.5px',
              px: 2.25,
              py: 0.875,
            }}
          >
            Request to Join
          </Button>
        </Box>
      </Card>
    </motion.div>
  );
};