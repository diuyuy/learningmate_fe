import { GoogleLoginButton } from '@/components/GoogleLoginButton';
import { KakaoLoginButton } from '@/components/kakao-login-button';

export default function OauthLoginButtonList() {
  return (
    <div className='space-y-4'>
      <GoogleLoginButton />
      {/* <NaverLoginButton /> */}
      <KakaoLoginButton />
    </div>
  );
}
