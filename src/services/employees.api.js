import axios from 'axios'

import URLApi from './axiosConfig.api'


export const getEmployees = () => URLApi.get('/employees/employees/')
export const getEmployeesOnlyFullname = () => URLApi.get('/employees/employeesfullname/')
export const createEmployees = (data) => URLApi.post('/employees/employees/', data)
export const getEmployeeDetail = (id) => URLApi.get(`/employees/employee/${id}/detail/`)
export const updateEmployee = (id, data) => URLApi.put(`employees/employee/${id}/update/`, data)

//export const getIncomeType = () => URLApi.get('/income/type/')
//export const getIncomeConciliation = () => URLApi.get('/income/conciliation/')

