import { supabase, unwrap } from "../lib/supabase";

export async function getProfile(id) {
  const data = unwrap(
    await supabase.from("profiles").select("id, name, avatar_url, bio, created_at").eq("id", id).maybeSingle()
  );
  if (!data) throw new Error("Profile not found");
  return data;
}

export async function updateProfile(id, values) {
  return unwrap(
    await supabase
      .from("profiles")
      .update(values)
      .eq("id", id)
      .select("id, name, avatar_url, bio, created_at")
      .single()
  );
}

// Uploads into <bucket>/<userId>/... and returns the public URL
export async function uploadImage(bucket, userId, blob) {
  const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
  unwrap(
    await supabase.storage.from(bucket).upload(path, blob, { contentType: "image/jpeg", cacheControl: "31536000" })
  );
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}
