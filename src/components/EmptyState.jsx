import { Box, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { keyframes } from "@emotion/react";
import { LogoMark } from "./Logo";

const steam = keyframes`
  0% { transform: translateY(6px) scaleY(0.8); opacity: 0; }
  40% { opacity: 0.7; }
  100% { transform: translateY(-14px) scaleY(1.1); opacity: 0; }
`;

// Cup with rising steam, used instead of emoji so it looks the same on every OS
export function CupIllustration({ size = 88 }) {
  return (
    <Box sx={{ position: "relative", width: size * 1.6, height: size * 1.6, display: "grid", placeItems: "center", mx: "auto" }}>
      <Box
        sx={(theme) => ({
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.16)}, transparent 70%)`,
        })}
      />
      <Stack direction="row" spacing={1} sx={{ position: "absolute", top: size * 0.05 }} aria-hidden="true">
        {[0, 0.6, 1.2].map((delay) => (
          <Box
            key={delay}
            sx={{
              width: 3,
              height: size * 0.28,
              borderRadius: 3,
              bgcolor: "text.secondary",
              opacity: 0,
              animation: `${steam} 2.4s ease-in-out ${delay}s infinite`,
              "@media (prefers-reduced-motion: reduce)": { animation: "none", opacity: 0.3 },
            }}
          />
        ))}
      </Stack>
      <Box sx={{ position: "relative", "& svg": { display: "block" } }}>
        <LogoMark size={size} />
      </Box>
    </Box>
  );
}

function EmptyState({ title, message, action, size = 72, sx }) {
  return (
    <Box sx={{ textAlign: "center", py: { xs: 6, md: 8 }, px: 2, ...sx }}>
      <CupIllustration size={size} />
      <Typography variant="h5" component="h2" sx={{ mt: 1, mb: 1 }}>
        {title}
      </Typography>
      {message && (
        <Typography color="text.secondary" sx={{ maxWidth: 420, mx: "auto", mb: action ? 3 : 0 }}>
          {message}
        </Typography>
      )}
      {action}
    </Box>
  );
}

export default EmptyState;
