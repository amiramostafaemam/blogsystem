import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Badge,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import { useAuth } from "../context/AuthContext";
import {
  countUnread,
  getNotification,
  listNotifications,
  markAllRead,
  markRead,
  subscribeToNotifications,
} from "../api/notifications";
import { timeAgo } from "../utils";

function NotificationText({ n }) {
  const who = <strong>{n.actor?.name ?? "Someone"}</strong>;
  const what = <strong>{n.post?.title ?? "your story"}</strong>;
  return n.type === "like" ? (
    <>
      {who} liked {what}
    </>
  ) : (
    <>
      {who} responded to {what}
    </>
  );
}

function NotificationBell() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [items, setItems] = useState(null);
  const [unread, setUnread] = useState(0);

  const refreshUnread = useCallback(() => {
    countUnread().then(setUnread).catch(() => {});
  }, []);

  // Unread badge + live updates
  useEffect(() => {
    refreshUnread();
    const unsubscribe = subscribeToNotifications(user.id, async (id) => {
      setUnread((n) => n + 1);
      try {
        const fresh = await getNotification(id);
        if (fresh) setItems((prev) => (prev ? [fresh, ...prev.filter((x) => x.id !== id)] : prev));
      } catch {
        // the list refetches next time it opens
      }
    });
    return unsubscribe;
  }, [user.id, refreshUnread]);

  const open = async (e) => {
    setAnchorEl(e.currentTarget);
    try {
      setItems(await listNotifications(20));
    } catch {
      setItems([]);
    }
  };

  const close = () => setAnchorEl(null);

  const openItem = async (n) => {
    close();
    if (!n.read_at) {
      setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, read_at: new Date().toISOString() } : x)));
      setUnread((c) => Math.max(0, c - 1));
      markRead([n.id]).catch(refreshUnread);
    }
    navigate(`/posts/${n.post_id}${n.type === "comment" ? "#comments" : ""}`);
  };

  const readAll = async () => {
    setItems((prev) => prev?.map((x) => ({ ...x, read_at: x.read_at ?? new Date().toISOString() })));
    setUnread(0);
    try {
      await markAllRead(user.id);
    } catch {
      refreshUnread();
    }
  };

  return (
    <>
      <Tooltip title="Notifications">
        <IconButton color="inherit" onClick={open} aria-label={`Notifications, ${unread} unread`}>
          <Badge badgeContent={unread} color="primary" max={99}>
            <NotificationsNoneIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={close}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { sx: { width: 360, maxWidth: "calc(100vw - 32px)", maxHeight: 480 } } }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2, py: 1 }}>
          <Typography fontWeight={700}>Notifications</Typography>
          <Button size="small" onClick={readAll} disabled={unread === 0}>
            Mark all as read
          </Button>
        </Stack>
        <Divider />

        {!items && (
          <Box sx={{ display: "grid", placeItems: "center", py: 4 }}>
            <CircularProgress size={24} />
          </Box>
        )}
        {items?.length === 0 && (
          <Typography color="text.secondary" sx={{ px: 2, py: 4, textAlign: "center" }}>
            No notifications yet. They'll show up when readers like or respond to your stories.
          </Typography>
        )}

        {items?.map((n) => (
          <MenuItem
            key={n.id}
            onClick={() => openItem(n)}
            sx={{ alignItems: "flex-start", gap: 1.5, py: 1.25, whiteSpace: "normal", bgcolor: n.read_at ? "transparent" : "action.hover" }}
          >
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              badgeContent={
                <Box
                  sx={{
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    bgcolor: "background.paper",
                    color: "primary.main",
                    "& svg": { fontSize: 12 },
                  }}
                >
                  {n.type === "like" ? <FavoriteIcon /> : <ChatBubbleIcon />}
                </Box>
              }
            >
              <Avatar src={n.actor?.avatar_url} alt={n.actor?.name} sx={{ width: 36, height: 36 }}>
                {n.actor?.name?.[0]?.toUpperCase()}
              </Avatar>
            </Badge>
            <Box sx={{ minWidth: 0, flexGrow: 1 }}>
              <Typography variant="body2" sx={{ lineHeight: 1.45 }}>
                <NotificationText n={n} />
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {timeAgo(n.created_at)}
              </Typography>
            </Box>
            {!n.read_at && (
              <Box aria-label="Unread" sx={{ width: 8, height: 8, mt: 1, borderRadius: "50%", bgcolor: "primary.main", flexShrink: 0 }} />
            )}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

export default NotificationBell;
