import axios from 'axios'

const URLApi = axios.create({
    baseURL: 'http://192.168.20.30:8000/api/treasury'
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
        const res = await axios.post('http://192.168.20.30:8000/api/users/token/', {
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


export const getAllSolicitudes = () => URLApi.get('/solicitudes')
export const getSolicitud = (id) => URLApi.get(`/${id}/`)
export const updateSolicitud = (id, solicitud) => URLApi.put(`/${id}/update/`, solicitud)
export const createSolicitud = (solicitud) => URLApi.post('/', solicitud)

export const getAllRequests = () => URLApi.get('/requests/')
export const getRequest = (id) => URLApi.get(`request/${id}/`)
export const RequestCreate = (request) => URLApi.post('/requests-create/', request)

//   Datos Generales  
export const getMonedas = () => URLApi.get('/monedas/')
export const getFormaPago = () => URLApi.get('/formapago/')
export const getTipoOperacion = () => URLApi.get('/tipooperacion/')
export const getTipoSolicitud = () => URLApi.get('/tiposolicitud/')
export const getTipoPago = () => URLApi.get('/tipopago/')


