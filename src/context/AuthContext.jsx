import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { supabase, unwrap } from "../lib/supabase";
import { getProfile } from "../api/profiles";

const AuthContext = createContext();

// The app's "user" is the public profile plus the private email
async function loadUser(authUser) {
  if (!authUser) return null;
  try {
    const profile = await getProfile(authUser.id);
    return { ...profile, email: authUser.email };
  } catch {
    return { id: authUser.id, email: authUser.email, name: authUser.email.split("@")[0] };
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(async ({ data }) => {
      const next = await loadUser(data.session?.user);
      if (!active) return;
      setUser(next);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") setUser(null);
      // Supabase warns against awaiting other calls inside this callback
      if (event === "SIGNED_IN" || event === "USER_UPDATED") {
        setTimeout(async () => {
          const next = await loadUser(session?.user);
          if (active) setUser(next);
        });
      }
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email, password) => {
    const { user: authUser } = unwrap(await supabase.auth.signInWithPassword({ email, password }));
    const next = await loadUser(authUser);
    setUser(next);
    return next;
  }, []);

  const signUp = useCallback(async ({ email, password, name }) => {
    const data = unwrap(
      await supabase.auth.signUp({ email, password, options: { data: { name } } })
    );
    if (!data.session) {
      throw new Error("Check your inbox to confirm your email, then log in.");
    }
    const next = await loadUser(data.user);
    setUser(next);
    return next;
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  // Merge local changes after a profile update
  const updateUser = useCallback((changes) => {
    setUser((prev) => (prev ? { ...prev, ...changes } : prev));
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
