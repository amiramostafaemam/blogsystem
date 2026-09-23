import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <Box sx={{ textAlign: "center", py: 10 }}>
      <Typography fontSize={64}>☕</Typography>
      <Typography variant="h3" component="h1" gutterBottom>
        Page not found
      </Typography>
      <Typography color="text.secondary" mb={4}>
        Looks like this cup is empty.
      </Typography>
      <Button component={Link} to="/explore" variant="contained">
        Back to posts
      </Button>
    </Box>
  );
}

export default NotFound;
