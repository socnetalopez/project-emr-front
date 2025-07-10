
import URLApi from './axiosConfig.api'


export const getAllPromoters = () => URLApi.get('promoters/promotores/')
export const getPromoter = (id) => URLApi.get(`promoters/promotor/${id}/`)
export const createPromoter = (p) => URLApi.post('promoters/promotores/', p)
export const updatePromoter =(id, p) => URLApi.put(`promoters/promotor/${id}/update/`, p)