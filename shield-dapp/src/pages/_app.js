//import '@/styles/globals.css'

import Head from 'next/head'
import ContextProvider from "../../context/provider";
import NavBar from "../../components/NavBar";
import '../../node_modules/sal.js/dist/sal.css';
import LoadingScreen from '../../components/LoadingScreen';


export default function App({ Component, pageProps }) {
  
  return (
    <>
      <Head>
        <title>Dapp Project</title>
        <meta name="description" content="Dapp" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest"></link>
      </Head>
      <ContextProvider pageProps={pageProps}>
        <LoadingScreen/>
        <NavBar/>
        <Component {...pageProps}/>
      </ContextProvider>
    </>
  );
}
