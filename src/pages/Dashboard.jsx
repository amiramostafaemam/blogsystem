import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Chip,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { deletePost, listMyPosts } from "../api/posts";
import { useAuth } from "../context/AuthContext";
import { useNotify } from "../context/NotifyContext";
import ConfirmDialog from "../components/ConfirmDialog";
import PageMeta from "../components/PageMeta";
import { formatDate, readingTime } from "../utils";

function StatCard({ label, value }) {
  return (
    <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 4 }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: "2rem", lineHeight: 1.2 }}>
        {value}
      </Typography>
    </Paper>
  );
}

function PostRow({ post, onDelete }) {
  const isDraft = post.status === "draft";
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 1.5,
        borderRadius: 3,
        display: "grid",
        gridTemplateColumns: { xs: "72px 1fr", sm: "120px 1fr auto" },
        gap: 2,
        alignItems: "center",
      }}
    >
      <Box
        component={Link}
        to={`/posts/${post.id}`}
        sx={{
          aspectRatio: "4 / 3",
          borderRadius: 2,
          overflow: "hidden",
          bgcolor: "action.hover",
          display: "grid",
          placeItems: "center",
          textDecoration: "none",
        }}
      >
        {post.image ? (
          <Box component="img" src={post.image} alt="" loading="lazy" sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <Typography fontSize={24}>☕</Typography>
        )}
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
          <Chip size="small" label={isDraft ? "Draft" : "Published"} color={isDraft ? "default" : "success"} variant="outlined" />
          <Typography variant="caption" color="text.secondary" noWrap>
            {formatDate(post.updated_at ?? post.created_at)} · {readingTime(post.content)}
          </Typography>
        </Stack>
        <Typography
          component={Link}
          to={isDraft ? `/edit/${post.id}` : `/posts/${post.id}`}
          sx={{ fontWeight: 700, color: "text.primary", textDecoration: "none", "&:hover": { color: "primary.main" }, display: "block" }}
          noWrap
        >
          {post.title}
        </Typography>
        {!isDraft && (
          <Stack direction="row" spacing={2} mt={0.5} sx={{ color: "text.secondary" }}>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <FavoriteBorderIcon sx={{ fontSize: 16 }} />
              <Typography variant="caption">{post.likeCount}</Typography>
            </Stack>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <ChatBubbleOutlineIcon sx={{ fontSize: 16 }} />
              <Typography variant="caption">{post.commentCount}</Typography>
            </Stack>
          </Stack>
        )}
      </Box>

      <Stack direction="row" sx={{ gridColumn: { xs: "1 / -1", sm: "auto" }, justifyContent: "flex-end" }}>
        <Tooltip title="Edit">
          <IconButton component={Link} to={`/edit/${post.id}`} aria-label={`Edit ${post.title}`}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton onClick={() => onDelete(post)} aria-label={`Delete ${post.title}`}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Stack>
    </Paper>
  );
}

function Dashboard() {
  const { user } = useAuth();
  const notify = useNotify();
  const [posts, setPosts] = useState(null);
  const [tab, setTab] = useState("all");
  const [toDelete, setToDelete] = useState(null);

  useEffect(() => {
    let ignore = false;
    listMyPosts(user.id)
      .then((data) => !ignore && setPosts(data))
      .catch(() => {
        if (ignore) return;
        setPosts([]);
        notify("Couldn't load your stories", "error");
      });
    return () => {
      ignore = true;
    };
  }, [user.id, notify]);

  const stats = useMemo(() => {
    const list = posts ?? [];
    const published = list.filter((p) => p.status === "published");
    return {
      published: published.length,
      drafts: list.length - published.length,
      likes: published.reduce((s, p) => s + p.likeCount, 0),
      comments: published.reduce((s, p) => s + p.commentCount, 0),
    };
  }, [posts]);

  const visible = (posts ?? []).filter((p) => tab === "all" || p.status === tab);

  const confirmDelete = async () => {
    const post = toDelete;
    setToDelete(null);
    try {
      await deletePost(post.id);
      setPosts((prev) => prev.filter((p) => p.id !== post.id));
      notify("Story deleted");
    } catch (err) {
      notify(err.message || "Couldn't delete the story", "error");
    }
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto" }}>
      <PageMeta title="My posts" />

      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4} spacing={2}>
        <Box>
          <Typography variant="h3" component="h1" sx={{ fontSize: { xs: "2rem", md: "2.5rem" } }}>
            Your stories
          </Typography>
          <Typography color="text.secondary">Drafts, published stories and how they're doing.</Typography>
        </Box>
        <Button component={Link} to="/write" variant="contained" startIcon={<AddIcon />} sx={{ flexShrink: 0 }}>
          New story
        </Button>
      </Stack>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }, gap: 2, mb: 4 }}>
        <StatCard label="Published" value={posts ? stats.published : "–"} />
        <StatCard label="Drafts" value={posts ? stats.drafts : "–"} />
        <StatCard label="Likes" value={posts ? stats.likes : "–"} />
        <StatCard label="Responses" value={posts ? stats.comments : "–"} />
      </Box>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3, borderBottom: 1, borderColor: "divider" }}>
        <Tab value="all" label={`All (${posts?.length ?? 0})`} />
        <Tab value="published" label={`Published (${stats.published})`} />
        <Tab value="draft" label={`Drafts (${stats.drafts})`} />
      </Tabs>

      {!posts && (
        <Stack spacing={1.5}>
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} variant="rounded" height={96} />
          ))}
        </Stack>
      )}

      {posts && visible.length === 0 && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography fontSize={40}>✍️</Typography>
          <Typography color="text.secondary" mb={2}>
            {tab === "draft" ? "No drafts. Every story starts as one!" : "Nothing here yet."}
          </Typography>
          <Button component={Link} to="/write" variant="outlined">
            Start writing
          </Button>
        </Box>
      )}

      <Stack spacing={1.5}>
        {visible.map((post) => (
          <PostRow key={post.id} post={post} onDelete={setToDelete} />
        ))}
      </Stack>

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete this story?"
        message={`"${toDelete?.title ?? ""}" and all its responses will be removed permanently.`}
        onConfirm={confirmDelete}
        onClose={() => setToDelete(null)}
      />
    </Box>
  );
}

export default Dashboard;
