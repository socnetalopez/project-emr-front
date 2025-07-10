
import URLApi from './axiosConfig.api'


export const getAllBrokers = () => URLApi.get('promoters/brokers/');
export const getBroker = (id) => URLApi.get(`promoters/broker/${id}/`)
export const createBroker = (b) => URLApi.post('promoters/brokers/', b)
export const updateBroker =(id, b) => URLApi.put(`promoters/broker/${id}/update/`, b)
