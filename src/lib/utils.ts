import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const debounce = <T>(
  callback: (...args: T[]) => void,
  delay: number = 1000
) => {
  let timer: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<typeof callback>) => {
    if (timer) clearTimeout(timer);

    timer = setTimeout(() => {
      callback(...args);
      timer = null;
    }, delay);
  };
};
