import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { API } from "../api";

export default function AdminProtectedRoute({ children }) {
  const [authorized, setAuthorized] = useState(null);

  useEffect(() => {
    API.get("/admin/verify", { withCredentials: true })
      .then(() => setAuthorized(true))
      .catch(() => setAuthorized(false));
  }, []);

  if (authorized === null) return null; // loading

  if (!authorized) {
    return <Navigate to="/admin-login" />;
  }

  return children;
}
