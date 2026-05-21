import axios from "axios";

// Use relative base so Vite's dev proxy (→ localhost:8080) handles routing.
// In production, point this to your deployed backend URL.
const API = axios.create({
    baseURL: "/",
    headers: {
        "Content-Type": "application/json",
    },
});

// Attach JWT token to every request when present
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auto-redirect on 401 or 403 (token expired / invalid)
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default API;