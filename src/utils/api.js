// import axios from "axios";

// const BASE_URL="https://cervannacare.testorbis.com/api/";

// export const homeData = async ()=>{
//     axios.get(`${BASE_URL}/home`).then((res)=>res.data)
// }


// import axios from "axios";

// const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
// });

// export default api;


import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    // Some backends return 200 OK with status: false when account is deleted/unauthenticated
    if (
      response?.data?.status === false &&
      typeof response?.data?.message === "string" &&
      (response.data.message.toLowerCase().includes("unauthenticated") ||
       response.data.message.toLowerCase().includes("user not found") ||
       response.data.message.toLowerCase().includes("token"))
    ) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("specialist_expiry");
        window.dispatchEvent(new Event("auth:unauthorized"));
        if (!window.location.pathname.startsWith("/login")) {
          window.location.href = "/login";
        }
      }
    }
    return response;
  },
  (error) => {
    const status = error?.response?.status;
    const msg = error?.response?.data?.message?.toLowerCase?.() || "";
    const isAuthEndpoint =
      error?.config?.url?.includes("/login") ||
      error?.config?.url?.includes("/register");

    // If backend returns 401 Unauthorized, 403 Forbidden, 404 User Not Found on profile, or unauthenticated message
    if (
      !isAuthEndpoint &&
      (status === 401 ||
       status === 403 ||
       (status === 404 && error?.config?.url?.includes("/profile")) ||
       msg.includes("unauthenticated") ||
       msg.includes("user not found") ||
       msg.includes("token has expired") ||
       msg.includes("token is invalid") ||
       msg.includes("token not provided"))
    ) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("specialist_expiry");
        window.dispatchEvent(new Event("auth:unauthorized"));
        if (!window.location.pathname.startsWith("/login")) {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;

