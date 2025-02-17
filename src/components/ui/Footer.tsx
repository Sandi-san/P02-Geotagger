import { AppBar, Box, Button, Link, Toolbar, Typography } from "@mui/material";
import { FC } from "react";
import theme from "../../theme";
import useMediaQuery from "../../hooks/useMediaQuery";

const Footer: FC = () => {
    //mediaQuery for Responsive Web Design
    const { isMobile } = useMediaQuery(720)

    return (
        <AppBar position="static" sx={{
            backgroundColor: theme.palette.primary.main,
            boxShadow: 'none',
            paddingX: 4,
        }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* Far-left items */}
                <Box>
                    {isMobile ? (
                        <Box component="img" src="/logo-filled.svg" alt="Geotagger" sx={{ height: '6vh' }} />
                    ) : (
                        <Typography variant="h5" color='primary.contrastText'>
                            Geotagger
                        </Typography>
                    )}
                </Box>
                {/* Far-right items */}
                <Box>
                    <Typography variant="body1" color='primary.contrastText'>
                        All Rights Reserved | skillupmentor.com
                    </Typography>
                </Box>
            </Toolbar>
        </AppBar>
    )
}
export default Footer;