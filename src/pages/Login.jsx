import { useState } from "react";
import { Alert, Box, Button, Link as MuiLink, Stack, TextField, Typography } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/AuthLayout";
import PasswordField from "../components/PasswordField";
import PageMeta from "../components/PageMeta";
import SocialLogin from "../components/SocialLogin";
import DemoBanner from "../components/DemoBanner";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Please enter your email and password.");
      return;
    }

    setSubmitting(true);
    try {
      await signIn(form.email.trim(), form.password);
      const from = location.state?.from;
      navigate(from ? from.pathname + (from.search ?? "") : "/explore", { replace: true });
    } catch {
      setError("Invalid email or password.");
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to keep the conversation going.">
      <PageMeta title="Log in" />
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Stack spacing={2}>
          <DemoBanner />
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
            autoFocus
          />
          <PasswordField
            label="Password"
            name="password"
            autoComplete="current-password"
            value={form.password}
            onChange={handleChange}
            fullWidth
          />
          <Button type="submit" variant="contained" size="large" fullWidth disabled={submitting}>
            {submitting ? "Logging in…" : "Log in"}
          </Button>
          <SocialLogin redirectTo={location.state?.from?.pathname ?? "/explore"} />
          <Typography variant="body2" textAlign="center" color="text.secondary">
            New here?{" "}
            <MuiLink component={Link} to="/register" fontWeight={600}>
              Create an account
            </MuiLink>
          </Typography>
        </Stack>
      </Box>
    </AuthLayout>
  );
}

export default Login;
