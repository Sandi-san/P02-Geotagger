import { Box, Button, FormControl, Link, TextField, Toolbar, Typography } from '@mui/material';
import { FC, useState } from 'react';
import theme from '../theme';

const Register: FC = () => {
    //data to be used in the sign up form
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        repeatPassword: '',
    });

    const handleChange = (e: { target: { name: string; value: string; }; }) => {
        const { name, value } = e.target;
        // console.log(`Target: ${e.target.name} | ${e.target.value}`)
        setFormData((prev) => ({ ...prev, [name]: value }));
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
                alignItems: 'center',
            }}>
                <Box
                    sx={{
                        flex: 2,
                        height: '100vh',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        bgcolor: 'background.paper',
                        marginX: 2,
                        paddingX: 4,
                    }}
                >
                    <Typography variant="h3" gutterBottom>
                        Sign up
                    </Typography>
                    <FormControl fullWidth>
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
                        <Box>
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
                        height: '100vh',
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
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: 'inherit',

                        }}
                    />
                    {/* Green overlay */}
                    <Box
                        sx={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            bgcolor: `${theme.palette.primary.main}80`, //color from custom theme with alpha channel (50% = 80 in hex color code)
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