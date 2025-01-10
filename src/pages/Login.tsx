import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../stores/configure.store';
import { resetForm, updateField } from '../slices/forms/userLoginForm.slice';

const Login: FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { email, password } = useSelector((state: RootState) => state.loginForm);
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      dispatch(updateField({ name, value }));
    };
  
    const handleSubmit = () => {
      console.log('Login Data:', { email, password });
      // Add login logic here
    };
  
    const handleReset = () => {
      dispatch(resetForm()); // Reset login form
    };
  
    return (
        <>
           <p>To be added.</p>
        </>
    );
};

export default Login;