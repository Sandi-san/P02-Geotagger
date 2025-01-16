import { AppBar, Avatar, Box, Button, IconButton, Link, Toolbar, Typography } from "@mui/material";
import { FC } from "react";
import theme from "../../theme";
import authStore from "../../stores/auth.store";
import { userStorage } from "../../utils/localStorage";
import useMediaQuery from "../../hooks/useMediaQuery";

const Header: FC = () => {
    const { isMobile } = useMediaQuery(720)

    //TODO: add userStorage checker if access_token has existed
    //for X amount of time (backend) aka was last updated
    //if time has passed and token is invalid, delete local user

    return (
        <AppBar position="static" sx={{
            backgroundColor: 'background.default',
            boxShadow: 'none',
            padding: 2,
        }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* Far-left items */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {/* Logo */}
                    {/* <Box component="img" src="/logo.svg" alt="Logo" sx={{ height: 40 }} /> */}
                    <Link href="/">
                        <Box component="img" src="/logo.svg" alt="Logo" sx={{ height: 40 }} />
                    </Link>
                    {/* Text */}
                    <Typography variant="h4" component="span" sx={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ color: theme.palette.primary.main }}>Geo</span>
                        <span style={{ color: theme.palette.primary.dark }}>tagger</span>
                    </Typography>
                </Box>
                {/* Far-right items */}
                {/* User is not logged in (no access_token) */}
                {!userStorage.getUser() ? (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {/* Sign in button */}
                        <Link variant="body2" color='primary.dark'
                            sx={{ textDecoration: 'none', marginRight: 1 }}
                            href="/login"
                        >
                            Sign in
                        </Link>
                        <Typography variant="body1" color='primary.main' sx={{ marginRight: 1 }}>
                            or
                        </Typography>
                        {/* Sign up button */}
                        <Button
                            variant="contained"
                            color='primary'
                            href="/register"
                        >
                            Sign up
                        </Button>
                    </Box>
                ) : (
                    // User is logged in
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {/* Menu links */}
                        {/* Go to home page */}
                        <Link variant="body1" color='primary.dark'
                            sx={{
                                textDecoration: 'none',
                                marginRight: isMobile ? 1 : 3,
                            }}
                            href="/home"
                        >
                            Home
                        </Link>
                        {/* Open User Settings popup */}
                        <Link variant="body1" color='primary.dark'
                            sx={{ 
                                textDecoration: 'none', 
                                marginRight: isMobile ? 1 : 3,
                            }}
                            href="/profile"
                        >
                            Profile settings
                        </Link>
                        {/* Open User logout popup */}
                        <Link variant="body1" color='primary.dark'
                            sx={{ 
                                textDecoration: 'none', 
                                marginRight: isMobile ? 1 : 3,
                            }}
                            href="/logout"
                        >
                            Logout
                        </Link>
                        {/* Avatar and Tokens Box */}
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                borderRadius: 4,
                                border: 2,
                                borderColor: 'primary.main',
                                bgcolor: 'background.paper',
                                maxWidth: 200,
                                minWidth: '12vh',
                                height: '4vh',
                                '&:hover': {
                                    cursor: 'pointer'
                                }
                            }}
                            onClick={() => console.log('Open User Profile page!')}
                        >
                            {/* Avatar */}
                            <Box
                                sx={{
                                    width: '33%',
                                    height: '100%',
                                    borderRadius: '50%',
                                    overflow: 'hidden',
                                    marginRight: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    bgcolor: 'grey.400',
                                }}
                            >
                                <img
                                    src={authStore.user?.image || '/placeholder-avatar.png'}
                                    alt="User Avatar"
                                    style={{
                                        //if user does not have an image, display placeholder with different styling
                                        width: authStore.user?.image ? '100%' : '80%',
                                        height: authStore.user?.image ? '100%' : '80%',
                                        objectFit: 'cover',
                                        boxSizing: 'border-box', //ensures padding is accounted inside the box
                                        borderRadius: authStore.user?.image ? '100%' : '50%', //ensures the placeholder image remains circular
                                    }}
                                />
                            </Box>
                            {/* Token display */}
                            <Typography
                                variant="body2"
                                color="primary.dark"
                                sx={{
                                    textOverflow: 'ellipsis',
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap',
                                    flexGrow: 1,
                                }}
                            >
                                {authStore.user?.guessTokens || '0'}
                            </Typography>
                        </Box>
                        <Box>
                            {/* Add Location Button */}
                            <IconButton
                                color="primary"
                                size="small"
                                sx={{
                                    marginLeft: 1,
                                    bgcolor: 'primary.main',
                                    '&:hover': {
                                        bgcolor: 'primary.light',
                                    },
                                    minWidth: '4vh',
                                }}
                                onClick={() => console.log('Open Add Location form!')}
                            >
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 'bold',
                                        lineHeight: 1,
                                        color: 'primary.contrastText'
                                    }}
                                >
                                    +
                                </Typography>
                            </IconButton>
                        </Box>
                    </Box>
                )}
            </Toolbar>
        </AppBar >
    )
}
export default Header;