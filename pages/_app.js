import APILoaderNotification from "../component/APILoaderNotification";
import APINotification from "../component/APINotification";
import APIConfirmProvider from "../component/common/providers/APIConfirmProvider";
import APINotifProvider from "../component/common/providers/APINotifProvider";
import "../styles/globals.css";
import "../styles/reactprosidebarstyles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/main.css";
// import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "../styles/primereactcustom.css";

import { I18nextProvider } from "react-i18next";
import i18n from "../locales/i18n";

import axios from "axios";
import Head from "next/head";

// For GET requests
axios.interceptors.request.use(
  (req) => {
    // console.log(req);
    return req;
  },
  (err) => {
    console.log(err);
    return Promise.reject(err);
  }
);

// For POST requests
axios.interceptors.response.use(
  (res) => {
    //console.log(res);
    return res;
  },
  (err) => {
    console.log(err);
    return Promise.reject(err);
  }
);

function MyApp({ Component, pageProps }) {
  const Layout = Component.layout || (({ children }) => <>{children}</>);

  return (
    <I18nextProvider i18n={i18n}>
      <APIConfirmProvider>
        <APINotifProvider>
        <Head>
          <title>Aplikasi Panjar</title>
        </Head>
          <Layout>
            <Component {...pageProps} />
          </Layout>
          <APILoaderNotification />
          <APINotification />
        </APINotifProvider>
      </APIConfirmProvider>
    </I18nextProvider>
  );
}

export default MyApp;
