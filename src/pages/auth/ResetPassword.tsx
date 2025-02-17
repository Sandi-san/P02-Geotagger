import { FC, useEffect, useState } from 'react';
import isApiError from '../../utils/apiErrorChecker';
import useMediaQuery from '../../hooks/useMediaQuery';
import { Box, Button, DialogContent, FormControl, IconButton, InputAdornment, Link, Modal, TextField, Typography } from '@mui/material';
import { Controller } from 'react-hook-form';
import ErrorDisplay from '../../components/modals/ErrorDisplay';
import theme from '../../theme';
import { useResetPasswordMutation } from '../../slices/api/auth.slice';
import { PasswordUserFields, usePasswordForm } from '../../hooks/react-hook-form/useResetPassword';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SuccessConformation from '../../components/modals/SuccessConformation';
import AuthHeader from '../../components/ui/AuthHeader';

const ResetPassword: FC = () => {
    //mediaQuery for Responsive Web Design
    const { isMobile } = useMediaQuery(720)
    const navigate = useNavigate()

    //extract token from url
    const [searchParams] = useSearchParams()
    const token = searchParams.get("token") || ""

    const { handleSubmit, errors, control, setValue } = usePasswordForm();
    // Ensure resetToken is set (in case of async behavior)
    setValue("resetToken", token);

    //initialize mutation hook for registering User (register user api call)
    const [resetPassword] = useResetPasswordMutation()

    //toggle buttons for showing values inside password and confirm_password forms
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    //value of error returned by api
    const [apiError, setApiError] = useState('')
    //status code returned by api
    const [apiStatus, setApiStatus] = useState('')
    //state if error has occured
    const [showError, setShowError] = useState(false)
    //error when url token is invalid
    const [showTokenError, setShowTokenError] = useState(false)

    //state for opening Successful Change Modal
    const [showSuccess, setShowSuccess] = useState(false)
    const [successResponse, setSuccessResponse] = useState('')

    const onSubmit = async (formData: PasswordUserFields) => {
        console.log('Form Data:', formData);

        try {
            //call RTK Query mutation with valid formData (login user)
            const resetResponse = await resetPassword(formData).unwrap();
            console.log('Response:', resetResponse);

            if (typeof resetResponse === 'object' && (resetResponse !== undefined || null)
                && 'response' as string) {
                setSuccessResponse(resetResponse.response)
                setShowSuccess(true)
            }
            else {
                //force call catch error block
                throw new Error()
            }
        }
        catch (err) {
            console.error("Error during password reset: ", err)
            if (isApiError(err)) {
                setApiError(err.data.message);
                setApiStatus(err.status.toString());
                setShowError(true);
            }
            else {
                //check if thrown error is a FETCH_ERROR
                if (typeof err === 'object' && (err !== undefined || null)
                    && 'status' in (err as any) && 'error' in (err as any)) {
                    setApiStatus((err as any).status);
                    setApiError("Check your connection. " + (err as any).error);
                }
                else
                    setApiError("An unexpected error has occured.");
                setShowError(true);
            }
        }
    }

    //Show/hide password visibility
    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword((prev) => !prev);

    //Check token in url
    useEffect(() => {
        // console.log("Token: ", token)
        if (!token) {
            console.error("Missing token in url")
            setApiError("Missing token in url.");
            setApiStatus("400");
            setShowTokenError(true);
        }
        else if (token.length !== 64) {
            console.error("Invalid token in url.")
            setApiError("Invalid token in url.");
            setApiStatus("400");
            setShowTokenError(true);
        }
    }, []);

    // Handle invalid token
    if (showTokenError) {
        return (
            <Modal
                open={showTokenError}
                onClose={() => navigate('/')} // Redirect on close
                aria-labelledby="error-modal-title"
                aria-describedby="error-modal-description"
            >
                <DialogContent>
                    <ErrorDisplay message={apiError} errorStatus={apiStatus}
                        handleClose={() => {
                            setShowTokenError(false);
                            navigate('/');
                        }} />
                </DialogContent>
            </Modal>
        );
    }

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
                    <AuthHeader />
                    <Typography variant="h3" gutterBottom>
                        Reset password
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
                                <Typography variant="body1" color='primary.dark' sx={{ marginBottom: 2 }}>
                                    Choose a new password. Your account will be updated automatically.
                                </Typography>
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
                                                            <Box component="img" src="/icon-eye.svg" alt="Icon" sx={{ height: '2vh' }} />
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
                                                            <Box component="img" src="/icon-eye.svg" alt="Icon" sx={{ height: '2vh' }} />
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            },
                                        }}
                                    />
                                )}
                            />
                            {/* Reset token - hidden field */}
                            <Controller
                                name="resetToken"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        // label="Reset token"
                                        type="hidden"
                                        error={!!errors.resetToken}
                                        helperText={errors.resetToken?.message}
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
                                Reset
                            </Button>
                        </FormControl>
                    </form>

                    {/* Link to Login & Signup */}
                    <Box sx={{
                        width: '100%',
                        position: 'relative',
                        display: 'flex',
                        textAlign: 'center',
                        justifyContent: 'space-between',
                        // minHeight: 0,
                        maxWidth: '65vh',
                    }}>
                        <Box sx={{ alignItems: 'flex-start', textAlign: 'left' }}>
                            <Typography variant="body1" color='primary.dark'>
                                Login with a different account?
                            </Typography>
                        </Box>
                        <Box sx={{ alignContent: 'flex-end', textAlign: 'end' }} >
                            <Link variant="body1" color='primary.main'
                                sx={{ textDecoration: 'none' }}
                                href="/login"
                            >
                                Sign in
                            </Link>
                        </Box>
                    </Box>
                    <Box sx={{
                        width: '100%',
                        position: 'relative',
                        display: 'flex',
                        textAlign: 'center',
                        justifyContent: 'space-between',
                        marginTop: isMobile ? 0 : 1,
                        maxWidth: '65vh',
                    }}>
                        <Box sx={{ alignItems: 'flex-start', textAlign: 'left' }}>
                            <Typography variant="body1" color='primary.dark'>
                                Do you want to create an account?
                            </Typography>
                        </Box>
                        <Box sx={{ alignContent: 'flex-end', textAlign: 'end' }} >
                            <Link variant="body1" color='primary.main'
                                sx={{ textDecoration: 'none' }}
                                href="/register"
                            >
                                Sign up
                            </Link>
                        </Box>
                    </Box>
                    {/* If api error occurs, show error widget  */}
                    {showError && (
                        <Modal
                            open={showError}
                            onClose={() => setShowError(false)}
                            aria-labelledby="error-modal-title"
                            aria-describedby="error-modal-description"
                        >
                            <DialogContent>
                                <ErrorDisplay message={apiError} errorStatus={apiStatus} handleClose={() => setShowError(false)} />
                            </DialogContent>
                        </Modal>
                    )}
                    {showSuccess && (
                        <Modal
                            open={showSuccess}
                            onClose={() => navigate("/login")}
                            aria-labelledby="success-modal-title"
                            aria-describedby="success-modal-description"
                        >
                            <DialogContent>
                                <SuccessConformation
                                    handleClose={() => navigate("/login")}
                                    title={"Reset successful"}
                                    message={successResponse} />
                            </DialogContent>
                        </Modal>
                    )}
                </Box>
                {!isMobile && (
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
                                //gradient from left to right: color from custom theme with alpha channel opacity (50% = 80 in hex color code)
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
                )}
            </Box >
        </>
    )
};

export default ResetPassword;