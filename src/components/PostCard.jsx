import { useState } from "react";
import { Avatar, Box, Link as MuiLink, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { Link } from "react-router-dom";
import { LikeButton, BookmarkButton } from "./ReactionButtons";
import SpotlightCard from "./reactbits/SpotlightCard";
import { excerpt, formatDate, readingTime } from "../utils";

function PostCard({ post, liked = false, bookmarked = false }) {
  const [imageFailed, setImageFailed] = useState(false);
  const { id, title, content = "", image, author, created_at: createdAt, tags = [] } = post;
  const hasImage = image && !imageFailed;

  return (
    <SpotlightCard
      component="article"
      spotlightColor="rgba(224, 122, 95, 0.22)"
      sx={(theme) => ({
        height: "100%",
        display: "flex",
        flexDirection: "column",
        p: 1.25,
        borderRadius: "20px",
        border: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
        transition: "transform .3s cubic-bezier(.2,.7,.2,1), box-shadow .3s, border-color .3s",
        "&:hover": {
          transform: "translateY(-4px)",
          borderColor: alpha(theme.palette.primary.main, 0.35),
          boxShadow: `0 22px 44px -24px ${alpha("#3E2723", theme.palette.mode === "dark" ? 0.9 : 0.45)}`,
        },
        "&:hover h2": { color: "primary.main" },
        "&:hover img": { transform: "scale(1.04)" },
        "&:focus-within": { outline: "2px solid", outlineColor: "primary.main", outlineOffset: 2 },
      })}
    >
      {hasImage && (
        <Box sx={{ borderRadius: "14px", overflow: "hidden", aspectRatio: "16 / 10", bgcolor: "action.hover" }}>
          <Box
            component="img"
            src={image}
            alt=""
            loading="lazy"
            onError={() => setImageFailed(true)}
            sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform .6s cubic-bezier(.2,.7,.2,1)" }}
          />
        </Box>
      )}

      <Box sx={{ px: 1.25, pt: 2, pb: 1.5, flexGrow: 1 }}>
        {tags.length > 0 && (
          <Typography
            sx={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "primary.main", mb: 1 }}
          >
            {tags.slice(0, 3).map((t) => `#${t}`).join("  ·  ")}
          </Typography>
        )}

        {/* The title link stretches over the whole card; buttons below sit above it */}
        <Box
          component={Link}
          to={`/posts/${id}`}
          sx={{
            color: "inherit",
            textDecoration: "none",
            "&::after": { content: '""', position: "absolute", inset: 0, zIndex: 1 },
            "&:focus-visible": { outline: "none" },
          }}
        >
          <Typography variant="h5" component="h2" sx={{ fontSize: "1.3rem", lineHeight: 1.3, mb: 1, transition: "color .2s" }}>
            {title}
          </Typography>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ lineHeight: 1.7, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", wordBreak: "break-word" }}
        >
          {excerpt(content, 220)}
        </Typography>
      </Box>

      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{ position: "relative", zIndex: 2, mx: 1.25, pt: 1.25, borderTop: 1, borderColor: "divider" }}
      >
        <Avatar
          component={Link}
          to={`/u/${author?.id}`}
          src={author?.avatar_url}
          alt={author?.name}
          sx={{ width: 30, height: 30, fontSize: 13, textDecoration: "none" }}
        >
          {author?.name?.[0]?.toUpperCase()}
        </Avatar>
        <Box sx={{ minWidth: 0, flexGrow: 1 }}>
          <MuiLink
            component={Link}
            to={`/u/${author?.id}`}
            variant="subtitle2"
            color="text.primary"
            underline="hover"
            fontWeight={700}
            noWrap
            sx={{ display: "block", lineHeight: 1.3 }}
          >
            {author?.name || "Anonymous"}
          </MuiLink>
          <Typography variant="caption" color="text.secondary" noWrap component="p">
            {formatDate(createdAt)} · {readingTime(content)}
          </Typography>
        </Box>

        <LikeButton key={`like-${liked}`} postId={id} initialLiked={liked} initialCount={post.likeCount} />
        <Stack
          direction="row"
          alignItems="center"
          spacing={0.5}
          component={Link}
          to={`/posts/${id}#comments`}
          aria-label={`${post.commentCount} comments`}
          sx={{ color: "text.secondary", textDecoration: "none", fontSize: 14, px: 0.5, "&:hover": { color: "primary.main" } }}
        >
          <ChatBubbleOutlineIcon sx={{ fontSize: 18 }} />
          <span>{post.commentCount}</span>
        </Stack>
        <BookmarkButton key={`bm-${bookmarked}`} postId={id} initialSaved={bookmarked} />
      </Stack>
    </SpotlightCard>
  );
}

export default PostCard;
