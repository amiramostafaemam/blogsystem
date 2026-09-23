import { Avatar, AvatarGroup, Box, Button, Container, Paper, Skeleton, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { keyframes } from "@emotion/react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import BoltIcon from "@mui/icons-material/Bolt";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { Link } from "react-router-dom";
import { LogoMark } from "../Logo";
import { useDemoLogin } from "../../hooks/useDemoLogin";
import { readingTime } from "../../utils";
import { brand } from "../../theme";

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-14px); }
`;
const spin = keyframes`
  to { transform: rotate(360deg); }
`;
const rise = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: none; }
`;

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const reducedMotion = { "@media (prefers-reduced-motion: reduce)": { animation: "none" } };

// Staggered entrance for hero copy
const enter = (delay) => ({
  animation: `${rise} .9s cubic-bezier(.2,.7,.2,1) ${delay}ms both`,
  ...reducedMotion,
});

function MiniPostCard({ post }) {
  return (
    <Paper
      component={Link}
      to={`/posts/${post.id}`}
      elevation={0}
      sx={(theme) => ({
        display: "block",
        width: { xs: 230, md: 280 },
        borderRadius: 4,
        overflow: "hidden",
        textDecoration: "none",
        color: "text.primary",
        border: 1,
        borderColor: "divider",
        boxShadow: `0 30px 60px -20px ${alpha(brand.espresso, theme.palette.mode === "dark" ? 0.8 : 0.35)}`,
        transition: "transform .3s",
        "&:hover": { transform: "scale(1.03)" },
      })}
    >
      {post.image && (
        <Box component="img" src={post.image} alt="" sx={{ width: "100%", aspectRatio: "16 / 10", objectFit: "cover", display: "block" }} />
      )}
      <Box sx={{ p: 2 }}>
        <Typography
          sx={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 700,
            lineHeight: 1.3,
            mb: 1.5,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {post.title}
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Avatar src={post.author?.avatar_url} sx={{ width: 22, height: 22, fontSize: 12 }}>
            {post.author?.name?.[0]}
          </Avatar>
          <Typography variant="caption" color="text.secondary" noWrap>
            {post.author?.name} · {readingTime(post.content)}
          </Typography>
        </Stack>
      </Box>
    </Paper>
  );
}

// Floating cards arranged around a slowly spinning crema swirl
function Collage({ posts, loading }) {
  const slots = [
    { top: "2%", left: { xs: "0%", md: "4%" }, rotate: -7, delay: 0 },
    { top: { xs: "30%", md: "26%" }, right: { xs: "0%", md: "0%" }, rotate: 6, delay: 1.6 },
    { bottom: "0%", left: { xs: "12%", md: "18%" }, rotate: -2, delay: 3.2, hideOnMobile: true },
  ];

  return (
    <Box sx={{ position: "relative", height: { xs: 440, md: 580 }, ...enter(300) }}>
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          display: "grid",
          placeItems: "center",
          opacity: 0.9,
          "& svg": { width: { xs: 300, md: 440 }, height: "auto" },
          animation: `${spin} 80s linear infinite`,
          ...reducedMotion,
        }}
      >
        <LogoMark size={440} />
      </Box>

      {slots.map((slot, i) => {
        const post = posts[i];
        if (!loading && !post) return null;
        return (
          <Box
            key={i}
            sx={{
              position: "absolute",
              top: slot.top,
              left: slot.left,
              right: slot.right,
              bottom: slot.bottom,
              transform: `rotate(${slot.rotate}deg)`,
              display: slot.hideOnMobile ? { xs: "none", sm: "block" } : "block",
              zIndex: 3 - i,
            }}
          >
            <Box sx={{ animation: `${float} 7s ease-in-out ${slot.delay}s infinite`, ...reducedMotion }}>
              {post ? (
                <MiniPostCard post={post} />
              ) : (
                <Skeleton variant="rounded" sx={{ width: { xs: 230, md: 280 }, height: 260, borderRadius: 4 }} />
              )}
            </Box>
          </Box>
        );
      })}

      <Paper
        elevation={0}
        sx={{
          position: "absolute",
          bottom: { xs: "4%", md: "14%" },
          right: { xs: "2%", md: "6%" },
          zIndex: 5,
          px: 2,
          py: 1,
          borderRadius: 99,
          display: "flex",
          alignItems: "center",
          gap: 1,
          border: 1,
          borderColor: "divider",
          boxShadow: `0 12px 30px -12px ${alpha(brand.espresso, 0.4)}`,
          animation: `${float} 6s ease-in-out 1s infinite`,
          ...reducedMotion,
        }}
      >
        <EditNoteIcon sx={{ color: "primary.main" }} />
        <Typography variant="body2" fontWeight={600}>
          Draft saved
        </Typography>
      </Paper>
    </Box>
  );
}

