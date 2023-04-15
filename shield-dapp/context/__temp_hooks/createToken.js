import { useContractRead, useContractWrite, usePrepareContractWrite, useToken} from 'wagmi'

import { useAccount } from 'wagmi';

const tokenFactoryContractAddress = "";
/**
 * Token Creation
 */


/**
 * Description: Create Reflection Token
 * 
 */
const createReflectTokenABI = ''
function useCreateReflectToken(name, symbol, decimals, totalSupply, fee) {
   const { config } = usePrepareContractWrite({
     address: tokenFactoryContractAddress,
     abi: createReflectTokenABI,
     functionName: 'createReflectToken',
     args:[name, symbol, decimals, totalSupply],
     overrides: {
        value: fee//ethers.utils.parseEther('0.01'),
      },
   });
   
   const { data, isLoading, isSuccess, write } = useContractWrite(config);
   return { data, isLoading, isSuccess, write };
}


/**
 * Description: Create Liquid Token
 * 
 */
const createLiquidTokenABI = ''
function useCreateLiquidToken(name, symbol, decimals, totalSupply, taxBps, liqBps, fee) {
   const { config } = usePrepareContractWrite({
   address: tokenFactoryContractAddress,
   abi: createLiquidTokenABI,
   functionName: 'createLiquidToken',
   args:[name, symbol, decimals, totalSupply, taxBps, liqBps],
   overrides: {
      value: fee//ethers.utils.parseEther('0.01'),
      },
   });
   
   const { data, isLoading, isSuccess, write } = useContractWrite(config);
   return { data, isLoading, isSuccess, write };
}
 

 /**
 * Description: Create Standard Token
 * 
 */
const createStandardTokenABI = ''
function useCreateStandardToken(name, symbol, decimals, totalSupply, fee) {
   const { config } = usePrepareContractWrite({
     address: tokenFactoryContractAddress,
     abi: createStandardTokenABI,
     functionName: 'createStandardToken',
     args:[name, symbol, decimals, totalSupply],
     overrides: {
        value: fee//ethers.utils.parseEther('0.01'),
      },
   });
   
   const { data, isLoading, isSuccess, write } = useContractWrite(config);
   return { data, isLoading, isSuccess, write };
}


/**
 * Description: Provides Token Creation Fee
 */
const tokenCreationFeeABI = ";"
function useTokenCreationFee(){
   const { data, isError, isLoading } = useContractRead({
      address: tokenFactoryContractAddress,
      abi: tokenCreationFeeABI,
      functionName: 'fee',
    });
   return { data, isError, isLoading };
}

/**
 * 
 * Description: Provides Token Information 
 */
function useTokenInfo(tokenAddress){
   const { data, isError, isLoading } = useToken({ address: tokenAddress });
   return { data, isError, isLoading };
}


/**
 * Description: Provides list of created Token
 */
const createdTokenABI = "";
function useCreatedToken(){
   const {address} = useAccount();

   const {data, isError, isLoading} = useContractRead({
      address: tokenFactoryContractAddress,
      abi: createdTokenABI,
      functionName:"createdToken",
      overrides: { from: address }
   });

   return {data, isError, isLoading};
}


/**
 * Description: Provides address of contract owner
 */
const factoryOwnerABI = "";
function useFactoryOwner(){

   const {data, isError, isLoading} = useContractRead({
      address: tokenFactoryContractAddress,
      abi: factoryOwnerABI,
      functionName:"owner"
   });

   return {data, isError, isLoading};
}


 /**
 * Description: Withdraw Fee to `Factory Owner wallet`
 * 
 */
const withdrawFeeABI = ''
function useWithdrawFee() {
   const { config } = usePrepareContractWrite({
      address: tokenFactoryContractAddress,
      abi: withdrawFeeABI,
      functionName: 'withdrawFee'
   });
   
   const { data, isLoading, isSuccess, write } = useContractWrite(config);
   
   return { data, isLoading, isSuccess, write };
}

/**
 * Description: Provides the total amount of fee availabe in contract for withdrawal
 */
const recievedFeeABI = ""
function useRecievedFee(){
   const {data, isError, isLoading} = useContractRead({
      address: tokenFactoryContractAddress,
      abi: recievedFeeABI,
      functionName:"getRecievedFee"
   });

   return {data, isError, isLoading};
}

export {useCreateReflectToken, useCreateLiquidToken, useCreateStandardToken};