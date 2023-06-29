import {bscTestnet, bsc, mainnet, goerli} from 'wagmi/chains'


const IS_PRODUCTION = process.env.NEXT_PUBLIC_ENV === "production";

const CONFIG = {
    activeChains:[...(IS_PRODUCTION?[]:[bscTestnet,  goerli]), bsc, mainnet],
    activeIdChains:{
        ...(
            IS_PRODUCTION?
            {}:
            {
                97:bscTestnet,
                5:goerli
            }
        ),
        56:bsc,
        1:mainnet,
    }
}

export default CONFIG;