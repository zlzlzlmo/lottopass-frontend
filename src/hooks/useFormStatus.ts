import { useContext, createContext } from 'react';

interface FormStatus {
  pending: boolean;
  data: FormData | null;
  method: string | null;
  action: string | null;
}

const FormStatusContext = createContext<FormStatus | null>(null);

export function useFormStatus(): FormStatus {
  const status = useContext(FormStatusContext);
  if (!status) {
    return {
      pending: false,
      data: null,
      method: null,
      action: null,
    };
  }
  return status;
}

export const FormStatusProvider = FormStatusContext.Provider;