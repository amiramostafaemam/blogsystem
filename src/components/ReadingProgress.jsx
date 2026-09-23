import { useEffect, useState } from "react";
import { Box } from "@mui/material";

// Thin bar under the navbar that fills as you read
function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <Box
      role="progressbar"
      aria-label="Reading progress"
      aria-valuenow={Math.round(progress * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      sx={{
        position: "fixed",
        top: { xs: 56, sm: 64 },
        left: 0,
        right: 0,
        height: 3,
        zIndex: (theme) => theme.zIndex.appBar,
        bgcolor: "transparent",
      }}
    >
      <Box
        sx={{
          height: "100%",
          width: "100%",
          bgcolor: "primary.main",
          transformOrigin: "left",
          transform: `scaleX(${progress})`,
        }}
      />
    </Box>
  );
}

export default ReadingProgress;
