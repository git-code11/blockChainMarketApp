import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/react'
import { configureChains, createClient, WagmiConfig } from 'wagmi'
import {publicProvider} from "wagmi/providers/public";
import {InjectedConnector} from "wagmi/connectors/injected";

import {bscTestnet, hardhat} from 'wagmi/chains'

import {useEffect, useState} from "react";


// 1. Get projectID at https://cloud.walletconnect.com
// if (!process.env.NEXT_PUBLIC_PROJECT_ID) {
//   throw new Error('You need to provide NEXT_PUBLIC_PROJECT_ID env variable')
// }
// const projectId = process.env.NEXT_PUBLIC_PROJECT_ID

// 2. Configure wagmi client
const _chains = [hardhat];

const { provider, chains } = configureChains(_chains, [publicProvider()])

const wagmiClient = createClient({
  autoConnect: true,
  connectors: [
    new InjectedConnector({chains})
  ],
  provider
});


export default function ({children}) {
  const [ready, setReady] = useState(false)

// 5. Prevent server-side rendering of Component
  useEffect(() => {
    setReady(true)
  }, []);

  return (
    <>
      {ready ? (
        <WagmiConfig client={wagmiClient}>
          {children}
        </WagmiConfig>
      ) : null}
      
    </>
  )
}