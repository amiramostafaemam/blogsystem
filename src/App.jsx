import { lazy, Suspense } from "react";
import { Navigate, Routes, Route } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import { ProtectedRoute, GuestRoute, PageLoader } from "./components/RouteGuards";
import { useAuth } from "./context/AuthContext";
import Landing from "./pages/Landing";

// Everything except the landing page is split into its own chunk
const Explore = lazy(() => import("./pages/Explore"));
const PostPage = lazy(() => import("./pages/PostPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const WritePost = lazy(() => import("./pages/WritePost"));
const EditPost = lazy(() => import("./pages/EditPost"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Stats = lazy(() => import("./pages/Stats"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Bookmarks = lazy(() => import("./pages/Bookmarks"));
const Settings = lazy(() => import("./pages/Settings"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
  const { user, loading } = useAuth();

  const home = loading ? <PageLoader /> : user ? <Navigate to="/explore" replace /> : <Landing />;

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Visitors get the landing page, signed-in writers go straight to the feed */}
        <Route path="/" element={home} />

        <Route element={<GuestRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<AppLayout />}>
          <Route path="/explore" element={<Explore />} />
          <Route path="/posts/:id" element={<PostPage />} />
          <Route path="/u/:id" element={<ProfilePage />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/write" element={<WritePost />} />
            <Route path="/edit/:id" element={<EditPost />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
