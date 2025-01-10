import { apiRoutes } from '../constants/apiConstants';
import { apiRequest } from './Api';
import { LoginUserFields } from '../hooks/react-hook-form/useLogin';
import { UserType } from '../models/user';
import { RegisterUserFields } from '../hooks/react-hook-form/useRegister';
import { UpdateUserFields } from '../hooks/react-hook-form/useCreateUpdateUser';

//TODO: change

//dobi local storage access_token od userja
const getAccessToken = () => {
  const accessToken = localStorage.getItem('access_token');
  //parsaj access token iz JSON (dobi samo vsebini)
  let parsedAccessToken;
  if (accessToken) {
    const parsedToken = JSON.parse(accessToken);
    if (parsedToken && parsedToken.access_token) {
      parsedAccessToken = parsedToken.access_token;
      return parsedAccessToken;
    }
  }
  return null;
};

//GET User
export const fetchUser = async () => {
  //dobi access token (local storage)
  const accessToken = getAccessToken();

  const response = await apiRequest<undefined, UserType>(
    'get',
    apiRoutes.FETCH_USER,
    undefined,
    //POZOR: treba poslati Authorization za access token
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );

  //poglej ce response vsebuje data
  if (response && response.data) {
    return response.data; //vrni data
  } else {
    console.error('No user data found in response');
    return null; // return null ce user data is ni available
  }
};

//POST Login User
export const login = async (data: LoginUserFields) =>
  apiRequest<LoginUserFields, UserType>('post', apiRoutes.LOGIN, data);

//POST Register User
export const register = async (data: RegisterUserFields) => {
  try {
    const response = await apiRequest<RegisterUserFields, void>(
      'post',
      apiRoutes.REGISTER,
      data,
    );
    return response;
  } catch (error) {
    console.error('Error:', error);
    throw error; // Rethrow the error to be caught by the caller
  }
};

//POST Signout User
// export const signout = async () =>
//   apiRequest<undefined, void>('post', apiRoutes.SIGNOUT);

//PATCH Update User (firstname, lastname, email)
export const updateUser = async (data: UpdateUserFields) => {
  console.log('Update user data:', JSON.stringify(data));
  const accessToken = getAccessToken();
  return apiRequest<UpdateUserFields, void>(
    'patch',
    `${apiRoutes.UPDATE_USER}`,
    data,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
};

//PATCH Update User Password (drugacni route kot samo Update)
export const updateUserPassword = async (data: UpdateUserFields) => {
  console.log('Update password data:', JSON.stringify(data));
  const accessToken = getAccessToken();
  return apiRequest<UpdateUserFields, void>(
    'patch',
    `${apiRoutes.UPDATE_USER_PASSWORD}`,
    data,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
};

//PATCH Update User Image (poslje file)
export const updateUserImage = async (formData: FormData) => {
  console.log('Update image data:', JSON.stringify(formData));
  const accessToken = getAccessToken();
  return apiRequest<FormData, void>(
    'post',
    `${apiRoutes.UPDATE_USER_IMAGE}`,
    formData,
    //POZOR: poslati treba tudi Content-Type
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'multipart/form-data',
      },
    },
  );
};