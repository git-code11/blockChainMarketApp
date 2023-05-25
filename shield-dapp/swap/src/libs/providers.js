import { ethers, BigNumber, Contract } from 'ethers'
import { CurrentConfig } from '../config'
import { ERC20_ABI } from '../constants';
// Provider Functions


export const wallet = createWallet();

export const TransactionState = {
  Failed:"Failed",
  Success:"Success",
  Sent:"Sent"
}

export function getProvider(){
  return new ethers.providers.JsonRpcProvider(CurrentConfig.rpc.bsc_testnet)
}

export function getWallet(){
  return wallet;
}

export function getWalletAddress(){
  return wallet.address
}


function createWallet(){
  let provider = getProvider();
  return new ethers.Wallet(CurrentConfig.wallet.privateKey, provider)
}

export async function sendTransaction(
  _wallet,
  _transaction
){
  const txRes = await _wallet.sendTransaction(_transaction)
  console.log({txRes})
  let receipt = await txRes.wait();
  console.log({receipt});
  return receipt;
  
}


export const gasPriceWei = ()=>getProvider().getGasPrice();
export const gasEstimate = (tx)=>getProvider().estimateGas(tx);

export const createTransaction =  async({from, to, data, value})=>{
  
  const tradeTX = {
    from,
    to,
    data,
    ...(value ? {value}:{})
  }
  console.log("Estimating Gas To use")
  const txEstimate = await gasEstimate(tradeTX).catch(e=>console.log({e})||null);
  console.log({txEstimate})
  if(!txEstimate)
    return;
  return {
    ...tradeTX,
    ...(txEstimate?{gasLimit:calculateGasMargin(txEstimate)}:{})
  }

}


export const getERC20Contract = (address, _signer)=>new Contract(address, ERC20_ABI, _signer ?? getProvider())


export const approveAmount = async(address, _signer, _spender, _amount)=>{
  const erc20 = getERC20Contract(address, _signer);
  
  const _value = await Promise.all([erc20.balanceOf(_signer.address), erc20.allowance(_signer.address, _spender)]);
  
  if(_value[0]?.lt(_amount)){
    throw Error("Not Enough Balance");
  }
  else if(_value[1]?.gte(_amount)){
    return true;
  }else{
    const tx = await erc20.approve(_spender, _amount);
    const reciept = await tx.wait();
    return true;
  }
}
//1bips == 0.1% === 1/10000
//adds 10% to gas
export function calculateGasMargin(value , margin = 1000) {
  return value.mul(BigNumber.from(10000).add(BigNumber.from(margin))).div(BigNumber.from(10000))
}
