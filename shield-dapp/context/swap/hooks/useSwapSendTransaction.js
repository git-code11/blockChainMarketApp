import useAppSendTransaction from "../../wagmi_ethers/useAppSendTransaction";


//amountValue should pass non integer or BigInt

export default (calldata, __enabled)=>{
    
    const {reciept:tx, ...method} =  useAppSendTransaction({
        to:calldata?.to,
        value:calldata?.value,
        data:calldata?.data,
        chainId:calldata?.chainId,
        enabled:Boolean(calldata) && __enabled
    });
    
    return {tx, ...method}
}