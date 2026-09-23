import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { brand } from "../theme";

// Top view of a cup of espresso with a crema swirl
export function LogoMark({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="16" r="15" fill={brand.terracottaBright} />
      <circle cx="16" cy="16" r="10" fill={brand.espresso} />
      <path
        d="M11.5 16a4.5 4.5 0 0 1 9 0 2.5 2.5 0 0 1-5 0"
        fill="none"
        stroke={brand.sand}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Logo({ to = "/", color = "inherit", size = 32 }) {
  return (
    <Box
      component={Link}
      to={to}
      aria-label="Crema home"
      sx={{ display: "inline-flex", alignItems: "center", gap: 1, color, textDecoration: "none" }}
    >
      <LogoMark size={size} />
      <Typography
        component="span"
        sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: size * 0.75 }}
      >
        crema
      </Typography>
    </Box>
  );
}

export default Logo;
