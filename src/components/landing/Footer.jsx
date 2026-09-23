import { Box, Container, Link as MuiLink, Stack, Typography } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import { Link } from "react-router-dom";
import Logo from "../Logo";
import { GITHUB_URL } from "../../config";

const COLUMNS = [
  {
    title: "Read",
    links: [
      { label: "Explore stories", to: "/explore" },
      { label: "Search", to: "/explore" },
    ],
  },
  {
    title: "Write",
    links: [
      { label: "Create account", to: "/register" },
      { label: "Log in", to: "/login" },
    ],
  },
];

function Footer() {
  return (
    <Box component="footer" sx={{ borderTop: 1, borderColor: "divider", bgcolor: "background.paper", py: { xs: 6, md: 8 } }}>
      <Container maxWidth="lg">
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "2fr 1fr 1fr" }, gap: 5, mb: 6 }}>
          <Box>
            <Box sx={{ color: "text.primary", mb: 2 }}>
              <Logo />
            </Box>
            <Typography color="text.secondary" sx={{ maxWidth: 320, lineHeight: 1.7 }}>
              A calm place to write, read and share stories, best enjoyed with a warm cup.
            </Typography>
          </Box>
          {COLUMNS.map((col) => (
            <Box key={col.title}>
              <Typography fontWeight={700} mb={2}>
                {col.title}
              </Typography>
              <Stack spacing={1.25}>
                {col.links.map((link) => (
                  <MuiLink key={link.label} component={Link} to={link.to} color="text.secondary" underline="hover">
                    {link.label}
                  </MuiLink>
                ))}
              </Stack>
            </Box>
          ))}
        </Box>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
          sx={{ pt: 4, borderTop: 1, borderColor: "divider" }}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Crema. Designed & built by Amira.
          </Typography>
          <MuiLink href={GITHUB_URL} target="_blank" rel="noreferrer" color="text.secondary" underline="hover" sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}>
            <GitHubIcon fontSize="small" /> View source on GitHub
          </MuiLink>
        </Stack>
      </Container>
    </Box>
  );
}

export default Footer;
