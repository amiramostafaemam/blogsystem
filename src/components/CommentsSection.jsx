import { useEffect, useState } from "react";
import { Avatar, Box, Button, IconButton, Link as MuiLink, Stack, TextField, Tooltip, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import { Link, useLocation } from "react-router-dom";
import { addComment, deleteComment, getComment, listComments, subscribeToComments } from "../api/social";
import { useAuth } from "../context/AuthContext";
import { useNotify } from "../context/NotifyContext";
import ConfirmDialog from "./ConfirmDialog";
import { timeAgo } from "../utils";

const MAX_LENGTH = 2000;

function addUnique(list, comment) {
  return list.some((c) => c.id === comment.id) ? list : [...list, comment];
}

function CommentsSection({ postId, postOwnerId, onCountChange }) {
  const { user } = useAuth();
  const notify = useNotify();
  const location = useLocation();
  const [comments, setComments] = useState(null);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  useEffect(() => {
    let ignore = false;
    listComments(postId)
      .then((data) => !ignore && setComments(data))
      .catch(() => !ignore && setComments([]));

    // Live updates when someone else comments
    const unsubscribe = subscribeToComments(postId, async (commentId) => {
      try {
        const comment = await getComment(commentId);
        if (!ignore) setComments((prev) => addUnique(prev ?? [], comment));
      } catch {
        // comment was deleted before we fetched it
      }
    });

    return () => {
      ignore = true;
      unsubscribe();
    };
  }, [postId]);

  useEffect(() => {
    if (comments) onCountChange?.(comments.length);
  }, [comments, onCountChange]);

  const submit = async (e) => {
    e.preventDefault();
    const text = body.trim();
    if (!text) return;
    setSending(true);
    try {
      const comment = await addComment(postId, text);
      setComments((prev) => addUnique(prev ?? [], comment));
      setBody("");
    } catch (err) {
      notify(err.message || "Couldn't post your comment", "error");
    } finally {
      setSending(false);
    }
  };

  const confirmDelete = async () => {
    const comment = toDelete;
    setToDelete(null);
    try {
      await deleteComment(comment.id);
      setComments((prev) => prev.filter((c) => c.id !== comment.id));
      notify("Comment deleted");
    } catch (err) {
      notify(err.message || "Couldn't delete the comment", "error");
    }
  };

  return (
    <Box component="section" id="comments" sx={{ scrollMarginTop: 90 }}>
      <Typography variant="h5" component="h2" mb={3}>
        Responses {comments ? `(${comments.length})` : ""}
      </Typography>

      {user ? (
        <Box component="form" onSubmit={submit} sx={{ mb: 4 }}>
          <Stack direction="row" spacing={1.5} alignItems="flex-start">
            <Avatar src={user.avatar_url} alt={user.name} sx={{ width: 38, height: 38 }}>
              {user.name?.[0]?.toUpperCase()}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <TextField
                value={body}
                onChange={(e) => setBody(e.target.value.slice(0, MAX_LENGTH))}
                onKeyDown={(e) => (e.ctrlKey || e.metaKey) && e.key === "Enter" && submit(e)}
                placeholder="What are your thoughts?"
                multiline
                minRows={2}
                fullWidth
                slotProps={{ htmlInput: { "aria-label": "Write a comment" } }}
              />
              <Stack direction="row" justifyContent="space-between" alignItems="center" mt={1}>
                <Typography variant="caption" color="text.secondary">
                  {body.length > 0 && `${body.length}/${MAX_LENGTH} · Ctrl+Enter to send`}
                </Typography>
                <Button type="submit" variant="contained" disabled={sending || !body.trim()}>
                  {sending ? "Posting…" : "Respond"}
                </Button>
              </Stack>
            </Box>
          </Stack>
        </Box>
      ) : (
        <Box sx={{ p: 3, mb: 4, borderRadius: 3, border: 1, borderColor: "divider", textAlign: "center" }}>
          <Typography mb={1.5}>Join the conversation</Typography>
          <Button component={Link} to="/login" state={{ from: location }} variant="contained">
            Log in to respond
          </Button>
        </Box>
      )}

      {comments?.length === 0 && (
        <Typography color="text.secondary">No responses yet. Be the first to share your thoughts.</Typography>
      )}

      <Stack spacing={3}>
        {comments?.map((comment) => {
          const canDelete = user && (user.id === comment.user_id || user.id === postOwnerId);
          return (
            <Stack key={comment.id} direction="row" spacing={1.5} alignItems="flex-start">
              <Avatar
                component={Link}
                to={`/u/${comment.author?.id}`}
                src={comment.author?.avatar_url}
                alt={comment.author?.name}
                sx={{ width: 38, height: 38, textDecoration: "none" }}
              >
                {comment.author?.name?.[0]?.toUpperCase()}
              </Avatar>
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Stack direction="row" spacing={1} alignItems="baseline">
                  <MuiLink component={Link} to={`/u/${comment.author?.id}`} color="text.primary" underline="hover" fontWeight={700}>
                    {comment.author?.name}
                  </MuiLink>
                  {comment.user_id === postOwnerId && (
                    <Typography variant="caption" sx={{ color: "primary.main", fontWeight: 700 }}>
                      Author
                    </Typography>
                  )}
                  <Typography variant="caption" color="text.secondary">
                    {timeAgo(comment.created_at)}
                  </Typography>
                </Stack>
                <Typography sx={{ whiteSpace: "pre-line", wordBreak: "break-word", mt: 0.5, lineHeight: 1.7 }}>
                  {comment.body}
                </Typography>
              </Box>
              {canDelete && (
                <Tooltip title="Delete">
                  <IconButton size="small" onClick={() => setToDelete(comment)} aria-label="Delete comment">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
          );
        })}
      </Stack>

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete this response?"
        message="This can't be undone."
        onConfirm={confirmDelete}
        onClose={() => setToDelete(null)}
      />
    </Box>
  );
}

export default CommentsSection;
