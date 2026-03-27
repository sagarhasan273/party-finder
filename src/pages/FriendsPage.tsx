// src/pages/FriendsPage.tsx
import React from 'react';
import { Box, Typography, Card, Avatar, Button, Stack } from '@mui/material';
import { Friend } from '../types';
import { useToast } from '../contexts/ToastContext';

const mockFriends: Friend[] = [
  { name: "NightSabre", tag: "#EU1", rank: "Gold II", status: "In a lobby", online: true },
  { name: "VeloMax", tag: "#NA1", rank: "Platinum III", status: "In game", online: true },
  { name: "StarK", tag: "#KR1", rank: "Diamond I", status: "Online", online: true },
  { name: "BronzeBro", tag: "#BR2", rank: "Bronze II", status: "Offline", online: false },
  { name: "SilverAce", tag: "#NA7", rank: "Silver III", status: "Online", online: true },
];

export const FriendsPage: React.FC = () => {
  const { showToast } = useToast();

  const handleInvite = (name: string) => {
    showToast(`Invite sent to ${name}!`, 'success');
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: '"Barlow Condensed", sans-serif' }}>
          Friends
        </Typography>
        <Typography variant="body2" sx={{ color: 'grey.300' }}>
          Manage your connections and see who's online
        </Typography>
      </Box>

      <Stack spacing={1.5}>
        {mockFriends.map((friend, idx) => (
          <Card
            key={idx}
            sx={{
              bgcolor: 'background.paper',
              border: 1,
              borderColor: 'grey.600',
              borderRadius: 2,
              p: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              opacity: friend.online ? 1 : 0.6,
            }}
          >
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: `hsl(${idx * 72}, 70%, 55%)`,
                fontWeight: 700,
              }}
            >
              {friend.name.slice(0, 2).toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: 15 }}>
                {friend.name}
                <Typography component="span" sx={{ color: 'grey.400', fontWeight: 400, ml: 0.5 }}>
                  {friend.tag}
                </Typography>
              </Typography>
              <Typography variant="caption" sx={{ color: 'grey.400', display: 'block' }}>
                {friend.rank}
              </Typography>
              <Typography variant="caption" sx={{ color: friend.online ? 'success.main' : 'grey.500' }}>
                {friend.status}
              </Typography>
            </Box>
            {friend.online && (
              <Button variant="contained" size="small" onClick={() => handleInvite(friend.name)}>
                Invite
              </Button>
            )}
          </Card>
        ))}
      </Stack>
    </Box>
  );
};