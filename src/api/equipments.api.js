import axios from 'axios'

//const token = localStorage.getItem('token');

const URLApi = axios.create({
    baseURL: 'http://192.168.56.101:8000/api/it'
    //baseURL: 'http://192.168.100.226:8000/api/'
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
        const res = await axios.post('http://192.168.1.10:8000/api/users/token/', {
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


export const getAllEquipments = () => URLApi.get('/equipments/equipments/')
export const CreateEquipment = (d) => URLApi.post('/equipments/equipmentsave/', d)
export const getEquipmentDetail = (id) => URLApi.get(`equipments/equipment/${id}/`)
export const updateEquipment =(id, d) => URLApi.put(`equipments/equipment/${id}/update/`, d)

export const getAllMake = () => URLApi.get('/catalogues/make/')
export const getAllModel = () => URLApi.get('/catalogues/model/')
export const getAllEquipmentType = () => URLApi.get('/catalogues/equipmenttype/')
export const getAllBranches = () => URLApi.get('/catalogues/branches/')
export const getAllStatus = () => URLApi.get('/catalogues/equipmentstatus/')



//export const createComisionVenta = (b) => URLApi.post('commissions/comisiones/', b)

//export const updateComisionVenta =(id, b) => URLApi.put(`commissions/comisiones/${id}/update/`, b)
