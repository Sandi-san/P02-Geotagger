import { AppBar, Avatar, Box, Button, IconButton, Link, Modal, Toolbar, Typography } from "@mui/material";
import { FC, useEffect, useState } from "react";
import theme from "../../theme";
import userStore from "../../stores/user.store";
import { tokenStorage } from "../../utils/tokenStorage";
import useMediaQuery from "../../hooks/useMediaQuery";
import { UserType } from "../../models/user";
import fetchUser from "../../utils/fetchLocalUser";
import Loading from "./Loading";
import ProfileSettings from "../modals/ProfileSettings";
import getValidImagePath from "../../utils/validImagePath";

const Header: FC = () => {
    const { isMobile } = useMediaQuery(720)

    //open/close states for User Settings popup
    const [open, setOpen] = useState(false);
    //open the modal
    const handleOpen = () => setOpen(true);
    //close the modal
    const handleClose = () => {
        //TODO: refetch user here
        setOpen(false);
    }

    //check if User avatar image can be displayed 
    const [validImage, setValidImage] = useState(false);
    const userImage = getValidImagePath(userStore.user?.image)

    useEffect(() => {
        if (userImage !== undefined)
            setValidImage(true)
        else
            setValidImage(false)
    }, []);

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
                {!tokenStorage.getToken() ? (
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
                            href="/"
                        >
                            Home
                        </Link>
                        {/* Open User Settings popup */}
                        <Link variant="body1" color='primary.dark'
                            sx={{
                                textDecoration: 'none',
                                marginRight: isMobile ? 1 : 3,
                                '&:hover': {
                                    cursor: 'pointer'
                                }
                            }}
                            onClick={handleOpen}
                        >
                            Profile settings
                        </Link>
                        {/* Modal is MUI popup handler. Child is content of popup widget.  */}
                        <Modal
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="profile-settings-title"
                            aria-describedby="profile-settings-description"
                        >
                            <ProfileSettings
                                handleClose={handleClose}
                            />
                        </Modal>
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
                        <Link href="/profile" sx={{ textDecoration: 'none' }}>
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
                                        src={userImage ? (userImage) :
                                            ('/placeholder-avatar.png')}
                                        alt="User Avatar"
                                        style={{
                                            //if user does not have an image, display placeholder with different styling
                                            width: validImage ? '100%' : '80%',
                                            height: validImage ? '100%' : '80%',
                                            objectFit: 'cover',
                                            boxSizing: 'border-box', //ensures padding is accounted inside the box
                                            borderRadius: validImage ? '100%' : '50%', //ensures the placeholder image remains circular
                                        }}
                                        onError={(e) => {
                                            setValidImage(false);
                                            (e.target as HTMLImageElement).src = '/placeholder-avatar.png';
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
                                    {userStore.user?.guessTokens ?
                                        (userStore.user?.guessTokens)
                                        : ('0')}
                                </Typography>
                            </Box>
                        </Link>
                        <Link href="/location/add" sx={{ textDecoration: 'none' }}>
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
                                // onClick={() => console.log('Open Add Location form!')}
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
                        </Link>
                    </Box>
                )}
            </Toolbar>
        </AppBar >
    )
}
export default Header;