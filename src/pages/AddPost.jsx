import {
  Container,
  TextField,
  Button,
  Typography,
  Stack,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addPost } from "../api/api";
import { useAuth } from "../context/AuthContext";

function AddPost() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    image: "",
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const postData = {
        ...form,
        author: {
          name: user.name,
          profileImage: user.profileImage,
        },
        createdAt: new Date().toISOString(),
      };

      await addPost(postData, token);
      setOpenSnackbar(true);
      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      alert("Failed to add the post");
      console.error(err);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <Container
      maxWidth="sm"
      sx={{
        mt: 8,
        background: "linear-gradient(to bottom right, #E8D8C4, #C7B7A3)",
        borderRadius: 4,
        p: 2,
      }}
    >
      <Paper elevation={5} sx={{ p: 4, backgroundColor: "#F9F4ED", borderRadius: 4 }}>
        <Typography
          variant="h5"
          gutterBottom
          align="center"
          sx={{ color: "#561C24", fontWeight: "bold" }}
        >
          Create New Post
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Image URL"
              name="image"
              value={form.image}
              onChange={handleChange}
              fullWidth
              required
              sx={{
                backgroundColor: "#fff",
                borderRadius: 1,
                input: { color: "#6D2932" },
                label: { color: "#6D2932" },
              }}
            />
            <TextField
              label="Title"
              name="title"
              value={form.title}
              onChange={handleChange}
              fullWidth
              required
              sx={{
                backgroundColor: "#fff",
                borderRadius: 1,
                input: { color: "#6D2932" },
                label: { color: "#6D2932" },
              }}
            />
            <TextField
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              multiline
              rows={4}
              fullWidth
              required
              sx={{
                backgroundColor: "#fff",
                borderRadius: 1,
                textarea: { color: "#6D2932" },
                label: { color: "#6D2932" },
              }}
            />
            <Button
              variant="contained"
              type="submit"
              fullWidth
              sx={{
                backgroundColor: "#6D2932",
                "&:hover": { backgroundColor: "#561C24" },
                color: "#fff",
                fontWeight: "bold",
              }}
            >
              Save Post
            </Button>
          </Stack>
        </form>
      </Paper>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={1000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          Post created successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default AddPost;
