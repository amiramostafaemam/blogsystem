import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PostCard from "./PostCard";

// PostCard only needs to know whether someone is signed in
vi.mock("../context/AuthContext", () => ({ useAuth: () => ({ user: null }) }));
vi.mock("../context/NotifyContext", () => ({ useNotify: () => vi.fn() }));

const post = {
  id: 7,
  title: "A Weekend in the Mountains",
  content: "The **last bar** of signal disappeared somewhere around the third switchback.",
  image: null,
  tags: ["travel", "slow-living"],
  created_at: "2026-09-12T10:00:00Z",
  user_id: "u1",
  author: { id: "u1", name: "Nour Adel", avatar_url: null },
  likeCount: 12,
  commentCount: 3,
};

function renderCard(props = {}) {
  return render(
    <MemoryRouter>
      <PostCard post={post} {...props} />
    </MemoryRouter>
  );
}

describe("PostCard", () => {
  it("shows the title, a plain-text excerpt and the author", () => {
    renderCard();
    expect(screen.getByRole("heading", { name: post.title })).toBeInTheDocument();
    expect(screen.getByText(/The last bar of signal/)).toBeInTheDocument();
    expect(screen.getByText("Nour Adel")).toBeInTheDocument();
  });

  it("links to the post page and the author profile", () => {
    renderCard();
    expect(screen.getByRole("heading", { name: post.title }).closest("a")).toHaveAttribute("href", "/posts/7");
    expect(screen.getByText("Nour Adel").closest("a")).toHaveAttribute("href", "/u/u1");
  });

  it("renders tags and reaction counts", () => {
    renderCard();
    expect(screen.getByText("#travel")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Like" })).toHaveTextContent("12");
    expect(screen.getByLabelText("3 comments")).toBeInTheDocument();
  });

  it("reflects an existing like", () => {
    renderCard({ liked: true });
    expect(screen.getByRole("button", { name: "Unlike" })).toHaveAttribute("aria-pressed", "true");
  });
});
