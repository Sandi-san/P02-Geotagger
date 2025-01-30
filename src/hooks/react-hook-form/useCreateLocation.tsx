import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

//Structure for Create Location form
export interface CreateLocationFields {
  lat: number;
  lon: number;
  address?: string | undefined;
}

export const useCreateLocationForm = () => {
  const CreateLocationSchema = Yup.object().shape({
    lat: Yup.number().required(),
    lon: Yup.number().required(),
    address: Yup.string().notRequired().nonNullable(),
  });

  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue, //for setting Map data
  } = useForm<CreateLocationFields>({
    defaultValues: {
      lat: 0,
      lon: 0,
      address: '',
    },
    mode: 'onSubmit',
    resolver: yupResolver(CreateLocationSchema)
  });

  return {
    handleSubmit,
    errors,
    control,
    setValue,
  };
};

export type CreateUpdateLocationForm = ReturnType<typeof useCreateLocationForm>;
