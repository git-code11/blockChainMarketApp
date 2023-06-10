import WalletProvider from "./wallet";
import ThemeProvider from './theme';
import SWRProvider from "./http";
import SessionProvider from './session'
import ReduxProvider from '../redux/provider'

export default ({children, pageProps})=>{
    return (
    <WalletProvider>
        <ReduxProvider>
            <SessionProvider session={pageProps.session}>
                <SWRProvider>
                    <ThemeProvider>
                        {children}
                    </ThemeProvider>
                </SWRProvider>
            </SessionProvider>
        </ReduxProvider>
    </WalletProvider>
    );
}
