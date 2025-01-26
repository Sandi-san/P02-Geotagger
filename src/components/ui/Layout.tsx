import { FC, ReactNode, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { tokenStorage } from "../../utils/tokenStorage";
import userStore from "../../stores/user.store";
import fetchUser from "../../utils/fetchLocalUser";
import { UserType } from "../../models/user";
import { Box } from "@mui/material";

interface Props {
    children: ReactNode | ReactNode[];
}

//Layout as interface for Header and page elements (children)
const Layout: FC<Props> = ({ children }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh', //ensure the container takes up the full viewport height
            }}
        >
            <Header />
            <Box sx={{ flex: 1 }}>{children}</Box> {/* grow to fill available space */}
            <Footer /> {/* stick footer to bottom */}
        </Box>
    )
}
export default Layout;