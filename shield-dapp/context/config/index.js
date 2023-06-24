import {bscTestnet, bsc, mainnet, goerli} from 'wagmi/chains'

const CONFIG = {
    activeChains:[/* bscTestnet,  goerli, */ bsc, mainnet],
    activeIdChains:{
        //97:bscTestnet,
        56:bsc,
        1:mainnet,
        //5:goerli
    }
}

export default CONFIG;