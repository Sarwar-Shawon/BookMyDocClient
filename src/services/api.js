import axios from 'axios';
import {getItem, setItem} from '../utils';
import {apiUrl} from '../config/appConfig';
//
const api = axios.create({
  baseURL: apiUrl(),
});
//
api.interceptors.request.use(
  async config => {
    const token = await getItem('apat');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error),
);
//
api.interceptors.response.use(
  async response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const resp = await axios.get(
          `${apiUrl()}/auth/refreshToken`,{
            withCredentials: true, 
          }
        );
        const {token} = resp.data;
        if(token)
          await setItem('apat', token);
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return axios(originalRequest);
      } catch (error) {
        // Handle refresh token error
      }
    }
    return Promise.reject(error);
  },
);
//
export default api;
