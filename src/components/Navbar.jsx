import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Tooltip,
  Box,
  Divider,
  useScrollTrigger,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import DarkModeIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeIcon from "@mui/icons-material/LightModeOutlined";
import PersonIcon from "@mui/icons-material/PersonOutline";
import DashboardIcon from "@mui/icons-material/SpaceDashboardOutlined";
import BookmarkIcon from "@mui/icons-material/BookmarkBorder";
import SettingsIcon from "@mui/icons-material/SettingsOutlined";
import InsightsIcon from "@mui/icons-material/InsightsOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import EditIcon from "@mui/icons-material/EditOutlined";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useColorMode } from "../context/ColorModeContext";
import Logo from "./Logo";
import NotificationBell from "./NotificationBell";

const MENU = [
  { label: "Your profile", to: (u) => `/u/${u.id}`, icon: <PersonIcon fontSize="small" /> },
  { label: "My posts", to: () => "/dashboard", icon: <DashboardIcon fontSize="small" /> },
  { label: "Stats", to: () => "/stats", icon: <InsightsIcon fontSize="small" /> },
  { label: "Bookmarks", to: () => "/bookmarks", icon: <BookmarkIcon fontSize="small" /> },
  { label: "Settings", to: () => "/settings", icon: <SettingsIcon fontSize="small" /> },
];

// Frosted top bar, same language as the landing page nav
function Navbar({ onMenuClick }) {
  const { user, signOut } = useAuth();
  const { mode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const scrolled = useScrollTrigger({ disableHysteresis: true, threshold: 4 });

  const closeMenu = () => setAnchorEl(null);

  const handleLogout = () => {
    closeMenu();
    signOut();
    navigate("/");
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={(theme) => ({
        zIndex: theme.zIndex.drawer + 1,
        color: "text.primary",
        bgcolor: alpha(theme.palette.background.default, scrolled ? 0.82 : 0.6),
        backdropFilter: "saturate(180%) blur(16px)",
        borderBottom: 1,
        borderColor: "divider",
        transition: "background-color .25s",
      })}
    >
      <Toolbar sx={{ gap: 0.5 }}>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onMenuClick}
          aria-label="Open navigation"
          sx={{ mr: 0.5, display: { md: "none" } }}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ flexGrow: 1, display: "flex" }}>
          <Logo to={user ? "/explore" : "/"} />
        </Box>

        {user && (
          <Button
            component={Link}
            to="/write"
            variant="contained"
            startIcon={<EditIcon />}
            sx={{ display: { xs: "none", sm: "inline-flex" }, mr: 1, borderRadius: 99, px: 2.25 }}
          >
            Write
          </Button>
        )}

        <Tooltip title={mode === "dark" ? "Light mode" : "Dark mode"}>
          <IconButton color="inherit" onClick={toggleColorMode} aria-label="Toggle color mode">
            {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Tooltip>

        {user ? (
          <>
            <NotificationBell />
            <IconButton
              onClick={(e) => setAnchorEl(e.currentTarget)}
              aria-label="Account menu"
              sx={{ ml: 0.5, p: 0.5 }}
            >
              <Avatar
                src={user.avatar_url}
                alt={user.name}
                sx={{
                  width: 34,
                  height: 34,
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  outline: "2px solid",
                  outlineColor: "divider",
                  outlineOffset: 2,
                }}
              >
                {user.name?.[0]?.toUpperCase()}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={closeMenu}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              slotProps={{ paper: { sx: { minWidth: 220, mt: 1 } } }}
            >
              <Box sx={{ px: 2, py: 1 }}>
                <Typography fontWeight={700}>{user.name}</Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {user.email}
                </Typography>
              </Box>
              <Divider sx={{ my: 0.5 }} />
              {MENU.map((item) => (
                <MenuItem
                  key={item.label}
                  onClick={() => {
                    closeMenu();
                    navigate(item.to(user));
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  {item.label}
                </MenuItem>
              ))}
              <Divider sx={{ my: 0.5 }} />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                Log out
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Box sx={{ display: "flex", gap: 1, ml: 1 }}>
            <Button component={Link} to="/login" color="inherit" sx={{ display: { xs: "none", sm: "inline-flex" } }}>
              Log in
            </Button>
            <Button component={Link} to="/register" variant="contained" sx={{ borderRadius: 99, px: 2.25 }}>
              Sign up
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
