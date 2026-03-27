// src/components/PlayerCard.tsx
import React from 'react';
import { Card, Box, Typography, Chip, Avatar, Button, Rating } from '@mui/material';
import { Player } from '../types';
import { useToast } from '../contexts/ToastContext';

const getRankColor = (rank: string) => {
  const tier = rank.split(' ')[0].toLowerCase();
  const colors: Record<string, string> = {
    gold: '#f5c842',
    platinum: '#4fc3f7',
    diamond: '#a78bfa',
    silver: '#94a3b8',
    iron: '#94a3b8',
    bronze: '#cd7f32',
    radiant: '#f5c842',
  };
  return colors[tier] || '#94a3b8';
};

interface PlayerCardProps {
  player: Player;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ player }) => {
  const { showToast } = useToast();
  const rankColor = getRankColor(player.rank);

  const handleInvite = () => {
    showToast(`Invite sent to ${player.name}!`, 'success');
  };

  return (
    <Card
      sx={{
        bgcolor: '#141519',
        border: '1px solid #2a2b35',
        borderRadius: 2,
        p: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        opacity: player.online ? 1 : 0.6,
        '&:hover': {
          borderColor: '#363742',
        },
      }}
    >
      <Avatar
        sx={{
          width: 42,
          height: 42,
          bgcolor: ['#ff4655', '#7c3aed', '#059669', '#d97706', '#db2777'][player.name.length % 5],
          fontWeight: 700,
          fontSize: 14,
          fontFamily: '"Barlow Condensed", sans-serif',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {player.name.slice(0, 2).toUpperCase()}
      </Avatar>
      <Box sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ fontWeight: 700, fontSize: 15, fontFamily: '"Barlow Condensed", sans-serif' }}>
            {player.name}
            <Typography component="span" sx={{ color: '#5c6070', fontWeight: 400, ml: 0.5, fontFamily: '"Barlow", sans-serif', fontSize: 13 }}>
              {player.tag}
            </Typography>
          </Typography>
          {player.online && (
            <Box sx={{ width: 7, height: 7, bgcolor: '#4ade80', borderRadius: '50%' }} />
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
          <Chip
            label={player.rank}
            size="small"
            sx={{
              bgcolor: `rgba(${rankColor === '#f5c842' ? '245, 200, 66' : rankColor === '#4fc3f7' ? '79, 195, 247' : '167, 139, 250'}, 0.15)`,
              color: rankColor,
              border: `1px solid rgba(${rankColor === '#f5c842' ? '245, 200, 66' : rankColor === '#4fc3f7' ? '79, 195, 247' : '167, 139, 250'}, 0.3)`,
              fontSize: 12,
              fontFamily: '"Barlow Condensed", sans-serif',
              fontWeight: 700,
            }}
          />
          <Chip
            label={player.role}
            size="small"
            sx={{ bgcolor: '#1c1d22', border: '1px solid #2a2b35', color: '#9aa0b8', fontSize: 12 }}
          />
          <Typography variant="caption" sx={{ color: '#5c6070', fontSize: 12 }}>
            {player.agents.join(', ')}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
          <Rating value={player.karma} precision={0.5} size="small" readOnly sx={{ color: '#f5c842' }} />
          <Typography variant="caption" sx={{ color: '#5c6070', fontSize: 12 }}>{player.karma}</Typography>
          {player.labels.map((label, idx) => (
            <Chip 
              key={idx} 
              label={label} 
              size="small" 
              sx={{ 
                bgcolor: 'rgba(74, 222, 128, 0.1)', 
                color: '#4ade80', 
                fontSize: 11, 
                height: 20,
                fontFamily: '"Barlow Condensed", sans-serif',
                fontWeight: 600,
                border: '1px solid rgba(74, 222, 128, 0.2)'
              }} 
            />
          ))}
        </Box>
      </Box>
      <Box sx={{ textAlign: 'right' }}>
        <Typography variant="caption" sx={{ color: '#5c6070', fontSize: 12, display: 'block' }}>
          {player.winRate} WR · {player.matches} matches
        </Typography>
        <Button 
          variant="contained" 
          size="small" 
          onClick={handleInvite}
          sx={{ 
            mt: 0.75, 
            fontSize: 13, 
            px: 1.75, 
            py: 0.625,
            fontFamily: '"Barlow Condensed", sans-serif',
            fontWeight: 700,
          }}
        >
          Invite
        </Button>
      </Box>
    </Card>
  );
};