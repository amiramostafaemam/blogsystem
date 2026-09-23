import { Box, Container, Paper, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import DevicesIcon from "@mui/icons-material/Devices";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { Reveal, SectionHeading } from "./Reveal";
import { brand } from "../../theme";

function IconBadge({ children }) {
  return (
    <Box
      sx={(theme) => ({
        width: 48,
        height: 48,
        borderRadius: 3,
        display: "grid",
        placeItems: "center",
        mb: 2.5,
        color: "primary.main",
        bgcolor: alpha(theme.palette.primary.main, 0.12),
      })}
    >
      {children}
    </Box>
  );
}

function FeatureCard({ icon, title, text, children, sx }) {
  return (
    <Paper
      elevation={0}
      sx={(theme) => ({
        height: "100%",
        display: "flex",
        flexDirection: "column",
        p: { xs: 3, md: 4 },
        borderRadius: 5,
        border: 1,
        borderColor: "divider",
        overflow: "hidden",
        position: "relative",
        transition: "transform .3s, box-shadow .3s, border-color .3s",
        "&:hover": {
          transform: "translateY(-4px)",
          borderColor: alpha(theme.palette.primary.main, 0.4),
          boxShadow: `0 24px 50px -24px ${alpha(brand.espresso, 0.35)}`,
        },
        ...sx,
      })}
    >
      <IconBadge>{icon}</IconBadge>
      <Typography variant="h6" sx={{ mb: 1 }}>
        {title}
      </Typography>
      <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
        {text}
      </Typography>
      {children}
    </Paper>
  );
}

// Tiny fake editor used as decoration in the big card
function EditorMock() {
  const line = (width, color = "divider") => (
    <Box sx={{ height: 10, width, borderRadius: 99, bgcolor: color }} />
  );
  return (
    <Box sx={{ mt: 4, p: 3, flexGrow: 1, borderRadius: 3, border: 1, borderColor: "divider", bgcolor: "background.default" }}>
      <Stack direction="row" spacing={0.75} mb={2.5}>
        {["#E07A5F", "#E8B04B", "#7BAE7F"].map((c) => (
          <Box key={c} sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: c }} />
        ))}
      </Stack>
      <Typography sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: "1.4rem", mb: 2 }}>
        A letter to my morning self
        <Box component="span" sx={{ display: "inline-block", width: 2, height: "1.1em", ml: 0.5, verticalAlign: "text-bottom", bgcolor: "primary.main", animation: "blink 1s steps(1) infinite", "@keyframes blink": { "50%": { opacity: 0 } } }} />
      </Typography>
      <Stack spacing={1.2}>
        {line("95%")}
        {line("88%")}
        {line("70%")}
      </Stack>
      <Box
        sx={{
          my: 3,
          borderRadius: 2,
          aspectRatio: "21 / 6",
          background: (theme) =>
            `linear-gradient(120deg, ${alpha(theme.palette.primary.main, 0.25)}, ${alpha(brand.espresso, 0.15)})`,
        }}
      />
      <Stack spacing={1.2}>
        {line("92%")}
        {line("84%")}
        {line("45%")}
      </Stack>
    </Box>
  );
}

// Half light / half dark preview for the theme card
function ThemeMock() {
  return (
    <Box sx={{ mt: 3, display: "grid", gridTemplateColumns: "1fr 1fr", borderRadius: 3, overflow: "hidden", border: 1, borderColor: "divider", height: 90 }}>
      {[
        { bg: brand.milk, fg: brand.roast },
        { bg: brand.night, fg: "#F3ECE6" },
      ].map((t) => (
        <Box key={t.bg} sx={{ bgcolor: t.bg, p: 2 }}>
          <Box sx={{ height: 8, width: "70%", borderRadius: 99, bgcolor: t.fg, opacity: 0.8, mb: 1 }} />
          <Box sx={{ height: 6, width: "90%", borderRadius: 99, bgcolor: t.fg, opacity: 0.3, mb: 0.75 }} />
          <Box sx={{ height: 6, width: "60%", borderRadius: 99, bgcolor: t.fg, opacity: 0.3 }} />
        </Box>
      ))}
    </Box>
  );
}

function Features() {
  return (
    <Box component="section" id="features" sx={{ py: { xs: 10, md: 14 }, bgcolor: "background.paper", scrollMarginTop: 72 }}>
      <Container maxWidth="lg">
        <SectionHeading
          eyebrow="Why Crema"
          title="Everything a writer needs. Nothing they don't."
          subtitle="We stripped away the noise so the only thing left on the page is you."
        />

        <Box
          sx={{
            display: "grid",
            gap: 3,
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
          }}
        >
          <Reveal sx={{ gridColumn: { md: "span 2" }, gridRow: { md: "span 2" }, display: "flex", flexDirection: "column", "& > *": { flexGrow: 1 } }}>
            <FeatureCard
              icon={<EditNoteIcon />}
              title="A distraction-free editor"
              text="Markdown with a formatting toolbar, live preview, drag-and-drop covers and drafts that wait for you."
            >
              <EditorMock />
            </FeatureCard>
          </Reveal>
          <Reveal delay={100}>
            <FeatureCard icon={<DarkModeOutlinedIcon />} title="Day or night" text="A light and a dark theme, remembered across visits.">
              <ThemeMock />
            </FeatureCard>
          </Reveal>
          <Reveal delay={200}>
            <FeatureCard icon={<SearchIcon />} title="Find anything" text="Full-text search and tags help readers find exactly what they are craving." />
          </Reveal>
          <Reveal delay={100}>
            <FeatureCard icon={<ShieldOutlinedIcon />} title="Your words, protected" text="Only you can edit or delete your stories. Row-level security enforces it in the database itself." />
          </Reveal>
          <Reveal delay={200}>
            <FeatureCard icon={<DevicesIcon />} title="Looks great everywhere" text="From a 4K monitor to the phone in your pocket, every page adapts." />
          </Reveal>
          <Reveal delay={300}>
            <FeatureCard icon={<ForumOutlinedIcon />} title="Live conversations" text="Likes, bookmarks and responses that appear in real time, no refresh needed." />
          </Reveal>
        </Box>
      </Container>
    </Box>
  );
}

export default Features;
