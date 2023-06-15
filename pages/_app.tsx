import "bootstrap/dist/css/bootstrap.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

import "@/styles/style.css";
import Head from "next/head";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import SocketWrapper from "@/components/context/SocketWrapper";
import AppWrapper from "@/components/context/AppContext";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Header />
      <main>
        <AppWrapper>
          <SocketWrapper>
            <Component {...pageProps} />
          </SocketWrapper>
        </AppWrapper>
      </main>
      <Footer />
    </>
  );
}
