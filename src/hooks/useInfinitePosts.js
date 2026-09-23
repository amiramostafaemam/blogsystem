import { useCallback, useEffect, useRef, useState } from "react";
import { listPosts, PAGE_SIZE } from "../api/posts";

// Paginated published posts; resets whenever the filters change
export function useInfinitePosts({ search = "", tag = "" }) {
  const [posts, setPosts] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [hasMore, setHasMore] = useState(true);
  const pageRef = useRef(0);
  const requestRef = useRef(0);

  const fetchPage = useCallback(
    async (page) => {
      const request = ++requestRef.current;
      setStatus("loading");
      try {
        const data = await listPosts({ page, search, tag });
        if (request !== requestRef.current) return; // a newer request won
        setPosts((prev) => (page === 0 ? data : [...prev, ...data]));
        setHasMore(data.length === PAGE_SIZE);
        pageRef.current = page;
        setStatus("ready");
      } catch {
        if (request === requestRef.current) setStatus("error");
      }
    },
    [search, tag]
  );

  useEffect(() => {
    setPosts([]);
    setHasMore(true);
    fetchPage(0);
  }, [fetchPage]);

  const loadMore = useCallback(() => {
    if (status === "ready" && hasMore) fetchPage(pageRef.current + 1);
  }, [status, hasMore, fetchPage]);

  const retry = useCallback(() => fetchPage(pageRef.current + (posts.length ? 1 : 0)), [fetchPage, posts.length]);

  const removePost = useCallback((id) => setPosts((prev) => prev.filter((p) => p.id !== id)), []);

  return { posts, status, hasMore, loadMore, retry, removePost };
}
