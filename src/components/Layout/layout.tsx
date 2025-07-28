import { ReactNode } from "react";
import Header from "./header/header";
import Footer from "./footer/footer";
import TawkMessengerReact from "@tawk.to/tawk-messenger-react";

type Props = {
  children: ReactNode;
};

export const Layout = ({ children }: Props) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <TawkMessengerReact
        propertyId="6887dd3d670c54192a8b455b"
        widgetId="1j19bgefu"
      />
      <Footer />
    </>
  );
};
