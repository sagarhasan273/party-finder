// src/components/Sidebar.tsx
import React from 'react';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarItemProps {
  path: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  isActive: boolean;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ path, label, icon, badge, isActive, onClick }) => (
  <ListItem disablePadding>
    <ListItemButton
      onClick={onClick}
      sx={{
        pl: 2.5,
        py: 1.25,
        borderLeft: '3px solid transparent',
        backgroundColor: isActive ? 'rgba(255, 70, 85, 0.08)' : 'transparent',
        borderLeftColor: isActive ? '#ff4655' : 'transparent',
        '&:hover': {
          backgroundColor: '#1c1d22',
        },
      }}
    >
      <ListItemIcon sx={{ minWidth: 32, color: isActive ? '#ff4655' : '#9aa0b8' }}>
        {icon}
      </ListItemIcon>
      <ListItemText 
        primary={label} 
        primaryTypographyProps={{ 
          fontSize: 14, 
          fontWeight: 500,
          color: isActive ? '#ff4655' : '#9aa0b8',
        }} 
      />
      {badge && (
        <Typography
          variant="caption"
          sx={{
            backgroundColor: isActive ? 'rgba(255, 70, 85, 0.2)' : '#252630',
            color: isActive ? '#ff4655' : '#9aa0b8',
            px: 0.75,
            py: 0.25,
            borderRadius: 2,
            fontSize: 11,
            fontWeight: 700,
            fontFamily: '"Barlow Condensed", sans-serif',
          }}
        >
          {badge}
        </Typography>
      )}
    </ListItemButton>
  </ListItem>
);

interface SidebarProps {
  onLogout: () => void;
  onNavigate?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onLogout, onNavigate }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path: string) => {
    navigate(path);
    onNavigate?.();
  };

  const iconProps = { width: 18, height: 18, stroke: 'currentColor', strokeWidth: 2, fill: 'none' };

  return (
    <List sx={{ py: 2 }}>
      <ListSubheader sx={{ 
        fontSize: 11, 
        fontWeight: 700, 
        color: '#5c6070', 
        textTransform: 'uppercase', 
        letterSpacing: 1,
        fontFamily: '"Barlow Condensed", sans-serif',
        bgcolor: 'transparent',
        px: 2.5,
        py: 0.5
      }}>
        Lobby
      </ListSubheader>
      
      <SidebarItem
        path="/lobbies"
        label="Find a Party"
        icon={<svg viewBox="0 0 24 24" {...iconProps}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
        badge="12"
        isActive={location.pathname === '/lobbies'}
        onClick={() => handleNavigate('/lobbies')}
      />
      
      <SidebarItem
        path="/create"
        label="Create Lobby"
        icon={<svg viewBox="0 0 24 24" {...iconProps}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>}
        isActive={location.pathname === '/create'}
        onClick={() => handleNavigate('/create')}
      />

      <ListSubheader sx={{ 
        fontSize: 11, 
        fontWeight: 700, 
        color: '#5c6070', 
        textTransform: 'uppercase', 
        letterSpacing: 1,
        fontFamily: '"Barlow Condensed", sans-serif',
        bgcolor: 'transparent',
        px: 2.5,
        mt: 1.5,
        py: 0.5
      }}>
        Social
      </ListSubheader>
      
      <SidebarItem
        path="/players"
        label="Browse Players"
        icon={<svg viewBox="0 0 24 24" {...iconProps}><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>}
        badge="38"
        isActive={location.pathname === '/players'}
        onClick={() => handleNavigate('/players')}
      />
      
      <SidebarItem
        path="/friends"
        label="Friends"
        icon={<svg viewBox="0 0 24 24" {...iconProps}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><line x1="18" y1="8" x2="23" y2="13"/><line x1="23" y1="8" x2="18" y2="13"/></svg>}
        badge="5"
        isActive={location.pathname === '/friends'}
        onClick={() => handleNavigate('/friends')}
      />

      <ListSubheader sx={{ 
        fontSize: 11, 
        fontWeight: 700, 
        color: '#5c6070', 
        textTransform: 'uppercase', 
        letterSpacing: 1,
        fontFamily: '"Barlow Condensed", sans-serif',
        bgcolor: 'transparent',
        px: 2.5,
        mt: 1.5,
        py: 0.5
      }}>
        Account
      </ListSubheader>
      
      <SidebarItem
        path="/profile"
        label="My Profile"
        icon={<svg viewBox="0 0 24 24" {...iconProps}><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>}
        isActive={location.pathname === '/profile'}
        onClick={() => handleNavigate('/profile')}
      />
      
      <SidebarItem
        path="/logout"
        label="Sign Out"
        icon={<svg viewBox="0 0 24 24" {...iconProps}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>}
        isActive={false}
        onClick={onLogout}
      />
    </List>
  );
};