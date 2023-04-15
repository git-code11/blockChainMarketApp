// import Image from 'next/image'
//import { Inter } from 'next/font/google'
//const inter = Inter({ subsets: ['latin'] })

import { useAccount } from 'wagmi'
import { Web3Button, Web3NetworkSwitch } from '@web3modal/react'

export default function Home() {
  const { address, isConnecting, isDisconnected } = useAccount()
 
  // if (isConnecting) return <div>Connecting…</div>
  // if (isDisconnected) return <div>Disconnected</div>
  return <div>
    {address}
    <br/>
    <Web3Button icon="show" label="Connect Wallet" balance="show" />
  </div>
}