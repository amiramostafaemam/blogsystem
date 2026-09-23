import { describe, expect, it } from "vitest";
import { excerpt, normalizeTag, readingTime, stripMarkdown, timeAgo, toSearchQuery } from "./utils";

describe("stripMarkdown", () => {
  it("removes formatting but keeps the words", () => {
    const md = "## Title\n\nSome **bold** and _italic_ with a [link](https://x.dev) and `code`.\n\n> quote\n- item";
    expect(stripMarkdown(md)).toBe("Title Some bold and italic with a link and code. quote item");
  });

  it("drops images and code blocks entirely", () => {
    expect(stripMarkdown("Hi ![cat](cat.png)\n```js\nconst a = 1;\n```\nbye")).toBe("Hi bye");
  });
});

describe("readingTime", () => {
  it("never reports less than a minute", () => {
    expect(readingTime("short")).toBe("1 min read");
  });

  it("assumes about 200 words per minute", () => {
    expect(readingTime(Array(1000).fill("word").join(" "))).toBe("5 min read");
  });
});

describe("excerpt", () => {
  it("adds an ellipsis only when the text is cut", () => {
    expect(excerpt("hello world", 50)).toBe("hello world");
    expect(excerpt("hello wonderful world", 10)).toBe("hello wond…");
  });
});

describe("toSearchQuery", () => {
  it("turns words into prefix matches joined with AND", () => {
    expect(toSearchQuery("Slow  Coffee")).toBe("slow:* & coffee:*");
  });

  it("strips characters that would break tsquery syntax", () => {
    expect(toSearchQuery("c'mon & (hack) |!")).toBe("c:* & mon:* & hack:*");
  });

  it("returns an empty string for blank input", () => {
    expect(toSearchQuery("   ")).toBe("");
  });

  it("keeps non-latin letters", () => {
    expect(toSearchQuery("قهوة")).toBe("قهوة:*");
  });
});

describe("normalizeTag", () => {
  it("lowercases, trims and hyphenates", () => {
    expect(normalizeTag("  Slow Living! ")).toBe("slow-living");
  });
});

describe("timeAgo", () => {
  const now = new Date("2026-09-23T12:00:00Z").getTime();

  it("says just now for recent times", () => {
    expect(timeAgo("2026-09-23T11:59:40Z", now)).toBe("just now");
  });

  it("uses the largest fitting unit", () => {
    expect(timeAgo("2026-09-23T09:00:00Z", now)).toBe("3 hours ago");
    expect(timeAgo("2026-09-22T12:00:00Z", now)).toBe("yesterday");
  });
});
