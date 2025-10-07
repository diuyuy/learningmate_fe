import { useIntl, type FormatDateOptions } from 'react-intl';

export const useFormattedDate = (date: string, options: FormatDateOptions) => {
  const intl = useIntl();

  return intl.formatDate(date, options);
};
