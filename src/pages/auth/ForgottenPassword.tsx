import { FC, useState } from 'react';
import isApiError from '../../utils/apiErrorChecker';
import useMediaQuery from '../../hooks/useMediaQuery';
import { Box, Button, DialogContent, FormControl, IconButton, InputAdornment, Link, Modal, TextField, Typography } from '@mui/material';
import { Controller } from 'react-hook-form';
import ErrorDisplay from '../../components/modals/ErrorDisplay';
import theme from '../../theme';
import { LoginUserFields, useLoginForm } from '../../hooks/react-hook-form/useLogin';
import { useLoginOAuthUserMutation, useRedirectOAuthUserMutation, useLoginUserMutation, useForgottenPasswordMutation } from '../../slices/api/auth.slice';
import { tokenStorage } from '../../utils/tokenStorage';
import userStore from '../../stores/user.store';
import fetchUser from '../../utils/fetchLocalUser';
import { UserType } from '../../models/user';
import { EmailForm, EmailUserFields, useEmailForm } from '../../hooks/react-hook-form/useResetEmail';
import SuccessConformation from '../../components/modals/SuccessConformation';
import Loading from '../../components/ui/Loading';
import AuthHeader from '../../components/ui/AuthHeader';

const ForgottenPassword: FC = () => {
    //mediaQuery for Responsive Web Design
    const { isMobile } = useMediaQuery(720)
    //TODO: remove right section display when set as isMobile

    //mediaQuery for top-left logo
    const unstickLogo = useMediaQuery(850)

    //form validation for email
    const { handleSubmit, errors, control } = useEmailForm();
    //initialize mutation hook for reset User password
    const [sendResetToken] = useForgottenPasswordMutation()

    //value of error returned by api
    const [apiError, setApiError] = useState('')
    //status code returned by api
    const [apiStatus, setApiStatus] = useState('')
    //state if error has occured
    const [showError, setShowError] = useState(false)

    //state for opening Successful Change Modal
    const [showSuccess, setShowSuccess] = useState(false)
    const [successResponse, setSuccessResponse] = useState('')

    //loading state when waiting for API to respond
    const [loading, setLoading] = useState(false)

    const onSubmit = async (formData: EmailUserFields) => {
        // console.log('Form Data:', formData);
        try {
            setLoading(true)

            const resetResponse = await sendResetToken(formData).unwrap();
            console.log('Response:', resetResponse);

            if (typeof resetResponse === 'object' && (resetResponse !== undefined || null)
                && 'response' as string) {
                setSuccessResponse(resetResponse.response)
                setShowSuccess(true)
            }
            else {
                //TODO: copy to other pages
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
        finally {
            setLoading(false); // Stop loading after response
        }
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
                        minHeight: 0,
                        overflow: 'auto',
                    }}
                >
                    <AuthHeader />
                    <Typography variant="h3" gutterBottom>
                        Reset password
                    </Typography>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Typography variant="body1" color='primary.dark' >
                            To reset your password, input your email below.
                        </Typography>
                        <Typography variant="body1" color='primary.dark' sx={{ marginBottom: 2 }} >
                            The reset token will be sent to an <span style={{ fontWeight: 'bold' }}>existing</span> email.
                        </Typography>
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
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                sx={{ marginBottom: 2 }}
                            >
                                Send
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
                        maxWidth: '45vh',
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
                        maxWidth: '45vh',
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
                            open={showError} // Modal visibility tied to the showError state
                            onClose={() => setShowError(false)} // Close the modal on backdrop click
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
                            onClose={() => setShowSuccess(false)}
                            aria-labelledby="success-modal-title"
                            aria-describedby="success-modal-description"
                        >
                            <DialogContent>
                                <SuccessConformation
                                    handleClose={() => setShowSuccess(false)}
                                    title={"Token sent successfully"}
                                    message={successResponse} />
                            </DialogContent>
                        </Modal>
                    )}
                    {loading && (
                        <Modal
                            open={loading}
                            onClose={() => setLoading(false)}
                            aria-labelledby="loading"
                            aria-describedby="waiting for response"
                        >
                            {/* Remove Dialog padding for child to take up full page */}
                            <DialogContent sx={{ padding: 0 }}>
                                {/* Show Loading widget and darken background */}
                                <Loading backgroundColor='#000' backgroundOpacity={0.3} />
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
    );
};

export default ForgottenPassword;