import axios, { AxiosError } from 'axios';

// TODO: 인터셉터 설정 필요.

const baseUrl = import.meta.env.VITE_BASE_URL;

export const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

type FailedQueueItem = {
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
};

let isRefreshing = false;
let failedQueue: FailedQueueItem[] = [];

const processQueue = (error: unknown) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(null);
    }
  });

  failedQueue = [];
};

export const setInterceptors = (logout: () => void) => {
  api.interceptors.response.use(
    (response) => {
      // 2xx 범위에 있는 상태 코드는 이 함수를 트리거 합니다.
      return response;
    },
    async (error: AxiosError) => {
      // 2xx 외의 범위에 있는 상태 코드는 이 함수를 트리거 합니다.
      const originalRequest = error.config!;

      // 401 에러이고, 재시도한 요청이 아닐 경우
      if (error.response?.status === 401 && !originalRequest._retry) {
        // 이미 토큰 재발급이 진행 중인 경우
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            // 실패한 요청을 큐에 추가
            failedQueue.push({ resolve, reject });
          }).then(() => {
            // 토큰 재발급이 완료된 후, 원래 요청을 다시 실행
            return api(originalRequest);
          });
        }

        // 재시도 플래그 설정
        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // 리프레시 토큰으로 새로운 액세스 토큰을 요청
          // 서버의 응답 헤더(Set-Cookie)를 통해 브라우저에 새로운 accessToken 쿠키가 설정됩니다.
          await axios.post(
            'http://localhost:8080/api/v1/auth/refresh-token',
            {},
            {
              withCredentials: true,
            }
          );

          processQueue(null);

          return api(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError);
          // 예: 상태 초기화, 로그인 페이지로 리디렉션 등
          logout();

          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );
};
