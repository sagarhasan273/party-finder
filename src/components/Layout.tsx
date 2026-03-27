// src/components/Layout.tsx
import React, { ReactNode } from 'react';
import { Box, AppBar, Toolbar, Typography, Avatar, Chip, IconButton, Drawer, useMediaQuery } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { Sidebar } from './Sidebar';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: ReactNode;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, onLogout }) => {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [onlineCount, setOnlineCount] = React.useState(247);

  React.useEffect(() => {
    const interval = setInterval(() => {
      const delta = Math.floor(Math.random() * 6) - 2;
      setOnlineCount(prev => Math.max(0, prev + delta));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: '#141519',
          borderBottom: '1px solid #2a2b35',
          height: 60,
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: 60, px: { xs: 2, sm: 3 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isMobile && (
              <IconButton color="inherit" edge="start" onClick={handleDrawerToggle}>
                <MenuIcon />
              </IconButton>
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  bgcolor: '#ff4655',
                  borderRadius: '50%',
                  animation: 'pulse 2s infinite',
                }}
              />
              <Typography 
                variant="h6" 
                sx={{ 
                  fontFamily: '"Barlow Condensed", sans-serif', 
                  fontWeight: 800, 
                  fontSize: 22,
                  letterSpacing: '0.5px'
                }}
              >
                VAL<span style={{ color: '#ff4655' }}>5TH</span>
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Chip
              label={`${onlineCount} online`}
              size="small"
              sx={{
                backgroundColor: '#1a2a1a',
                color: '#4ade80',
                border: '1px solid #2d4a2d',
                fontSize: 12,
                fontWeight: 600,
                '& .MuiChip-label': { px: 1.5 },
                '& .MuiChip-icon': { color: '#4ade80' }
              }}
              icon={<Box sx={{ width: 6, height: 6, bgcolor: '#4ade80', borderRadius: '50%' }} />}
            />
            <Avatar
              onClick={() => window.location.href = '/profile'}
              sx={{
                width: 36,
                height: 36,
                background: 'linear-gradient(135deg, #ff4655, #a78bfa)',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                border: '2px solid transparent',
                transition: '0.2s',
                '&:hover': { borderColor: '#ff4655' },
              }}
            >
              {user?.avatarInitials || 'PR'}
            </Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{display: 'flex'}}>
        <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          width: 260,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 260,
            boxSizing: 'border-box',
            bgcolor: '#141519',
            borderRight: '1px solid #2a2b35',
            position: isMobile ? 'fixed' : 'sticky',
            top: 60,
            height: 'calc(100vh - 60px)',
          },
        }}
      >
        <Sidebar onLogout={onLogout} onNavigate={handleDrawerToggle} />
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          overflowY: 'auto',
          height: 'calc(100vh - 60px)',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          {children}
        </motion.div>
      </Box>
      </Box>
    </Box>
  );
};