import { forwardRef, useEffect, useState } from 'react';
import { Box, Typography, Button, Link, Drawer, Modal, Avatar } from '@mui/material';
import theme from '../../theme';
import ProfileSettings from './ProfileSettings';
import { tokenStorage } from '../../utils/tokenStorage';
import getValidImagePath from '../../utils/validImagePath';
import { UserType } from '../../models/user';
import userStore from '../../stores/user.store';
import { useNavigate } from 'react-router-dom';

interface HeaderMenuProps {
    isOpen: boolean;
    handleClose: () => void; //function to close the widget (modal)
}

const HeaderMenu = forwardRef<HTMLDivElement, HeaderMenuProps>(
    ({ isOpen, handleClose }, ref) => {
        const navigate = useNavigate()

        //open/close states for User Settings popup
        const [openSettings, setOpenSettings] = useState(false)
        const handleOpenSettings = () => setOpenSettings(true)
        const handleCloseSettings = () => setOpenSettings(false)

        //set user as state when accessing elements (prevents error when logging out)
        const [user, setUser] = useState<UserType | null>(null)

        useEffect(() => {
            //redirect from page when user is not set, except when user has not logged yet (login, register, etc.)
            if(tokenStorage.getToken() && !userStore.user){
                console.error("Cannot access local user object on this widget! Redirecting...")
                navigate("/")
            }
            else if(userStore.user)
                setUser(userStore.user)
        }, []);

        const handleLogout = () => {
            userStore.signout()
            window.location.reload()
        }

        return (
            <Drawer
                anchor="top"
                ref={ref}
                open={isOpen}
                onClose={handleClose} // Closes when clicking outside
            >
                <Box
                    role="presentation"
                    sx={{
                        display: 'flex',
                        width: 'stretch',
                        bgcolor: 'background.paper',
                        p: 2,
                    }}
                >
                    {/* Header */}
                    <Box sx={{
                        flex: 1, display: 'flex', alignItems: 'flex-start',
                        marginLeft: '4vh',
                    }}>
                        {/* Logo */}
                        <Link href="/">
                            <Box component="img" src="/logo.svg" alt="Logo" sx={{ height: 40 }} />
                        </Link>
                        {/* Text */}
                        <Typography variant="h4" component="span" sx={{ alignItems: 'center' }}>
                            <span style={{ color: theme.palette.primary.main }}>Geo</span>
                            <span style={{ color: theme.palette.primary.dark }}>tagger</span>
                        </Typography>
                    </Box>
                    <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-end", flexGrow: 1, marginRight: '4vh', marginTop: 1, }}>
                        <Box component="img" src="/icon-close-mobile.svg" alt="X"
                            sx={{
                                height: '4vh',
                                '&:hover': {
                                    cursor: 'pointer',
                                }
                            }}
                            onClick={handleClose} />
                    </Box>
                </Box>

                {/* Menu */}
                <Box
                    role="presentation"
                    sx={{
                        // display: 'flex',
                        width: 'stretch',
                        bgcolor: 'background.paper',
                        p: 2,
                    }}
                >
                    <Box>
                        {/* Profile Avatar and User name */}
                        {tokenStorage.getToken() && (
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center', //vertical center
                                    textAlign: 'left',
                                    paddingBottom: '3vh',
                                    marginLeft: '3vh',
                                }}
                            >
                                <Avatar
                                    src={getValidImagePath(user?.image) ? (getValidImagePath(user?.image)) :
                                        ('/placeholder-avatar.png')}
                                    sx={{
                                        width: '8vh',
                                        height: '8vh',
                                        marginRight: 2,
                                        marginLeft: 1,
                                    }}
                                />
                                <Typography
                                    variant="h4"
                                    color="primary.dark"
                                    sx={{
                                        marginBottom: 0, //remove margin-bottom for better alignment
                                    }}
                                >
                                    {user?.firstName} {user?.lastName}
                                </Typography>
                            </Box>
                        )}

                        {/* Home link */}
                        <Link href="/" sx={{ flex: 1, display: 'flex', textDecoration: 'none' }}>
                            <Box sx={{
                                flex: 1, display: 'flex', alignItems: 'flex-start', marginLeft: '4vh'
                            }}>
                                <Typography variant="h4" color='primary.dark' component="span" sx={{ alignItems: 'center' }}>
                                    Home
                                </Typography>
                            </Box>
                            <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-end", flexGrow: 1, marginRight: '4vh', marginBottom: 4, }}>
                                <Box component="img" src="/icon-arrow-right.svg" alt=">"
                                    sx={{ height: '4vh' }} />
                            </Box>
                        </Link>
                        {tokenStorage.getToken() && (<>
                            {/* Profile settings */}
                            <Link sx={{ flex: 1, display: 'flex', textDecoration: 'none', '&:hover': { cursor: 'pointer' } }}
                                onClick={handleOpenSettings}>
                                <Box sx={{
                                    flex: 1, display: 'flex', alignItems: 'flex-start', marginLeft: '4vh'
                                }}>
                                    <Typography variant="h4" color='primary.dark' component="span" sx={{ alignItems: 'center' }}>
                                        Profile settings
                                    </Typography>
                                </Box>
                                <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-end", flexGrow: 1, marginRight: '4vh', marginBottom: 4, }}>
                                    <Box component="img" src="/icon-arrow-right.svg" alt=">"
                                        sx={{ height: '4vh' }} />
                                </Box>
                            </Link>
                            {/* Modal for opening User Profile settings widget */}
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

                            {/* Logout */}
                            <Link sx={{ flex: 1, display: 'flex', textDecoration: 'none', '&:hover': { cursor: 'pointer' } }}
                                onClick={handleLogout}>
                                <Box sx={{
                                    flex: 1, display: 'flex', alignItems: 'flex-start', marginLeft: '4vh'
                                }}>
                                    <Typography variant="h4" color='primary' component="span" sx={{ alignItems: 'center' }}>
                                        Logout
                                    </Typography>
                                </Box>
                                <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-end", flexGrow: 1, marginRight: '4vh', marginBottom: 4, }}>
                                    <Box component="img" src="/icon-arrow-right_primary-green.svg" alt=">"
                                        sx={{ height: '4vh' }} />
                                </Box>
                            </Link>
                        </>)}
                    </Box>
                </Box>

                {!tokenStorage.getToken() && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: 2, }}>
                        {/* Sign up button */}
                        <Button
                            variant="contained"
                            color='primary'
                            href="/register"
                            sx={{ margin: 1, width: '80%' }}
                        >
                            Sign up
                        </Button>
                        {/* Sign in button */}
                        <Button
                            variant="outlined"
                            color='primary'
                            href="/login"
                            sx={{ margin: 1, width: '80%' }}
                        >
                            Sign in
                        </Button>
                    </Box>)}
            </Drawer>
        );
    }
)

export default HeaderMenu;