//use state using React Redux (used in Register.tsx)  
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

//define class
interface UserRegisterFormData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirm_password: string;
  image: File | null;
}

//default values
const initialState: UserRegisterFormData = {
  email: '',
  firstName: '',
  lastName: '',
  password: '',
  confirm_password: '',
  image: null,
};

//functionality (methods)
const userRegisterFormSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    updateField: (state, action: PayloadAction<{ name: string; value: string }>) => {
      const { name, value } = action.payload;
      (state as any)[name] = value; //dynamic property update
    },
    updateImage: (state, action: PayloadAction<File | null>) => {
      state.image = action.payload;
    },
    resetForm: () => initialState, //reset input to initial state
  },
});

export const { updateField, updateImage, resetForm } = userRegisterFormSlice.actions;

export default userRegisterFormSlice.reducer;
