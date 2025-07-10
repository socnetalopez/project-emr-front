import axios from 'axios'

import URLApi from './axiosConfig.api'


export const getEquipments = () => URLApi.get('inventoryit/equipments/')
export const getEquipmentId = (id) => URLApi.get(`inventoryit/equipment/${id}/`)
export const createEquipments = (data) => URLApi.post('inventoryit/equipmentsave/', data)
export const updateEquipments = (id, data) => URLApi.put(`inventoryit/equipment/${id}/update/`, data)

export const MAKE_ENDPOINT = 'componentsit/make/'

export const getMake = () => URLApi.get(MAKE_ENDPOINT)
export const createMake = (data) => URLApi.post('componentsit/make/', data)

export const getModel = () => URLApi.get('componentsit/model/')
export const createModel = (data) => URLApi.post('componentsit/model/', data)

export const getEquipmentType = () => URLApi.get('componentsit/equipmenttype/')
export const createEquipmentType = (data) => URLApi.post('componentsit/equipmenttype/', data)

export const getProcessors = () => URLApi.get('componentsit/processor/')
export const createProcessor = (data) => URLApi.post('componentsit/processor/', data)

export const getRam = () => URLApi.get('componentsit/ram/')
export const createRam = (data) => URLApi.post('componentsit/ram/', data)

export const getDisks = () => URLApi.get('componentsit/disks/')
export const createDisks = (data) => URLApi.post('componentsit/disks/', data)

export const getIpAddress = () => URLApi.get('componentsit/ip/')
export const createIpAddress = (data) => URLApi.post('componentsit/ip/', data)

//export const getIncomeType = () => URLApi.get('/income/type/')
//export const getIncomeConciliation = () => URLApi.get('/income/conciliation/')

