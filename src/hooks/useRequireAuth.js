import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNotify } from "../context/NotifyContext";

// Returns a guard: requireAuth("like stories") -> true if signed in, otherwise sends to login
export function useRequireAuth() {
  const { user } = useAuth();
  const notify = useNotify();
  const navigate = useNavigate();
  const location = useLocation();

  return useCallback(
    (action) => {
      if (user) return true;
      notify(`Log in to ${action}`, "info");
      navigate("/login", { state: { from: location } });
      return false;
    },
    [user, notify, navigate, location]
  );
}
