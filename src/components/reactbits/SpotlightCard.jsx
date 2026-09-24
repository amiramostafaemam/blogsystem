// SpotlightCard from React Bits (https://reactbits.dev) by David Haz.
// MIT + Commons Clause, see ./LICENSE.md.
// Adapted for Crema: styles moved from SpotlightCard.css into MUI `sx` so the card
// follows the theme, and extra props are forwarded to the root element.
import { useRef } from "react";
import { Box } from "@mui/material";

const SpotlightCard = ({ children, spotlightColor = "rgba(255, 255, 255, 0.25)", sx, ...rest }) => {
  const divRef = useRef(null);

  const handleMouseMove = (e) => {
    const rect = divRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    divRef.current.style.setProperty("--mouse-x", `${x}px`);
    divRef.current.style.setProperty("--mouse-y", `${y}px`);
    divRef.current.style.setProperty("--spotlight-color", spotlightColor);
  };

  return (
    <Box
      ref={divRef}
      onMouseMove={handleMouseMove}
      sx={[
        {
        position: "relative",
        overflow: "hidden",
        "--mouse-x": "50%",
        "--mouse-y": "50%",
        "--spotlight-color": spotlightColor,
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at var(--mouse-x) var(--mouse-y), var(--spotlight-color), transparent 80%)",
          opacity: 0,
          transition: "opacity 0.5s ease",
          pointerEvents: "none",
          zIndex: 1,
        },
        "&:hover::before, &:focus-within::before": { opacity: 0.6 },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...rest}
    >
      {children}
    </Box>
  );
};

export default SpotlightCard;
