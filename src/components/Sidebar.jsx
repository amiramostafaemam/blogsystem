import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Button,
  Chip,
} from "@mui/material";
import ExploreIcon from "@mui/icons-material/ExploreOutlined";
import BookmarkIcon from "@mui/icons-material/BookmarkBorder";
import DashboardIcon from "@mui/icons-material/SpaceDashboardOutlined";
import PersonIcon from "@mui/icons-material/PersonOutline";
import SettingsIcon from "@mui/icons-material/SettingsOutlined";
import EditIcon from "@mui/icons-material/EditOutlined";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getPopularTags } from "../api/posts";

export const SIDEBAR_WIDTH = 260;

function PopularTags({ onNavigate }) {
  const [tags, setTags] = useState([]);
  const [searchParams] = useSearchParams();
  const activeTag = searchParams.get("tag");

  useEffect(() => {
    getPopularTags(10).then(setTags).catch(() => {});
  }, []);

  if (tags.length === 0) return null;

  return (
    <Box sx={{ mt: 3, px: 1 }}>
      <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: "0.12em" }}>
        Popular tags
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mt: 1 }}>
        {tags.map(({ tag }) => (
          <Chip
            key={tag}
            label={`#${tag}`}
            size="small"
            component={Link}
            to={`/explore?tag=${encodeURIComponent(tag)}`}
            onClick={onNavigate}
            clickable
            color={activeTag === tag ? "primary" : "default"}
            variant={activeTag === tag ? "filled" : "outlined"}
          />
        ))}
      </Box>
    </Box>
  );
}

function Sidebar({ onNavigate }) {
  const { user } = useAuth();
  const { pathname } = useLocation();

  const items = [
    { label: "Explore", to: "/explore", icon: <ExploreIcon /> },
    ...(user
      ? [
          { label: "My posts", to: "/dashboard", icon: <DashboardIcon /> },
          { label: "Bookmarks", to: "/bookmarks", icon: <BookmarkIcon /> },
          { label: "Profile", to: `/u/${user.id}`, icon: <PersonIcon /> },
          { label: "Settings", to: "/settings", icon: <SettingsIcon /> },
        ]
      : []),
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", p: 2, overflowY: "auto" }}>
      {user ? (
        <Button
          component={Link}
          to="/write"
          variant="contained"
          size="large"
          startIcon={<EditIcon />}
          onClick={onNavigate}
          sx={{ mb: 2 }}
        >
          Write a story
        </Button>
      ) : (
        <Box sx={{ py: 1, px: 1, mb: 1 }}>
          <Typography fontWeight={700} gutterBottom>
            Join the conversation
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Sign up to write, like, comment and save stories.
          </Typography>
          <Button component={Link} to="/register" variant="contained" fullWidth onClick={onNavigate}>
            Create account
          </Button>
        </Box>
      )}

      <List disablePadding>
        {items.map((item) => (
          <ListItemButton
            key={item.to}
            component={Link}
            to={item.to}
            selected={pathname === item.to}
            onClick={onNavigate}
            sx={{ borderRadius: 2, mb: 0.5 }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>

      <PopularTags onNavigate={onNavigate} />
    </Box>
  );
}

export default Sidebar;
