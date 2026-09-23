import { supabase, unwrap } from "../lib/supabase";

// ---------- Likes ----------

export async function getLikedPostIds(userId, postIds) {
  if (!userId || postIds.length === 0) return new Set();
  const data = unwrap(
    await supabase.from("likes").select("post_id").eq("user_id", userId).in("post_id", postIds)
  );
  return new Set(data.map((row) => row.post_id));
}

export async function likePost(postId) {
  unwrap(await supabase.from("likes").insert({ post_id: postId }));
}

export async function unlikePost(postId, userId) {
  unwrap(await supabase.from("likes").delete().match({ post_id: postId, user_id: userId }));
}

// ---------- Bookmarks ----------

export async function getBookmarkedPostIds(userId, postIds) {
  if (!userId || postIds.length === 0) return new Set();
  const data = unwrap(
    await supabase.from("bookmarks").select("post_id").eq("user_id", userId).in("post_id", postIds)
  );
  return new Set(data.map((row) => row.post_id));
}

export async function bookmarkPost(postId) {
  unwrap(await supabase.from("bookmarks").insert({ post_id: postId }));
}

export async function removeBookmark(postId, userId) {
  unwrap(await supabase.from("bookmarks").delete().match({ post_id: postId, user_id: userId }));
}

export async function listBookmarkedPosts(userId) {
  const data = unwrap(
    await supabase
      .from("bookmarks")
      .select(
        `created_at,
         post:posts (
           id, title, content, image, tags, status, created_at, user_id,
           author:profiles!posts_user_id_fkey (id, name, avatar_url),
           likes (count),
           comments (count)
         )`
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
  );
  return data
    .map((row) => row.post)
    .filter(Boolean)
    .map(({ likes, comments, ...post }) => ({
      ...post,
      likeCount: likes?.[0]?.count ?? 0,
      commentCount: comments?.[0]?.count ?? 0,
    }));
}

// ---------- Comments ----------

const COMMENT_FIELDS = "id, body, created_at, post_id, user_id, author:profiles!comments_user_id_fkey (id, name, avatar_url)";

export async function listComments(postId) {
  return unwrap(
    await supabase
      .from("comments")
      .select(COMMENT_FIELDS)
      .eq("post_id", postId)
      .order("created_at", { ascending: true })
  );
}

export async function getComment(id) {
  return unwrap(await supabase.from("comments").select(COMMENT_FIELDS).eq("id", id).single());
}

export async function addComment(postId, body) {
  return unwrap(
    await supabase.from("comments").insert({ post_id: postId, body }).select(COMMENT_FIELDS).single()
  );
}

export async function deleteComment(id) {
  unwrap(await supabase.from("comments").delete().eq("id", id));
}

// Calls onInsert(commentId) whenever someone comments on this post
export function subscribeToComments(postId, onInsert) {
  const channel = supabase
    .channel(`comments:${postId}`)
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "comments", filter: `post_id=eq.${postId}` },
      (payload) => onInsert(payload.new.id)
    )
    .subscribe();
  return () => supabase.removeChannel(channel);
}
