const isDevelopment = import.meta.env.MODE === 'development';
const API_BASE_URL = isDevelopment ? import.meta.env.VITE_API_BASE_URL : import.meta.env.VITE_API_BASE_URL_PROD;

export { API_BASE_URL };