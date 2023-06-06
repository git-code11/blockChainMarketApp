import useAppSendTransaction_2 from "../../wagmi_ethers/useAppSendTransaction_2";


//amountValue should pass non integer or BigInt
export default (calldata, __enabled)=>{
    
    const {reciept:tx, ...method} = useAppSendTransaction_2({
        to:calldata?.to,
        value:calldata?.value,
        data:calldata?.data,
        chainId:calldata?.chainId
    });

    return {tx, ...method}
}