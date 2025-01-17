import { Avatar, Box, Button, FormControl, IconButton, InputAdornment, Link, TextField, Typography } from '@mui/material';
import { FC, useState } from 'react';
import theme from '../theme';
import useMediaQuery from '../hooks/useMediaQuery';
import { useRegisterUserMutation } from '../slices/api/auth.slice';
import { RegisterUserFields, useRegisterForm } from '../hooks/react-hook-form/useRegister';
import { Controller } from 'react-hook-form';
import userStore from '../stores/user.store';
import isApiError from '../utils/apiErrorChecker';
import ErrorDisplay from '../components/ui/ErrorDisplay';
import { useUploadImageMutation } from '../slices/api/user.slice';
import { tokenStorage } from '../utils/tokenStorage';

const Register: FC = () => {
    //mediaQuery for Responsive Web Design
    const { isMobile } = useMediaQuery(720)
    //TODO: remove right section display when set as isMobile

    //form validation for user registration (custom hook)
    const { handleSubmit, errors, control } = useRegisterForm();
    //initialize mutation hook for registering User (register user api call)
    const [registerUser] = useRegisterUserMutation()

    //set state for image file (separate from useRegisterForm, which uses Yup)
    const [imageFile, setImageFile] = useState<File | null>(null)
    //initialize mutation hook for uploading image for User (after registration)
    const [uploadImage] = useUploadImageMutation()

    //toggle buttons for showing values inside password and confirm_password forms
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    //value of error returned by api
    const [apiError, setApiError] = useState('')
    //state if error has occured
    const [showError, setShowError] = useState(false)

    //method for changing Avatar image
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // console.log("Changing avatar")
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file)
        }
    };

    //handle submit method: registration (with Yup form validation) & upload image
    const onSubmit = async (formData: RegisterUserFields) => {
        console.log('Form Data:', formData);

        try {
            //call RTK Query mutation with valid formData (register user)
            const registerResponse = await registerUser(formData).unwrap();
            console.log('User registered successfully:', registerResponse);

            //save the returned access_token into local storage
            tokenStorage.setToken(registerResponse.access_token)
            console.log('Local user:', tokenStorage.getToken());

            //if image is also passed, call uploadFile route
            if (imageFile) {
                const formDataImage = new FormData()
                formDataImage.append('image', imageFile)
                //call api
                const imageUploadResponse = await uploadImage(formDataImage);
                console.log('Image uploaded successfully:', imageUploadResponse);
                //check if response successful and save the User locally
                if (typeof (imageUploadResponse as any).data === 'object' &&
                    imageUploadResponse.data !== undefined)
                    userStore.login(imageUploadResponse.data)
            }
        }
        catch (err) {
            console.error("Error during registration: ", err)
            if (isApiError(err)) {
                setApiError(err.data.message);
                setShowError(true);
            }
            else {
                setApiError("An unexpected error has occured.");
                setShowError(true);
            }
        }
    };

    //Show/hide password visibility
    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword((prev) => !prev);

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
                        // width: '100%',
                        // maxWidth: '100vh',
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
                                        type={showPassword ? 'text' : 'password'}
                                        label="Password"
                                        error={!!errors.password}
                                        helperText={errors.password?.message}
                                        variant="outlined"
                                        fullWidth
                                        sx={{ marginBottom: 2 }}
                                        // Eye icon for toggling visiblity
                                        slotProps={{
                                            input: {
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            onClick={togglePasswordVisibility}
                                                            edge="end"
                                                        >
                                                            <Box component="img" src="/eye.svg" alt="Icon" sx={{ height: '2vh' }} />
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            },
                                        }}
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
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        label="Confirm Password"
                                        error={!!errors.confirm_password}
                                        helperText={errors.confirm_password?.message}
                                        variant="outlined"
                                        fullWidth
                                        sx={{ marginBottom: 2 }}
                                        // Eye icon for toggling visiblity
                                        slotProps={{
                                            input: {
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            onClick={toggleConfirmPasswordVisibility}
                                                            edge="end"
                                                        >
                                                            <Box component="img" src="/eye.svg" alt="Icon" sx={{ height: '2vh' }} />
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            },
                                        }}
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
                    <Box sx={{
                        width: '100%',
                        position: 'relative',
                        display: 'flex',
                        textAlign: 'center',
                        justifyContent: 'space-between',
                        // minHeight: 0,
                        maxWidth: isMobile ? '100vh' : '60vh',
                    }}>
                        <Box sx={{ alignItems: 'flex-start' }}>
                            <Typography variant="body1" color='primary.dark'>
                                Already have an account?
                            </Typography>
                        </Box>
                        <Box sx={{alignContent: 'flex-end'}} >
                            <Link variant="body1" color='primary.main'
                                sx={{ textDecoration: 'none' }}
                                href="/login"
                            >
                                Sign in
                            </Link>
                        </Box>
                    </Box>
                    {/* If api error occurs, show error widget  */}
                    {showError && (
                        <ErrorDisplay message={apiError} />
                    )}
                    {/* {isLoading && (
                        <Typography color='info'>Registering...</Typography>
                    )}*/}
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