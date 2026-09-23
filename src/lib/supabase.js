import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  throw new Error(
    "Missing Supabase env vars. Copy .env.example to .env and fill in VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY."
  );
}

export const supabase = createClient(url, key);

let providersPromise;

// OAuth providers switched on in the Supabase dashboard, e.g. ["google", "github"]
export function getEnabledProviders() {
  providersPromise ??= fetch(`${url}/auth/v1/settings`, { headers: { apikey: key } })
    .then((res) => (res.ok ? res.json() : { external: {} }))
    .then(({ external = {} }) => Object.keys(external).filter((name) => external[name] === true && name !== "email"))
    .catch(() => []);
  return providersPromise;
}

// Supabase returns { data, error }; throw so callers can use try/catch
export function unwrap({ data, error }) {
  if (error) throw new Error(error.message);
  return data;
}
