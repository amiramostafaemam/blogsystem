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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DarkModeIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeIcon from "@mui/icons-material/LightModeOutlined";
import PersonIcon from "@mui/icons-material/PersonOutline";
import DashboardIcon from "@mui/icons-material/SpaceDashboardOutlined";
import BookmarkIcon from "@mui/icons-material/BookmarkBorder";
import SettingsIcon from "@mui/icons-material/SettingsOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useColorMode } from "../context/ColorModeContext";
import Logo from "./Logo";
import { brand } from "../theme";

function Navbar({ onMenuClick }) {
  const { user, signOut } = useAuth();
  const { mode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

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
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: brand.espresso,
        color: brand.sand,
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onMenuClick}
          aria-label="Open navigation"
          sx={{ mr: 1, display: { md: "none" } }}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ flexGrow: 1, display: "flex" }}>
          <Logo to={user ? "/explore" : "/"} />
        </Box>

        <Tooltip title={mode === "dark" ? "Light mode" : "Dark mode"}>
          <IconButton color="inherit" onClick={toggleColorMode} aria-label="Toggle color mode">
            {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Tooltip>

        {user ? (
          <>
            <IconButton
              onClick={(e) => setAnchorEl(e.currentTarget)}
              aria-label="Account menu"
              sx={{ ml: 1, p: 0.5 }}
            >
              <Avatar
                src={user.avatar_url}
                alt={user.name}
                sx={{ width: 36, height: 36, border: `2px solid ${brand.clay}`, bgcolor: brand.terracotta, color: "#fff" }}
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
            >
              <Box sx={{ px: 2, py: 1 }}>
                <Typography fontWeight={700}>{user.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.email}
                </Typography>
              </Box>
              {[
                { label: "Your profile", to: `/u/${user.id}`, icon: <PersonIcon fontSize="small" /> },
                { label: "My posts", to: "/dashboard", icon: <DashboardIcon fontSize="small" /> },
                { label: "Bookmarks", to: "/bookmarks", icon: <BookmarkIcon fontSize="small" /> },
                { label: "Settings", to: "/settings", icon: <SettingsIcon fontSize="small" /> },
              ].map((item) => (
                <MenuItem
                  key={item.to}
                  onClick={() => {
                    closeMenu();
                    navigate(item.to);
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  {item.label}
                </MenuItem>
              ))}
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Box sx={{ display: "flex", gap: 1, ml: 1 }}>
            <Button component={Link} to="/login" color="inherit">
              Login
            </Button>
            <Button
              component={Link}
              to="/register"
              variant="contained"
              sx={{ bgcolor: brand.terracotta, color: "#fff", "&:hover": { bgcolor: "#963A26" } }}
            >
              Sign up
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
