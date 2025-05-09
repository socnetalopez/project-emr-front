import axios from 'axios'

//const token = localStorage.getItem('token');

const URLApi = axios.create({
    baseURL: 'http://192.168.20.75:8000/api/'
});

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
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// ❗ Interceptor de respuesta para manejar 401
URLApi.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem('refreshToken')
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = 'Bearer ' + token;
            return URLApi(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const res = await axios.post('http://192.168.20.75:8001/api/users/token/', {
          refreshToken: localStorage.getItem('refreshToken'),
        });

        const newAccessToken = res.data.accessToken;
        localStorage.setItem('accessToken', newAccessToken);
        URLApi.defaults.headers.common['Authorization'] = 'Bearer ' + newAccessToken;

        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = 'Bearer ' + newAccessToken;
        return URLApi(originalRequest);
      } catch (err) {
        processQueue(err, null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/';
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export const createComisionVenta = (b) => URLApi.post('commissions/comisiones/', b)
export const getComisionVenta = (id) => URLApi.get(`commissions/comisionventas/${id}`)
export const getComisionVta = (id) => URLApi.get(`commissions/comisionventa/${id}/detalle/`)
export const updateComisionVenta =(id, b) => URLApi.put(`comisiones/${id}/update/`, b)

export const getAllPromoters = () => URLApi.get('promoters/promotores/')
export const getPromoter = (id) => URLApi.get(`promoters/promotor/${id}/`)
export const createPromoter = (p) => URLApi.post('promoters/promotores/', p)
export const updatePromoter =(id, p) => URLApi.put(`promoters/promotor/${id}/update/`, p)

export const getAllBrokers = () => URLApi.get('promoters/brokers/');
export const getBroker = (id) => URLApi.get(`promoters/broker/${id}/`)
export const createBroker = (b) => URLApi.post('promoters/brokers/', b)
export const updateBroker =(id, b) => URLApi.put(`promoters/broker/${id}/update/`, b)

export const getAllComisionistas = () => URLApi.get('promoters/comisionistas/')
export const getComisionista = (id) => URLApi.get(`promoters/comisionista/${id}/`)
export const createComisionista = (b) => URLApi.post('promoters/comisionistas/', b)
export const updateComisionista =(id, b) => URLApi.put(`promoters/comisionista/${id}/update/`, b)

export const getAllTipo = () => URLApi.get('/commissions/tipo/')
export const getAllBase = () => URLApi.get('/commissions/base/')