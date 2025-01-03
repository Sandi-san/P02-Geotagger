import { FC, ReactNode } from "react";
import Header from "./Header";

interface Props {
    children: ReactNode | ReactNode[];
}

//Layout as interface for Header and page (children) element
const Layout: FC<Props> = ({ children }) => {
    return (
        <>
          <Header
          />
          {children}
          </>
    )
}
export default Layout;