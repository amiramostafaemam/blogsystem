import { Box, Typography } from "@mui/material";
import { useInView } from "../../hooks/useInView";

// Fades + slides its children in when they scroll into view
export function Reveal({ children, delay = 0, y = 28, sx }) {
  const [ref, inView] = useInView();

  return (
    <Box
      ref={ref}
      sx={{
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : `translateY(${y}px)`,
        transition: `opacity 0.8s ease ${delay}ms, transform 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) ${delay}ms`,
        "@media (prefers-reduced-motion: reduce)": {
          opacity: 1,
          transform: "none",
          transition: "none",
        },
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}

export function SectionHeading({ eyebrow, title, subtitle, align = "center" }) {
  return (
    <Reveal sx={{ textAlign: align, maxWidth: 680, mx: align === "center" ? "auto" : 0, mb: { xs: 5, md: 7 } }}>
      <Typography
        sx={{
          color: "primary.main",
          fontWeight: 700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          fontSize: "0.8rem",
          mb: 1.5,
        }}
      >
        {eyebrow}
      </Typography>
      <Typography
        variant="h2"
        sx={{ fontSize: { xs: "2rem", md: "2.9rem" }, lineHeight: 1.15, mb: subtitle ? 2 : 0 }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography color="text.secondary" sx={{ fontSize: { md: "1.1rem" }, lineHeight: 1.7 }}>
          {subtitle}
        </Typography>
      )}
    </Reveal>
  );
}
