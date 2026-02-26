import axios from 'axios';
import { useSelector } from 'react-redux';

// Create a custom axios hook that includes auth headers
export const useApi = () => {
  const { token } = useSelector((state) => state.generalInfo);

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
  });

  // Add request interceptor to include auth token
  api.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return api;
};

export default useApi;
