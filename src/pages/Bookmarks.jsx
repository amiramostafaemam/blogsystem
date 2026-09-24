import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import { listBookmarkedPosts } from "../api/social";
import { useAuth } from "../context/AuthContext";
import { useNotify } from "../context/NotifyContext";
import PostGrid, { PostGridSkeleton } from "../components/PostGrid";
import PageMeta from "../components/PageMeta";
import EmptyState from "../components/EmptyState";

function Bookmarks() {
  const { user } = useAuth();
  const notify = useNotify();
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    let ignore = false;
    listBookmarkedPosts(user.id)
      .then((data) => !ignore && setPosts(data))
      .catch(() => {
        if (ignore) return;
        setPosts([]);
        notify("Couldn't load your bookmarks", "error");
      });
    return () => {
      ignore = true;
    };
  }, [user.id, notify]);

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto" }}>
      <PageMeta title="Bookmarks" />
      <Typography variant="h3" component="h1" sx={{ fontSize: { xs: "2rem", md: "2.5rem" } }}>
        Saved for later
      </Typography>
      <Typography color="text.secondary" mb={4}>
        Stories you bookmarked. Only you can see this list.
      </Typography>

      {!posts && <PostGridSkeleton count={2} />}
      {posts?.length === 0 && (
        <EmptyState
          title="No bookmarks yet"
          message="Tap the bookmark icon on any story to save it here."
          action={
            <Button component={Link} to="/explore" variant="contained" sx={{ borderRadius: 99 }}>
              Find something to read
            </Button>
          }
        />
      )}
      {posts?.length > 0 && <PostGrid posts={posts} />}
    </Box>
  );
}

export default Bookmarks;
