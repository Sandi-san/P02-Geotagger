import { yupResolver } from '@hookform/resolvers/yup';
import { UpdateUserType } from '../../models/user';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

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

export const useUpdateLocationForm = ({ defaultValues }: Props) => {
  const UpdateLocationSchema = Yup.object().shape({
    lat: Yup.number().notRequired().nonNullable(),
    lon: Yup.number().notRequired().nonNullable(),
    address: Yup.string().notRequired().nonNullable(),
  });

  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue, //for setting formData
  } = useForm<UpdateLocationFields>({
    defaultValues: {
      lat: 0,
      lon: 0,
      address: '',
      ...defaultValues,
    },
    mode: 'onSubmit',
    resolver: yupResolver(UpdateLocationSchema)
  });

  return {
    handleSubmit,
    errors,
    control,
    setValue,
  };
};

export type UpdateLocationForm = ReturnType<typeof useUpdateLocationForm>;
