import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const enrollmentAPI = {
  submit: (data) => api.post("/enrollments", data),
  getAll: () => api.get("/enrollments"),
};

export const partnershipAPI = {
  submit: (data) => api.post("/partnerships", data),
  getAll: () => api.get("/partnerships"),
};

export const blogAPI = {
  getAll: () => api.get("/blogs"),
  getOne: (id) => api.get(`/blogs/${id}`),
  create: (data) => api.post("/blogs", data),
  delete: (id) => api.delete(`/blogs/${id}`),
};

export const contactAPI = {
  submit: (data) => api.post("/contacts", data),
  getAll: () => api.get("/contacts"),
};

export const adminAPI = {
  login: (data) => api.post("/admin/login", data),
};

export default api;
