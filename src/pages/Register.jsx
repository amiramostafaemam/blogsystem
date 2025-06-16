import {
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Stack,
  Avatar,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/api";

import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ImageIcon from "@mui/icons-material/Image";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    profileImage: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, profileImage: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (form.confirmPassword !== form.password)
      newErrors.confirmPassword = "Passwords do not match";
    if (!form.profileImage) newErrors.profileImage = "Profile image is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const { confirmPassword, ...userData } = form;
      await registerUser(userData);
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error.message);
      alert("Failed to register");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(to bottom right, #E8D8C4, #C7B7A3)",
        p: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          maxWidth: 500,
          width: "100%",
          p: 4,
          borderRadius: 3,
          backgroundColor: "#F9F4ED",
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ color: "#561C24", fontWeight: "bold" }}
        >
          Register
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Name"
              name="name"
              fullWidth
              value={form.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: "#6D2932" }} />
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{ style: { color: "#6D2932" } }}
            />

            <TextField
              label="Email"
              name="email"
              type="email"
              fullWidth
              value={form.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: "#6D2932" }} />
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{ style: { color: "#6D2932" } }}
            />

            <TextField
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              fullWidth
              value={form.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: "#6D2932" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{ style: { color: "#6D2932" } }}
            />

<TextField
  label="Confirm Password"
  name="confirmPassword"
  type={showPassword ? "text" : "password"}
  fullWidth
  value={form.confirmPassword}
  onChange={handleChange}
  error={!!errors.confirmPassword}
  helperText={errors.confirmPassword}
  InputProps={{
    startAdornment: (
      <InputAdornment position="start">
        <LockIcon sx={{ color: "#6D2932" }} />
      </InputAdornment>
    ),
    endAdornment: (
      <InputAdornment position="end">
        <IconButton
          onClick={() => setShowPassword((prev) => !prev)}
          edge="end"
        >
          {showPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </InputAdornment>
    ),
  }}
  InputLabelProps={{ style: { color: "#6D2932" } }}
/>


            <Button
              variant="outlined"
              component="label"
              startIcon={<ImageIcon />}
              sx={{
                borderColor: "#6D2932",
                color: "#6D2932",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "#f5eae0",
                  borderColor: "#561C24",
                },
              }}
            >
              Upload Profile Picture
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>
            {errors.profileImage && (
              <Typography variant="caption" color="error">
                {errors.profileImage}
              </Typography>
            )}
            {form.profileImage && (
              <Box textAlign="center">
                <Typography variant="caption">Preview:</Typography>
                <Avatar
                  src={form.profileImage}
                  sx={{ width: 80, height: 80, m: "10px auto" }}
                />
              </Box>
            )}

            <Button
              variant="contained"
              type="submit"
              fullWidth
              sx={{
                backgroundColor: "#6D2932",
                color: "#fff",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "#561C24",
                },
              }}
            >
              Register
            </Button>

            <Button
              onClick={() => navigate("/login")}
              fullWidth
              sx={{ color: "#6D2932", fontWeight: "bold" }}
            >
              Already have an account? Login
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}

export default Register;
