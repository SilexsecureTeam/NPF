import { ReactNode } from "react";
import Header from "./header/header";
import Footer from "./footer/footer";
// @ts-ignore
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
      <div
        className="elfsight-app-e84c7b92-78e8-4f3f-90ef-c80341a1263c"
        data-elfsight-app-lazy
      ></div>
      <Footer />
    </>
  );
};
