// Pure helpers for the markdown toolbar. Each returns the new text and selection.

const WRAPS = {
  bold: ["**", "**", "bold text"],
  italic: ["_", "_", "italic text"],
  code: ["`", "`", "code"],
  link: ["[", "](https://)", "link text"],
};

const LINE_PREFIXES = {
  heading: "## ",
  quote: "> ",
  list: "- ",
};

export function applyFormat(action, text, start, end) {
  if (WRAPS[action]) {
    const [before, after, placeholder] = WRAPS[action];
    const selected = text.slice(start, end) || placeholder;
    const next = text.slice(0, start) + before + selected + after + text.slice(end);
    const selStart = start + before.length;
    return { text: next, selectionStart: selStart, selectionEnd: selStart + selected.length };
  }

  if (LINE_PREFIXES[action]) {
    const prefix = LINE_PREFIXES[action];
    // Expand to whole lines, then toggle the prefix on each one
    const lineStart = text.lastIndexOf("\n", start - 1) + 1;
    const lineEndIdx = text.indexOf("\n", end);
    const lineEnd = lineEndIdx === -1 ? text.length : lineEndIdx;
    const lines = text.slice(lineStart, lineEnd).split("\n");
    const allPrefixed = lines.every((line) => line.startsWith(prefix));
    const updated = lines
      .map((line) => (allPrefixed ? line.slice(prefix.length) : prefix + line))
      .join("\n");
    const next = text.slice(0, lineStart) + updated + text.slice(lineEnd);
    return { text: next, selectionStart: lineStart, selectionEnd: lineStart + updated.length };
  }

  return { text, selectionStart: start, selectionEnd: end };
}
