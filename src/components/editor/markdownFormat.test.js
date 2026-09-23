import { describe, expect, it } from "vitest";
import { applyFormat } from "./markdownFormat";

describe("applyFormat", () => {
  it("wraps the selection in bold markers and keeps it selected", () => {
    const result = applyFormat("bold", "make this loud", 10, 14);
    expect(result.text).toBe("make this **loud**");
    expect(result.text.slice(result.selectionStart, result.selectionEnd)).toBe("loud");
  });

  it("inserts a placeholder when nothing is selected", () => {
    const result = applyFormat("italic", "abc", 3, 3);
    expect(result.text).toBe("abc_italic text_");
    expect(result.text.slice(result.selectionStart, result.selectionEnd)).toBe("italic text");
  });

  it("prefixes every selected line for lists", () => {
    const result = applyFormat("list", "one\ntwo\nthree", 0, 7);
    expect(result.text).toBe("- one\n- two\nthree");
  });

  it("toggles a heading off when it is already there", () => {
    const result = applyFormat("heading", "## Title", 3, 3);
    expect(result.text).toBe("Title");
  });
});
