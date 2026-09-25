import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Avatar, Box, Button, Paper, Skeleton, Stack, Typography } from "@mui/material";
import SettingsIcon from "@mui/icons-material/SettingsOutlined";
import { getProfile } from "../api/profiles";
import { listPosts } from "../api/posts";
import { useAuth } from "../context/AuthContext";
import PostGrid, { PostGridSkeleton } from "../components/PostGrid";
import PageMeta from "../components/PageMeta";
import { formatDate } from "../utils";

function Stat({ value, label }) {
  return (
    <Box>
      <Typography sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: "1.6rem", lineHeight: 1.1 }}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Box>
  );
}

function ProfilePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    let ignore = false;
    setProfile(null);
    setPosts(null);
    setMissing(false);
    getProfile(id)
      .then((p) => !ignore && setProfile(p))
      .catch(() => !ignore && setMissing(true));
    listPosts({ authorId: id, pageSize: 60 })
      .then((p) => !ignore && setPosts(p))
      .catch(() => !ignore && setPosts([]));
    return () => {
      ignore = true;
    };
  }, [id]);

  // Show the freshest avatar/name for your own profile
  const shown = user?.id === id && profile ? { ...profile, ...user } : profile;
  const isMe = user?.id === id;

  if (missing) {
    return (
      <Box sx={{ textAlign: "center", py: 10 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Writer not found
        </Typography>
        <Button component={Link} to="/explore" variant="contained">
          Browse stories
        </Button>
      </Box>
    );
  }

  const totalLikes = posts?.reduce((sum, p) => sum + p.likeCount, 0) ?? 0;

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto" }}>
      <PageMeta title={shown?.name} description={shown?.bio || undefined} />

      <Paper variant="outlined" sx={{ p: { xs: 3, sm: 5 }, mb: 5, borderRadius: "20px" }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={3} alignItems={{ xs: "center", sm: "flex-start" }} textAlign={{ xs: "center", sm: "left" }}>
          {shown ? (
            <Avatar src={shown.avatar_url} alt={shown.name} sx={{ width: 120, height: 120, fontSize: 48 }}>
              {shown.name?.[0]?.toUpperCase()}
            </Avatar>
          ) : (
            <Skeleton variant="circular" width={120} height={120} />
          )}

          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography variant="h3" component="h1" sx={{ fontSize: { xs: "2rem", md: "2.5rem" } }}>
              {shown ? shown.name : <Skeleton width={220} />}
            </Typography>
            {shown && (
              <Typography color="text.secondary" variant="body2" mt={0.5}>
                Joined {formatDate(shown.created_at)}
              </Typography>
            )}
            {shown?.bio && (
              <Typography sx={{ mt: 2, maxWidth: 560, lineHeight: 1.7 }}>{shown.bio}</Typography>
            )}
            {isMe && !shown?.bio && shown && (
              <Typography color="text.secondary" sx={{ mt: 2 }}>
                Add a short bio so readers know who you are.
              </Typography>
            )}

            <Stack direction="row" spacing={4} mt={3} justifyContent={{ xs: "center", sm: "flex-start" }}>
              <Stat value={posts?.length ?? "–"} label="Stories" />
              <Stat value={posts ? totalLikes : "–"} label="Likes received" />
            </Stack>
          </Box>

          {isMe && (
            <Button component={Link} to="/settings" variant="outlined" startIcon={<SettingsIcon />}>
              Edit profile
            </Button>
          )}
        </Stack>
      </Paper>

      <Typography variant="h5" component="h2" mb={3}>
        {isMe ? "Your published stories" : `Stories by ${shown?.name ?? "…"}`}
      </Typography>

      {!posts && <PostGridSkeleton count={2} />}
      {posts?.length === 0 && (
        <Typography color="text.secondary">
          {isMe ? "You haven't published anything yet." : "No published stories yet."}
        </Typography>
      )}
      {posts?.length > 0 && <PostGrid posts={posts} />}
    </Box>
  );
}

export default ProfilePage;