function Hero({ posts, loading, stats }) {
  const { loginAsDemo, loading: demoLoading } = useDemoLogin();
  const authors = [...new Map(posts.map((p) => [p.user_id, p.author])).values()].filter(Boolean);

  return (
    <Box
      component="section"
      sx={(theme) => ({
        position: "relative",
        overflow: "hidden",
        pt: { xs: 14, md: 18 },
        pb: { xs: 8, md: 12 },
        background: `
          radial-gradient(900px circle at 85% 10%, ${alpha(brand.terracottaBright, theme.palette.mode === "dark" ? 0.22 : 0.18)}, transparent 60%),
          radial-gradient(700px circle at 0% 100%, ${alpha(theme.palette.mode === "dark" ? brand.clay : brand.sand, theme.palette.mode === "dark" ? 0.08 : 0.9)}, transparent 60%),
          ${theme.palette.background.default}`,
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          backgroundImage: GRAIN,
          opacity: theme.palette.mode === "dark" ? 0.05 : 0.07,
          pointerEvents: "none",
        },
      })}
    >
      <Container maxWidth="lg" sx={{ position: "relative" }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.05fr 1fr" },
            gap: { xs: 6, md: 4 },
            alignItems: "center",
          }}
        >
          <Box>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                px: 1.5,
                py: 0.75,
                mb: 3,
                borderRadius: 99,
                border: 1,
                borderColor: "divider",
                bgcolor: (theme) => alpha(theme.palette.background.paper, 0.6),
                fontSize: "0.85rem",
                fontWeight: 600,
                ...enter(0),
              }}
            >
              <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "primary.main" }} />
              A cozy corner of the internet for writers
            </Box>

            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "3rem", sm: "4rem", md: "4.6rem" },
                lineHeight: 1.02,
                letterSpacing: "-0.02em",
                mb: 3,
                ...enter(100),
              }}
            >
              Where stories
              <br />
              are brewed{" "}
              <Box component="span" sx={{ position: "relative", whiteSpace: "nowrap", color: "primary.main", fontStyle: "italic" }}>
                slowly.
                <Box
                  component="svg"
                  viewBox="0 0 240 16"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                  sx={{ position: "absolute", left: 0, bottom: "-0.12em", width: "100%", height: "0.22em", overflow: "visible" }}
                >
                  <path d="M2 10 C 45 3, 90 3, 125 8 S 195 14, 238 5" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.55" />
                </Box>
              </Box>
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ fontSize: { xs: "1.1rem", md: "1.25rem" }, lineHeight: 1.7, maxWidth: 520, mb: 4, ...enter(200) }}
            >
              Crema is a calm place to write, read and share stories. No noise, no algorithms fighting for
              your attention. Just good words and a warm cup.
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mb: 5, ...enter(300) }}>
              <Button
                component={Link}
                to="/register"
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  px: 3.5,
                  py: 1.6,
                  fontSize: "1rem",
                  boxShadow: (theme) => `0 14px 30px -10px ${alpha(theme.palette.primary.main, 0.7)}`,
                  "& .MuiButton-endIcon": { transition: "transform .2s" },
                  "&:hover .MuiButton-endIcon": { transform: "translateX(4px)" },
                }}
              >
                Start writing, it's free
              </Button>
              <Button
                variant="outlined"
                size="large"
                color="inherit"
                startIcon={<BoltIcon sx={{ color: "primary.main" }} />}
                onClick={loginAsDemo}
                disabled={demoLoading}
                sx={{ px: 3, py: 1.6, fontSize: "1rem", borderColor: "divider", bgcolor: (theme) => alpha(theme.palette.background.paper, 0.5) }}
              >
                {demoLoading ? "Brewing…" : "Try the live demo"}
              </Button>
            </Stack>

            {authors.length > 0 && (
              <Stack direction="row" spacing={2} alignItems="center" sx={enter(400)}>
                <AvatarGroup max={5} sx={{ "& .MuiAvatar-root": { width: 38, height: 38, borderColor: "background.default" } }}>
                  {authors.map((a) => (
                    <Avatar key={a.id} src={a.avatar_url} alt={a.name}>
                      {a.name?.[0]}
                    </Avatar>
                  ))}
                </AvatarGroup>
                <Typography variant="body2" color="text.secondary">
                  Join <strong>{stats.writers} writers</strong> sharing{" "}
                  <strong>{stats.stories} stories</strong>
                </Typography>
              </Stack>
            )}
          </Box>

          <Collage posts={posts.slice(0, 3)} loading={loading} />
        </Box>
      </Container>
    </Box>
  );
}

export default Hero;
