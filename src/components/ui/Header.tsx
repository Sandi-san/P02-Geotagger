import { AppBar, Box, Button, IconButton, Link, Modal, Toolbar, Typography } from "@mui/material";
import { FC, useEffect, useState } from "react";
import theme from "../../theme";
import userStore from "../../stores/user.store";
import { tokenStorage } from "../../utils/tokenStorage";
import useMediaQuery from "../../hooks/useMediaQuery";
import ProfileSettings from "../modals/ProfileSettings";
import getValidImagePath from "../../utils/validImagePath";
import { useNavigate } from "react-router-dom";
import HeaderMenu from "../modals/HeaderMenu";

const Header: FC = () => {
    const { isMobile } = useMediaQuery(720)
    //for text padding
    const isSquished = useMediaQuery(770)
    const navigate = useNavigate()

    //open/close states for User Settings popup
    const [openSettings, setOpenSettings] = useState(false)
    //open the modal
    const handleOpenSettings = () => setOpenSettings(true)
    //close the modal
    const handleCloseSettings = () => setOpenSettings(false)

    //open/close states for Menu popup
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuOpen = () => setIsMenuOpen(true)
    const menuClose = () => setIsMenuOpen(false)

    //logout user and refresh page
    const handleLogout = () => {
        userStore.signout()
        window.location.reload()
    }

    const handleOpenActivityLog = () => {
        navigate("/activity-log")
    }
    const handleOpenHomePage = () => {
        navigate("/")
    }

    //check if User avatar image can be displayed 
    const [validImage, setValidImage] = useState(false);
    const userImage = getValidImagePath(userStore.user?.image)

    useEffect(() => {
        // console.log("User image: ",userImage)
        if (userImage !== undefined)
            setValidImage(true)
        else
            setValidImage(false)
    }, []);

    return (
        <AppBar position="static" sx={{
            backgroundColor: 'background.default',
            padding: 2,
            boxShadow: isMobile ? 3 : 'none',
            marginBottom: isMobile ? '4vh' : 0,
        }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', }}>
                {/* Far-left items */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {/* Logo */}
                    {/* <Box component="img" src="/logo.svg" alt="Logo" sx={{ height: 40 }} /> */}
                    <Link href="/">
                        <Box component="img" src="/logo.svg" alt="Logo" sx={{ height: 40 }} />
                    </Link>
                    {/* Text */}
                    <Typography variant="h4" component="span" sx={{
                        //do not display if mobile mode is enabled and showing tokens box
                        display: isMobile && tokenStorage.getToken() ? "none" : "flex",
                        alignItems: 'center'
                    }}>
                        <span style={{ color: theme.palette.primary.main }}>Geo</span>
                        <span style={{ color: theme.palette.primary.dark }}>tagger</span>
                    </Typography>
                </Box>
                {/* Far-right items */}
                {/* If screen is mobile */}
                {isMobile ? (
                    <>
                        <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-end", flexGrow: 1, marginRight: '4vh', }}>
                            {tokenStorage.getToken() && (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        borderRadius: 6,
                                        border: 2,
                                        borderColor: 'primary.main',
                                        bgcolor: 'background.paper',
                                        maxWidth: 300,
                                        minWidth: '18vh',
                                        height: '6vh',
                                        '&:hover': {
                                            cursor: 'pointer'
                                        },
                                        marginRight: 4,
                                    }}
                                >
                                    {/* Token display & Profile link */}
                                    <Link href="/profile" sx={{
                                        textDecoration: 'none',
                                        textOverflow: 'ellipsis',
                                        overflow: 'hidden',
                                        whiteSpace: 'nowrap',
                                        textAlign: 'center',
                                        flexGrow: 1,
                                    }}>
                                        <Typography variant="body2" color="primary.dark">
                                            {userStore.user?.guessTokens ?
                                                (userStore.user?.guessTokens)
                                                : ('0')}
                                        </Typography>
                                    </Link>
                                    {/* Add Location Button */}
                                    <Box
                                        sx={{
                                            height: '100%',
                                        }}>
                                        <Link href="/location/add" sx={{ textDecoration: 'none' }}>

                                            <IconButton
                                                color="primary"
                                                sx={{
                                                    width: '100%',
                                                    height: '100%',
                                                    borderRadius: '50%',
                                                    overflow: 'hidden',
                                                    marginRight: 1,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    // marginLeft: 1,
                                                    bgcolor: 'primary.main',
                                                    '&:hover': {
                                                        bgcolor: 'primary.light',
                                                    },
                                                }}
                                            >
                                                <Typography
                                                    variant="h4"
                                                    sx={{
                                                        lineHeight: 1,
                                                        color: 'primary.contrastText'
                                                    }}
                                                >
                                                    +
                                                </Typography>
                                            </IconButton>
                                        </Link>
                                    </Box>
                                </Box>
                            )}
                            <Box component="img" src="/icon-menu-mobile.svg" alt="X"
                                sx={{
                                    height: '4vh',
                                    '&:hover': {
                                        cursor: 'pointer',
                                    },
                                    paddingTop: tokenStorage.getToken() ? 1 : 0,
                                }}
                                onClick={menuOpen} />
                        </Box>
                        <HeaderMenu isOpen={isMenuOpen} handleClose={menuClose} />
                    </>
                ) : (
                    //User is not logged in (no access_token)
                    !tokenStorage.getToken() ? (
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
                            {/* Activity page - only for admins */}
                            {userStore.user?.role === "admin" && (
                                <Link variant="body2" color='primary.dark'
                                    sx={{
                                        textDecoration: 'none',
                                        marginRight: isSquished.isMobile ? 1.5 : 3,
                                        '&:hover': {
                                            cursor: 'pointer'
                                        }
                                    }}
                                    onClick={handleOpenActivityLog}
                                >
                                    Log
                                </Link>
                            )}
                            {/* Go to home page */}
                            <Link variant="body1" color='primary.dark'
                                sx={{
                                    textDecoration: 'none',
                                    marginRight: isSquished.isMobile ? 1.5 : 3,
                                    '&:hover': {
                                        cursor: 'pointer'
                                    }
                                }}
                                onClick={handleOpenHomePage}
                            >
                                Home
                            </Link>
                            {/* Open User Settings popup */}
                            <Link variant="body1" color='primary.dark'
                                sx={{
                                    textDecoration: 'none',
                                    marginRight: isSquished.isMobile ? 1.5 : 3,
                                    '&:hover': {
                                        cursor: 'pointer'
                                    }
                                }}
                                onClick={handleOpenSettings}
                            >
                                Profile settings
                            </Link>
                            {/* Modal is MUI popup handler. Child is content of popup widget.  */}
                            <Modal
                                open={openSettings}
                                onClose={handleCloseSettings}
                                aria-labelledby="profile-settings-title"
                                aria-describedby="profile-settings-description"
                            >
                                <ProfileSettings
                                    handleClose={handleCloseSettings}
                                />
                            </Modal>
                            {/* Open User logout popup */}
                            <Link variant="body1" color='primary.dark'
                                sx={{
                                    textDecoration: 'none',
                                    marginRight: isSquished.isMobile ? 1.5 : 3,
                                    '&:hover': {
                                        cursor: 'pointer'
                                    }
                                }}
                                onClick={handleLogout}
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
                                            src={userImage || '/placeholder-avatar.png'}
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
                    ))}
            </Toolbar>
        </AppBar >
    )
}
export default Header;