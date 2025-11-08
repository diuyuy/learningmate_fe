import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { ROUTE_PATHS } from '@/constants/routepaths';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  CheckCircle2,
  Lock,
  Mail,
  Shield,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { ClipLoader } from 'react-spinners';
import { signUp } from '../api/api';
import { useAuthCodeTimer } from '../hooks/useAuthCodeTimer';
import { useSignUpActions } from '../hooks/useSignUpActions';
import { useSignUpForm } from '../hooks/useSignUpForm';
import type { SignUpFormData } from '../types/types';
import AuthCodeTimer from './AuthCodeTimer';
import PasswordInput from './PasswordInput';
import SignupFailureDialog from './SignupFailureDialog';
import SignupSuccessDialog from './SignupSuccessDialog';

export default function SignUpForm() {
  const form = useSignUpForm();

  const { seconds, startTimer } = useAuthCodeTimer(3 * 60);

  const {
    checkEmail,
    validateCode,
    isRequesting,
    hasRequestedCode,
    submitIsAbled,
    requestAuthCodeAction,
    checkEmailExistsAction,
    validateAuthCodeAction,
  } = useSignUpActions(form, startTimer);

  const navigate = useNavigate();
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [isFailureDialogOpen, setIsFailureDialogOpen] = useState(false);

  const onSubmit = async (data: SignUpFormData) => {
    try {
      await signUp(data);
      setIsSuccessDialogOpen(true);
    } catch (error) {
      setIsFailureDialogOpen(true);
    }
  };

  return (
    <Card className='mx-auto w-full max-w-md'>
      <CardContent>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex flex-col gap-5'
        >
          <FieldGroup className='gap-6'>
            {/* Email Section */}
            <div className='space-y-3'>
              <Controller
                control={form.control}
                name='email'
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor='form-input-email'
                      className='font-semibold flex items-center gap-2'
                    >
                      <Mail className='w-4 h-4' />
                      이메일
                    </FieldLabel>
                    <div className='flex items-center gap-2 flex-wrap md:flex-nowrap'>
                      <Input
                        id='form-input-email'
                        autoComplete='email'
                        placeholder='이메일을 입력하세요...'
                        {...field}
                      />
                      <Button
                        type='button'
                        variant={'outline'}
                        onClick={checkEmailExistsAction}
                        className='whitespace-nowrap'
                      >
                        중복 확인
                      </Button>
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <AnimatePresence mode='wait'>
                {checkEmail.isPending ? (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className='flex items-center gap-2 px-3 py-2 rounded-md bg-gray-50'
                  >
                    <ClipLoader color='gray' size={16} />
                    <span className='text-sm text-gray-600'>확인 중...</span>
                  </motion.div>
                ) : !checkEmail.unknown ? (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md ${
                      checkEmail.isExist ? 'bg-red-50' : 'bg-green-50'
                    }`}
                  >
                    {checkEmail.isExist ? (
                      <>
                        <XCircle className='w-4 h-4 text-red-500' />
                        <span className='text-sm text-red-600'>
                          중복된 이메일 입니다.
                        </span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className='w-4 h-4 text-green-500' />
                        <span className='text-sm text-green-600'>
                          유효한 이메일 입니다.
                        </span>
                      </>
                    )}
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
            {/* Password Section */}
            <Controller
              control={form.control}
              name='password'
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor='form-input-passwd1'
                    className='font-semibold flex items-center gap-2'
                  >
                    <Lock className='w-4 h-4' />
                    비밀번호
                  </FieldLabel>
                  <PasswordInput
                    id='form-input-passwd1'
                    placeholder='비밀번호를 입력하세요...'
                    autoComplete='current-password'
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name='password2'
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor='form-input-passwd2'
                    className='font-semibold flex items-center gap-2'
                  >
                    <Lock className='w-4 h-4' />
                    비밀번호 확인
                  </FieldLabel>
                  <PasswordInput
                    id='form-input-passwd2'
                    placeholder='비밀번호를 입력하세요...'
                    autoComplete='current-password2'
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            {/* Auth Code Section */}
            <AnimatePresence>
              {hasRequestedCode ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Controller
                    control={form.control}
                    name='authCode'
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          htmlFor='form-input-authCode'
                          className='font-semibold flex items-center gap-2'
                        >
                          <Shield className='w-4 h-4' />
                          인증 코드 번호
                        </FieldLabel>
                        <div className='flex justify-between items-center gap-3'>
                          <Input
                            id='form-input-authCode'
                            type='text'
                            placeholder='인증 코드 6자리'
                            autoComplete='authCode'
                            {...field}
                            className='flex-1'
                          />
                          {hasRequestedCode ? (
                            <AuthCodeTimer seconds={seconds} />
                          ) : null}
                        </div>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </motion.div>
              ) : null}
            </AnimatePresence>
          </FieldGroup>

          {/* Auth Code Actions Section */}
          <div className='space-y-3'>
            <div className='flex items-center gap-2'>
              {!hasRequestedCode || seconds === 0 ? (
                <Button
                  type='button'
                  variant={'outline'}
                  onClick={requestAuthCodeAction}
                  className='flex-1'
                >
                  인증 번호 요청
                </Button>
              ) : null}
              {isRequesting ? (
                <div className='flex items-center gap-2 px-3 py-2 rounded-md bg-gray-50'>
                  <ClipLoader color='gray' size={16} />
                  <span className='text-sm text-gray-600'>요청 중...</span>
                </div>
              ) : hasRequestedCode && seconds !== 0 ? (
                <Button
                  type='button'
                  variant={'secondary'}
                  onClick={validateAuthCodeAction}
                  className='flex-1'
                >
                  인증 번호 확인
                </Button>
              ) : null}
            </div>
            <AnimatePresence mode='wait'>
              {validateCode.isPending ? (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className='flex items-center gap-2 px-3 py-2 rounded-md bg-gray-50'
                >
                  <ClipLoader color='gray' size={16} />
                  <span className='text-sm text-gray-600'>확인 중...</span>
                </motion.div>
              ) : !validateCode.unknown ? (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md ${
                    validateCode.isValid ? 'bg-green-50' : 'bg-red-50'
                  }`}
                >
                  {validateCode.isValid ? (
                    <>
                      <CheckCircle2 className='w-4 h-4 text-green-500' />
                      <span className='text-sm text-green-600'>인증 성공</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className='w-4 h-4 text-red-500' />
                      <span className='text-sm text-red-600'>인증 실패</span>
                    </>
                  )}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          {/* Submit Button */}
          <Button
            type='submit'
            className='w-full py-6 text-base font-semibold'
            disabled={!submitIsAbled}
          >
            계정 생성
          </Button>
        </form>
      </CardContent>
      <SignupSuccessDialog
        open={isSuccessDialogOpen}
        onConfirm={() => {
          setIsSuccessDialogOpen(false);
          navigate(ROUTE_PATHS.LOGIN);
        }}
      />
      <SignupFailureDialog
        open={isFailureDialogOpen}
        onClose={() => setIsFailureDialogOpen(false)}
      />
    </Card>
  );
}
