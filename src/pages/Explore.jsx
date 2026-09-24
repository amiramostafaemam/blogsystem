import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Fab,
  IconButton,
  InputBase,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useInfinitePosts } from "../hooks/useInfinitePosts";
import { getPopularTags } from "../api/posts";
import PostGrid, { PostGridSkeleton } from "../components/PostGrid";
import LoadMoreSentinel from "../components/LoadMoreSentinel";
import PageMeta from "../components/PageMeta";
import EmptyState from "../components/EmptyState";
import BlurText from "../components/reactbits/BlurText";
import { LogoMark } from "../components/Logo";

// Banner with the animated title, a roomy search field and a rail of topics
function ExploreHeader({ heading, subtitle, input, onInput, tag, onTag, tags }) {
  return (
    <Box
      sx={(theme) => ({
        position: "relative",
        overflow: "hidden",
        borderRadius: "28px",
        border: 1,
        borderColor: "divider",
        p: { xs: 3, md: 5 },
        mb: 4,
        background: `radial-gradient(700px circle at 100% 0%, ${alpha(theme.palette.primary.main, theme.palette.mode === "dark" ? 0.18 : 0.14)}, transparent 60%), ${theme.palette.background.paper}`,
      })}
    >
      <Box
        aria-hidden="true"
        sx={{ position: "absolute", right: { xs: -90, md: -40 }, top: { xs: -90, md: -60 }, opacity: 0.08, "& svg": { width: { xs: 220, md: 300 }, height: "auto" } }}
      >
        <LogoMark size={300} />
      </Box>

      <Box sx={{ position: "relative" }}>
        <Typography sx={{ color: "primary.main", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", fontSize: 12, mb: 1.5 }}>
          The Crema journal
        </Typography>
        <BlurText
          key={heading}
          as="h1"
          text={heading}
          delay={90}
          stepDuration={0.3}
          style={{
            margin: 0,
            fontFamily: '"Playfair Display", serif',
            fontWeight: 700,
            fontSize: "clamp(2rem, 4.5vw, 3.25rem)",
            lineHeight: 1.1,
            letterSpacing: "-0.01em",
          }}
        />
        <Typography color="text.secondary" sx={{ mt: 1.5, mb: 3, maxWidth: 520 }}>
          {subtitle}
        </Typography>

        <Box
          component="label"
          sx={(theme) => ({
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            maxWidth: 560,
            px: 2,
            py: 1,
            borderRadius: 99,
            bgcolor: "background.default",
            border: 1,
            borderColor: "divider",
            transition: "border-color .2s, box-shadow .2s",
            "&:focus-within": { borderColor: "primary.main", boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.15)}` },
          })}
        >
          <SearchIcon sx={{ color: "text.secondary" }} />
          <InputBase
            value={input}
            onChange={(e) => onInput(e.target.value)}
            placeholder="Search stories, ideas, people…"
            inputProps={{ "aria-label": "Search stories" }}
            sx={{ flexGrow: 1, fontSize: 16 }}
          />
          {input && (
            <IconButton size="small" onClick={() => onInput("")} aria-label="Clear search">
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </Box>

        {tags.length > 0 && (
          <Stack direction="row" spacing={1} sx={{ mt: 2.5, overflowX: "auto", pb: 0.5, mx: -0.5, px: 0.5 }}>
            {["", ...tags].map((t) => {
              const active = t === tag;
              return (
                <Chip
                  key={t || "all"}
                  label={t ? `#${t}` : "All"}
                  onClick={() => onTag(t)}
                  variant={active ? "filled" : "outlined"}
                  color={active ? "primary" : "default"}
                  sx={{ borderRadius: 99, fontWeight: 600, flexShrink: 0, borderColor: "divider" }}
                />
              );
            })}
          </Stack>
        )}
      </Box>
    </Box>
  );
}

function Explore() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("q") ?? "";
  const tag = searchParams.get("tag") ?? "";
  const [input, setInput] = useState(search);
  const [tags, setTags] = useState([]);
  const lastPushed = useRef(search);

  useEffect(() => {
    getPopularTags(10)
      .then((rows) => setTags(rows.map((r) => r.tag)))
      .catch(() => {});
  }, []);

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

  const selectTag = (value) => {
    const next = new URLSearchParams(searchParams);
    if (value && value !== tag) next.set("tag", value);
    else next.delete("tag");
    setSearchParams(next);
  };

  const heading = tag ? `#${tag}` : search ? `Results for “${search}”` : "Explore stories";
  const subtitle = tag
    ? "Every story brewed under this topic."
    : search
      ? "Stories whose title or words match your search."
      : "Fresh stories from the community, best enjoyed with a fresh cup.";
  const firstLoad = status === "loading" && posts.length === 0;

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto" }}>
      <PageMeta title={tag ? `#${tag}` : "Explore"} />

      <ExploreHeader
        heading={heading}
        subtitle={subtitle}
        input={input}
        onInput={setInput}
        tag={tag}
        onTag={selectTag}
        tags={tags}
      />

      {firstLoad && <PostGridSkeleton count={6} />}

      {status === "ready" && posts.length === 0 && (
        <EmptyState
          title={search || tag ? "No stories match" : "Nothing brewing yet"}
          message={search || tag ? "Try a different keyword or topic." : "Be the first to share a story with the community."}
          action={
            user && !search && !tag ? (
              <Button component={Link} to="/write" variant="contained" startIcon={<AddIcon />} sx={{ borderRadius: 99 }}>
                Write a story
              </Button>
            ) : search || tag ? (
              <Button onClick={() => { setInput(""); setSearchParams({}); }} sx={{ borderRadius: 99 }}>
                Clear filters
              </Button>
            ) : null
          }
        />
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
          You've reached the bottom of the cup.
        </Typography>
      )}

      {user && (
        <Fab
          color="primary"
          component={Link}
          to="/write"
          aria-label="Write a story"
          sx={{ position: "fixed", bottom: 24, right: 24, display: { sm: "none" } }}
        >
          <AddIcon />
        </Fab>
      )}
    </Box>
  );
}

export default Explore;
