import { useEffect, useState } from "react";
import { Box, Typography, List, ListItemButton, ListItemIcon, ListItemText, Button, Chip, Stack } from "@mui/material";
import { alpha } from "@mui/material/styles";
import ExploreIcon from "@mui/icons-material/ExploreOutlined";
import BookmarkIcon from "@mui/icons-material/BookmarkBorder";
import DashboardIcon from "@mui/icons-material/SpaceDashboardOutlined";
import PersonIcon from "@mui/icons-material/PersonOutline";
import SettingsIcon from "@mui/icons-material/SettingsOutlined";
import InsightsIcon from "@mui/icons-material/InsightsOutlined";
import EditIcon from "@mui/icons-material/EditOutlined";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getPopularTags } from "../api/posts";
import SpotlightCard from "./reactbits/SpotlightCard";
import { LogoMark } from "./Logo";
import { GITHUB_URL } from "../config";
import { brand } from "../theme";

export const SIDEBAR_WIDTH = 248;

function SectionLabel({ children }) {
  return (
    <Typography
      sx={{ px: 1.5, mb: 0.75, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "text.secondary", opacity: 0.8 }}
    >
      {children}
    </Typography>
  );
}

function NavItem({ item, active, onNavigate }) {
  return (
    <ListItemButton
      component={Link}
      to={item.to}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      sx={(theme) => ({
        position: "relative",
        borderRadius: 2.5,
        py: 0.75,
        mb: 0.25,
        color: active ? "primary.main" : "text.primary",
        bgcolor: active ? alpha(theme.palette.primary.main, 0.1) : "transparent",
        "&:hover": { bgcolor: active ? alpha(theme.palette.primary.main, 0.14) : "action.hover" },
        "&::before": {
          content: '""',
          position: "absolute",
          left: -8,
          top: 8,
          bottom: 8,
          width: 3,
          borderRadius: 3,
          bgcolor: "primary.main",
          opacity: active ? 1 : 0,
          transition: "opacity .2s",
        },
      })}
    >
      <ListItemIcon sx={{ minWidth: 36, color: "inherit", "& svg": { fontSize: 21 } }}>{item.icon}</ListItemIcon>
      <ListItemText primary={item.label} slotProps={{ primary: { fontWeight: active ? 700 : 500, fontSize: 15 } }} />
    </ListItemButton>
  );
}

function PopularTags({ onNavigate }) {
  const [tags, setTags] = useState([]);
  const [searchParams] = useSearchParams();
  const activeTag = searchParams.get("tag");

  useEffect(() => {
    getPopularTags(8).then(setTags).catch(() => {});
  }, []);

  if (tags.length === 0) return null;

  return (
    <Box sx={{ mt: 3 }}>
      <SectionLabel>Topics</SectionLabel>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, px: 1 }}>
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
            sx={{ borderRadius: 99, fontWeight: 500, borderColor: "divider" }}
          />
        ))}
      </Box>
    </Box>
  );
}

// Warm call-to-action for signed-out readers
function JoinCard({ onNavigate }) {
  return (
    <SpotlightCard
      spotlightColor={alpha(brand.clay, 0.35)}
      sx={(theme) => ({
        p: 2.5,
        mb: 3,
        borderRadius: "20px",
        color: brand.sand,
        background: `radial-gradient(circle at 100% 0%, ${alpha(brand.terracottaBright, 0.45)}, transparent 55%), linear-gradient(160deg, ${brand.espresso}, ${theme.palette.mode === "dark" ? "#0d0b0a" : brand.roast})`,
      })}
    >
      <Box sx={{ position: "relative", zIndex: 2 }}>
        <Box sx={{ mb: 1.5, "& svg": { display: "block" } }}>
          <LogoMark size={30} />
        </Box>
        <Typography sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: "1.15rem", lineHeight: 1.25, mb: 0.75 }}>
          Join the conversation
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.75, mb: 2 }}>
          Write, like, respond and save stories.
        </Typography>
        <Button
          component={Link}
          to="/register"
          onClick={onNavigate}
          variant="contained"
          fullWidth
          sx={{ bgcolor: brand.terracotta, color: "#fff", "&:hover": { bgcolor: "#963A26" } }}
        >
          Create free account
        </Button>
      </Box>
    </SpotlightCard>
  );
}

function Sidebar({ onNavigate }) {
  const { user } = useAuth();
  const { pathname } = useLocation();

  const discover = [{ label: "Explore", to: "/explore", icon: <ExploreIcon /> }];
  const mine = user
    ? [
        { label: "My posts", to: "/dashboard", icon: <DashboardIcon /> },
        { label: "Stats", to: "/stats", icon: <InsightsIcon /> },
        { label: "Bookmarks", to: "/bookmarks", icon: <BookmarkIcon /> },
        { label: "Profile", to: `/u/${user.id}`, icon: <PersonIcon /> },
        { label: "Settings", to: "/settings", icon: <SettingsIcon /> },
      ]
    : [];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", px: 2, py: 2.5, overflowY: "auto" }}>
      {!user && <JoinCard onNavigate={onNavigate} />}

      {user && (
        <Button
          component={Link}
          to="/write"
          onClick={onNavigate}
          variant="contained"
          startIcon={<EditIcon />}
          sx={{ display: { sm: "none" }, mb: 2.5, borderRadius: 99 }}
        >
          Write a story
        </Button>
      )}

      <SectionLabel>Discover</SectionLabel>
      <List disablePadding sx={{ mb: 2.5 }}>
        {discover.map((item) => (
          <NavItem key={item.to} item={item} active={pathname === item.to} onNavigate={onNavigate} />
        ))}
      </List>

      {mine.length > 0 && (
        <>
          <SectionLabel>Your space</SectionLabel>
          <List disablePadding>
            {mine.map((item) => (
              <NavItem key={item.to} item={item} active={pathname === item.to} onNavigate={onNavigate} />
            ))}
          </List>
        </>
      )}

      {/* Explore already shows topics in its header */}
      {pathname !== "/explore" && <PopularTags onNavigate={onNavigate} />}

      <Stack direction="row" spacing={1.5} sx={{ mt: "auto", pt: 3, px: 1.5, "& a": { color: "text.secondary", fontSize: 12, textDecoration: "none", "&:hover": { color: "text.primary" } } }}>
        <Link to="/privacy" onClick={onNavigate}>
          Privacy
        </Link>
        <a href={GITHUB_URL} target="_blank" rel="noreferrer">
          GitHub
        </a>
        <Typography component="span" sx={{ fontSize: 12, color: "text.secondary" }}>
          © {new Date().getFullYear()} Crema
        </Typography>
      </Stack>
    </Box>
  );
}

export default Sidebar;
