import { supabase, unwrap } from "../lib/supabase";

const FIELDS = `
  id, type, post_id, comment_id, read_at, created_at,
  actor:profiles!notifications_actor_id_fkey (id, name, avatar_url),
  post:posts!notifications_post_id_fkey (id, title)
`;

export async function listNotifications(limit = 20) {
  return unwrap(
    await supabase.from("notifications").select(FIELDS).order("created_at", { ascending: false }).limit(limit)
  );
}

export async function countUnread() {
  const { count, error } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .is("read_at", null);
  if (error) throw new Error(error.message);
  return count ?? 0;
}

export async function getNotification(id) {
  return unwrap(await supabase.from("notifications").select(FIELDS).eq("id", id).maybeSingle());
}

export async function markRead(ids) {
  if (ids.length === 0) return;
  unwrap(
    await supabase.from("notifications").update({ read_at: new Date().toISOString() }).in("id", ids).is("read_at", null)
  );
}

export async function markAllRead(userId) {
  unwrap(
    await supabase
      .from("notifications")
      .update({ read_at: new Date().toISOString() })
      .eq("user_id", userId)
      .is("read_at", null)
  );
}

// Calls onInsert(id) for every new notification addressed to this user
export function subscribeToNotifications(userId, onInsert) {
  const channel = supabase
    .channel(`notifications:${userId}`)
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${userId}` },
      (payload) => onInsert(payload.new.id)
    )
    .subscribe();
  return () => supabase.removeChannel(channel);
}
