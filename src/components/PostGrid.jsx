import { Box, Card, CardContent, Skeleton, Stack } from "@mui/material";
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
        <Card key={i}>
          <Skeleton variant="rectangular" sx={{ aspectRatio: "16 / 9", height: "auto" }} />
          <CardContent>
            <Skeleton variant="text" sx={{ fontSize: "1.5rem" }} />
            <Skeleton />
            <Skeleton width="80%" />
            <Stack direction="row" spacing={1.5} mt={2} alignItems="center">
              <Skeleton variant="circular" width={32} height={32} />
              <Box flexGrow={1}>
                <Skeleton width="40%" />
                <Skeleton width="30%" />
              </Box>
            </Stack>
          </CardContent>
        </Card>
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
