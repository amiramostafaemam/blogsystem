// App.jsx
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import AddPost from "./pages/AddPost";
import EditPost from "./pages/EditPost";
import Profile from "./pages/Profile";


function AppWrapper() {
  const location = useLocation();
  const hideNavbarOnRoutes = ["/"];

  return (
    <>
      {!hideNavbarOnRoutes.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/add" element={<AddPost />} />
        <Route path="/edit/:id" element={<EditPost />} />
        <Route path="/profile" element={<Profile />} />

      </Routes>
    </>
  );
}

function App() {
  return <AppWrapper />;
}

export default App;
