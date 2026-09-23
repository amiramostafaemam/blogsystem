import { useRef, useState } from "react";
import { Box, Divider, IconButton, Stack, Tab, Tabs, TextField, Tooltip, Typography } from "@mui/material";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import TitleIcon from "@mui/icons-material/Title";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import LinkIcon from "@mui/icons-material/Link";
import CodeIcon from "@mui/icons-material/Code";
import Markdown from "../Markdown";
import { applyFormat } from "./markdownFormat";

const TOOLS = [
  { action: "bold", label: "Bold (Ctrl+B)", icon: <FormatBoldIcon fontSize="small" /> },
  { action: "italic", label: "Italic (Ctrl+I)", icon: <FormatItalicIcon fontSize="small" /> },
  { action: "heading", label: "Heading", icon: <TitleIcon fontSize="small" /> },
  { action: "quote", label: "Quote", icon: <FormatQuoteIcon fontSize="small" /> },
  { action: "list", label: "Bulleted list", icon: <FormatListBulletedIcon fontSize="small" /> },
  { action: "link", label: "Link (Ctrl+K)", icon: <LinkIcon fontSize="small" /> },
  { action: "code", label: "Inline code", icon: <CodeIcon fontSize="small" /> },
];

const SHORTCUTS = { b: "bold", i: "italic", k: "link" };

function MarkdownEditor({ value, onChange, error, helperText }) {
  const [tab, setTab] = useState("write");
  const inputRef = useRef(null);

  const format = (action) => {
    const el = inputRef.current;
    if (!el) return;
    const result = applyFormat(action, value, el.selectionStart, el.selectionEnd);
    onChange(result.text);
    // Restore the selection after React re-renders the textarea
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(result.selectionStart, result.selectionEnd);
    });
  };

  const handleKeyDown = (e) => {
    const action = (e.ctrlKey || e.metaKey) && SHORTCUTS[e.key.toLowerCase()];
    if (action) {
      e.preventDefault();
      format(action);
    }
  };

  return (
    <Box sx={{ border: 1, borderColor: error ? "error.main" : "divider", borderRadius: 3, overflow: "hidden", bgcolor: "background.paper" }}>
      <Stack direction="row" alignItems="center" sx={{ px: 1, borderBottom: 1, borderColor: "divider", flexWrap: "wrap" }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ minHeight: 44, "& .MuiTab-root": { minHeight: 44, py: 0 } }}>
          <Tab value="write" label="Write" />
          <Tab value="preview" label="Preview" />
        </Tabs>
        {tab === "write" && (
          <>
            <Divider orientation="vertical" flexItem sx={{ mx: 1, my: 1 }} />
            <Stack direction="row" sx={{ flexWrap: "wrap" }}>
              {TOOLS.map((tool) => (
                <Tooltip key={tool.action} title={tool.label}>
                  <IconButton size="small" onClick={() => format(tool.action)} aria-label={tool.label}>
                    {tool.icon}
                  </IconButton>
                </Tooltip>
              ))}
            </Stack>
          </>
        )}
      </Stack>

      {tab === "write" ? (
        <TextField
          inputRef={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={"Tell your story…\n\nTip: use **bold**, _italic_, ## headings, > quotes and - lists."}
          multiline
          minRows={14}
          fullWidth
          variant="standard"
          slotProps={{ input: { disableUnderline: true } }}
          sx={{ "& .MuiInputBase-root": { p: 2.5, fontSize: "1.05rem", lineHeight: 1.8, alignItems: "flex-start" } }}
        />
      ) : (
        <Box sx={{ p: 3, minHeight: 360 }}>
          {value.trim() ? (
            <Markdown>{value}</Markdown>
          ) : (
            <Typography color="text.secondary">Nothing to preview yet.</Typography>
          )}
        </Box>
      )}

      {helperText && (
        <Typography variant="caption" color={error ? "error" : "text.secondary"} sx={{ display: "block", px: 2.5, pb: 1.5 }}>
          {helperText}
        </Typography>
      )}
    </Box>
  );
}

export default MarkdownEditor;
