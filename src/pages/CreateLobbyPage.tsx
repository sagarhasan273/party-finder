import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Stack,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Paper,
  Chip,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Plus, ChevronLeft, Crosshair, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store';
import { createLobby } from '../store/lobbiesSlice';
import { useAuth } from '../hooks/useAuth';
import { RANKS, MAPS, REGIONS, ROLES, ROLE_COLORS } from '../lib/valorant';
import type { RankTier } from '../types';
import { toast } from 'sonner';

const sectionSx = {
  p: 3,
  backgroundColor: 'rgba(22,25,38,0.9)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: '8px',
};

const sectionLabel = {
  fontFamily: '"Rajdhani", sans-serif' as const,
  fontWeight: 700,
  fontSize: '0.72rem',
  letterSpacing: '0.12em',
  color: 'rgba(255,255,255,0.35)',
  mb: 2.5,
};

export function CreateLobbyPage() {
  const { user, isLoading, isAuthenticated, login } = useAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [hostUsername, setHostUsername] = useState('');
  const [hostTag, setHostTag] = useState('');
  const [description, setDescription] = useState('');
  const [rankMin, setRankMin] = useState<RankTier>('Gold');
  const [rankMax, setRankMax] = useState<RankTier>('Platinum');
  const [map, setMap] = useState('Any');
  const [region, setRegion] = useState('NA');
  const [rolesNeeded, setRolesNeeded] = useState<string[]>(['Any']);
  const [discordLink, setDiscordLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      login();
    }
  }, [isLoading, isAuthenticated, login]);

  const toggleRole = (role: string) => {
    setRolesNeeded((prev) => {
      if (role === 'Any') return ['Any'];
      const withoutAny = prev.filter((r) => r !== 'Any');
      if (withoutAny.includes(role)) {
        const next = withoutAny.filter((r) => r !== role);
        return next.length === 0 ? ['Any'] : next;
      }
      return [...withoutAny, role];
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { login(); return; }
    if (!title.trim()) { toast.error('Title is required'); return; }
    if (!hostUsername.trim()) { toast.error('Username is required'); return; }

    setIsSubmitting(true);
    try {
      await dispatch(
        createLobby({
          userId: user.id,
          title: title.trim(),
          description: description.trim() || undefined,
          rankMin,
          rankMax,
          map: map || 'Any',
          rolesNeeded: JSON.stringify(rolesNeeded),
          region,
          status: 'open',
          hostUsername: hostUsername.trim(),
          hostTag: hostTag.trim() || undefined,
          discordLink: discordLink.trim() || undefined,
          currentPlayers: 4,
          maxPlayers: 5,
        })
      ).unwrap();
      toast.success('Lobby posted! Good luck finding your 5th 🎯');
      navigate('/');
    } catch {
      toast.error('Failed to create lobby. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectSx = {
    backgroundColor: 'rgba(28,32,48,0.8)',
    fontFamily: '"Rajdhani", sans-serif',
    fontWeight: 700,
    fontSize: '0.85rem',
    letterSpacing: '0.04em',
    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.08)' },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#FF4655' },
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Stack alignItems="center" gap={2}>
          <CircularProgress size={40} sx={{ color: '#FF4655' }} />
          <Typography sx={{ fontFamily: '"Rajdhani", sans-serif', fontWeight: 700, letterSpacing: '0.1em', color: 'text.secondary', fontSize: '0.8rem' }}>
            LOADING...
          </Typography>
        </Stack>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Stack alignItems="center" gap={2.5} textAlign="center">
          <AlertCircle size={44} color="#FF4655" />
          <Typography variant="h4" sx={{ fontFamily: '"Rajdhani", sans-serif', fontWeight: 800 }}>
            SIGN IN REQUIRED
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>You need to sign in to create a lobby.</Typography>
          <Button
            variant="contained"
            onClick={login}
            sx={{ background: '#FF4655', fontFamily: '"Rajdhani", sans-serif', fontWeight: 700 }}
          >
            Sign In
          </Button>
        </Stack>
      </Box>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Back + header */}
        <Box mb={4}>
          <Button
            component={Link}
            to="/"
            startIcon={<ChevronLeft size={15} />}
            size="small"
            sx={{
              fontFamily: '"Rajdhani", sans-serif',
              fontWeight: 700,
              fontSize: '0.72rem',
              letterSpacing: '0.07em',
              color: 'text.secondary',
              mb: 2,
              '&:hover': { color: 'text.primary' },
            }}
          >
            BACK TO BROWSE
          </Button>
          <Stack direction="row" alignItems="center" gap={1.5} mb={0.75}>
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: '6px',
                background: 'rgba(255,70,85,0.12)',
                border: '1px solid rgba(255,70,85,0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Crosshair size={18} color="#FF4655" />
            </Box>
            <Typography
              variant="h3"
              sx={{ fontFamily: '"Rajdhani", sans-serif', fontWeight: 900, fontSize: '1.8rem', letterSpacing: '0.04em' }}
            >
              POST A LOBBY
            </Typography>
          </Stack>
          <Typography sx={{ color: 'text.secondary', fontSize: '0.88rem' }}>
            Fill in the details below to find your perfect 5th teammate.
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          <Stack gap={2.5}>
            {/* ── Basic Info ── */}
            <Paper elevation={0} sx={sectionSx}>
              <Typography sx={sectionLabel}>BASIC INFO</Typography>
              <Stack gap={2.5}>
                <TextField
                  label="Lobby Title *"
                  placeholder="e.g. Gold-Plat ranked, chill vibes"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  fullWidth
                  inputProps={{ maxLength: 80 }}
                  required
                />
                <Stack direction={{ xs: 'column', sm: 'row' }} gap={2}>
                  <TextField
                    label="Your Username *"
                    placeholder="NightReaper"
                    value={hostUsername}
                    onChange={(e) => setHostUsername(e.target.value)}
                    fullWidth
                    inputProps={{ maxLength: 32 }}
                    required
                  />
                  <TextField
                    label="Tag"
                    placeholder="1234"
                    value={hostTag}
                    onChange={(e) => setHostTag(e.target.value.replace('#', ''))}
                    fullWidth
                    inputProps={{ maxLength: 8 }}
                    InputProps={{
                      startAdornment: (
                        <Typography sx={{ color: 'text.secondary', mr: 0.25, fontFamily: '"Rajdhani", sans-serif', fontWeight: 700 }}>#</Typography>
                      ),
                    }}
                  />
                </Stack>
                <Box>
                  <TextField
                    label="Description (optional)"
                    placeholder="Tell players about your playstyle, mic requirements, schedule..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                    multiline
                    rows={3}
                    inputProps={{ maxLength: 300 }}
                  />
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', textAlign: 'right', mt: 0.5 }}>
                    {description.length}/300
                  </Typography>
                </Box>
              </Stack>
            </Paper>

            {/* ── Rank & Region ── */}
            <Paper elevation={0} sx={sectionSx}>
              <Typography sx={sectionLabel}>RANK & REGION</Typography>
              <Stack gap={2.5}>
                <Stack direction={{ xs: 'column', sm: 'row' }} gap={2}>
                  <FormControl fullWidth>
                    <InputLabel>Min Rank</InputLabel>
                    <Select
                      value={rankMin}
                      label="Min Rank"
                      onChange={(e) => setRankMin(e.target.value as RankTier)}
                      sx={selectSx}
                    >
                      {RANKS.map((r) => (
                        <MenuItem key={r} value={r} sx={{ fontFamily: '"Rajdhani", sans-serif', fontWeight: 700 }}>
                          {r}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel>Max Rank</InputLabel>
                    <Select
                      value={rankMax}
                      label="Max Rank"
                      onChange={(e) => setRankMax(e.target.value as RankTier)}
                      sx={selectSx}
                    >
                      {RANKS.map((r) => (
                        <MenuItem key={r} value={r} sx={{ fontFamily: '"Rajdhani", sans-serif', fontWeight: 700 }}>
                          {r}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} gap={2}>
                  <FormControl fullWidth>
                    <InputLabel>Map</InputLabel>
                    <Select value={map} label="Map" onChange={(e) => setMap(e.target.value)} sx={selectSx}>
                      {MAPS.map((m) => (
                        <MenuItem key={m} value={m} sx={{ fontFamily: '"Rajdhani", sans-serif', fontWeight: 700 }}>
                          {m}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel>Region</InputLabel>
                    <Select value={region} label="Region" onChange={(e) => setRegion(e.target.value)} sx={selectSx}>
                      {REGIONS.map((r) => (
                        <MenuItem key={r} value={r} sx={{ fontFamily: '"Rajdhani", sans-serif', fontWeight: 700 }}>
                          {r}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
              </Stack>
            </Paper>

            {/* ── Roles ── */}
            <Paper elevation={0} sx={sectionSx}>
              <Typography sx={sectionLabel}>ROLES NEEDED</Typography>
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {ROLES.map((role) => {
                  const isSelected = rolesNeeded.includes(role);
                  const colors = ROLE_COLORS[role] ?? { bg: 'rgba(100,100,130,0.2)', color: '#a0a0c0', border: 'rgba(100,100,130,0.3)' };
                  return (
                    <Chip
                      key={role}
                      label={role.toUpperCase()}
                      onClick={() => toggleRole(role)}
                      sx={{
                        fontFamily: '"Rajdhani", sans-serif',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        letterSpacing: '0.05em',
                        cursor: 'pointer',
                        height: 30,
                        backgroundColor: isSelected ? colors.bg : 'rgba(28,32,48,0.8)',
                        color: isSelected ? colors.color : 'rgba(255,255,255,0.45)',
                        border: `1px solid ${isSelected ? colors.border : 'rgba(255,255,255,0.08)'}`,
                        transition: 'all 0.15s',
                        '&:hover': {
                          backgroundColor: isSelected ? colors.bg : 'rgba(255,255,255,0.05)',
                          filter: 'brightness(1.1)',
                        },
                        '& .MuiChip-label': { px: 1.5 },
                      }}
                    />
                  );
                })}
              </Stack>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 1.5 }}>
                Selected: {rolesNeeded.join(', ')}
              </Typography>
            </Paper>

            {/* ── Contact ── */}
            <Paper elevation={0} sx={sectionSx}>
              <Typography sx={sectionLabel}>CONTACT (OPTIONAL)</Typography>
              <TextField
                label="Discord Server / Invite Link"
                placeholder="https://discord.gg/yourserver"
                value={discordLink}
                onChange={(e) => setDiscordLink(e.target.value)}
                type="url"
                fullWidth
              />
            </Paper>

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />

            {/* Submit */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isSubmitting}
              startIcon={
                isSubmitting ? (
                  <CircularProgress size={16} sx={{ color: 'white' }} />
                ) : (
                  <Plus size={18} />
                )
              }
              sx={{
                background: isSubmitting ? 'rgba(255,70,85,0.5)' : '#FF4655',
                fontFamily: '"Rajdhani", sans-serif',
                fontWeight: 700,
                letterSpacing: '0.08em',
                fontSize: '0.95rem',
                height: 48,
                '&:hover': {
                  background: '#ff6b77',
                  boxShadow: '0 0 24px rgba(255,70,85,0.4)',
                },
                '&.Mui-disabled': { background: 'rgba(255,70,85,0.3)', color: 'rgba(255,255,255,0.5)' },
              }}
            >
              {isSubmitting ? 'POSTING...' : 'POST LOBBY'}
            </Button>
          </Stack>
        </Box>
      </motion.div>
    </Container>
  );
}
