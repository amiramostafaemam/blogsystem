import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Avatar,
  Badge,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { updateProfile, uploadImage } from "../api/profiles";
import { useAuth } from "../context/AuthContext";
import { useNotify } from "../context/NotifyContext";
import PageMeta from "../components/PageMeta";
import { resizeImage } from "../utils";

const BIO_MAX = 280;

function Settings() {
  const { user, updateUser } = useAuth();
  const notify = useNotify();
  const fileRef = useRef(null);
  const [form, setForm] = useState({ name: user.name ?? "", bio: user.bio ?? "" });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const dirty = form.name !== (user.name ?? "") || form.bio !== (user.bio ?? "");
  const nameError = !form.name.trim() ? "Name is required" : form.name.length > 60 ? "Max 60 characters" : "";

  const handleAvatar = async (e) => {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      const blob = await resizeImage(file, 320);
      const url = await uploadImage("avatars", user.id, blob);
      await updateProfile(user.id, { avatar_url: url });
      updateUser({ avatar_url: url });
      notify("Profile picture updated");
    } catch (err) {
      notify(err.message || "Couldn't update your picture", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (nameError) return;
    setSaving(true);
    try {
      const values = { name: form.name.trim(), bio: form.bio.trim() || null };
      await updateProfile(user.id, values);
      updateUser(values);
      notify("Profile saved");
    } catch (err) {
      notify(err.message || "Couldn't save your profile", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 640, mx: "auto" }}>
      <PageMeta title="Settings" />
      <Typography variant="h3" component="h1" sx={{ fontSize: { xs: "2rem", md: "2.5rem" } }} mb={1}>
        Settings
      </Typography>
      <Typography color="text.secondary" mb={4}>
        This is how other readers see you.{" "}
        <Box component={Link} to={`/u/${user.id}`} sx={{ color: "primary.main" }}>
          View your public profile
        </Box>
      </Typography>

      <Paper variant="outlined" sx={{ p: { xs: 3, sm: 4 }, borderRadius: 4 }}>
        <Stack direction="row" spacing={3} alignItems="center" mb={4}>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            badgeContent={
              <IconButton
                size="small"
                onClick={() => fileRef.current.click()}
                disabled={uploading}
                aria-label="Change profile picture"
                sx={{ bgcolor: "primary.main", color: "primary.contrastText", "&:hover": { bgcolor: "primary.dark" } }}
              >
                {uploading ? <CircularProgress size={16} color="inherit" /> : <PhotoCameraIcon sx={{ fontSize: 16 }} />}
              </IconButton>
            }
          >
            <Avatar src={user.avatar_url} alt={user.name} sx={{ width: 88, height: 88, fontSize: 36 }}>
              {user.name?.[0]?.toUpperCase()}
            </Avatar>
          </Badge>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleAvatar} />
          <Box>
            <Typography fontWeight={700}>Profile picture</Typography>
            <Typography variant="body2" color="text.secondary">
              JPG or PNG. We'll crop and resize it for you.
            </Typography>
          </Box>
        </Stack>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={2.5}>
            <TextField
              label="Display name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              error={Boolean(nameError)}
              helperText={nameError}
              fullWidth
            />
            <TextField
              label="Bio"
              value={form.bio}
              onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value.slice(0, BIO_MAX) }))}
              helperText={`${form.bio.length}/${BIO_MAX}`}
              placeholder="Coffee lover, weekend hiker, writes about slow living…"
              multiline
              minRows={3}
              fullWidth
            />
            <TextField label="Email" value={user.email ?? ""} disabled fullWidth helperText="Only you can see this." />
            <Stack direction="row" justifyContent="flex-end">
              <Button type="submit" variant="contained" disabled={!dirty || saving || Boolean(nameError)}>
                {saving ? "Saving…" : "Save changes"}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}

export default Settings;
