// src/pages/EditPost.jsx
import {
    Container,
    TextField,
    Button,
    Typography,
    Stack,
    Paper,
  } from "@mui/material";
  import { useEffect, useState } from "react";
  import { useNavigate, useParams } from "react-router-dom";
  import { getPosts, updatePost } from "../api/api";
  import { useAuth } from "../context/AuthContext";
  
  function EditPost() {
    const { id } = useParams(); 
    const { token } = useAuth();
    const navigate = useNavigate();
  
    const [formData, setFormData] = useState({
      title: "",
      description: "",
      image: "",
    });
  
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      getPosts(token)
        .then((posts) => {
          const post = posts.find((p) => p.id == id);
          if (post) {
            setFormData({
              title: post.title,
              description: post.description,
              image: post.image,
            });
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }, [id, token]);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await updatePost(id, formData, token);
        navigate("/");
      } catch (err) {
        console.error("Failed to edit", err);
        alert("Failed to edit");
      }
    };
  
    return (
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, mt: 6 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Edit Post
          </Typography>
          {loading ? (
            <Typography>Loading...</Typography>
          ) : (
            <form onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <TextField
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
                <TextField
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  required
                />
                <TextField
                  label="Image URL"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                />
                <Button variant="contained" type="submit" color="secondary">
                  Save Updates
                </Button>
              </Stack>
            </form>
          )}
        </Paper>
      </Container>
    );
  }
  
  export default EditPost;
  