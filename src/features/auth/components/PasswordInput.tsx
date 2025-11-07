import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useState } from 'react';

type InputType = 'password' | 'text';

export default function PasswordInput({
  className,
  ...props
}: React.ComponentProps<'input'>) {
  const [inputType, setInpuType] = useState<InputType>('password');

  const togglePasswdVisibility = () =>
    setInpuType((pre) => (pre === 'password' ? 'text' : 'password'));

  return (
    <div className='relative'>
      <Input
        type={inputType}
        className={cn('font-sans', className)}
        {...props}
      />
      <button
        type='button'
        onClick={togglePasswdVisibility}
        className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent hover:cursor-pointer'
      >
        {inputType === 'text' ? (
          <EyeOffIcon color='gray' size={18} />
        ) : (
          <EyeIcon color='gray' size={18} />
        )}
      </button>
    </div>
  );
}
