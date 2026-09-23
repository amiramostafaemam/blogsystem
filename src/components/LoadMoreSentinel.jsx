import { useEffect, useRef } from "react";
import { Box } from "@mui/material";

// Invisible marker that calls onVisible when it scrolls near the viewport
function LoadMoreSentinel({ onVisible }) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && onVisible(),
      { rootMargin: "600px 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [onVisible]);

  return <Box ref={ref} sx={{ height: 1 }} aria-hidden="true" />;
}

export default LoadMoreSentinel;
