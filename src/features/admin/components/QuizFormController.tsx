import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Controller } from 'react-hook-form';
import TextareaAutosize from 'react-textarea-autosize';
import { useQuizForm } from '../hooks/useQuizForm';
import type { QuizForm } from '../types/types';
type Props = {
  form: ReturnType<typeof useQuizForm>;
  name: keyof QuizForm;
};

export default function QuizFormController({ form, name }: Props) {
  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel
            id={name}
            className='font-semibold'
          >{`${name[0].toUpperCase()}${name.substring(1)}`}</FieldLabel>
          <TextareaAutosize
            {...field}
            id={name}
            className='w-full resize-none border rounded-md p-2 focus-visible:outline-none'
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
