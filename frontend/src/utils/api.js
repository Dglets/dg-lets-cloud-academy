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
  updateStatus: (id, status) => api.patch(`/enrollments/${id}/status`, { status }),
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

export const paymentAPI = {
  submit: (data) => api.post("/payments", data),
  getAll: () => api.get("/payments"),
  updateStatus: (id, status) => api.patch(`/payments/${id}/status`, { status }),
};

export const studentAPI = {
  login: (data) => api.post("/students/login", data),
  getProfile: () => api.get("/students/profile"),
  getAssignments: () => api.get("/students/assignments"),
  getTests: () => api.get("/students/tests"),
  getTutorials: () => api.get("/students/tutorials"),
  grantAccess: (data) => api.post("/students/grant-access", data),
  getAll: () => api.get("/students/all"),
  createAssignment: (data) => api.post("/students/assignments", data),
  deleteAssignment: (id) => api.delete(`/students/assignments/${id}`),
  createTest: (data) => api.post("/students/tests", data),
  deleteTest: (id) => api.delete(`/students/tests/${id}`),
  createTutorial: (data) => api.post("/students/tutorials", data),
  deleteTutorial: (id) => api.delete(`/students/tutorials/${id}`),
};

export const notificationAPI = {
  subscribe: (data) => api.post("/notifications", data),
  getAll: () => api.get("/notifications"),
};

export const adminAPI = {
  login: (data) => api.post("/admin/login", data),
};

export default api;
