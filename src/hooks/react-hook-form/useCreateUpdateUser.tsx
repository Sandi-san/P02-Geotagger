import { yupResolver } from '@hookform/resolvers/yup';
import { UpdateUserType } from '../../models/user';
import { Resolver, useForm } from 'react-hook-form';
import * as Yup from 'yup';

type UserFormFields = CreateUserFields | UpdateUserFields;

//Structure for Create User form
export interface CreateUserFields {
  firstName?: string | undefined;
  lastName?: string | undefined;
  email: string;
  password: string;
  confirm_password: string;
}

//Structure for Update User form
export interface UpdateUserFields {
  firstName?: string | undefined;
  lastName?: string | undefined;
  email: string;
  old_password?: string | undefined;
  password?: string | undefined;
  confirm_password?: string | undefined;
}

//for update
interface Props {
  defaultValues?: UpdateUserType;
}

//Unify Create & Update user fields to be able to be used with resolver
type UnionUserFields = CreateUserFields | UpdateUserFields;

export const useCreateUpdateUserForm = ({ defaultValues }: Props) => {
  const CreateUserSchema = Yup.object().shape({
    firstName: Yup.string().notRequired().nonNullable(),
    lastName: Yup.string().notRequired().nonNullable(),
    email: Yup.string().email().required('Please enter a valid email'),
    password: Yup.string()
      .matches(
        /^(?=.*\d)[A-Za-z.\s_-]+[\w~@#$%^&*+=`|{}:;!.?"()[\]-]{6,}/,
        'Password must contain least one number, lower or uppercase letter and must be longer than 6 characters.',
      )
      .required(),
    confirm_password: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords do not match')
      .required('Passwords do not match'),
  });

  const UpdateUserSchema = Yup.object().shape({
    firstName: Yup.string().notRequired().nonNullable(),
    lastName: Yup.string().notRequired().nonNullable(),
    email: Yup.string().email().required('Please enter a valid email'),
    old_password: Yup.string().notRequired().nonNullable(),
    password: Yup.string().notRequired().nonNullable(),
    confirm_password: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords do not match')
      .notRequired().nonNullable(),
  });

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<UnionUserFields>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      old_password: '',
      password: '',
      confirm_password: '',
      ...defaultValues,
    },
    mode: 'onSubmit',
    //if defaultValues is set, use update, else create
    resolver: (defaultValues
      ? yupResolver(UpdateUserSchema)
      //type assertion (resolver expects Update & Create to have matching schemes)
      : yupResolver(CreateUserSchema)) as unknown as Resolver<UnionUserFields, any>
  });

  return {
    handleSubmit,
    errors,
    control,
  };
};

export type CreateUpdateUserForm = ReturnType<typeof useCreateUpdateUserForm>;
