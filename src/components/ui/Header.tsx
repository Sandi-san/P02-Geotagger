import { AppBar, Avatar, Box, Button, Link, Toolbar, Typography } from "@mui/material";
import { FC } from "react";
import theme from "../../theme";
import authStore from "../../stores/auth.store";
import { userStorage } from "../../utils/localStorage";

const Header: FC = () => {
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
                {!userStorage.getUser() ? (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {/* Sign in button */}
                        <Link variant="body1" color='primary.dark'
                            sx={{ textDecoration: 'none', fontWeight: 'bold', marginRight: 1 }}
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
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body1" color="primary.main">Hello {userStorage.getToken()}</Typography>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    )
}
export default Header;