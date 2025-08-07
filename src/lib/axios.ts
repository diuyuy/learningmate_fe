import axios from 'axios';

// TODO: 인증 됐을 시 사용할 axios 인스턴스. 인터셉터 설정 필요.
export const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

// 인증 시 사용할 axios 인스턴스
export const authApi = axios.create({
  baseURL: 'http://localhost:8080/api',
});
