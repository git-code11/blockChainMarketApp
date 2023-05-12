//import '@/styles/globals.css'

import Head from 'next/head'
import ContextProvider from "../../context/provider";
import NavBar from "../../components/NavBar";
import '../../node_modules/sal.js/dist/sal.css';


export default function App({ Component, pageProps }) {
  
  return (
    <>
      <Head>
        <title>Dapp Project</title>
        <meta name="description" content="Dapp" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ContextProvider pageProps={pageProps}>
        <NavBar/>
        <Component {...pageProps}/>
      </ContextProvider>
    </>
  );
}
