import axios from 'axios'

const URLApi = axios.create({
    baseURL: 'http://192.168.20.75:8000/api/customers'
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

export const getAllCustomers = () => URLApi.get('/')
export const getCustomer = (id) => URLApi.get(`/${id}/`)
export const createCustomer = (p) => URLApi.post('/create/', p)
export const updateCustomer =(id, p) => URLApi.put(`/${id}/update/`, p)

export const getCustomersPromotorId = (id) => URLApi.get(`/promotor/${id}/`)
export const getCustomerIdRequest = (id) => URLApi.get(`/${id}/?tipo=solicitud`)

export const getRegimenTipo = () => URLApi.get('/regimentipo/')
export const getCountry = () => URLApi.get('/country/')
export const getStates = () => URLApi.get('/states/')
export const getMunicpio = () => URLApi.get('/municipios/')

export const getTipoCalculo = () => URLApi.get('/tipocalculo/')
export const getComprobante = () => URLApi.get('/comprobante/')
export const getTax = () => URLApi.get('/tax/')
export const getTipoPago = () => URLApi.get('/tipopago/')

export const getREgimenFiscal = () => URLApi.get('/regimenfiscal/')
export const getUsoFactura = () => URLApi.get('/usofactura/')

// Comision Venta ****
//export const getComisionVenta = (id) => URLApi.get(`comisionventa/${id}`)

//export const getBroker = (id) => URLApi.get(`/${id}/`)
