import { Box } from "@mui/material";
import { alpha } from "@mui/material/styles";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const components = {
  // External links open in a new tab
  a: ({ href, children }) => {
    const external = /^https?:\/\//.test(href ?? "");
    return (
      <a href={href} {...(external && { target: "_blank", rel: "noreferrer noopener" })}>
        {children}
      </a>
    );
  },
  img: ({ src, alt }) => <img src={src} alt={alt ?? ""} loading="lazy" />,
};

// Renders post content with the article typography. Raw HTML is never rendered.
function Markdown({ children, dropCap = false, sx }) {
  return (
    <Box
      sx={(theme) => ({
        fontSize: { xs: "1.06rem", md: "1.15rem" },
        lineHeight: 1.85,
        wordBreak: "break-word",
        "& > *:first-of-type": { mt: 0 },
        "& p": { mt: 0, mb: 3 },
        "& h1, & h2, & h3": {
          fontFamily: '"Playfair Display", serif',
          lineHeight: 1.25,
          mt: 5,
          mb: 2,
        },
        "& h1": { fontSize: "2rem" },
        "& h2": { fontSize: "1.65rem" },
        "& h3": { fontSize: "1.3rem" },
        "& a": { color: "primary.main", textUnderlineOffset: "3px" },
        "& blockquote": {
          m: 0,
          mb: 3,
          pl: 3,
          py: 0.5,
          borderLeft: "4px solid",
          borderColor: "primary.main",
          fontFamily: '"Playfair Display", serif',
          fontStyle: "italic",
          fontSize: "1.2em",
          color: "text.secondary",
          "& p": { mb: 0 },
        },
        "& ul, & ol": { pl: 3.5, mb: 3, "& li": { mb: 0.75 } },
        "& code": {
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
          fontSize: "0.88em",
          px: 0.75,
          py: 0.25,
          borderRadius: 1,
          bgcolor: alpha(theme.palette.primary.main, 0.1),
        },
        "& pre": {
          p: 2.5,
          mb: 3,
          borderRadius: 2,
          overflowX: "auto",
          bgcolor: theme.palette.mode === "dark" ? "#0d0b0a" : "#2B1D1A",
          color: "#F3ECE6",
          fontSize: "0.9rem",
          lineHeight: 1.6,
          "& code": { p: 0, bgcolor: "transparent", fontSize: "inherit" },
        },
        "& img": { maxWidth: "100%", borderRadius: 2, my: 1 },
        "& hr": { border: 0, textAlign: "center", my: 5, "&::before": { content: '"· · ·"', letterSpacing: "0.6em", color: "text.secondary" } },
        "& table": { width: "100%", borderCollapse: "collapse", mb: 3, fontSize: "0.95rem" },
        "& th, & td": { border: 1, borderColor: "divider", px: 1.5, py: 1, textAlign: "left" },
        ...(dropCap && {
          "& > p:first-of-type::first-letter": {
            float: "left",
            fontFamily: '"Playfair Display", serif',
            fontWeight: 700,
            fontSize: "3.6em",
            lineHeight: 0.8,
            mr: 1.5,
            mt: 1,
            color: "primary.main",
          },
        }),
        ...sx,
      })}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </ReactMarkdown>
    </Box>
  );
}

export default Markdown;
