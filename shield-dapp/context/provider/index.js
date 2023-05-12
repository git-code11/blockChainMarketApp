import WalletProvider from "./wallet";
import ThemeProvider from './theme';
import SWRProvider from "./http";//
import SessionProvider from './session'


export default ({children, pageProps})=>{
    return (
    <WalletProvider>
        <SessionProvider session={pageProps.session}>
            <SWRProvider>
                <ThemeProvider>
                    {children}
                </ThemeProvider>
            </SWRProvider>
        </SessionProvider>
    </WalletProvider>
    );
}
