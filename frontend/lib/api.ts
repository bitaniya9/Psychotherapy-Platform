import axios, { AxiosError, AxiosRequestConfig } from "axios";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:7777/api/v1";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // allow cookies for refresh token
});

export function setAuthToken(token: string | null) {
  if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete api.defaults.headers.common["Authorization"];
}

// Basic domain helpers (return axios response data object as the rest of the app expects)
export async function registerUser(
  email: string,
  password: string,
  firstName?: string,
  lastName?: string,
  role?: string
) {
  const payload: any = { email, password };
  if (firstName) payload.firstName = firstName;
  if (lastName) payload.lastName = lastName;
  if (role) payload.role = role;
  const res = await api.post("/auth/register", payload);
  return res.data;
}

export async function login(email: string, password: string) {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
}

export async function refreshToken() {
  const res = await api.post("/auth/refresh-token");
  return res.data;
}

export async function getMe() {
  const res = await api.get("/users/me");
  return res.data;
}

export async function verifyEmail(email: string, otp: string) {
  const res = await api.post("/auth/verify-email", { email, otp });
  return res.data;
}

export async function forgotPassword(email: string) {
  const res = await api.post("/auth/forgot-password", { email });
  return res.data;
}

// --- Automatic refresh-on-401 handler ---
// Prevents multiple concurrent refresh requests and queues pending requests
let isRefreshing = false;
let pendingRequests: Array<(token?: string | null) => void> = [];

async function performRefresh() {
  try {
    const r = await api.post("/auth/refresh-token");
    const payload = r.data as any; // { success, data: { accessToken }, message }
    const newToken = payload?.data?.accessToken;
    if (newToken) {
      setAuthToken(newToken);
      try {
        // persist token in localStorage so UI can pick it up
        if (typeof window !== "undefined")
          localStorage.setItem("token", newToken);
        // notify other parts of the app an access token was refreshed
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("tokenRefreshed", { detail: newToken })
          );
        }
      } catch (e) {
        // ignore storage errors
      }
    }
    return newToken;
  } catch (err) {
    return null;
  }
}

// Attach interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };
    if (!originalRequest) return Promise.reject(error);

    // Only try refresh once per original request
    if (error.response?.status === 401 && !originalRequest._retry) {
      // don't try to refresh when the failing request was the refresh endpoint itself
      if (
        originalRequest.url &&
        originalRequest.url.includes("/auth/refresh-token")
      ) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (isRefreshing) {
        // queue the request until refresh finished
        return new Promise((resolve, reject) => {
          pendingRequests.push((token?: string | null) => {
            if (token) {
              if (!originalRequest.headers) originalRequest.headers = {};
              (originalRequest.headers as any)["Authorization"] =
                `Bearer ${token}`;
              resolve(api(originalRequest));
            } else {
              reject(error);
            }
          });
        });
      }

      isRefreshing = true;
      const newToken = await performRefresh();
      isRefreshing = false;

      // drain queue
      pendingRequests.forEach((cb) => cb(newToken));
      pendingRequests = [];

      if (newToken) {
        if (!originalRequest.headers) originalRequest.headers = {};
        (originalRequest.headers as any)["Authorization"] =
          `Bearer ${newToken}`;
        return api(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
