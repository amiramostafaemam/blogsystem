import { supabase, unwrap } from "../lib/supabase";

// Count one view of a story. Failures are ignored: stats must never break reading.
export async function recordView(postId) {
  try {
    await supabase.rpc("record_view", { target_post: postId });
  } catch {
    // ignore
  }
}

// Daily views / likes / responses on the signed-in author's stories
export async function getDailyStats(days) {
  const rows = unwrap(await supabase.rpc("author_daily_stats", { days }));
  return rows.map((r) => ({
    day: r.day,
    views: Number(r.views),
    likes: Number(r.likes),
    comments: Number(r.comments),
  }));
}

export async function getTopPosts(days, maxCount = 5) {
  const rows = unwrap(await supabase.rpc("author_top_posts", { days, max_count: maxCount }));
  return rows.map((r) => ({
    ...r,
    views: Number(r.views),
    likes: Number(r.likes),
    comments: Number(r.comments),
  }));
}
