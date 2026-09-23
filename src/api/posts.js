import { supabase, unwrap } from "../lib/supabase";
import { toSearchQuery } from "../utils";

export const PAGE_SIZE = 9;

const POST_FIELDS = `
  id, title, content, image, tags, status, created_at, updated_at, user_id,
  author:profiles!posts_user_id_fkey (id, name, avatar_url),
  likes!likes_post_id_fkey (count),
  comments!comments_post_id_fkey (count)
`;

// Flatten the embedded counts: likes: [{ count: 3 }] -> likeCount: 3
function shape(post) {
  if (!post) return post;
  const { likes, comments, ...rest } = post;
  return {
    ...rest,
    likeCount: likes?.[0]?.count ?? 0,
    commentCount: comments?.[0]?.count ?? 0,
  };
}

// Published posts, newest first, with optional search / tag / author filters
export async function listPosts({ page = 0, search = "", tag = "", authorId, pageSize = PAGE_SIZE } = {}) {
  let query = supabase
    .from("posts")
    .select(POST_FIELDS)
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .range(page * pageSize, page * pageSize + pageSize - 1);

  const tsquery = toSearchQuery(search);
  if (tsquery) query = query.textSearch("search", tsquery, { config: "simple" });
  if (tag) query = query.contains("tags", [tag]);
  if (authorId) query = query.eq("user_id", authorId);

  return unwrap(await query).map(shape);
}

// All posts of the signed-in user, drafts included
export async function listMyPosts(userId) {
  const data = unwrap(
    await supabase
      .from("posts")
      .select(POST_FIELDS)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
  );
  return data.map(shape);
}

export async function getPost(id) {
  const data = unwrap(await supabase.from("posts").select(POST_FIELDS).eq("id", id).maybeSingle());
  if (!data) throw new Error("Post not found");
  return shape(data);
}

export async function createPost(values) {
  return unwrap(await supabase.from("posts").insert(values).select("id").single());
}

export async function updatePost(id, values) {
  return unwrap(
    await supabase
      .from("posts")
      .update({ ...values, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select("id")
      .single()
  );
}

export async function deletePost(id) {
  unwrap(await supabase.from("posts").delete().eq("id", id));
}

export async function getPopularTags(max = 12) {
  return unwrap(await supabase.rpc("popular_tags", { max_count: max }));
}

export async function getSiteStats() {
  const [posts, writers] = await Promise.all([
    supabase.from("posts").select("id", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
  ]);
  return { stories: posts.count ?? 0, writers: writers.count ?? 0 };
}
