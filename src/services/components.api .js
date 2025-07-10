import URLApi from './axiosConfig.api'; 

export const getJobs = async () => {
  try {
    const response = await URLApi.get('components/jobs/');
    console.log("response", response    )
    return response;
  } catch (error) {
    console.error('Error al obtener los trabajos:', error);
    throw error;
  }
};
export const createJobs = (data) => URLApi.post('components/jobs/', data)

export const getDepatmentsName = () => URLApi.get('/components/departments/')
export const createDepatmentsName = (data) => URLApi.post('/components/departments/', data)
export const getGenders = () => URLApi.get('components/genders/')
export const getHighestLevelEducation = () => URLApi.get('components/highestleveleducation/')
export const getBranchs = () => URLApi.get('/components/branchs/')
export const getStatus = () => URLApi.get('components/status/')
export const createStatus = (data) => URLApi.post('components/status/', data)

