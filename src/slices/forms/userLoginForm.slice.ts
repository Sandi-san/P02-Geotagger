//use state using React Redux (used in Register.tsx)  
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

//define class
interface UserLoginFormData {
  email: string;
  password: string;
}

//default values
const initialState: UserLoginFormData = {
  email: '',
  password: '',
};

//functionality (methods)
const userLoginFormSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    updateField: (state, action: PayloadAction<{ name: string; value: string }>) => {
      const { name, value } = action.payload;
      (state as any)[name] = value;
    },
    resetForm: () => initialState,
  },
});

export const { updateField, resetForm } = userLoginFormSlice.actions;

export default userLoginFormSlice.reducer;
