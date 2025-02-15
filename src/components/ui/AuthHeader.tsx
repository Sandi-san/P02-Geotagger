import { Box, Link, Typography } from "@mui/material";
import { FC, useState } from "react";
import theme from "../../theme";
import useMediaQuery from "../../hooks/useMediaQuery";

const AuthHeader: FC = () => {
    const { isMobile } = useMediaQuery(720)

    //open/close states for Menu popup
    const [open, setOpen] = useState(false);
    //open the modal
    const handleOpen = () => setOpen(true);
    //close the modal
    const handleClose = () => {
        setOpen(false);
    }

    return (
        //Top left logo with functionality and RWD
        <Box
        sx={{
            position: isMobile ? 'static' : 'absolute',
            top: isMobile ? 'auto' : '2vh',
            left: isMobile ? 'auto' : '4vh',
            display: 'flex',
            alignItems: 'center',
            width: isMobile ? '100%' : '',
            padding: isMobile ? 2 : 0,
            justifyContent: isMobile ? 'space-between' : 'flex-start',
            boxShadow: isMobile ? 3 : 0,
            marginBottom: isMobile ? '4vh' : 0,
        }}
    >
        <Box sx={{
            flex: 1, display: 'flex', alignItems: 'flex-start',
            marginLeft: isMobile ? '4vh' : '0',
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
        {isMobile && (
            <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-end", flexGrow: 1, marginRight: '4vh', }}>
                <Box component="img" src="/icon-menu-mobile.svg" alt="X"
                    sx={{
                        height: '4vh',
                        '&:hover': {
                            cursor: 'pointer',
                        }
                    }} />
            </Box>
        )}
    </Box>
    )
}
export default AuthHeader;