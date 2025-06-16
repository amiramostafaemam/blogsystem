import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Avatar,
  Stack,
  Slide,
  useScrollTrigger,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Animation on scroll (optional fade-in slide)
function HideOnScroll({ children }) {
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <HideOnScroll>
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: "#561C24", 
          boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
          transition: "all 0.3s ease-in-out",
        }}
      >
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            <Link
              to="/"
              style={{
                textDecoration: "none",
                color: "#E8D8C4", 
                fontWeight: "bold",
              }}
            >
              Latte Talks
            </Link>
          </Typography>

          {user ? (
            <>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ mr: 2 }}
              >
                <Avatar
                  src={user.profileImage}
                  alt={user.name}
                  sx={{ border: "2px solid #C7B7A3" }}
                />
                <Typography sx={{ color: "#E8D8C4", fontWeight: "bold" }}>
                  {user.name}
                </Typography>
              </Stack>
              <Button
                onClick={handleLogout}
                sx={{
                  color: "#E8D8C4",
                  "&:hover": {
                    backgroundColor: "#6D2932", 
                  },
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                component={Link}
                to="/login"
                sx={{
                  color: "#E8D8C4",
                  "&:hover": {
                    backgroundColor: "#6D2932",
                  },
                }}
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/register"
                sx={{
                  color: "#E8D8C4",
                  "&:hover": {
                    backgroundColor: "#6D2932",
                  },
                }}
              >
                Register
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </HideOnScroll>
  );
}

export default Navbar;
