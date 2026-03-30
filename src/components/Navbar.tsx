import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Plus,
  User,
  LogOut,
  Layout,
  Crosshair,
  ChevronDown,
} from "lucide-react";

import {
  Box,
  Menu,
  Stack,
  AppBar,
  Button,
  Avatar,
  Toolbar,
  Divider,
  MenuItem,
  Typography,
  ListItemIcon,
} from "@mui/material";

import { GoogleSignIn } from "src/core/auth";
import { useCredentials } from "src/core/slices";

const navLinks = [
  { label: "BROWSE", path: "/" },
  { label: "APPLIED LOBBIES", path: "/applied-lobbies", authOnly: true },
  { label: "MY LOBBY", path: "/my-lobby", authOnly: true },
];

export function Navbar() {
  const { user, isAuthenticated, logout } = useCredentials();

  const location = useLocation();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const isActive = (path: string) => location.pathname === path;

  return (
    <AppBar position="sticky" elevation={0}>
      <Toolbar
        sx={{ maxWidth: 1200, mx: "auto", width: "100%", px: { xs: 2, sm: 3 } }}
      >
        {/* Logo */}
        <Link to="/" style={{ textDecoration: "none" }}>
          <Stack direction="row" alignItems="center" gap={1} sx={{ mr: 4 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "6px",
                background: "#FF4655",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Crosshair size={16} color="#fff" />
            </Box>
            <Typography
              sx={{
                fontFamily: '"Rajdhani", sans-serif',
                fontWeight: 900,
                fontSize: "1.35rem",
                letterSpacing: "0.06em",
                color: "#e8ecf0",
                lineHeight: 1,
              }}
            >
              VAL<span style={{ color: "#FF4655" }}>5</span>TH
            </Typography>
          </Stack>
        </Link>

        {/* Nav Links – desktop */}
        <Stack
          direction="row"
          gap={0.5}
          sx={{ display: { xs: "none", md: "flex" }, flex: 1 }}
        >
          {navLinks
            .filter((l) => !l.authOnly || isAuthenticated)
            .map((l) => (
              <Button
                key={l.path}
                component={Link}
                to={l.path}
                size="small"
                sx={{
                  fontFamily: '"Rajdhani", sans-serif',
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  fontSize: "0.78rem",
                  color: isActive(l.path) ? "#FF4655" : "rgba(255,255,255,0.5)",
                  backgroundColor: isActive(l.path)
                    ? "rgba(255,70,85,0.08)"
                    : "transparent",
                  px: 1.5,
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.05)",
                    color: isActive(l.path)
                      ? "#FF4655"
                      : "rgba(255,255,255,0.8)",
                  },
                }}
              >
                {l.label}
              </Button>
            ))}
        </Stack>

        {/* Right: auth controls */}
        <Stack
          direction="row"
          alignItems="center"
          gap={1.5}
          sx={{ ml: "auto" }}
        >
          {isAuthenticated ? (
            <>
              <Button
                component={Link}
                to="/create"
                variant="contained"
                size="small"
                startIcon={<Plus size={14} />}
                sx={{
                  display: { xs: "none", md: "flex" },
                  background: "#FF4655",
                  fontFamily: '"Rajdhani", sans-serif',
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  fontSize: "0.78rem",
                  px: 1.75,
                  height: 34,
                  "&:hover": {
                    background: "#ff6b77",
                    boxShadow: "0 0 18px rgba(255,70,85,0.4)",
                  },
                }}
              >
                POST LOBBY
              </Button>

              {/* User dropdown */}
              <Box
                component="button"
                onClick={(e) => setAnchorEl(e.currentTarget)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  px: 1.25,
                  py: 0.75,
                  borderRadius: "6px",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  transition: "background 0.15s",
                  "&:hover": { background: "rgba(255,255,255,0.05)" },
                }}
              >
                <Avatar
                  sx={{
                    width: 28,
                    height: 28,
                    background: "#FF4655",
                    fontFamily: '"Rajdhani", sans-serif',
                    fontWeight: 700,
                    fontSize: "0.8rem",
                  }}
                >
                  {(user?.name?.[0] ?? user?.email?.[0] ?? "U").toUpperCase()}
                </Avatar>
                <Typography
                  sx={{
                    display: { xs: "none", sm: "block" },
                    fontFamily: '"Rajdhani", sans-serif',
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    color: "#e8ecf0",
                    maxWidth: 100,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {user?.name ?? user?.email?.split("@")[0] ?? "User"}
                </Typography>
                <ChevronDown size={12} color="rgba(255,255,255,0.4)" />
              </Box>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                PaperProps={{
                  sx: {
                    mt: 1,
                    minWidth: 180,
                    backgroundColor: "#1c2030",
                    border: "1px solid rgba(255,255,255,0.08)",
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <Box px={2} py={1}>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary", fontSize: "0.72rem" }}
                  >
                    {user?.email}
                  </Typography>
                </Box>
                <Divider />
                <MenuItem
                  onClick={() => {
                    navigate("/profile");
                    setAnchorEl(null);
                  }}
                  sx={{ fontSize: "0.85rem" }}
                >
                  <ListItemIcon sx={{ minWidth: 0 }}>
                    <User size={15} />
                  </ListItemIcon>
                  My Profile
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    navigate("/my-lobby");
                    setAnchorEl(null);
                  }}
                  sx={{ fontSize: "0.85rem" }}
                >
                  <ListItemIcon sx={{ minWidth: 0 }}>
                    <Layout size={15} />
                  </ListItemIcon>
                  My Lobby
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    navigate("/applied-lobbies");
                    setAnchorEl(null);
                  }}
                  sx={{ fontSize: "0.85rem" }}
                >
                  <ListItemIcon sx={{ minWidth: 0 }}>
                    <Layout size={15} />
                  </ListItemIcon>
                  Applied Lobbies
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    navigate("/create");
                    setAnchorEl(null);
                  }}
                  sx={{ fontSize: "0.85rem" }}
                >
                  <ListItemIcon sx={{ minWidth: 0 }}>
                    <Plus size={15} />
                  </ListItemIcon>
                  Create Lobby
                </MenuItem>
                <Divider />
                <MenuItem
                  onClick={() => {
                    logout();
                    setAnchorEl(null);
                  }}
                  sx={{ fontSize: "0.85rem", color: "#FF4655" }}
                >
                  <ListItemIcon sx={{ minWidth: 0, color: "#FF4655" }}>
                    <LogOut size={15} />
                  </ListItemIcon>
                  Sign Out
                </MenuItem>
              </Menu>
            </>
          ) : (
            <GoogleSignIn />
          )}
        </Stack>
      </Toolbar>

      {/* Mobile bottom nav (authenticated) */}
      {isAuthenticated && (
        <Box
          sx={{
            display: { xs: "flex", md: "none" },
            borderTop: "1px solid rgba(255,255,255,0.06)",
            px: 2,
            py: 1,
            gap: 0.5,
            overflowX: "auto",
          }}
        >
          {navLinks
            .filter((l) => !l.authOnly || isAuthenticated)
            .map((l) => (
              <Button
                key={l.path}
                component={Link}
                to={l.path}
                size="small"
                sx={{
                  fontFamily: '"Rajdhani", sans-serif',
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  fontSize: "0.7rem",
                  color: isActive(l.path)
                    ? "#FF4655"
                    : "rgba(255,255,255,0.45)",
                  backgroundColor: isActive(l.path)
                    ? "rgba(255,70,85,0.08)"
                    : "transparent",
                  whiteSpace: "nowrap",
                  "&:hover": { color: "rgba(255,255,255,0.8)" },
                }}
              >
                {l.label}
              </Button>
            ))}
        </Box>
      )}
    </AppBar>
  );
}
