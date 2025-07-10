import axios from 'axios';

// 🔧 Crear instancia con baseURL desde variable de entorno
const URLApi = axios.create({
  //baseURL: import.meta.env.VITE_API_BASE_URL || 'http://192.168.1.10:8002/api/',
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// 🔐 Agregar token a cada petición
URLApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🔄 Control de refresco de token
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) =>
    error ? reject(error) : resolve(token)
  );
  failedQueue = [];
};

// ❗ Interceptor de respuesta para manejar errores 401 y refresh automático
URLApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem('refreshToken')
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return URLApi(originalRequest);
        });
      }

      isRefreshing = true;

      try {
        // 👉 Llamar a /users/token/ con el refreshToken
        const res = await axios.post(
        //  `${import.meta.env.VITE_API_BASE_URL || 'https://192.168.1.10:8002/api/'}users/token/`,
            `${import.meta.env.VITE_API_BASE_URL}users/token/`,
          {
            refreshToken: localStorage.getItem('refreshToken'),
          }
        );

        const newAccessToken = res.data.accessToken;
        localStorage.setItem('accessToken', newAccessToken);
        URLApi.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return URLApi(originalRequest);
      } catch (err) {
        processQueue(err, null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/'; // Redirigir al login
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default URLApi;
