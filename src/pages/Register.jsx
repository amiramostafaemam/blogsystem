import { useEffect, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Link as MuiLink,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { updateProfile, uploadImage } from "../api/profiles";
import AuthLayout from "../components/AuthLayout";
import PasswordField from "../components/PasswordField";
import PageMeta from "../components/PageMeta";
import SocialLogin from "../components/SocialLogin";
import DemoBanner from "../components/DemoBanner";
import { resizeImage } from "../utils";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = "Name is required";
  else if (form.name.length > 60) errors.name = "Max 60 characters";
  if (!EMAIL_RE.test(form.email.trim())) errors.email = "Enter a valid email";
  if (form.password.length < 8) errors.password = "At least 8 characters";
  if (form.confirmPassword !== form.password) errors.confirmPassword = "Passwords do not match";
  return errors;
}

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [avatar, setAvatar] = useState(null); // { blob, preview }
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { signUp, updateUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => () => avatar && URL.revokeObjectURL(avatar.preview), [avatar]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setServerError("");
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const blob = await resizeImage(file, 320);
      setAvatar({ blob, preview: URL.createObjectURL(blob) });
    } catch {
      setServerError("That image couldn't be read. Try another one.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) return;

    setSubmitting(true);
    try {
      const user = await signUp({
        email: form.email.trim().toLowerCase(),
        password: form.password,
        name: form.name.trim(),
      });
      // Uploading needs a session, so the avatar goes up right after sign up
      if (avatar) {
        try {
          const url = await uploadImage("avatars", user.id, avatar.blob);
          await updateProfile(user.id, { avatar_url: url });
          updateUser({ avatar_url: url });
        } catch {
          // not fatal: they can add it later in Settings
        }
      }
      navigate("/explore", { replace: true });
    } catch (err) {
      setServerError(err.message || "Registration failed");
      setSubmitting(false);
    }
  };

  const field = (name) => ({
    name,
    value: form[name],
    onChange: handleChange,
    error: Boolean(errors[name]),
    helperText: errors[name],
    fullWidth: true,
  });

  return (
    <AuthLayout title="Create your account" subtitle="It only takes a minute.">
      <PageMeta title="Sign up" />
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Stack spacing={2}>
          <DemoBanner />
          {serverError && <Alert severity="error">{serverError}</Alert>}

          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar src={avatar?.preview} sx={{ width: 64, height: 64 }}>
              {form.name.trim()[0]?.toUpperCase()}
            </Avatar>
            <Button component="label" variant="outlined" startIcon={<PhotoCameraIcon />}>
              {avatar ? "Change photo" : "Add photo (optional)"}
              <input type="file" hidden accept="image/*" onChange={handleImageChange} />
            </Button>
          </Stack>

          <TextField label="Name" autoComplete="name" autoFocus {...field("name")} />
          <TextField label="Email" type="email" autoComplete="email" {...field("email")} />
          <PasswordField label="Password" autoComplete="new-password" {...field("password")} />
          <PasswordField label="Confirm password" autoComplete="new-password" {...field("confirmPassword")} />

          <Button type="submit" variant="contained" size="large" fullWidth disabled={submitting}>
            {submitting ? "Creating account…" : "Sign up"}
          </Button>
          <SocialLogin />
          <Typography variant="body2" textAlign="center" color="text.secondary">
            Already have an account?{" "}
            <MuiLink component={Link} to="/login" fontWeight={600}>
              Log in
            </MuiLink>
          </Typography>
        </Stack>
      </Box>
    </AuthLayout>
  );
}

export default Register;
