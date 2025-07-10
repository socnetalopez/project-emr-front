
import URLApi from './axiosConfig.api'


export const getAllComisionistas = () => URLApi.get('promoters/comisionistas/')
export const getComisionista = (id) => URLApi.get(`promoters/comisionista/${id}/`)
export const createComisionista = (b) => URLApi.post('promoters/comisionistas/', b)
export const updateComisionista =(id, b) => URLApi.put(`promoters/comisionista/${id}/update/`, b)