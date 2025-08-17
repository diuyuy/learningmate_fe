import axios from 'axios';

// TODO: 인증 됐을 시 사용할 axios 인스턴스. 인터셉터 설정 필요.
export const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
});

// 인증 시 사용할 axios 인스턴스
export const authApi = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
});

// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error instanceof AxiosError) {
//       if (error.status === 401) {
//         //TODO: refresh token 으로 accessToken 갱신하는 로직 추가
//         //TODO: refresh token 만료 시 인증 페이지로 redirct 로직 추가
//         return redirect(ROUTE_PATHS.LOGIN);
//       }
//     }

//     throw new Error('알 수 없는 에러입니다.');
//   }
// );
