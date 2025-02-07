import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

//Structure for Create Location form
export interface CreateGuessFields {
  lat: number;
  lon: number;
}

export const useCreateGuessForm = () => {
  const CreateGuessSchema = Yup.object().shape({
    lat: Yup.number().required(),
    lon: Yup.number().required(),
  });

  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue, //for setting Map data
  } = useForm<CreateGuessFields>({
    defaultValues: {
      lat: 0,
      lon: 0,
    },
    mode: 'onSubmit',
    resolver: yupResolver(CreateGuessSchema)
  });

  return {
    handleSubmit,
    errors,
    control,
    setValue,
  };
};

export type CreateGuessForm = ReturnType<typeof useCreateGuessForm>;
