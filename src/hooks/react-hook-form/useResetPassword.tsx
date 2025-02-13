import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

export interface PasswordUserFields {
  password: string;
  confirm_password: string;
  resetToken: string;
}

export const usePasswordForm = () => {
  const PasswordSchema = Yup.object().shape({
    password: Yup.string()
      .matches(
        /^(?=.*\d)[A-Za-z.\s_-]+[\w~@#$%^&*+=`|{}:;!.?"()[\]-]{6,}/,
        'Password must contain least one number, lower or uppercase letter and must be longer than 6 characters.',
      )
      .required(),
    confirm_password: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords do not match')
      .required('Passwords do not match'),
    resetToken: Yup.string().length(64).required('Reset token is invalid')
  });

  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm<PasswordUserFields>({
    defaultValues: {
      password: '',
      confirm_password: '',
      resetToken: '',
    },
    mode: 'onSubmit',
    resolver: yupResolver(PasswordSchema),
  });

  return {
    handleSubmit,
    errors,
    control,
    setValue,
  };
};

export type PasswordForm = ReturnType<typeof usePasswordForm>;
