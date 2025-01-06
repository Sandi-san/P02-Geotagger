import { FC, ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

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