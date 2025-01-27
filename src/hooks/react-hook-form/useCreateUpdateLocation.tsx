import { yupResolver } from '@hookform/resolvers/yup';
import { UpdateUserType } from '../../models/user';
import { Resolver, useForm } from 'react-hook-form';
import * as Yup from 'yup';

//Structure for Create Location form
export interface CreateLocationFields {
  lat: number;
  lon: number;
  address?: string | undefined;
}

//Structure for Update Location form
export interface UpdateLocationFields {
  lat?: number | undefined;
  lon?: number | undefined;
  address?: string | undefined;
}

//for update
interface Props {
  defaultValues?: UpdateUserType;
}

//Unify Create & Update location fields to be able to be used with resolver
type UnionLocationFields = CreateLocationFields | UpdateLocationFields;

export const useCreateUpdateLocationForm = ({ defaultValues }: Props) => {
  const CreateLocationSchema = Yup.object().shape({
    lat: Yup.number().required(),
    lon: Yup.number().required(),
    address: Yup.string().notRequired().nonNullable(),
  });

  const UpdateLocationSchema = Yup.object().shape({
    lat: Yup.number().notRequired().nonNullable(),
    lon: Yup.number().notRequired().nonNullable(),
    address: Yup.string().notRequired().nonNullable(),
  });

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<UnionLocationFields>({
    defaultValues: {
      lat: 0,
      lon: 0,
      address: '',
      ...defaultValues,
    },
    mode: 'onSubmit',
    //if defaultValues is set, use update, else create
    resolver: (defaultValues
      ? yupResolver(UpdateLocationSchema)
      //type assertion (resolver expects Update & Create to have matching schemes)
      : yupResolver(CreateLocationSchema)) as unknown as Resolver<UnionLocationFields, any>
  });

  return {
    handleSubmit,
    errors,
    control,
  };
};

export type CreateUpdateLocationForm = ReturnType<typeof useCreateUpdateLocationForm>;
