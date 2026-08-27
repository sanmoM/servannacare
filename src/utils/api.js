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
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    // console.log(`[API Request] ${config.method.toUpperCase()} ${config.url} - Auth Header set: Bearer ${token.slice(0, 10)}...`);
  } else {
    console.warn(`[API Request] ${config.method.toUpperCase()} ${config.url} - No token found in localStorage`);
  }
  return config;
});

// api.interceptors.response.use(
//   (response) => response.data,
//   (error) => Promise.reject(error)
// );

export default api;
