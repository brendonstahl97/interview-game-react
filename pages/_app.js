import "bootstrap/dist/css/bootstrap.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

import "@/styles/style.css";
import Head from "next/head";
import Header from "@/components/header/header";
import Footer from "../components/footer/footer";
import SocketWrapper from "@/components/socket-wrapper";
import AppWrapper from "@/components/context/AppContext";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Header />
      <AppWrapper>
        <SocketWrapper>
          <Component {...pageProps} />
        </SocketWrapper>
      </AppWrapper>
      <Footer />
    </>
  );
}
