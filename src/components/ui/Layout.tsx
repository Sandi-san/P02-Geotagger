import { FC, ReactNode, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { tokenStorage } from "../../utils/tokenStorage";
import userStore from "../../stores/user.store";
import fetchUser from "../../utils/fetchLocalUser";
import { UserType } from "../../models/user";

interface Props {
    children: ReactNode | ReactNode[];
}

//Layout as interface for Header and page elements (children)
const Layout: FC<Props> = ({ children }) => {
    return (
        <>
            <Header
            />
            {children}
            <Footer />
        </>
    )
}
export default Layout;