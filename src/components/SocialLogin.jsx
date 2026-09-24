import { useEffect, useState } from "react";
import { Box, Button, Divider } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";
import { getEnabledProviders, supabase } from "../lib/supabase";
import { useNotify } from "../context/NotifyContext";

const PROVIDERS = [
  { id: "google", label: "Google", icon: <GoogleIcon /> },
  { id: "github", label: "GitHub", icon: <GitHubIcon /> },
];

// "or continue with" + a button for each OAuth provider switched on in Supabase
function SocialLogin({ redirectTo = "/explore" }) {
  const notify = useNotify();
  const [enabled, setEnabled] = useState([]);
  const [pending, setPending] = useState(null);

  useEffect(() => {
    getEnabledProviders().then(setEnabled);
  }, []);

  const signIn = async (provider) => {
    setPending(provider);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}${redirectTo}` },
    });
    // On success the browser leaves the page, so we only get here on failure
    if (error) {
      notify(error.message, "error");
      setPending(null);
    }
  };

  const visible = PROVIDERS.filter((p) => enabled.includes(p.id));
  if (visible.length === 0) return null;

  return (
    <>
      <Divider sx={{ color: "text.secondary", fontSize: 13 }}>or continue with</Divider>
      <Box sx={{ display: "grid", gridTemplateColumns: `repeat(${visible.length}, 1fr)`, gap: 1.25 }}>
        {visible.map((p) => (
          <Button
            key={p.id}
            variant="outlined"
            size="large"
            color="inherit"
            startIcon={p.icon}
            onClick={() => signIn(p.id)}
            disabled={Boolean(pending)}
            aria-label={`Continue with ${p.label}`}
            sx={{ borderColor: "divider", "&:hover": { borderColor: "text.secondary" } }}
          >
            {pending === p.id ? "Redirecting…" : p.label}
          </Button>
        ))}
      </Box>
    </>
  );
}

export default SocialLogin;
