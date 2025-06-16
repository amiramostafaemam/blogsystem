import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Avatar,
  Switch,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import ArticleIcon from "@mui/icons-material/Article";
import PersonIcon from "@mui/icons-material/Person";
import CloseIcon from "@mui/icons-material/Close";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Sidebar({
  onAllPostsClick,
  onMyPostsClick,
  onClose,
  darkMode,
  toggleDarkMode,
}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const bgColor = darkMode ? "#561C24" : "#F9F4ED";
const textColor = darkMode ? "#F9F4ED" : "#561C24";
const borderColor = darkMode ? "#C7B7A3" : "#6D2932";


  return (
    <Box
      sx={{
        width: "280px",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        bgcolor: bgColor,
        color: textColor,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        pb: 3,
        boxShadow: "2px 0 10px rgba(0,0,0,0.2)",
        zIndex: 1000,
        transition: "all 0.3s ease",
      }}
    >
      <Box>
        {/* Close button */}
        <Box display="flex" justifyContent="flex-end">
          <IconButton onClick={onClose} sx={{ color: textColor }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Profile */}
        <Box
          textAlign="center"
          mb={2}
          pb={2}
          borderBottom="2px solid"
          borderColor={borderColor}
        >
          <Avatar
            src={user?.profileImage}
            alt={user?.name}
            sx={{ width: 80, height: 80, margin: "0 auto", mb: 1 }}
          />
          <Typography variant="h6">{user?.name}</Typography>
        </Box>

        {/* Menu */}
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate("/profile")}>
              <ListItemIcon sx={{ color: textColor }}>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText
                primary="Profile"
                primaryTypographyProps={{ sx: { color: textColor } }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={onAllPostsClick}>
              <ListItemIcon sx={{ color: textColor }}>
                <ArticleIcon />
              </ListItemIcon>
              <ListItemText
                primary="All Posts"
                primaryTypographyProps={{ sx: { color: textColor } }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={onMyPostsClick}>
              <ListItemIcon sx={{ color: textColor }}>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText
                primary="My Posts"
                primaryTypographyProps={{ sx: { color: textColor } }}
              />
            </ListItemButton>
          </ListItem>
        </List>

        <Divider sx={{ my: 2, borderColor: borderColor }} />

        {/* Dark Mode Toggle */}
        <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
          <WbSunnyIcon sx={{ color: textColor }} />
          <Switch checked={darkMode} onChange={toggleDarkMode} color="default" />
          <DarkModeIcon sx={{ color: textColor }} />
        </Box>
      </Box>

      {/* Logout */}
      <ListItem disablePadding>
        <ListItemButton
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          <ListItemIcon sx={{ color: textColor }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{ sx: { color: textColor } }}
          />
        </ListItemButton>
      </ListItem>
    </Box>
  );
}

export default Sidebar;
