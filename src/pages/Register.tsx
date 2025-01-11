import { Avatar, Box, Button, FormControl, Link, TextField, Typography } from '@mui/material';
import { FC, useState } from 'react';
import theme from '../theme';
import useMediaQuery from '../hooks/useMediaQuery';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../stores/configure.store';
import { updateField, updateImage } from '../slices/forms/userRegisterForm.slice';
import { useRegisterUserMutation } from '../slices/api/auth.slice';
import { RegisterUserFields, useRegisterForm } from '../hooks/react-hook-form/useRegister';
import { Controller } from 'react-hook-form';

const Register: FC = () => {
    //mediaQuery for Responsive Web Design
    const { isMobile } = useMediaQuery(768)

    //form validation for user registration (custom hook)
    const { handleSubmit, errors, control } = useRegisterForm();
    //initialize mutation hook for registering User (backend api calls)
    const [registerUser] = useRegisterUserMutation();
    //set state for image file (separate from useRegisterForm, which uses Yup)
    const [imageFile, setImageFile] = useState<File | null>(null)

    //data to be used in the sign up form
    const formData = useSelector((state: RootState) => state.registerForm)

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log("Changing avatar")
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file)
        }
    };

    //handle submit with Yup form validation
    const onSubmit = async (formData: RegisterUserFields) => {
        console.log('Form Data:', formData);
        try {
            //call RTK Query mutation with valid formData (register user)
            const registerResponse = await registerUser(formData).unwrap();
            console.log('User registered successfully:', registerResponse);

            /*
            //if image is also passed, call uploadFile route
            if (imageFile) {
                const formDataImage = new FormData()
                formDataImage.append('image', imageFile)
                //call api
                //TODO: add user api hooks (upload Image (note: needs authentication, from registerResponse))
                const imageUploadResponse = await uploadImage(formDataImage);
                console.log('Image uploaded successfully:', imageUploadResponse);
            }
                */

        } catch (err) {
            console.error('Error during registration:', err);
        }
    };

    //TODO: SHOW/HIDE PASSWORD ICONS

    return (
        <>
            <Box sx={{
                position: 'relative',
                display: 'flex',
                height: '100vh',
                width: '100%',
                flexDirection: 'row',
                textAlign: 'center',
                alignItems: 'stretch',
                overflow: 'hidden', //prevent accidental overflow
            }}>
                <Box
                    sx={{
                        flex: 2,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        //change style based on width of the visible page (mediaQuery)
                        justifyContent: isMobile ? 'flex-start' : 'center',
                        alignItems: 'center',
                        bgcolor: 'background.paper',
                        paddingX: isMobile ? 0 : 8,
                        minHeight: 0,
                        overflow: 'auto',
                    }}
                >
                    <Typography variant="h3" gutterBottom>
                        Sign up
                    </Typography>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <FormControl fullWidth>
                            <Box sx={{
                                position: 'relative',
                                display: 'flex',
                                flexDirection: 'column',
                                textAlign: 'center',
                                alignItems: 'center',
                            }}>
                                <Typography variant="body1" color='primary.dark' sx={{ flex: 1 }}>
                                    Your name will appear on posts and your public profile.
                                </Typography>
                                {/* Avatar field inside label*/}
                                <label htmlFor='image-upload'>
                                    <input
                                        id='image-upload'
                                        type='file'
                                        accept='image/png, image/jpg, image/jpeg'
                                        style={{ display: 'none' }}
                                        onChange={handleAvatarChange}
                                    />
                                    <Avatar
                                        src={imageFile ? URL.createObjectURL(imageFile) : ''}
                                        sx={{
                                            width: '10vh',
                                            height: '10vh',
                                            cursor: 'pointer',
                                            marginY: 2,
                                        }}
                                    />
                                </label>
                            </Box>
                            {/* Email */}
                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Email"
                                        error={!!errors.email}
                                        helperText={errors.email?.message}
                                        variant="outlined"
                                        fullWidth
                                        sx={{ marginBottom: 2 }}
                                    />
                                )}
                            />
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: 2,
                                }}
                            >
                                {/* First Name */}
                                <Controller
                                    name="firstName"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="First Name"
                                            error={!!errors.firstName}
                                            helperText={errors.firstName?.message}
                                            variant="outlined"
                                            fullWidth
                                            sx={{ marginBottom: 2 }}
                                        />
                                    )}
                                />
                                {/* Last Name */}
                                <Controller
                                    name="lastName"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Last Name"
                                            error={!!errors.lastName}
                                            helperText={errors.lastName?.message}
                                            variant="outlined"
                                            fullWidth
                                            sx={{ marginBottom: 2 }}
                                        />
                                    )}
                                />
                            </Box>
                            {/* Password */}
                            <Controller
                                name="password"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        type="password"
                                        label="Password"
                                        error={!!errors.password}
                                        helperText={errors.password?.message}
                                        variant="outlined"
                                        fullWidth
                                        sx={{ marginBottom: 2 }}
                                    />
                                )}
                            />
                            {/* Confirm Password */}
                            <Controller
                                name="confirm_password"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        type="password"
                                        label="Confirm Password"
                                        error={!!errors.confirm_password}
                                        helperText={errors.confirm_password?.message}
                                        variant="outlined"
                                        fullWidth
                                        sx={{ marginBottom: 2 }}
                                    />
                                )}
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                sx={{ marginBottom: 2 }}
                            >
                                Sign up
                            </Button>
                        </FormControl>
                    </form>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <Box sx={{ alignItems: 'flex-start' }}>
                            <Typography variant="body1" color='primary.dark'>
                                Already have an account?
                            </Typography>
                        </Box>
                        <Box>
                            <Link variant="body1" color='primary.main'
                                sx={{ textDecoration: 'none' }}
                                href="/login"
                            >
                                Sign in
                            </Link>
                        </Box>
                    </Box>
                    {/* {isLoading && (
                        <Typography color='info'>Registering...</Typography>
                    )}
                    {error && (
                        <Typography color='error'>Registeration failed: {'message' in error ? error.message : ''}</Typography>
                    )} */}
                    <Box>
                    </Box>
                </Box>
                <Box
                    sx={{
                        position: 'relative',
                        flex: 3,
                        height: '100vh', //stretch through entire height
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        bgcolor: 'primary.main'
                    }}
                >
                    {/* Image background */}
                    <Box
                        component="img"
                        src='background-map.png'
                        alt="No image"
                        sx={{
                            width: '100%',
                            height: '100vh',
                            objectFit: 'cover',
                            borderRadius: 'inherit',

                        }}
                    />
                    {/* Green overlay */}
                    <Box
                        sx={{
                            position: 'absolute',
                            width: '100%',
                            height: '100vh',
                            //gradient from left to right: color from custom theme with alpha channel (50% = 80 in hex color code)
                            background: `linear-gradient(to right, ${theme.palette.primary.main}80, ${theme.palette.primary.light}80)`,
                            zIndex: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {/* Logo */}
                        <Box component="img" src="/logo-outline.svg" alt="Lock" sx={{ height: 200, position: 'relative' }} />
                    </Box>
                </Box>
            </Box >
        </>
    );
};

export default Register;