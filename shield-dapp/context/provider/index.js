import WalletProvider from "./wallet";
import ThemeProvider from './theme';
import HttpProvider from "./http";


export default ({children})=>{
    return (
    <WalletProvider>
        <HttpProvider>
            <ThemeProvider>
                {children}
            </ThemeProvider>
        </HttpProvider>
    </WalletProvider>
    );
}
