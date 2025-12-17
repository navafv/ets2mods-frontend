import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

function getStorage() {
  return localStorage.getItem("access")
    ? localStorage
    : sessionStorage;
}

api.interceptors.request.use((config) => {
  const token = getStorage().getItem("access");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshing = false;
let queue = [];

api.interceptors.response.use(
  res => res,
  async error => {
    if (error.response?.status === 401 && !refreshing) {
      refreshing = true;
      const storage = getStorage();

      try {
        const res = await axios.post(
          "http://127.0.0.1:8000/api/auth/token/refresh/",
          { refresh: storage.getItem("refresh") }
        );

        storage.setItem("access", res.data.access);

        queue.forEach(cb => cb(res.data.access));
        queue = [];
        refreshing = false;

        error.config.headers.Authorization = `Bearer ${res.data.access}`;
        return api(error.config);
      } catch {
        storage.clear();
        window.location.href = "/login";
      }
    }

    if (refreshing) {
      return new Promise(resolve => {
        queue.push(token => {
          error.config.headers.Authorization = `Bearer ${token}`;
          resolve(api(error.config));
        });
      });
    }

    return Promise.reject(error);
  }
);

export default api;
