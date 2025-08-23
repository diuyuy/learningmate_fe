import axios from 'axios';

// TODO: 인터셉터 설정 필요.
export const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  withCredentials: true,
});

api.interceptors.request.use(
  (req) => req,
  (error) => {
    console.error(error);
    throw error;
  }
);
