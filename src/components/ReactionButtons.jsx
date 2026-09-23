import { useState } from "react";
import { Button, IconButton, Tooltip } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { keyframes } from "@emotion/react";
import { useAuth } from "../context/AuthContext";
import { useNotify } from "../context/NotifyContext";
import { useRequireAuth } from "../hooks/useRequireAuth";
import { bookmarkPost, likePost, removeBookmark, unlikePost } from "../api/social";

const pop = keyframes`
  0% { transform: scale(1); }
  40% { transform: scale(1.35); }
  100% { transform: scale(1); }
`;

// Optimistic: the UI flips immediately and rolls back if the request fails
export function LikeButton({ postId, initialLiked = false, initialCount = 0, size = "small" }) {
  const { user } = useAuth();
  const notify = useNotify();
  const requireAuth = useRequireAuth();
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [busy, setBusy] = useState(false);

  const toggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (busy || !requireAuth("like stories")) return;

    const next = !liked;
    setLiked(next);
    setCount((c) => c + (next ? 1 : -1));
    setBusy(true);
    try {
      if (next) await likePost(postId);
      else await unlikePost(postId, user.id);
    } catch {
      setLiked(!next);
      setCount((c) => c + (next ? -1 : 1));
      notify("Couldn't update your like", "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Button
      size={size}
      onClick={toggle}
      aria-pressed={liked}
      aria-label={liked ? "Unlike" : "Like"}
      startIcon={
        liked ? (
          <FavoriteIcon sx={{ animation: `${pop} .35s ease` }} />
        ) : (
          <FavoriteBorderIcon />
        )
      }
      sx={{
        minWidth: 0,
        px: 1,
        color: liked ? "primary.main" : "text.secondary",
        "&:hover": { color: "primary.main" },
      }}
    >
      {count}
    </Button>
  );
}

export function BookmarkButton({ postId, initialSaved = false, size = "small" }) {
  const { user } = useAuth();
  const notify = useNotify();
  const requireAuth = useRequireAuth();
  const [saved, setSaved] = useState(initialSaved);
  const [busy, setBusy] = useState(false);

  const toggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (busy || !requireAuth("save stories")) return;

    const next = !saved;
    setSaved(next);
    setBusy(true);
    try {
      if (next) await bookmarkPost(postId);
      else await removeBookmark(postId, user.id);
      notify(next ? "Saved to your bookmarks" : "Removed from bookmarks");
    } catch {
      setSaved(!next);
      notify("Couldn't update your bookmarks", "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Tooltip title={saved ? "Remove bookmark" : "Save for later"}>
      <IconButton
        size={size}
        onClick={toggle}
        aria-pressed={saved}
        aria-label={saved ? "Remove bookmark" : "Save for later"}
        sx={{ color: saved ? "primary.main" : "text.secondary" }}
      >
        {saved ? <BookmarkIcon fontSize="small" /> : <BookmarkBorderIcon fontSize="small" />}
      </IconButton>
    </Tooltip>
  );
}
