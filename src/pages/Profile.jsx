import {
  Avatar,
  Button,
  Container,
  Typography,
  Stack,
  TextField,
  Paper,
  IconButton,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState, useRef } from "react";
import {
  getUserPosts,
  updateUserProfileImage,
  updatePost,
  deletePost,
} from "../api/api";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

function Profile() {
  const { user, token, login } = useAuth();
  const [posts, setPosts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(user.profileImage || "");
  const [editPostId, setEditPostId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    image: "",
  });
  const [showAlert, setShowAlert] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null); // 👈 جديد
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const userPosts = await getUserPosts(user.name);
        setPosts(userPosts);
      } catch (err) {
        console.error("Failed to load posts:", err);
      }
    };
    fetchPosts();
  }, [user.name]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result;
        try {
          await updateUserProfileImage(user.id, base64Image, token);
          login({ ...user, profileImage: base64Image }, token);
          setSelectedImage(base64Image);
          setShowAlert(true);
        } catch (err) {
          alert("فشل في رفع الصورة");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditClick = (post) => {
    setEditPostId(post.id);
    setEditForm({
      title: post.title,
      description: post.description,
      image: post.image,
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSave = async () => {
    try {
      const updated = {
        ...editForm,
        author: {
          name: user.name,
          profileImage: user.profileImage,
        },
        createdAt: new Date().toISOString(),
      };
      await updatePost(editPostId, updated, token);
      const updatedPosts = posts.map((p) =>
        p.id === editPostId ? { ...p, ...updated } : p
      );
      setPosts(updatedPosts);
      setEditPostId(null);
    } catch (err) {
      alert("Failed to update post");
      console.error(err);
    }
  };

  const handleDeleteClick = (id) => {
    setPostToDelete(id);
  };

  const confirmDelete = async () => {
    try {
      await deletePost(postToDelete, token);
      setPosts((prev) => prev.filter((post) => post.id !== postToDelete));
    } catch (err) {
      alert("فشل حذف البوست");
      console.error(err);
    } finally {
      setPostToDelete(null);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4, backgroundColor: "#F9F4ED" }}>
        <Typography variant="h5" gutterBottom sx={{ color: "#561C24" }}>
          Your Profile
        </Typography>

        <Stack direction="row" spacing={4} alignItems="center">
          <div style={{ position: "relative" }}>
            <Avatar
              src={selectedImage}
              sx={{
                width: 100,
                height: 100,
                border: "3px solid #6D2932",
              }}
            />
            <IconButton
              onClick={() => fileInputRef.current.click()}
              sx={{
                position: "absolute",
                bottom: 0,
                right: 0,
                backgroundColor: "#C7B7A3",
                "&:hover": { backgroundColor: "#A58E7D" },
              }}
            >
              <PhotoCameraIcon />
            </IconButton>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </div>

          <Stack spacing={1}>
            <Typography variant="h6" sx={{ color: "#6D2932" }}>
              {user.name}
            </Typography>
            <Typography sx={{ color: "#6D2932" }}>{user.email}</Typography>
          </Stack>
        </Stack>

        <Typography variant="h6" sx={{ mt: 4, color: "#561C24" }}>
          Your Posts
        </Typography>

        {posts.map((post) => (
          <Paper key={post.id} sx={{ p: 2, my: 2, backgroundColor: "#fff" }}>
            {editPostId === post.id ? (
              <Stack spacing={2}>
                <TextField
                  label="Image URL"
                  name="image"
                  value={editForm.image}
                  onChange={handleEditChange}
                  fullWidth
                />
                <TextField
                  label="Title"
                  name="title"
                  value={editForm.title}
                  onChange={handleEditChange}
                  fullWidth
                />
                <TextField
                  label="Description"
                  name="description"
                  value={editForm.description}
                  onChange={handleEditChange}
                  fullWidth
                  multiline
                  rows={3}
                />
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#561C24",
                    "&:hover": { backgroundColor: "#3e1218" },
                  }}
                  onClick={handleEditSave}
                >
                  Save Changes
                </Button>
              </Stack>
            ) : (
              <>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  {post.title}
                </Typography>
                <Typography variant="body2" sx={{ color: "#6D2932" }}>
                  {post.description}
                </Typography>
                <img
                  src={post.image}
                  alt={post.title}
                  style={{
                    width: "100%",
                    borderRadius: "10px",
                    marginTop: "10px",
                  }}
                />
                <Stack direction="row" spacing={2} mt={1}>
                  <Button
                    onClick={() => handleEditClick(post)}
                    size="small"
                    sx={{ color: "#561C24" }}
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDeleteClick(post.id)}
                    size="small"
                    color="error"
                  >
                    Delete
                  </Button>
                </Stack>
              </>
            )}
          </Paper>
        ))}
      </Paper>

      <Dialog open={!!postToDelete} onClose={() => setPostToDelete(null)}>
        <DialogTitle>Delete Post</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this post?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPostToDelete(null)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={showAlert}
        autoHideDuration={3000}
        onClose={() => setShowAlert(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          Your profile image is updated successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Profile;
