
const IS_PRODUCTION = process.env.NEXT_PUBLIC_ENV === "production";

const devConfig = {
    admin:"0x6592b3ae337bD50010FBc63907FB2dC92a450502",
    swapFeeBps:100,
    mainActiveChain:97
}


const prodConfig = {
    admin:"0x4733190cC4208aE26512b4F941895F1c25A2Bd50",
    swapFeeBps:100,
    mainActiveChain:56
}

const config = IS_PRODUCTION ? prodConfig : devConfig;

export default config;