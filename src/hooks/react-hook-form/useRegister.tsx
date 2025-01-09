import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

//Structure for Register User form
export interface RegisterUserFields {
  firstName?: string | undefined;
  lastName?: string | undefined;
  email: string;
  password: string;
  confirm_password: string;
}

//Method that gets called within the form
export const useRegisterForm = () => {
  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().notRequired().nonNullable(),
    lastName: Yup.string().notRequired().nonNullable(),
    email: Yup.string().email('Please enter a valid email').required('Email is required'),
    password: Yup.string()
      .matches(
        /^(?=.*\d)[A-Za-z.\s_-]+[\w~@#$%^&*+=`|{}:;!.?"()[\]-]{6,}/,
        'Password must contain at least one number, lower or uppercase letter, and must be longer than 6 characters.',
      )
      .required('Password is required'),
    confirm_password: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords do not match')
      .required('Passwords do not match'),
  });

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<RegisterUserFields>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirm_password: '',
    },
    mode: 'onSubmit',
    resolver: yupResolver(RegisterSchema),
  });

  return {
    handleSubmit,
    errors,
    control,
  };
};


export type RegisterForm = ReturnType<typeof useRegisterForm>;
