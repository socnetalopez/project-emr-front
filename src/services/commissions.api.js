// commissions Api

import URLApi from './axiosConfig.api'

export const createComisionVenta = (b) => URLApi.post('commissions/comisiones/', b)
export const getComisionVenta = (id) => URLApi.get(`commissions/comisionventas/${id}`)
export const getComisionVta = (id) => URLApi.get(`commissions/comisionventa/${id}/detalle/`)
export const updateComisionVenta =(id, b) => URLApi.put(`commissions/comisiones/${id}/update/`, b)

export const getAllTipo = () => URLApi.get('commissions/tipo/')
export const getAllBase = () => URLApi.get('commissions/base/')
export const getAllTaxes = () => URLApi.get('commissions/taxes/')

export const getSaleCommissionDetail = (id) => URLApi.get(`commissions/comisionventa/${id}/detalle/`)
export const getCommIVA = () => URLApi.get('commissions/comiva/')