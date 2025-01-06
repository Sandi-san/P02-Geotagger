import { AppBar, Box, Button, Link, Toolbar, Typography } from "@mui/material";
import { FC } from "react";
import theme from "../../theme";

const Footer: FC = () => {
    return (
        <AppBar position="static" sx={{ 
            backgroundColor: theme.palette.primary.main, 
            boxShadow: 'none', 
            padding: '0 16px',
             }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* Far-left items */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="h5" component="span" sx={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ color: theme.palette.primary.contrastText }}>Geotagger</span>
                    </Typography>
                </Box>
                {/* Far-right items */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body1" sx={{ marginRight: 1, color: theme.palette.primary.contrastText  }}>
                        All Rights Reserved | skillupmentor.com 
                    </Typography>
                </Box>
            </Toolbar>
        </AppBar>
    )
}
export default Footer;