import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AuthPage from "./pages/AuthPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import { api } from "./services/api.js";

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(token));

  useEffect(() => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    let active = true;
    api("/auth/me", { token })
      .then((result) => {
        if (active) setUser(result.user);
      })
      .catch(() => {
        localStorage.removeItem("token");
        if (active) {
          setToken(null);
          setUser(null);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [token]);

  function signIn(result) {
    localStorage.setItem("token", result.token);
    setToken(result.token);
    setUser(result.user);
  }

  function signOut() {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }

  if (loading) {
    return <main className="screen-loader">Carregando...</main>;
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={token ? <Navigate to="/" replace /> : <AuthPage mode="login" onSuccess={signIn} />}
      />
      <Route
        path="/cadastro"
        element={token ? <Navigate to="/" replace /> : <AuthPage mode="register" onSuccess={signIn} />}
      />
      <Route
        path="/"
        element={token && user ? <Dashboard token={token} user={user} onSignOut={signOut} /> : <Navigate to="/login" replace />}
      />
      <Route path="*" element={<Navigate to={token ? "/" : "/login"} replace />} />
    </Routes>
  );
}
