import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  Link as MuiLink,
  Paper,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import LinkIcon from "@mui/icons-material/Link";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { deletePost, getPost, listPosts } from "../api/posts";
import { getProfile } from "../api/profiles";
import { recordView } from "../api/stats";
import { useAuth } from "../context/AuthContext";
import { useNotify } from "../context/NotifyContext";
import { usePostReactions } from "../hooks/usePostReactions";
import ConfirmDialog from "../components/ConfirmDialog";
import PostGrid from "../components/PostGrid";
import Markdown from "../components/Markdown";
import CommentsSection from "../components/CommentsSection";
import ReadingProgress from "../components/ReadingProgress";
import PageMeta from "../components/PageMeta";
import { LikeButton, BookmarkButton } from "../components/ReactionButtons";
import { excerpt, formatDate, readingTime } from "../utils";

// One view per story per browser tab session; the server also ignores the author
function countViewOnce(post) {
  if (post.status !== "published") return;
  const key = `crema:viewed:${post.id}`;
  try {
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
  } catch {
    // storage blocked: still count, the server rate-limits signed-in readers
  }
  recordView(post.id);
}

// Same tag first, then the author's other stories, then the latest
async function loadRelated(post) {
  const [byTag, byAuthor, latest] = await Promise.all([
    post.tags?.[0] ? listPosts({ tag: post.tags[0], pageSize: 6 }) : [],
    listPosts({ authorId: post.user_id, pageSize: 6 }),
    listPosts({ pageSize: 6 }),
  ]);
  const seen = new Set([post.id]);
  return [...byTag, ...byAuthor, ...latest]
    .filter((p) => !seen.has(p.id) && seen.add(p.id))
    .slice(0, 4);
}

function PostPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const notify = useNotify();
  const navigate = useNavigate();
  const { hash } = useLocation();
  const [post, setPost] = useState(null);
  const [authorBio, setAuthorBio] = useState("");
  const [status, setStatus] = useState("loading"); // loading | ready | missing
  const [related, setRelated] = useState([]);
  const [commentCount, setCommentCount] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const reactions = usePostReactions(post ? [post] : []);

  useEffect(() => {
    let ignore = false;
    setStatus("loading");
    if (!window.location.hash) window.scrollTo(0, 0);

    getPost(id)
      .then((data) => {
        if (ignore) return;
        setPost(data);
        setCommentCount(data.commentCount);
        setStatus("ready");
        countViewOnce(data);
        getProfile(data.user_id).then((p) => !ignore && setAuthorBio(p.bio ?? "")).catch(() => {});
        loadRelated(data).then((r) => !ignore && setRelated(r)).catch(() => {});
      })
      .catch(() => !ignore && setStatus("missing"));

    return () => {
      ignore = true;
    };
  }, [id]);

  // Jump to #comments once the content is on the page
  useEffect(() => {
    if (status === "ready" && hash) {
      document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
    }
  }, [status, hash]);

  const isOwner = user != null && post?.user_id === user.id;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/posts/${id}`);
      notify("Link copied to clipboard");
    } catch {
      notify("Couldn't copy the link", "error");
    }
  };

  const handleDelete = async () => {
    setConfirmOpen(false);
    try {
      await deletePost(post.id);
      notify("Story deleted");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      notify(err.message || "Couldn't delete the story", "error");
    }
  };

  if (status === "missing") {
    return (
      <Box sx={{ textAlign: "center", py: 10 }}>
        <PageMeta title="Story not found" />
        <Typography variant="h4" component="h1" gutterBottom>
          This story has gone cold
        </Typography>
        <Typography color="text.secondary" mb={4}>
          It may have been deleted, unpublished, or the link is wrong.
        </Typography>
        <Button component={Link} to="/explore" variant="contained">
          Browse stories
        </Button>
      </Box>
    );
  }

  const actions = post && (
    <Stack direction="row" alignItems="center" spacing={0.5}>
      <LikeButton
        key={`like-${reactions.liked.has(post.id)}`}
        postId={post.id}
        initialLiked={reactions.liked.has(post.id)}
        initialCount={post.likeCount}
        size="medium"
      />
      <Button
        onClick={() => document.getElementById("comments")?.scrollIntoView({ behavior: "smooth" })}
        startIcon={<ChatBubbleOutlineIcon />}
        sx={{ color: "text.secondary", minWidth: 0, px: 1 }}
        aria-label={`${commentCount} comments`}
      >
        {commentCount}
      </Button>
      <Box sx={{ flexGrow: 1 }} />
      <BookmarkButton
        key={`bm-${reactions.bookmarked.has(post.id)}`}
        postId={post.id}
        initialSaved={reactions.bookmarked.has(post.id)}
        size="medium"
      />
      <Tooltip title="Copy link">
        <IconButton onClick={copyLink} aria-label="Copy link">
          <LinkIcon />
        </IconButton>
      </Tooltip>
      {isOwner && (
        <>
          <Tooltip title="Edit">
            <IconButton component={Link} to={`/edit/${post.id}`} aria-label="Edit story">
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={() => setConfirmOpen(true)} aria-label="Delete story">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </>
      )}
    </Stack>
  );

  return (
    <Box>
      <ReadingProgress />
      {post && <PageMeta title={post.title} description={excerpt(post.content, 155)} />}

      <Box component="article" sx={{ maxWidth: 740, mx: "auto" }}>
        <Button component={Link} to="/explore" startIcon={<ArrowBackIcon />} sx={{ mb: 3, ml: -1 }}>
          All stories
        </Button>

        {status === "loading" ? (
          <>
            <Skeleton variant="text" sx={{ fontSize: "3rem" }} />
            <Skeleton variant="text" width="60%" sx={{ fontSize: "3rem", mb: 3 }} />
            <Skeleton variant="rounded" sx={{ aspectRatio: "16 / 9", height: "auto", mb: 4 }} />
            <Skeleton />
            <Skeleton />
            <Skeleton width="80%" />
          </>
        ) : (
          <>
            {post.status === "draft" && (
              <Alert severity="info" sx={{ mb: 3 }} action={<Button component={Link} to={`/edit/${post.id}`} color="inherit">Edit</Button>}>
                This is a draft. Only you can see it.
              </Alert>
            )}

            {post.tags?.length > 0 && (
              <Stack direction="row" spacing={1} mb={2} sx={{ flexWrap: "wrap", rowGap: 1 }}>
                {post.tags.map((tag) => (
                  <Chip key={tag} label={`#${tag}`} size="small" component={Link} to={`/explore?tag=${encodeURIComponent(tag)}`} clickable />
                ))}
              </Stack>
            )}

            <Typography variant="h1" sx={{ fontSize: { xs: "2.2rem", md: "3.2rem" }, lineHeight: 1.12, letterSpacing: "-0.01em", mb: 3 }}>
              {post.title}
            </Typography>

            <Stack direction="row" alignItems="center" spacing={1.5} mb={2}>
              <Avatar
                component={Link}
                to={`/u/${post.author?.id}`}
                src={post.author?.avatar_url}
                alt={post.author?.name}
                sx={{ width: 46, height: 46, textDecoration: "none" }}
              >
                {post.author?.name?.[0]?.toUpperCase()}
              </Avatar>
              <Box sx={{ minWidth: 0 }}>
                <MuiLink component={Link} to={`/u/${post.author?.id}`} color="text.primary" underline="hover" fontWeight={700}>
                  {post.author?.name || "Anonymous"}
                </MuiLink>
                <Typography variant="body2" color="text.secondary">
                  {formatDate(post.created_at)} · {readingTime(post.content)}
                  {post.updated_at && " · edited"}
                </Typography>
              </Box>
            </Stack>

            <Box sx={{ py: 0.5, mb: 4, borderTop: 1, borderBottom: 1, borderColor: "divider" }}>{actions}</Box>

            {post.image && (
              <Box
                component="img"
                src={post.image}
                alt=""
                sx={{ width: "100%", aspectRatio: "16 / 9", objectFit: "cover", borderRadius: "16px", mb: 5, display: "block" }}
              />
            )}

            <Markdown dropCap>{post.content}</Markdown>

            <Box sx={{ py: 0.5, mt: 5, mb: 5, borderTop: 1, borderBottom: 1, borderColor: "divider" }}>{actions}</Box>

            <Paper variant="outlined" sx={{ p: 3, mb: 6, borderRadius: "16px" }}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "center" }}>
                <Avatar src={post.author?.avatar_url} alt={post.author?.name} sx={{ width: 64, height: 64 }}>
                  {post.author?.name?.[0]?.toUpperCase()}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="overline" color="text.secondary">
                    Written by
                  </Typography>
                  <Typography variant="h6">{post.author?.name}</Typography>
                  {authorBio && (
                    <Typography color="text.secondary" variant="body2" mt={0.5}>
                      {authorBio}
                    </Typography>
                  )}
                </Box>
                <Button component={Link} to={`/u/${post.author?.id}`} variant="outlined">
                  View profile
                </Button>
              </Stack>
            </Paper>

            {post.status === "published" && (
              <CommentsSection postId={post.id} postOwnerId={post.user_id} onCountChange={setCommentCount} />
            )}
          </>
        )}
      </Box>

      {related.length > 0 && (
        <Box sx={{ maxWidth: 1200, mx: "auto", mt: 10 }}>
          <Divider sx={{ mb: 6 }} />
          <Typography variant="h4" component="h2" mb={4}>
            Keep reading
          </Typography>
          <PostGrid posts={related} />
        </Box>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title="Delete this story?"
        message={`"${post?.title ?? ""}" and all its responses will be removed permanently.`}
        onConfirm={handleDelete}
        onClose={() => setConfirmOpen(false)}
      />
    </Box>
  );
}

export default PostPage;
