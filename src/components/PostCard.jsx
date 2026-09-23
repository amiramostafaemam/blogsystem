import { useState } from "react";
import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Link as MuiLink,
  Stack,
  Typography,
} from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { Link } from "react-router-dom";
import { LikeButton, BookmarkButton } from "./ReactionButtons";
import { excerpt, formatDate, readingTime } from "../utils";

function PostCard({ post, liked = false, bookmarked = false }) {
  const [imageFailed, setImageFailed] = useState(false);
  const { id, title, content = "", image, author, created_at: createdAt, tags = [] } = post;

  return (
    <Card
      component="article"
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform .25s, box-shadow .25s",
        "&:hover": { transform: "translateY(-4px)" },
        "&:hover h2": { color: "primary.main" },
      }}
    >
      <CardActionArea
        component={Link}
        to={`/posts/${id}`}
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "stretch" }}
      >
        {image && !imageFailed && (
          <CardMedia
            component="img"
            image={image}
            alt=""
            loading="lazy"
            onError={() => setImageFailed(true)}
            sx={{ aspectRatio: "16 / 9", objectFit: "cover" }}
          />
        )}
        <CardContent sx={{ flexGrow: 1 }}>
          {tags.length > 0 && (
            <Stack direction="row" spacing={0.75} mb={1.25} sx={{ flexWrap: "wrap", rowGap: 0.75 }}>
              {tags.slice(0, 3).map((tag) => (
                <Chip key={tag} label={`#${tag}`} size="small" variant="outlined" sx={{ height: 22, fontSize: 12 }} />
              ))}
            </Stack>
          )}
          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            sx={{ fontSize: "1.3rem", lineHeight: 1.3, transition: "color .2s" }}
          >
            {title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              lineHeight: 1.7,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              wordBreak: "break-word",
            }}
          >
            {excerpt(content, 220)}
          </Typography>
        </CardContent>
      </CardActionArea>

      <Stack direction="row" alignItems="center" spacing={1.25} sx={{ px: 2, pb: 1.5, pt: 0.5 }}>
        <Avatar
          component={Link}
          to={`/u/${author?.id}`}
          src={author?.avatar_url}
          alt={author?.name}
          sx={{ width: 32, height: 32, fontSize: 14, textDecoration: "none" }}
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
            sx={{ display: "block" }}
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
    </Card>
  );
}

export default PostCard;
