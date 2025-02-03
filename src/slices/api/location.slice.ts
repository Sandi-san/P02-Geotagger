import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { UserType } from '../../models/user';
import { RootState } from '../../stores/configure.store';
import { tokenStorage } from '../../utils/tokenStorage';
import { UpdateUserFields } from '../../hooks/react-hook-form/useCreateUpdateUser';
import { FetchPaginatedLocationType, LocationType } from '../../models/location';
import { CreateLocationFields } from '../../hooks/react-hook-form/useCreateLocation';
import { UpdateLocationFields } from '../../hooks/react-hook-form/useUpdateLocation';

//api for /location route in backend 
export const locationSlice = createApi({
  reducerPath: 'location', //identifier for this slice
  baseQuery: fetchBaseQuery({
    //base URL (matches backend)
    baseUrl: `${process.env.REACT_APP_BACKEND_DOMAIN}/location`,
    prepareHeaders: (headers) => {
      //retrieve user access_token from local storage 
      const token = tokenStorage.getToken()
      if (token)
        headers.set('Authorization', `Bearer ${token}`)
      return headers
    }
  }),
  endpoints: (builder) => ({
    getLocations: builder.query<FetchPaginatedLocationType, { page: number, take?: number }>({
      query: ({ page, take }) => {
        //construct query parameters dynamically
        const params = new URLSearchParams({ page: page.toString() });
        //if take is passed, append as parameter
        if (take !== undefined) {
          params.append('take', take.toString());
        }
        //call route with arguments
        return {
          url: `/?${params.toString()}`,
          method: 'GET',
        };
      },
    }),
    getLocation: builder.query<LocationType, { id: number }>({
      query: ({ id }) => ({
        url: `${id}`,
        method: 'GET',
      }),

    }),
    createLocation: builder.mutation<LocationType, CreateLocationFields>({
      query: (formData: CreateLocationFields) => ({
        url: '',
        method: 'POST',
        body: formData,
      }),
      transformResponse: (response: any): LocationType => {
        return {
          id: response.id,
          address: response.address,
          image: response.image,
          lat: response.lat,
          lon: response.lon,
          userId: response.userId,
        }
      }
    }),
    updateLocation: builder.mutation<LocationType, {id: number, formData: UpdateLocationFields}>({
      query: ({id, formData}) => ({
        url: `${id}`,
        method: 'PATCH',
        body: formData,
      }),
      transformResponse: (response: any): LocationType => {
        return {
          id: response.id,
          address: response.address,
          image: response.image,
          lat: response.lat,
          lon: response.lon,
          userId: response.userId,
        }
      }
    }),
    updateUser: builder.mutation<UserType, UpdateUserFields>({
      query: (formData: UpdateUserFields) => ({
        url: '/update',
        method: 'PATCH',
        body: formData,
      }),
      transformResponse: (response: any): UserType => {
        return {
          id: response.id,
          firstName: response.firstName,
          lastName: response.lastName,
          email: response.email,
          image: response.image,
          guessTokens: response.guessTokens,
        }
      }
    }),
    //get FormData and Id as arguments, return Location
    uploadImage: builder.mutation<LocationType, { id: number, formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `${id}/update-image`,
        method: 'POST',
        body: formData,
      }),
      transformResponse: (response: any): LocationType => {
        return {
          id: response.id,
          address: response.address,
          image: response.image,
          lat: response.lat,
          lon: response.lon,
          userId: response.userId,
        }
      }
    }),
  }),
});

export const {
  useGetLocationsQuery,
  useGetLocationQuery,
  useCreateLocationMutation,
  useUpdateLocationMutation,
  useUploadImageMutation,
  // useUpdateUserMutation,
  // useUploadImageMutation,
} = locationSlice;
