# =============================================
# 1. 빌드 단계 (Builder Stage)
# =============================================
# node:18-alpine 과 같이 Corepack이 포함된 버전을 사용합니다.
FROM node:22-alpine AS builder

# 작업 디렉토리 설정
WORKDIR /app


# 의존성 관련 파일들을 먼저 복사합니다.
# Yarn Berry는 여러 설정 파일을 사용할 수 있으므로 필요한 파일을 모두 복사합니다.
COPY package.json yarn.lock


RUN corepack enable

COPY . .

# 의존성 설치
# --immutable 플래그는 yarn.lock 파일이 변경되지 않도록 보장하여 CI 환경에서 안정성을 높입니다.
RUN yarn install

# 나머지 소스 코드 전체를 복사합니다.

# React 앱을 빌드합니다.
RUN yarn build

# =============================================
# 2. 배포 단계 (Production Stage)
# =============================================
# 경량 웹서버인 Nginx 이미지를 사용합니다.
FROM nginx:alpine

# 빌드 단계(builder)에서 생성된 빌드 결과물(/app/build)을
# Nginx의 기본 정적 파일 경로(/usr/share/nginx/html)로 복사합니다.
COPY --from=builder /app/dist /usr/share/nginx/html

# React Router 등을 위한 커스텀 Nginx 설정을 복사합니다.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 80번 포트를 외부에 노출합니다.
EXPOSE 80

# Nginx를 실행하여 컨테이너를 시작합니다.
CMD ["nginx", "-g", "daemon off;"]