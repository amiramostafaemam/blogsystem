import { useEffect, useState } from "react";
import { Box, Button, Chip, Stack, TextField, Typography } from "@mui/material";
import CoverUpload from "./CoverUpload";
import TagInput from "./TagInput";
import MarkdownEditor from "./MarkdownEditor";
import { readingTime, stripMarkdown } from "../../utils";

const EMPTY = { title: "", content: "", image: "", tags: [] };
const TITLE_MAX = 120;
const MIN_CONTENT = 20;

function validate(form, status) {
  const errors = {};
  if (!form.title.trim()) errors.title = "Give your story a title";
  else if (form.title.length > TITLE_MAX) errors.title = `Keep it under ${TITLE_MAX} characters`;
  if (status === "published" && form.content.trim().length < MIN_CONTENT)
    errors.content = `Write at least ${MIN_CONTENT} characters before publishing`;
  return errors;
}

/**
 * Shared editor for new and existing posts.
 * onSave(values, status) must return a promise; status is "draft" or "published".
 */
function PostEditor({ initialValues = EMPTY, currentStatus, onSave, onCancel }) {
  const [form, setForm] = useState({ ...EMPTY, ...initialValues });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(null); // null | "draft" | "published"
  const [dirty, setDirty] = useState(false);

  // Warn before closing the tab with unsaved changes
  useEffect(() => {
    if (!dirty) return;
    const handler = (e) => e.preventDefault();
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const set = (field) => (value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setDirty(true);
  };

  const save = async (status) => {
    const found = validate(form, status);
    setErrors(found);
    if (Object.keys(found).length) return;

    setSaving(status);
    try {
      await onSave(
        { title: form.title.trim(), content: form.content.trim(), image: form.image || null, tags: form.tags },
        status
      );
      setDirty(false);
    } finally {
      setSaving(null);
    }
  };

  const words = stripMarkdown(form.content).split(" ").filter(Boolean).length;
  const isPublished = currentStatus === "published";

  return (
    <Box sx={{ maxWidth: 820, mx: "auto" }}>
      <Stack
        direction="row"
        alignItems="center"
        spacing={1.5}
        sx={{
          position: "sticky",
          top: { xs: 56, sm: 64 },
          zIndex: 2,
          py: 1.5,
          mb: 3,
          bgcolor: "background.default",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Chip
          size="small"
          label={currentStatus ? (isPublished ? "Published" : "Draft") : "New story"}
          color={isPublished ? "success" : "default"}
          variant="outlined"
        />
        <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}>
          {words} words · {readingTime(form.content)}
          {dirty && " · unsaved changes"}
        </Typography>
        <Box sx={{ flexGrow: { xs: 1, sm: 0 } }} />
        {onCancel && (
          <Button onClick={onCancel} disabled={Boolean(saving)} sx={{ display: { xs: "none", sm: "inline-flex" } }}>
            Cancel
          </Button>
        )}
        <Button variant="outlined" onClick={() => save("draft")} disabled={Boolean(saving)}>
          {saving === "draft" ? "Saving…" : isPublished ? "Unpublish" : "Save draft"}
        </Button>
        <Button variant="contained" onClick={() => save("published")} disabled={Boolean(saving)}>
          {saving === "published" ? "Publishing…" : isPublished ? "Update" : "Publish"}
        </Button>
      </Stack>

      <Stack spacing={3}>
        <CoverUpload value={form.image} onChange={set("image")} />

        <TextField
          placeholder="Your story's title"
          value={form.title}
          onChange={(e) => set("title")(e.target.value)}
          error={Boolean(errors.title)}
          helperText={errors.title || `${form.title.length}/${TITLE_MAX}`}
          multiline
          fullWidth
          variant="standard"
          slotProps={{ input: { disableUnderline: true }, htmlInput: { "aria-label": "Title" } }}
          sx={{
            "& .MuiInputBase-input": {
              fontFamily: '"Playfair Display", serif',
              fontWeight: 700,
              fontSize: { xs: "2rem", md: "2.6rem" },
              lineHeight: 1.2,
            },
          }}
        />

        <TagInput value={form.tags} onChange={set("tags")} />

        <MarkdownEditor
          value={form.content}
          onChange={set("content")}
          error={Boolean(errors.content)}
          helperText={errors.content || "Markdown supported"}
        />
      </Stack>
    </Box>
  );
}

export default PostEditor;
