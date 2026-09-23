export function formatDate(iso) {
  return iso
    ? new Date(iso).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";
}

const UNITS = [
  ["year", 31536000],
  ["month", 2592000],
  ["week", 604800],
  ["day", 86400],
  ["hour", 3600],
  ["minute", 60],
];

export function timeAgo(iso, now = Date.now()) {
  const seconds = Math.round((now - new Date(iso).getTime()) / 1000);
  if (seconds < 45) return "just now";
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const [unit, size] = UNITS.find(([, s]) => seconds >= s) ?? UNITS[UNITS.length - 1];
  return rtf.format(-Math.round(seconds / size), unit);
}

// Markdown -> plain text, good enough for excerpts and word counts
export function stripMarkdown(md = "") {
  return md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)]\([^)]*\)/g, "$1")
    .replace(/^\s{0,3}(#{1,6}|>|[-*+]|\d+\.)\s+/gm, "")
    .replace(/(\*\*|__|\*|_|~~)(.*?)\1/g, "$2")
    .replace(/^\s*([-*_]\s*){3,}$/gm, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function readingTime(markdown = "") {
  const words = stripMarkdown(markdown).split(" ").filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

export function excerpt(markdown = "", length = 180) {
  const text = stripMarkdown(markdown);
  return text.length > length ? `${text.slice(0, length).trimEnd()}…` : text;
}

// "slow coffee" -> "slow:* & coffee:*" (prefix match on every word)
export function toSearchQuery(input = "") {
  const words = input.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];
  return words.map((w) => `${w}:*`).join(" & ");
}

// "  Slow Living! " -> "slow-living"
export function normalizeTag(tag = "") {
  return tag
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .slice(0, 24);
}

// Shrink an image to a JPEG blob before uploading
export function resizeImage(file, maxSize = 256, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("Could not process image"))),
        "image/jpeg",
        quality
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read image"));
    };
    img.src = url;
  });
}
