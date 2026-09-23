import { useRef, useState } from "react";
import { Box, Button, CircularProgress, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import { uploadImage } from "../../api/profiles";
import { useAuth } from "../../context/AuthContext";
import { useNotify } from "../../context/NotifyContext";
import { resizeImage } from "../../utils";

const MAX_BYTES = 10 * 1024 * 1024;

// Drag & drop (or click) to upload a cover image to Supabase Storage
function CoverUpload({ value, onChange }) {
  const { user } = useAuth();
  const notify = useNotify();
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return notify("Please choose an image file", "warning");
    if (file.size > MAX_BYTES) return notify("That image is over 10 MB", "warning");

    setUploading(true);
    try {
      const blob = await resizeImage(file, 1600, 0.82);
      onChange(await uploadImage("covers", user.id, blob));
    } catch (err) {
      notify(err.message || "Upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  const dropHandlers = {
    onDragOver: (e) => {
      e.preventDefault();
      setDragging(true);
    },
    onDragLeave: () => setDragging(false),
    onDrop: (e) => {
      e.preventDefault();
      setDragging(false);
      handleFile(e.dataTransfer.files[0]);
    },
  };

  const picker = (
    <input
      ref={inputRef}
      type="file"
      accept="image/*"
      hidden
      onChange={(e) => {
        handleFile(e.target.files[0]);
        e.target.value = "";
      }}
    />
  );

  if (value) {
    return (
      <Box sx={{ position: "relative", borderRadius: 3, overflow: "hidden" }} {...dropHandlers}>
        <Box component="img" src={value} alt="Cover" sx={{ width: "100%", aspectRatio: "21 / 9", objectFit: "cover", display: "block" }} />
        <Stack direction="row" spacing={1} sx={{ position: "absolute", top: 12, right: 12 }}>
          <Button size="small" variant="contained" color="secondary" onClick={() => inputRef.current.click()} disabled={uploading}>
            {uploading ? "Uploading…" : "Replace"}
          </Button>
          <Button size="small" variant="contained" color="secondary" onClick={() => onChange("")} disabled={uploading}>
            Remove
          </Button>
        </Stack>
        {picker}
      </Box>
    );
  }

  return (
    <Box
      role="button"
      tabIndex={0}
      onClick={() => !uploading && inputRef.current.click()}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current.click()}
      {...dropHandlers}
      sx={(theme) => ({
        display: "grid",
        placeItems: "center",
        aspectRatio: { xs: "16 / 9", sm: "21 / 7" },
        borderRadius: 3,
        border: "2px dashed",
        borderColor: dragging ? "primary.main" : "divider",
        bgcolor: dragging ? alpha(theme.palette.primary.main, 0.06) : "transparent",
        cursor: "pointer",
        textAlign: "center",
        transition: "all .2s",
        "&:hover": { borderColor: "primary.main" },
      })}
    >
      {uploading ? (
        <CircularProgress size={28} />
      ) : (
        <Box>
          <AddPhotoAlternateIcon sx={{ fontSize: 36, color: "primary.main", mb: 1 }} />
          <Typography fontWeight={600}>Add a cover image</Typography>
          <Typography variant="body2" color="text.secondary">
            Drag & drop or click to upload · JPG, PNG, WebP up to 10 MB
          </Typography>
        </Box>
      )}
      {picker}
    </Box>
  );
}

export default CoverUpload;
