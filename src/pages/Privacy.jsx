import { Box, Typography } from "@mui/material";
import Markdown from "../components/Markdown";
import PageMeta from "../components/PageMeta";
import { GITHUB_URL } from "../config";

const UPDATED = "24 September 2026";

const POLICY = `
Crema is a personal portfolio project: a small blogging platform where people can write, read and share stories. This page explains what data it collects and why.

## What we collect

- **Account details.** Your email address, display name and profile picture. If you sign in with Google or GitHub, we receive your name, email and avatar from that provider. We never see or store your Google or GitHub password.
- **What you publish.** Stories, drafts, tags, cover images, likes, bookmarks and responses you create.
- **Reading statistics.** When a story is opened we record that it was viewed and when. For signed-in readers the view is linked to their account only to avoid counting the same person twice; authors see totals, never who read their story.

We do not use advertising, tracking cookies or third-party analytics.

## How it is used

Your data is only used to run Crema: to sign you in, show your stories and profile, deliver notifications, and show authors their own statistics. It is never sold or shared for marketing.

## Where it is stored

Data is stored with [Supabase](https://supabase.com) (database, authentication and file storage) and the site is served by [Vercel](https://vercel.com). Access rules in the database ensure that only you can change your content, and that drafts and bookmarks stay private to you.

## Your choices

- You can edit or delete your stories, responses and profile details at any time.
- You can remove your likes and bookmarks at any time.
- To delete your account and everything linked to it, open an issue on the [project's GitHub page](${GITHUB_URL}/issues) and it will be removed.

## Demo account

The public demo account is shared by everyone who clicks "Try the live demo". Anything written while using it is visible to other visitors and may be reset at any time, so please don't post personal information there.

## Changes

If this policy changes, the date at the top of this page will be updated.
`;

function Privacy() {
  return (
    <Box sx={{ maxWidth: 740, mx: "auto" }}>
      <PageMeta title="Privacy policy" description="What data Crema collects and how it is used." />
      <Typography variant="h3" component="h1" sx={{ fontSize: { xs: "2rem", md: "2.6rem" } }}>
        Privacy policy
      </Typography>
      <Typography color="text.secondary" mb={4}>
        Last updated {UPDATED}
      </Typography>
      <Markdown>{POLICY}</Markdown>
    </Box>
  );
}

export default Privacy;
