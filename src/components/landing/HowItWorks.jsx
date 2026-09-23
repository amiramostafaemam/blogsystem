import { Box, Container, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Reveal, SectionHeading } from "./Reveal";

const STEPS = [
  { title: "Grab a seat", text: "Create a free account in under a minute. Add a photo if you like." },
  { title: "Brew your story", text: "Draft in a calm markdown editor. Add a cover and a few tags." },
  { title: "Share the pour", text: "Publish when it is ready. Readers like, save and respond." },
];

function HowItWorks() {
  return (
    <Box component="section" id="how" sx={{ py: { xs: 10, md: 14 }, scrollMarginTop: 72 }}>
      <Container maxWidth="lg">
        <SectionHeading eyebrow="How it works" title="From first sip to published in three steps" />

        <Box
          sx={{
            position: "relative",
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
            gap: { xs: 5, md: 6 },
            // dashed line connecting the steps on desktop
            "&::before": {
              content: '""',
              display: { xs: "none", md: "block" },
              position: "absolute",
              top: 36,
              left: "16%",
              right: "16%",
              borderTop: "2px dashed",
              borderColor: "divider",
            },
          }}
        >
          {STEPS.map((step, i) => (
            <Reveal key={step.title} delay={i * 150} sx={{ textAlign: "center", position: "relative" }}>
              <Box
                sx={(theme) => ({
                  width: 72,
                  height: 72,
                  mx: "auto",
                  mb: 3,
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  fontFamily: '"Playfair Display", serif',
                  fontWeight: 700,
                  fontSize: "1.6rem",
                  color: "primary.main",
                  bgcolor: "background.default",
                  border: "2px solid",
                  borderColor: alpha(theme.palette.primary.main, 0.35),
                  boxShadow: `0 0 0 8px ${theme.palette.background.default}`,
                })}
              >
                {String(i + 1).padStart(2, "0")}
              </Box>
              <Typography variant="h5" sx={{ mb: 1.5 }}>
                {step.title}
              </Typography>
              <Typography color="text.secondary" sx={{ maxWidth: 300, mx: "auto", lineHeight: 1.7 }}>
                {step.text}
              </Typography>
            </Reveal>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

export default HowItWorks;
