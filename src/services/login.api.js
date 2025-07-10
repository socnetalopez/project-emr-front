import URLApi from './axiosConfig.api'; // o donde tengas la configuración de Axios

/**
 * Realiza login con usuario y contraseña
 * Guarda accessToken y refreshToken en localStorage
 * @param {string} username
 * @param {string} password
 * @returns {Promise<Object>} datos del usuario o tokens
 */
export const login = async (username, password) => {
  try {
    const response = await URLApi.post('users/login/', {
      username,
      password,
    });

    const { accessToken, refreshToken } = response.data;

    if (accessToken && refreshToken) {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    } else {
      throw new Error('Tokens no recibidos desde el servidor');
    }

    return response.data; // puedes devolver lo que necesites del login
  } catch (error) {
    // Manejo simple de error, puedes personalizarlo
    console.error('Error en login:', error.response?.data || error.message);
    throw error;
  }
};