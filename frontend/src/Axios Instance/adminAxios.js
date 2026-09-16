import axios from "axios";

const ADMIN_TOKEN_KEY = "kmm_admin_token";

export const getAdminToken = () => localStorage.getItem(ADMIN_TOKEN_KEY);
export const setAdminToken = (token) => localStorage.setItem(ADMIN_TOKEN_KEY, token);
export const clearAdminToken = () => localStorage.removeItem(ADMIN_TOKEN_KEY);

// A separate axios instance from the main `axiosInstance` — the admin panel
// authenticates with its own username/password JWT, not the site's Firebase
// user session, so the two must never share an Authorization header.
const adminAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

adminAxios.interceptors.request.use((config) => {
  const token = getAdminToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

adminAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAdminToken();
      if (!window.location.pathname.startsWith("/admin/login")) {
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(error);
  }
);

export default adminAxios;
