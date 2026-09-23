import { useEffect, useMemo, useState } from "react";
import { Box } from "@mui/material";
import { getSiteStats, listPosts } from "../api/posts";
import { readingTime } from "../utils";
import PageMeta from "../components/PageMeta";
import LandingNav from "../components/landing/LandingNav";
import Hero from "../components/landing/Hero";
import StatsStrip from "../components/landing/StatsStrip";
import FeaturedStories from "../components/landing/FeaturedStories";
import Features from "../components/landing/Features";
import HowItWorks from "../components/landing/HowItWorks";
import FinalCta from "../components/landing/FinalCta";
import Footer from "../components/landing/Footer";

function Landing() {
  const [posts, setPosts] = useState([]);
  const [counts, setCounts] = useState({ stories: 0, writers: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    Promise.all([listPosts({ pageSize: 12 }), getSiteStats()])
      .then(([latest, siteStats]) => {
        if (ignore) return;
        setPosts(latest);
        setCounts(siteStats);
      })
      .catch(() => {}) // the landing page still works without live data
      .finally(() => !ignore && setLoading(false));
    return () => {
      ignore = true;
    };
  }, []);

  const stats = useMemo(
    () => ({
      ...counts,
      minutes: posts.reduce((sum, p) => sum + parseInt(readingTime(p.content), 10), 0),
    }),
    [counts, posts]
  );

  // Posts with a cover image make the best first impression
  const showcase = useMemo(() => posts.filter((p) => p.image), [posts]);

  return (
    <Box sx={{ bgcolor: "background.default", overflowX: "hidden" }}>
      <PageMeta />
      <LandingNav />
      <main>
        <Hero posts={showcase} loading={loading} stats={stats} />
        {counts.stories > 0 && <StatsStrip stats={stats} />}
        {/* Skip the posts already floating in the hero when there are enough */}
        <FeaturedStories posts={showcase.length > 6 ? showcase.slice(3) : showcase} />
        <Features />
        <HowItWorks />
        <FinalCta />
      </main>
      <Footer />
    </Box>
  );
}

export default Landing;
