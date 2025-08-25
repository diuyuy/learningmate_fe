import { ROUTE_PATHS } from '@/constants/routepaths';
import { useState, useTransition } from 'react';
import { useNavigate } from 'react-router';
import {
  checkEmailExists,
  requestAuthCode,
  signUp,
  validateAuthCode,
} from '../api/api';
import type { SignUpForm } from '../types/types';
import { useSignUpForm } from './useSignUpForm';

type checkEmail =
  | {
      isExist: boolean;
      isPending: false;
      unknown: false;
    }
  | { unknown: true; isPending: false }
  | { isPending: true };

type validateCode =
  | {
      isValid: boolean;
      isPending: false;
      unknown: false;
    }
  | { unknown: true; isPending: false }
  | {
      isPending: true;
    };

export const useSignUpActions = (
  form: ReturnType<typeof useSignUpForm>,
  startTimer: () => void
) => {
  const navigate = useNavigate();

  const [checkEmail, setCheckEmail] = useState<checkEmail>({
    unknown: true,
    isPending: false,
  });
  const [validateCode, setValidateCode] = useState<validateCode>({
    unknown: true,
    isPending: false,
  });
  const [hasRequestedCode, setHasRequestedCode] = useState(false);

  const [, startTransition] = useTransition();
  const [isRequesting, startRequestTransition] = useTransition();
  const [, startValidateTransition] = useTransition();

  const checkEmailValidate = async () => {
    return form.trigger('email');
  };

  const checkEmailExistsAction = async () => {
    if (!(await checkEmailValidate())) return;
    startTransition(async () => {
      setCheckEmail({ isPending: true });
      try {
        const isExist = await checkEmailExists(form.getValues().email);
        if (isExist) {
          setCheckEmail({ isExist: true, unknown: false, isPending: false });
        } else {
          setCheckEmail({ isExist: false, unknown: false, isPending: false });
        }
      } catch (error) {}
    });
  };

  const requestAuthCodeAction = async () => {
    if (!(await form.trigger(['email', 'password', 'password2']))) return;

    if (form.getValues().password !== form.getValues().password2) {
      form.setError('password2', {
        message: '비밀번호가 일치하지 않습니다.',
      });
      return;
    }

    startRequestTransition(async () => {
      try {
        await requestAuthCode(form.getValues().email);
        setHasRequestedCode(true);
        startTimer();
      } catch (error) {
        console.error(error);
      }
    });
  };

  const validateAuthCodeAction = async () => {
    if (!(await checkEmailValidate())) return;

    if (!(await form.trigger('authCode'))) {
      form.setError('authCode', {
        message: '유효한 인증 코드를 입력하세요.',
      });
      return;
    }

    startValidateTransition(async () => {
      const isValid = await validateAuthCode(
        form.getValues().email,
        form.getValues().authCode
      );

      setValidateCode({ isValid, unknown: false, isPending: false });
    });
  };

  const onSubmit = async (data: SignUpForm) => {
    try {
      await signUp(data);

      alert('회원가입이 완료되었습니다!');
      navigate(ROUTE_PATHS.LOGIN);
    } catch (error) {
      alert('회원가입을 실패했습니다.');
    }
  };

  const submitIsAbled = !(
    checkEmail.isPending === true ||
    checkEmail.unknown === true ||
    checkEmail.isExist ||
    validateCode.isPending === true ||
    validateCode.unknown === true ||
    !validateCode.isValid ||
    !hasRequestedCode
  );

  return {
    checkEmail,
    validateCode,
    isRequesting,
    hasRequestedCode,
    submitIsAbled,
    checkEmailExistsAction,
    requestAuthCodeAction,
    validateAuthCodeAction,
    onSubmit,
  };
};
