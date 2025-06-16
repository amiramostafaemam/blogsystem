// Home.jsx
import {
  Box,
  Typography,
  CircularProgress,
  Stack,
  Fab,
  Fade,
  Snackbar,
  Alert,
  TextField,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MenuIcon from "@mui/icons-material/Menu";
import { useEffect, useState } from "react";
import { getPosts, updatePost, deletePost } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";
import Sidebar from "../components/Sidebar";

function Home() {
  const [showMyPostsOnly, setShowMyPostsOnly] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const { token, user } = useAuth();
  const [postToDelete, setPostToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const POSTS_PER_PAGE = 10;

  const handleEdit = async (id, updatedData) => {
    await updatePost(id, updatedData, token);
    setPosts((prev) =>
      prev.map((post) => (post.id === id ? { ...post, ...updatedData } : post))
    );
  };

  const handleDeleteClick = (id) => {
    setPostToDelete(id);
  };

  const confirmDelete = async () => {
    try {
      await deletePost(postToDelete, token);
      setPosts((prev) => prev.filter((post) => post.id !== postToDelete));
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("Error Deleting post");
    } finally {
      setPostToDelete(null);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    getPosts(token)
      .then((data) => {
        setPosts(data.reverse());
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [token]);

  const filteredPosts = posts.filter((post) => {
    const byUser =
      !showMyPostsOnly ||
      (user &&
        ((typeof post.author === "string" && post.author === user.name) ||
          (typeof post.author === "object" && post.author?.name === user.name)));

    const bySearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.description.toLowerCase().includes(searchTerm.toLowerCase());

    return byUser && bySearch;
  });

  const pageCount = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  const backgroundGradient = darkMode
    ? "linear-gradient(to bottom, #2E1C1C, #561C24, #6D2932)"
    : "linear-gradient(to bottom, #E8D8C4, #C7B7A3, #6D2932)";
  const titleColor = darkMode ? "#E8D8C4" : "#6D2932";
  const textColor = darkMode ? "#fff" : "#000";
  const fabBg = "#C7B7A3";
  const fabText = "#561C24";
  const fabHover = "#A58C7B";
  const inputBg = darkMode ? "#F9F4ED" : "#fff";

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {sidebarOpen && (
        <Sidebar
          onAllPostsClick={() => setShowMyPostsOnly(false)}
          onMyPostsClick={() => setShowMyPostsOnly(true)}
          onClose={() => setSidebarOpen(false)}
          darkMode={darkMode}
          toggleDarkMode={() => setDarkMode((prev) => !prev)}
        />
      )}

      <Box
        sx={{
          flexGrow: 1,
          ml: sidebarOpen ? "260px" : 0,
          py: 3,
          px: { xs: 2, md: 10 },
          minHeight: "100vh",
          overflowX: "hidden",
          background: backgroundGradient,
          color: textColor,
          transition: "all 0.3s ease",
        }}
      >
        {!sidebarOpen && (
          <Box mb={2}>
            <Fab
              size="small"
              sx={{
                backgroundColor: fabBg,
                color: fabText,
                "&:hover": { backgroundColor: fabHover },
              }}
              onClick={() => setSidebarOpen(true)}
            >
              <MenuIcon />
            </Fab>
          </Box>
        )}

        <Typography
          variant="h3"
          fontWeight="bold"
          textAlign="center"
          mb={4}
          sx={{
            letterSpacing: 1,
            color: titleColor,
            borderBottom: "3px solid",
            borderColor: "#C7B7A3",
            display: "inline-block",
            paddingBottom: "10px",
            mx: "auto",
          }}
        >
          Explore The World
        </Typography>

        <TextField
          label="Search posts..."
          variant="outlined"
          fullWidth
          sx={{
            mb: 3,
            backgroundColor: inputBg,
            borderRadius: 1,
          }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {loading ? (
          <Stack alignItems="center" mt={4}>
            <CircularProgress color="secondary" />
          </Stack>
        ) : (
          <>
            <Stack spacing={3} alignItems="center">
              {paginatedPosts.map((post) => (
                <Fade in={true} key={post.id}>
                  <Box>
                    <PostCard
                      id={post.id}
                      title={post.title}
                      description={post.description}
                      image={post.image}
                      author={post.author}
                      createdAt={post.createdAt}
                      onEdit={handleEdit}
                      onDelete={handleDeleteClick}
                      currentUser={user?.name}
                      darkMode={darkMode}
                    />
                  </Box>
                </Fade>
              ))}
            </Stack>

            {pageCount > 1 && (
              <Stack mt={4} alignItems="center">
                <Pagination
                  count={pageCount}
                  page={currentPage}
                  onChange={(e, val) => setCurrentPage(val)}
                  color="secondary"
                />
              </Stack>
            )}
          </>
        )}

        {user && (
          <Fab
            aria-label="add"
            sx={{
              position: "fixed",
              bottom: 24,
              right: 24,
              backgroundColor: fabBg,
              color: fabText,
              "&:hover": { backgroundColor: fabHover },
            }}
            onClick={() => navigate("/add")}
          >
            <AddIcon />
          </Fab>
        )}

        <Dialog open={!!postToDelete} onClose={() => setPostToDelete(null)}>
          <DialogTitle>Confirm</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Do you want to delete this post?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPostToDelete(null)}>Cancel</Button>
            <Button onClick={confirmDelete} variant="contained" color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            severity="success"
            sx={{
              width: "100%",
              backgroundColor: darkMode ? "#561C24" : "#C7B7A3",
              color: darkMode ? "#fff" : "#000",
            }}
          >
            The post is deleted successfully!
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}

export default Home;
