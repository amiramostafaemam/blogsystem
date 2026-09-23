import { Box, Container, Typography } from "@mui/material";
import { useCountUp, useInView } from "../../hooks/useInView";

function Stat({ value, suffix = "", label, start }) {
  const count = useCountUp(typeof value === "number" ? value : 0, start);

  return (
    <Box sx={{ textAlign: "center", px: 2 }}>
      <Typography
        sx={{
          fontFamily: '"Playfair Display", serif',
          fontWeight: 700,
          fontSize: { xs: "2.4rem", md: "3.2rem" },
          lineHeight: 1,
          color: "primary.main",
          mb: 1,
        }}
      >
        {typeof value === "number" ? count : value}
        {suffix}
      </Typography>
      <Typography color="text.secondary" fontWeight={500}>
        {label}
      </Typography>
    </Box>
  );
}

function StatsStrip({ stats }) {
  const [ref, inView] = useInView({ threshold: 0.4 });

  return (
    <Box component="section" ref={ref} sx={{ borderTop: 1, borderBottom: 1, borderColor: "divider", bgcolor: "background.paper" }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
            rowGap: 5,
            py: { xs: 6, md: 7 },
            "& > *:not(:last-child)": { borderRight: { md: 1 }, borderColor: { md: "divider" } },
          }}
        >
          <Stat value={stats.stories} label="Stories published" start={inView} />
          <Stat value={stats.writers} label="Writers brewing" start={inView} />
          <Stat value={stats.minutes} suffix="+" label="Minutes of reading" start={inView} />
          <Stat value="∞" label="Cups of coffee" start={inView} />
        </Box>
      </Container>
    </Box>
  );
}

export default StatsStrip;
