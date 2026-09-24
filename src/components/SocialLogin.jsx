import { useEffect, useState } from "react";
import { Button, Divider, Stack } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";
import { getEnabledProviders, supabase } from "../lib/supabase";
import { useNotify } from "../context/NotifyContext";

const PROVIDERS = [
  { id: "google", label: "Continue with Google", icon: <GoogleIcon /> },
  { id: "github", label: "Continue with GitHub", icon: <GitHubIcon /> },
];

// Shows a button for each OAuth provider that is switched on in Supabase
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
      <Stack spacing={1.25}>
        {visible.map((p) => (
          <Button
            key={p.id}
            variant="outlined"
            size="large"
            color="inherit"
            fullWidth
            startIcon={p.icon}
            onClick={() => signIn(p.id)}
            disabled={Boolean(pending)}
            sx={{ borderColor: "divider" }}
          >
            {pending === p.id ? "Redirecting…" : p.label}
          </Button>
        ))}
      </Stack>
      <Divider sx={{ color: "text.secondary", fontSize: 13 }}>or use your email</Divider>
    </>
  );
}

export default SocialLogin;
