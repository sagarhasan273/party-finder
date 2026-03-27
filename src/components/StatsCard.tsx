// src/components/StatsCard.tsx
import React from 'react';
import { Card, Box, Typography } from '@mui/material';

interface StatsCardProps {
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
  green?: boolean;
}

export const StatsCard: React.FC<StatsCardProps> = ({ label, value, sub, accent, green }) => {
  return (
    <Card
      sx={{
        bgcolor: '#141519',
        border: '1px solid #2a2b35',
        borderRadius: 2,
        p: 2,
      }}
    >
      <Typography
        variant="caption"
        sx={{
          fontSize: 12,
          color: '#5c6070',
          fontWeight: 600,
          letterSpacing: 0.5,
          textTransform: 'uppercase',
          fontFamily: '"Barlow Condensed", sans-serif',
          display: 'block',
          mb: 0.75,
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: 26,
          fontWeight: 800,
          fontFamily: '"Barlow Condensed", sans-serif',
          color: accent ? '#ff4655' : green ? '#4ade80' : '#e8eaf0',
          lineHeight: 1,
        }}
      >
        {value}
      </Typography>
      {sub && (
        <Typography variant="caption" sx={{ fontSize: 12, color: '#5c6070', display: 'block', mt: 0.5 }}>
          {sub}
        </Typography>
      )}
    </Card>
  );
};