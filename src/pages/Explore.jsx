import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Fab,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useInfinitePosts } from "../hooks/useInfinitePosts";
import PostGrid, { PostGridSkeleton } from "../components/PostGrid";
import LoadMoreSentinel from "../components/LoadMoreSentinel";
import PageMeta from "../components/PageMeta";

function Explore() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("q") ?? "";
  const tag = searchParams.get("tag") ?? "";
  const [input, setInput] = useState(search);
  const lastPushed = useRef(search);

  // Follow the URL when it changes from elsewhere (sidebar, back button)
  useEffect(() => {
    if (search !== lastPushed.current) {
      lastPushed.current = search;
      setInput(search);
    }
  }, [search]);

  // Debounce typing so we don't query on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      if (input.trim() === search) return;
      lastPushed.current = input.trim();
      const next = new URLSearchParams(searchParams);
      if (input.trim()) next.set("q", input.trim());
      else next.delete("q");
      setSearchParams(next, { replace: true });
    }, 350);
    return () => clearTimeout(timer);
  }, [input, search, searchParams, setSearchParams]);

  const { posts, status, hasMore, loadMore, retry } = useInfinitePosts({ search, tag });

  const clearTag = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("tag");
    setSearchParams(next);
  };

  const heading = tag ? `#${tag}` : search ? `Results for “${search}”` : "Explore stories";
  const firstLoad = status === "loading" && posts.length === 0;

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto" }}>
      <PageMeta title={tag ? `#${tag}` : "Explore"} />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" sx={{ fontSize: { xs: "2rem", md: "2.75rem" } }}>
          {heading}
        </Typography>
        <Typography color="text.secondary" mt={1}>
          {tag
            ? "Stories tagged with this topic."
            : "Fresh stories from the community, best enjoyed with a fresh cup."}
        </Typography>
      </Box>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={4} alignItems={{ sm: "center" }}>
        <TextField
          placeholder="Search stories…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          fullWidth
          size="small"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            },
            htmlInput: { "aria-label": "Search stories" },
          }}
          sx={{ bgcolor: "background.paper", borderRadius: 1 }}
        />
        {tag && <Chip label={`#${tag}`} onDelete={clearTag} color="primary" />}
      </Stack>

      {firstLoad && <PostGridSkeleton count={6} />}

      {status === "ready" && posts.length === 0 && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography fontSize={48}>☕</Typography>
          <Typography variant="h6" gutterBottom>
            {search || tag ? "No stories match" : "Nothing here yet"}
          </Typography>
          <Typography color="text.secondary" mb={3}>
            {search || tag ? "Try a different keyword or tag." : "Be the first to share a story."}
          </Typography>
          {user && !search && !tag && (
            <Button component={Link} to="/write" variant="contained" startIcon={<AddIcon />}>
              Write a story
            </Button>
          )}
        </Box>
      )}

      {posts.length > 0 && <PostGrid posts={posts} />}

      {status === "error" && (
        <Alert severity="error" sx={{ mt: 3 }} action={<Button color="inherit" onClick={retry}>Retry</Button>}>
          Couldn't load stories. Check your connection and try again.
        </Alert>
      )}

      {status === "loading" && posts.length > 0 && (
        <Box sx={{ display: "grid", placeItems: "center", py: 4 }}>
          <CircularProgress size={28} />
        </Box>
      )}
      {status === "ready" && hasMore && posts.length > 0 && <LoadMoreSentinel onVisible={loadMore} />}
      {status === "ready" && !hasMore && posts.length > 6 && (
        <Typography textAlign="center" color="text.secondary" sx={{ py: 5 }}>
          You've reached the bottom of the cup ☕
        </Typography>
      )}

      {user && (
        <Fab
          color="primary"
          component={Link}
          to="/write"
          aria-label="Write a story"
          sx={{ position: "fixed", bottom: 24, right: 24, display: { md: "none" } }}
        >
          <AddIcon />
        </Fab>
      )}
    </Box>
  );
}

export default Explore;
