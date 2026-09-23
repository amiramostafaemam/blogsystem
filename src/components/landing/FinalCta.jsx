import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { keyframes } from "@emotion/react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import BoltIcon from "@mui/icons-material/Bolt";
import { Link } from "react-router-dom";
import { Reveal } from "./Reveal";
import { LogoMark } from "../Logo";
import { useDemoLogin } from "../../hooks/useDemoLogin";
import { brand } from "../../theme";

const spin = keyframes`to { transform: rotate(360deg); }`;

function FinalCta() {
  const { loginAsDemo, loading } = useDemoLogin();

  return (
    <Box component="section" sx={{ pb: { xs: 10, md: 14 } }}>
      <Container maxWidth="lg">
        <Reveal>
          <Box
            sx={{
              position: "relative",
              overflow: "hidden",
              borderRadius: { xs: 5, md: 8 },
              px: { xs: 3, sm: 6, md: 10 },
              py: { xs: 8, md: 11 },
              color: brand.sand,
              background: `radial-gradient(600px circle at 100% 0%, ${alpha(brand.terracottaBright, 0.45)}, transparent 60%), linear-gradient(135deg, ${brand.espresso}, ${brand.night})`,
            }}
          >
            <Box
              aria-hidden="true"
              sx={{
                position: "absolute",
                right: { xs: -140, md: -60 },
                bottom: { xs: -140, md: -90 },
                opacity: 0.35,
                animation: `${spin} 60s linear infinite`,
                "@media (prefers-reduced-motion: reduce)": { animation: "none" },
              }}
            >
              <LogoMark size={380} />
            </Box>

            <Box sx={{ position: "relative", maxWidth: 620 }}>
              <Typography variant="h2" sx={{ fontSize: { xs: "2.3rem", md: "3.4rem" }, lineHeight: 1.1, mb: 2.5 }}>
                Your next story is{" "}
                <Box component="span" sx={{ color: brand.clay, fontStyle: "italic" }}>
                  one cup away.
                </Box>
              </Typography>
              <Typography sx={{ opacity: 0.8, fontSize: "1.15rem", lineHeight: 1.7, mb: 5 }}>
                Pour yourself something warm and write the first line. We saved you a seat.
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  sx={{ px: 3.5, py: 1.6, fontSize: "1rem", bgcolor: brand.terracotta, color: "#fff", "&:hover": { bgcolor: "#963A26" } }}
                >
                  Create your free account
                </Button>
                <Button
                  size="large"
                  startIcon={<BoltIcon />}
                  onClick={loginAsDemo}
                  disabled={loading}
                  sx={{ px: 3, py: 1.6, fontSize: "1rem", color: brand.sand, border: 1, borderColor: alpha(brand.sand, 0.3), "&:hover": { bgcolor: alpha(brand.sand, 0.08) } }}
                >
                  {loading ? "Brewing…" : "Try the demo"}
                </Button>
              </Stack>
            </Box>
          </Box>
        </Reveal>
      </Container>
    </Box>
  );
}

export default FinalCta;
