import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const url = config.url || "";
  let token;
  if (url.startsWith("/instructors")) {
    token = localStorage.getItem("instructor_token");
  } else if (url === "/students/all") {
    token = localStorage.getItem("admin_token") || localStorage.getItem("instructor_token");
  } else if (url.match(/^\/students\/(assignments|tests|tutorials)/)) {
    // GET portal content — accessible by student, admin, or instructor
    token =
      localStorage.getItem("student_token") ||
      localStorage.getItem("admin_token") ||
      localStorage.getItem("instructor_token");
  } else if (url.startsWith("/students")) {
    token = localStorage.getItem("student_token") || localStorage.getItem("admin_token");
  } else {
    token = localStorage.getItem("admin_token");
  }
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
  getAllAdmin: () => api.get("/blogs/all"),
  getOne: (id) => api.get(`/blogs/${id}`),
  create: (data) => api.post("/blogs", data),
  toggle: (id) => api.patch(`/blogs/${id}/toggle`),
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
  forgotPassword: (data) => api.post("/students/forgot-password", data),
  resetPassword: (data) => api.post("/students/reset-password", data),
  getProfile: () => api.get("/students/profile"),
  getGrades: () => api.get("/students/grades"),
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

export const instructorAPI = {
  login: (data) => api.post("/instructors/login", data),
  getAll: () => api.get("/instructors"),
  create: (data) => api.post("/instructors", data),
  delete: (id) => api.delete(`/instructors/${id}`),
  submitGrade: (data) => api.post("/instructors/grades", data),
  getGrades: () => api.get("/instructors/grades"),
  getStudentGrades: (studentId) => api.get(`/instructors/grades/student/${studentId}`),
  getAllGrades: () => api.get("/instructors/grades/all"),
};

export default api;
