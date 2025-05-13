import axios from 'axios'

const solicitudApi = axios.create({
    baseURL: 'http://192.168.20.75:8000/api/treasury'
});

export const getAllSolicitudes = () => solicitudApi.get('/solicitudes')
export const getSolicitud = (id) => solicitudApi.get(`/${id}/`)
export const updateSolicitud = (id, solicitud) => solicitudApi.put(`/${id}/update/`, solicitud)
export const createSolicitud = (solicitud) => solicitudApi.post('/', solicitud)

//   Datos Generales  
export const getMonedas = () => solicitudApi.get('/monedas/')
export const getFormaPago = () => solicitudApi.get('/formapago/')
export const getTipoOperacion = () => solicitudApi.get('/tipooperacion/')
export const getTipoSolicitud = () => solicitudApi.get('/tiposolicitud/')
export const getTipoPago = () => solicitudApi.get('/tipopago/')


