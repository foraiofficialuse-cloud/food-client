import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim() || "http://localhost:5000/api";
const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");
export const getUploadFileUrl = (fileName?: string) =>
  fileName ? `${API_ORIGIN}/uploads/${fileName}` : "";

const api = axios.create({ baseURL: API_BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("fb_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("fb_token");
      localStorage.removeItem("fb_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// Auth
export const loginAPI = (data: { email: string; password: string }) =>
  api.post("/auth/login", data);
export const registerAPI = (data: FormData) => api.post("/auth/register", data);
export const getMeAPI = () => api.get("/auth/me");
export const getPublicStatsAPI = () => api.get("/auth/stats");

// Admin
export const adminDashboardAPI = () => api.get("/admin/dashboard");
export const getPendingUsersAPI = () => api.get("/admin/pending-users");
export const verifyUserAPI = (
  userId: string,
  data: { action: string; rejectionReason?: string },
) => api.put(`/admin/verify/${userId}`, data);
export const getAllUsersAPI = (params?: Record<string, string>) =>
  api.get("/admin/users", { params });
export const deleteUserAPI = (userId: string) =>
  api.delete(`/admin/users/${userId}`);
export const getAllOrdersAPI = () => api.get("/admin/orders");
export const deleteOrderAPI = (orderId: string) =>
  api.delete(`/admin/orders/${orderId}`);
export const cancelOrderAPI = (orderId: string) =>
  api.put(`/admin/orders/${orderId}/cancel`);

// Hotel
export const hotelStatsAPI = () => api.get("/hotel/stats");
export const uploadFoodAPI = (data: FormData) => api.post("/hotel/food", data);
export const getMyListingsAPI = () => api.get("/hotel/food");
export const cancelListingAPI = (listingId: string) =>
  api.put(`/hotel/food/${listingId}/cancel`);
export const getIncomingRequestsAPI = () => api.get("/hotel/requests");
export const respondToRequestAPI = (
  requestId: string,
  data: { action: string; hotelNotes?: string },
) => api.put(`/hotel/requests/${requestId}`, data);

// NGO
export const ngoStatsAPI = () => api.get("/ngo/stats");
export const getAvailableFoodAPI = (params?: { all?: boolean }) =>
  api.get("/ngo/available-food", { params });
export const requestFoodAPI = (
  listingId: string,
  data?: { ngoNotes?: string },
) => api.post(`/ngo/request/${listingId}`, data);
export const getMyRequestsAPI = () => api.get("/ngo/requests");
export const updateRequestStatusAPI = (
  requestId: string,
  data: Record<string, unknown>,
) => api.put(`/ngo/requests/${requestId}/status`, data);
export const getFoodServedAPI = () => api.get("/ngo/food-served");

export default api;
