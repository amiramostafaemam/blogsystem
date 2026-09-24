import { useMemo } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ExploreIcon from "@mui/icons-material/ExploreOutlined";
import { Link, useNavigate } from "react-router-dom";
import { useReducedMotion } from "motion/react";
import FuzzyText from "../components/reactbits/FuzzyText";
import PageMeta from "../components/PageMeta";

function NotFound() {
  const theme = useTheme();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const { primary } = theme.palette;
  // stable array, otherwise FuzzyText restarts its canvas on every render
  const gradient = useMemo(
    () => [primary.dark, primary.main, theme.palette.mode === "dark" ? "#F3ECE6" : "#E07A5F"],
    [primary.dark, primary.main, theme.palette.mode]
  );

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "calc(100vh - 160px)",
        display: "grid",
        placeItems: "center",
        textAlign: "center",
        py: 8,
      }}
    >
      <PageMeta title="Page not found" />

      {/* soft glow behind the number */}
      <Box
        aria-hidden="true"
        sx={{
          position: "absolute",
          top: "38%",
          left: "50%",
          width: { xs: 260, md: 420 },
          height: { xs: 160, md: 240 },
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          bgcolor: alpha(primary.main, theme.palette.mode === "dark" ? 0.22 : 0.16),
          filter: "blur(70px)",
        }}
      />

      <Box sx={{ position: "relative" }}>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }} role="img" aria-label="404">
          <FuzzyText
            fontSize="clamp(5rem, 18vw, 11rem)"
            fontWeight={700}
            fontFamily='"Playfair Display", serif'
            gradient={gradient}
            baseIntensity={reduceMotion ? 0 : 0.12}
            hoverIntensity={reduceMotion ? 0 : 0.45}
            glitchMode={!reduceMotion}
            glitchInterval={3200}
            glitchDuration={180}
            transitionDuration={250}
          >
            404
          </FuzzyText>
        </Box>

        <Typography variant="h3" component="h1" sx={{ fontSize: { xs: "1.9rem", md: "2.6rem" }, mb: 1.5 }}>
          This cup is empty
        </Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 440, mx: "auto", mb: 4, fontSize: { md: "1.1rem" } }}>
          The page you're looking for was moved, deleted, or never brewed in the first place.
        </Typography>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} justifyContent="center" sx={{ px: 2 }}>
          <Button component={Link} to="/explore" variant="contained" size="large" startIcon={<ExploreIcon />} sx={{ borderRadius: 99, px: 3 }}>
            Explore stories
          </Button>
          <Button onClick={() => navigate(-1)} size="large" startIcon={<ArrowBackIcon />} color="inherit" sx={{ borderRadius: 99, px: 3 }}>
            Go back
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}

export default NotFound;
