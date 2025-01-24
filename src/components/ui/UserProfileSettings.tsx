import { Avatar, Box, Button, FormControl, IconButton, InputAdornment, Link, TextField, Typography } from "@mui/material"
import { forwardRef, useState } from "react"
import { Controller } from "react-hook-form"
import { UpdateUserFields, useCreateUpdateUserForm } from "../../hooks/react-hook-form/useCreateUpdateUser";
import { UpdateUserType, UserType } from "../../models/user";
import userStore from "../../stores/user.store";
import isApiError from "../../utils/apiErrorChecker";
import ErrorDisplay from "./ErrorDisplay";
import theme from "../../theme";
import { useUpdateUserMutation, useUpdateUserPasswordMutation, useUploadImageMutation } from "../../slices/api/user.slice";
import fetchUser from "../../utils/fetchLocalUser";

//use forwardRef to recieve a functional component (handleClose function), required by Modal
const UserProfileSettings = forwardRef((
    { handleClose }: { handleClose: () => void },
    ref) => {
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [showAvatarForm, setShowAvatarForm] = useState(false);

    const handleShowPasswordForm = () => {
        setShowPasswordForm(true)
        setShowAvatarForm(false)
        console.log(`Open Password form: Pass: ${showPasswordForm} Avatar: ${showAvatarForm}`)
    };

    const handleShowAvatarForm = () => {
        setShowAvatarForm(true)
        setShowPasswordForm(false)
        console.log(`Open Password form: Pass: ${showPasswordForm} Avatar: ${showAvatarForm}`)
    };

    const handleClosePassword = () => {
        setShowPasswordForm(false);
    };

    const handleCloseAvatar = () => {
        setShowAvatarForm(false);
    };

    //destruct user variables from local user
    const { id, firstName, lastName, email, image } = userStore.user!;
    //set defaultValues for createUpdateUser form
    const defaultValues: UpdateUserType = {
        id,
        firstName,
        lastName,
        email,
    };

    //form validation for updating user
    const { handleSubmit, errors, control } = useCreateUpdateUserForm({ defaultValues });
    //initialize mutation hook for updating User
    // const [registerUser] = useRegisterUserMutation()

    //toggle buttons for showing values inside password and confirm_password forms
    const [showPassword, setShowPassword] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
    const toggleOldPasswordVisibility = () => setShowOldPassword((prev) => !prev);
    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword((prev) => !prev);

    //prepare mutations for calling api endpoints
    const [updateUser] = useUpdateUserMutation()
    const [updateUserPassword] = useUpdateUserPasswordMutation()
    //set state for image file
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [uploadImage] = useUploadImageMutation()

    //method for changing Avatar image
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // console.log("Changing avatar")
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file)
        }
    };
    //call handleAvatarChange function but triggered by foreign element (Button)
    const triggerFileInput = () => {
        //call on click event on Avatar (by id) from diffirent element
        const fileInput = document.getElementById('image-upload');
        if (fileInput) {
            fileInput.click();
        }
    };

    const [apiError, setApiError] = useState('')
    const [showError, setShowError] = useState(false)

    //handle submit method: registration (with Yup form validation) & upload image
    const onSubmit = async (formData: UpdateUserFields) => {
        console.log('Form Data:', formData);
        console.log('Image:', imageFile);
        console.log(`Submit: Pass: ${showPasswordForm} Avatar: ${showAvatarForm}`)

        try {
            //update basic User data
            if (!showPasswordForm && !showAvatarForm) {
                const updateResponse = await updateUser(formData).unwrap();
                console.log('User updated successfully:', updateResponse);
            }
            //update password
            else if (showPasswordForm && !showAvatarForm) {
                const updateResponse = await updateUserPassword(formData).unwrap();
                console.log('Response:', updateResponse.response);

            }
            //update image
            else {
                if (imageFile) {
                    const formDataImage = new FormData()
                    formDataImage.append('image', imageFile)
                    //call api
                    const imageUploadResponse = await uploadImage(formDataImage);
                    console.log('Image uploaded successfully:', imageUploadResponse);
                    //check if response successful and save the User locally
                    if (typeof (imageUploadResponse as any).data === 'object' &&
                        imageUploadResponse.data !== undefined) {
                        userStore.login(imageUploadResponse.data)

                    }
                }
            }

            //TODO: modal popup: information successfully changed
        }
        catch (err) {
            console.error("Error during update: ", err)
            if (isApiError(err)) {
                setApiError(err.data.message);
                setShowError(true);
            }
            else {
                setApiError("An unexpected error has occured.");
                setShowError(true);
            }
        }
    }

    return (
        <Box
            sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: { xs: '90%', sm: 400 },
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4, //padding between border and content
                borderRadius: 2,
            }}
        >
            <Typography id="profile-settings-title" variant="h6" component="h2" gutterBottom>
                <span style={{ color: theme.palette.primary.dark }}>Profile </span>
                <span style={{ color: theme.palette.primary.main }}>Settings</span>
            </Typography>
            {/* Show basic information form */}
            {!showPasswordForm && !showAvatarForm && (
                <>
                    <Typography variant="body1" sx={{ marginBottom: 2 }}>
                        Change your information
                    </Typography>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <FormControl fullWidth>
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
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                {/* Open User Change Password popup */}
                                <Link variant="body1" color='primary.main'
                                    sx={{
                                        flex: 1,
                                        textDecoration: 'none',
                                        marginBottom: 1,
                                        '&:hover': {
                                            cursor: 'pointer'
                                        }
                                    }}
                                    onClick={() => {
                                        handleShowPasswordForm()
                                    }}
                                >
                                    Change password
                                </Link>
                                {/* Open User Change Avatar popup */}
                                <Link variant="body1" color='primary.main'
                                    sx={{
                                        flex: 1,
                                        textDecoration: 'none',
                                        marginBottom: 1,
                                        '&:hover': {
                                            cursor: 'pointer'
                                        }
                                    }}
                                    onClick={() => {
                                        handleShowAvatarForm()
                                    }}
                                >
                                    Change profile picture
                                </Link>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                <Button variant="outlined" color="primary"
                                    sx={{ marginRight: 2 }}
                                    onClick={handleClose}>
                                    Cancel
                                </Button>
                                <Button type="submit" variant="contained" color="primary">
                                    Submit
                                </Button>
                            </Box>
                        </FormControl>
                    </form>
                </>
            )}
            {/* Show password form */}
            {showPasswordForm && !showAvatarForm && (
                <>
                    <Typography variant="body1" sx={{ marginBottom: 2 }}>
                        Change your password
                    </Typography>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <FormControl fullWidth>
                            {/* Old Password */}
                            <Controller
                                name="old_password"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        type={showOldPassword ? 'text' : 'password'}
                                        label="Current password"
                                        error={!!errors.old_password}
                                        helperText={errors.old_password?.message}
                                        variant="outlined"
                                        fullWidth
                                        sx={{ marginBottom: 2 }}
                                        // Eye icon for toggling visiblity
                                        slotProps={{
                                            input: {
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            onClick={toggleOldPasswordVisibility}
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
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                <Button variant="outlined" color="primary"
                                    sx={{ marginRight: 2 }}
                                    onClick={handleClosePassword}>
                                    Cancel
                                </Button>
                                <Button type="submit" variant="contained" color="primary">
                                    Submit
                                </Button>
                            </Box>
                        </FormControl>
                    </form>
                </>
            )}
            {/* Show avatar form */}
            {showAvatarForm && !showPasswordForm && (
                <>
                    <Typography variant="body1" sx={{ marginBottom: 2 }}>
                        Change your profile photo
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
                                            width: '8vh',
                                            height: '8vh',
                                            cursor: 'pointer',
                                            marginY: 1,
                                        }}
                                    />
                                </label>
                                <Button variant="outlined" color="primary"
                                    sx={{ marginBottom: 2, border: 2 }}
                                    onClick={triggerFileInput}>
                                    Upload new picture
                                </Button>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                <Button variant="outlined" color="primary"
                                    sx={{ marginRight: 2 }}
                                    onClick={handleCloseAvatar}>
                                    Cancel
                                </Button>
                                <Button type="submit" variant="contained" color="primary">
                                    Submit
                                </Button>
                            </Box>
                        </FormControl>
                    </form>
                </>
            )}
            {/* If api error occurs, show error widget  */}
            {showError && (
                <ErrorDisplay message={apiError} />
            )}
            {/* {isLoading && (
                        <Typography color='info'>Registering...</Typography>
                )}*/}
        </Box>
    )
})
export default UserProfileSettings