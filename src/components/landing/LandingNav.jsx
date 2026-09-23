import { AppBar, Box, Button, Container, IconButton, Stack, Toolbar, Tooltip, useScrollTrigger } from "@mui/material";
import { alpha } from "@mui/material/styles";
import DarkModeIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeIcon from "@mui/icons-material/LightModeOutlined";
import { Link } from "react-router-dom";
import Logo from "../Logo";
import { useColorMode } from "../../context/ColorModeContext";

const LINKS = [
  { label: "Stories", href: "#stories" },
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how" },
];

function LandingNav() {
  const scrolled = useScrollTrigger({ disableHysteresis: true, threshold: 12 });
  const { mode, toggleColorMode } = useColorMode();

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={(theme) => ({
        color: "text.primary",
        bgcolor: scrolled ? alpha(theme.palette.background.default, 0.75) : "transparent",
        backdropFilter: scrolled ? "saturate(180%) blur(14px)" : "none",
        borderBottom: 1,
        borderColor: scrolled ? "divider" : "transparent",
        transition: "background-color .3s, border-color .3s",
      })}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ height: 72 }}>
          <Box sx={{ flexGrow: 1, display: "flex" }}>
            <Logo />
          </Box>

          <Stack direction="row" spacing={0.5} sx={{ display: { xs: "none", md: "flex" }, mr: 2 }}>
            {LINKS.map((link) => (
              <Button key={link.href} href={link.href} color="inherit" sx={{ fontWeight: 500, opacity: 0.8, "&:hover": { opacity: 1 } }}>
                {link.label}
              </Button>
            ))}
          </Stack>

          <Tooltip title={mode === "dark" ? "Light mode" : "Dark mode"}>
            <IconButton color="inherit" onClick={toggleColorMode} aria-label="Toggle color mode" sx={{ mr: 1 }}>
              {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>
          <Button component={Link} to="/login" color="inherit" sx={{ display: { xs: "none", sm: "inline-flex" }, mr: 1 }}>
            Log in
          </Button>
          <Button component={Link} to="/register" variant="contained">
            Get started
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default LandingNav;
