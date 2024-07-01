import axios from "axios";
import { TOKEN } from "./constant";
import { handleLogOut } from "./helper";

const api = axios.create({
  baseURL: `https://samnote.mangasocial.online`,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MTg0MjEyMDMsInVzZXJuYW1lIjoiY2hlZmh1b25nMTk4OUBnbWFpbC5jb20ifQ.Z5FKdfia5BT_tGUm4zMZhrH62gO05_5JiBjn3WPeS0k",
  },
});
api.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem(TOKEN);
    config.headers.Authorization = `Bearer ${token}`;
    config.headers["Content-Type"] = "Application/json";
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response?.status === 401) {
      handleLogOut();
    }

    return Promise.reject(error);
  }
);
export default api;
