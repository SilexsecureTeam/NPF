import { ReactNode} from "react";
import Header from "./header/header";
import Footer from "./footer/footer";

type Props = {
  children: ReactNode;
};

export const Layout = ({ children }: Props) => {

  return (
    <>
      <Header />
      <main>
        {children}
      </main>
      <Footer/>
     
    </>
  );
};