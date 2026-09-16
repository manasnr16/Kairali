import React, { createContext, useEffect, useState, useCallback } from "react";
import adminAxios, { getAdminToken, setAdminToken, clearAdminToken } from "../Axios Instance/adminAxios";

export const AdminAuthContext = createContext({});

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, confirm any stored token is still valid so a stale/expired
  // token doesn't quietly grant a logged-out-looking but broken session.
  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      setLoading(false);
      return;
    }

    adminAxios
      .get("/admin/auth/me")
      .then((res) => setAdmin(res.data.admin))
      .catch(() => {
        clearAdminToken();
        setAdmin(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (username, password) => {
    const res = await adminAxios.post("/admin/auth/login", { username, password });
    setAdminToken(res.data.token);
    setAdmin(res.data.admin);
    return res.data.admin;
  }, []);

  const logout = useCallback(() => {
    clearAdminToken();
    setAdmin(null);
  }, []);

  return (
    <AdminAuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export default AdminAuthProvider;
