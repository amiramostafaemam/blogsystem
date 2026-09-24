import { Box, Button, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import BoltIcon from "@mui/icons-material/Bolt";
import { useDemoLogin } from "../hooks/useDemoLogin";

// One-click demo for visitors who just want to look around
function DemoBanner() {
  const { loginAsDemo, loading } = useDemoLogin();

  return (
    <Box
      sx={(theme) => ({
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        p: 1.5,
        pl: 2,
        borderRadius: "14px",
        border: 1,
        borderColor: alpha(theme.palette.primary.main, 0.3),
        bgcolor: alpha(theme.palette.primary.main, 0.07),
      })}
    >
      <BoltIcon sx={{ color: "primary.main" }} />
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Typography variant="body2" fontWeight={700}>
          Just looking around?
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Try Crema with a ready-made account.
        </Typography>
      </Box>
      <Button size="small" variant="contained" onClick={loginAsDemo} disabled={loading} sx={{ flexShrink: 0, borderRadius: 99 }}>
        {loading ? "Brewing…" : "Try demo"}
      </Button>
    </Box>
  );
}

export default DemoBanner;
