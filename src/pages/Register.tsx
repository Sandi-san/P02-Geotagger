import { Avatar, Box, Button, FormControl, Link, TextField, Typography } from '@mui/material';
import { FC, useState } from 'react';
import theme from '../theme';
import useMediaQuery from '../hooks/useMediaQuery';

type FormData = {
    email: string,
    firstName: string,
    lastName: string,
    password: string,
    repeatPassword: string,
    image: string | null,
}

const Register: FC = () => {
    //mediaQuery for Responsive Web Design
    const { isMobile } = useMediaQuery(768)

    //data to be used in the sign up form
    const [formData, setFormData] = useState<FormData>({
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        repeatPassword: '',
        image: null, //avatar image for user
    });

    //when changing values of input fields
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                setFormData((prev) => ({
                    ...prev,
                    image: reader.result as string, //Base64 data URL for display with type assertion
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = () => {
        console.log('Form Data:', formData);
        // Add form submission logic here
    };

    return (
        <>
            <Box sx={{
                position: 'relative',
                display: 'flex',
                height: '100vh',
                width: '100%',
                flexDirection: 'row',
                textAlign: 'center',
                alignItems: 'stretch', // Stretch children
                overflow: 'hidden', // Prevent accidental overflow
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
                                    src={formData.image || undefined}
                                    sx={{
                                        width: '10vh',
                                        height: '10vh',
                                        cursor: 'pointer',
                                        marginY: 2,
                                    }}
                                />
                            </label>
                        </Box>
                        <TextField
                            label="Email"
                            name='email'
                            value={formData.email}
                            onChange={handleChange}
                            variant="outlined"
                            fullWidth
                            sx={{ marginBottom: 2 }}
                        />
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 2,
                            }}
                        >
                            <TextField
                                label="First name"
                                variant="outlined"
                                name='firstName'
                                value={formData.firstName}
                                onChange={handleChange}
                                fullWidth
                                sx={{ marginBottom: 2 }}
                            />
                            <TextField
                                label="Last name"
                                variant="outlined"
                                name='lastName'
                                value={formData.lastName}
                                onChange={handleChange}
                                fullWidth
                                sx={{ marginBottom: 2 }}
                            />
                        </Box>
                        <TextField
                            label="Password"
                            type="password"
                            variant="outlined"
                            name='password'
                            value={formData.password}
                            onChange={handleChange}
                            fullWidth
                            sx={{ marginBottom: 2 }}
                        />
                        <TextField
                            label="Repeat password"
                            type="password"
                            variant="outlined"
                            name='repeatPassword'
                            value={formData.repeatPassword}
                            onChange={handleChange}
                            fullWidth
                            sx={{ marginBottom: 2 }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ marginBottom: 2 }}
                            onClick={handleSubmit}
                        >
                            Sign up
                        </Button>
                    </FormControl>
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
            </Box>
        </>
    );
};

export default Register;