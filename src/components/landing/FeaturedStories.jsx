import { Avatar, Box, Button, Container, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Link } from "react-router-dom";
import { Reveal, SectionHeading } from "./Reveal";
import { excerpt, formatDate, readingTime } from "../../utils";
import { brand } from "../../theme";

function Byline({ post, light }) {
  return (
    <Stack direction="row" spacing={1.25} alignItems="center">
      <Avatar src={post.author?.avatar_url} sx={{ width: 30, height: 30, fontSize: 14 }}>
        {post.author?.name?.[0]}
      </Avatar>
      <Typography variant="body2" sx={{ color: light ? "rgba(255,255,255,0.85)" : "text.secondary" }}>
        <Box component="span" sx={{ fontWeight: 600, color: light ? "#fff" : "text.primary" }}>
          {post.author?.name}
        </Box>{" "}
        · {formatDate(post.created_at)} · {readingTime(post.content)}
      </Typography>
    </Stack>
  );
}

// Large image card with the text sitting on a gradient
function FeatureCard({ post }) {
  return (
    <Box
      component={Link}
      to={`/posts/${post.id}`}
      sx={{
        position: "relative",
        display: "flex",
        alignItems: "flex-end",
        height: "100%",
        minHeight: { xs: 380, md: 520 },
        borderRadius: 5,
        overflow: "hidden",
        textDecoration: "none",
        color: "#fff",
        "& img": { transition: "transform .8s cubic-bezier(.2,.7,.2,1)" },
        "&:hover img": { transform: "scale(1.05)" },
      }}
    >
      <Box component="img" src={post.image} alt="" sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      <Box sx={{ position: "absolute", inset: 0, background: `linear-gradient(to top, ${alpha(brand.night, 0.92)} 0%, ${alpha(brand.night, 0.35)} 55%, transparent 100%)` }} />
      <Box sx={{ position: "relative", p: { xs: 3, md: 5 } }}>
        <Box sx={{ display: "inline-block", px: 1.5, py: 0.5, mb: 2, borderRadius: 99, bgcolor: brand.terracotta, fontSize: 12, fontWeight: 700, letterSpacing: "0.08em" }}>
          EDITOR'S PICK
        </Box>
        <Typography variant="h3" sx={{ fontSize: { xs: "1.8rem", md: "2.4rem" }, lineHeight: 1.15, mb: 2 }}>
          {post.title}
        </Typography>
        <Typography sx={{ opacity: 0.85, mb: 3, maxWidth: 520, display: { xs: "none", sm: "-webkit-box" }, WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {excerpt(post.content, 200)}
        </Typography>
        <Byline post={post} light />
      </Box>
    </Box>
  );
}

function RowCard({ post }) {
  return (
    <Box
      component={Link}
      to={`/posts/${post.id}`}
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "110px 1fr", sm: "180px 1fr" },
        gap: { xs: 2, sm: 3 },
        alignItems: "center",
        p: 1.5,
        borderRadius: 4,
        textDecoration: "none",
        color: "text.primary",
        transition: "background-color .2s",
        "&:hover": { bgcolor: "action.hover" },
        "&:hover h3": { color: "primary.main" },
      }}
    >
      <Box
        component="img"
        src={post.image}
        alt=""
        loading="lazy"
        sx={{ width: "100%", aspectRatio: "4 / 3", objectFit: "cover", borderRadius: 3, bgcolor: "action.hover" }}
      />
      <Box sx={{ minWidth: 0 }}>
        <Typography component="h3" sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: { xs: "1.1rem", sm: "1.35rem" }, lineHeight: 1.25, mb: 1, transition: "color .2s" }}>
          {post.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, display: { xs: "none", sm: "-webkit-box" }, WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {excerpt(post.content, 200)}
        </Typography>
        <Byline post={post} />
      </Box>
    </Box>
  );
}

function FeaturedStories({ posts }) {
  const withImages = posts.filter((p) => p.image);
  if (withImages.length === 0) return null;
  const [featured, ...rest] = withImages;

  return (
    <Box component="section" id="stories" sx={{ py: { xs: 10, md: 14 }, scrollMarginTop: 72 }}>
      <Container maxWidth="lg">
        <SectionHeading
          eyebrow="Fresh from the roaster"
          title="Stories worth slowing down for"
          subtitle="Hand-picked reads from our community, from quiet mornings to mountain weekends."
        />

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.15fr 1fr" }, gap: { xs: 3, md: 4 } }}>
          <Reveal>
            <FeatureCard post={featured} />
          </Reveal>
          <Stack spacing={1} justifyContent="space-between">
            {rest.slice(0, 3).map((post, i) => (
              <Reveal key={post.id} delay={120 * (i + 1)}>
                <RowCard post={post} />
              </Reveal>
            ))}
          </Stack>
        </Box>

        <Reveal sx={{ textAlign: "center", mt: 6 }}>
          <Button component={Link} to="/explore" size="large" endIcon={<ArrowForwardIcon />}>
            Explore all stories
          </Button>
        </Reveal>
      </Container>
    </Box>
  );
}

export default FeaturedStories;
