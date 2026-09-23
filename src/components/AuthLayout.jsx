import { Box, Paper, Typography } from "@mui/material";
import Logo from "./Logo";
import { brand } from "../theme";

function AuthLayout({ title, subtitle, children }) {
  return (
    <Box sx={{ minHeight: "100vh", display: "grid", gridTemplateColumns: { md: "1fr 1fr" } }}>
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "space-between",
          p: 6,
          color: brand.sand,
          background: `radial-gradient(circle at 85% 15%, ${brand.terracottaBright}55 0%, transparent 45%), linear-gradient(160deg, ${brand.espresso} 0%, ${brand.roast} 60%, ${brand.night} 100%)`,
        }}
      >
        <Logo />
        <Box>
          <Typography variant="h2" sx={{ fontSize: "3rem", lineHeight: 1.15, mb: 2 }}>
            Every good story
            <br />
            starts over{" "}
            <Box component="span" sx={{ color: brand.clay }}>
              coffee.
            </Box>
          </Typography>
          <Typography sx={{ opacity: 0.8, maxWidth: 420 }}>
            Share your thoughts, discover new voices and join a cozy community of writers.
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ opacity: 0.6 }}>
          © {new Date().getFullYear()} Crema
        </Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", p: 2 }}>
        <Paper elevation={0} sx={{ width: "100%", maxWidth: 420, p: { xs: 3, sm: 4 }, bgcolor: "transparent" }}>
          <Box sx={{ display: { md: "none" }, color: "text.primary", mb: 3 }}>
            <Logo />
          </Box>
          <Typography variant="h4" component="h1">
            {title}
          </Typography>
          <Typography color="text.secondary" mb={3}>
            {subtitle}
          </Typography>
          {children}
        </Paper>
      </Box>
    </Box>
  );
}

export default AuthLayout;
