import { Box, Skeleton, Stack } from "@mui/material";
import PostCard from "./PostCard";
import { usePostReactions } from "../hooks/usePostReactions";

const gridSx = {
  display: "grid",
  gap: 3,
  gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", xl: "repeat(3, 1fr)" },
};

export function PostGridSkeleton({ count = 4 }) {
  return (
    <Box sx={gridSx}>
      {Array.from({ length: count }, (_, i) => (
        <Box key={i} sx={{ p: 1.25, borderRadius: "20px", border: 1, borderColor: "divider", bgcolor: "background.paper" }}>
          <Skeleton variant="rounded" sx={{ aspectRatio: "16 / 10", height: "auto", borderRadius: "14px" }} />
          <Box sx={{ px: 1.25, pt: 2, pb: 1.5 }}>
            <Skeleton width="30%" />
            <Skeleton variant="text" sx={{ fontSize: "1.5rem" }} />
            <Skeleton />
            <Skeleton width="80%" />
          </Box>
          <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mx: 1.25, pt: 1.25, borderTop: 1, borderColor: "divider" }}>
            <Skeleton variant="circular" width={30} height={30} />
            <Box flexGrow={1}>
              <Skeleton width="40%" />
              <Skeleton width="30%" />
            </Box>
          </Stack>
        </Box>
      ))}
    </Box>
  );
}

function PostGrid({ posts }) {
  const { liked, bookmarked } = usePostReactions(posts);

  return (
    <Box sx={gridSx}>
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          liked={liked.has(post.id)}
          bookmarked={bookmarked.has(post.id)}
        />
      ))}
    </Box>
  );
}

export default PostGrid;
