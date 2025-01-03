import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { FC } from "react";
import theme from "../../theme";

const Header: FC = () => {
    return (
        <AppBar position="static" sx={{ backgroundColor: theme.palette.background.default, boxShadow: 'none', padding: '0 16px' }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* Far-left items */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {/* Logo */}
                    <Box component="img" src="/logo.svg" alt="Logo" sx={{ height: 40 }} />
                    {/* Text */}
                    <Typography variant="h4" component="span" sx={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ color: theme.palette.primary.main }}>Geo</span>
                        <span style={{ color: theme.palette.primary.dark }}>tagger</span>
                    </Typography>
                </Box>
                {/* Far-right items */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {/* Sign in button */}
                    <Button
                        variant="text"
                        color='primary'
                        sx={{ textTransform: 'none', fontWeight: 'bold' }}
                        href="/login"
                    >
                        Sign in
                    </Button>
                    <Typography variant="body1" sx={{ marginRight: 1, color: theme.palette.text.primary }}>
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
            </Toolbar>
        </AppBar>
    )
}
export default Header;