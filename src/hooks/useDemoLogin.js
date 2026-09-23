import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNotify } from "../context/NotifyContext";
import { DEMO_ACCOUNT } from "../config";

export function useDemoLogin() {
  const { signIn } = useAuth();
  const notify = useNotify();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const loginAsDemo = async () => {
    setLoading(true);
    try {
      const user = await signIn(DEMO_ACCOUNT.email, DEMO_ACCOUNT.password);
      notify(`Welcome! You're exploring as ${user.name}`, "info");
      navigate("/explore");
    } catch {
      notify("The demo is unavailable right now. Please try again.", "error");
      setLoading(false);
    }
  };

  return { loginAsDemo, loading };
}
