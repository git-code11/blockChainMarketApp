import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/react'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import {bscTestnet} from 'wagmi/chains'
import {useState, useEffect} from 'react';


// 1. Get projectID at https://cloud.walletconnect.com
if (!process.env.NEXT_PUBLIC_PROJECT_ID) {
  throw new Error('You need to provide NEXT_PUBLIC_PROJECT_ID env variable')
}
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID

// 2. Configure wagmi client
const chains = [bscTestnet]


const { publicClient, webSocketPublicClient  } = configureChains(chains, [w3mProvider({ projectId })])

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, version: 1, chains }),
  publicClient,
  webSocketPublicClient
})
const ethereumClient = new EthereumClient(wagmiConfig, chains)

export default function({children}) {
  const [ready, setReady] = useState(false)

  // 5. Prevent server-side rendering of Component
  useEffect(() => {
    setReady(true)
  }, []);

  
  return (
    <> 
      {ready ? (
       <WagmiConfig config={wagmiConfig}>
        {children}
        </WagmiConfig>
      ) : null}
        

      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </>
  )
}
