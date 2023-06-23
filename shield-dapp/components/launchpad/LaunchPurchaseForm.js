import { useMemo } from "react";
import { Stack, Typography, Alert } from "@mui/material";
import { LoadingButton } from "@mui/lab"
import { InputWithSymbol } from "./form"
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { purchaseLaunchSchema } from "./data/schema";
import { purchaseLaunchDefValue } from "./data/defaultValues";
import useSaleEx from "../../context/hook/app/factory/launch/useSaleEx";
import { parseEther, formatUnits } from "ethers/lib/utils.js";
import { useDebounce } from "use-debounce";
import usePurchase from "../../context/hook/app/factory/launch/usePurchase";
import { constants } from "ethers";
import useApprove from "../../context/hook/app/erc20/useApprove";
import e_msg from "../../context/lib/e_msg";

const RecieveBox = ({address, launchSym, outDecimal})=>{
    const {watch} = useFormContext();
    const _amountIn = watch('value');
    const [debouncedAmount] = useDebounce(_amountIn);
    const amountIn = useMemo(()=>{
        if(debouncedAmount && !isNaN(debouncedAmount)){
            return parseEther(debouncedAmount.toString())
        }
        return null;
    },[debouncedAmount]);
    

    const {data} = useSaleEx({
        address,
        amountIn,
        enabled:Boolean(amountIn)
    })

    const amountOut = useMemo(()=>data && formatUnits(data, outDecimal),[data, outDecimal]);

    return (
        <Typography
        variant="consolas" 
        varaint="h6"
        textAlign="center"
        fontWeight="bold"
        >Recieve ➜ {amountOut}{launchSym}</Typography>
    )
}

const PurchaseAction = ({address})=>{
    const {watch} = useFormContext();
    const watchValues = watch(['value', 'buyToken']);
    const [[debouncedAmount, buyToken]] = useDebounce(watchValues);
    
    const amountIn = useMemo(()=>{
        if(debouncedAmount && Number(debouncedAmount) > 0 && !isNaN(debouncedAmount)){
            return parseEther(debouncedAmount.toString())
        }
        return null;
    },[debouncedAmount]);

    const isToken = buyToken !== constants.AddressZero;

    const enableApproveBtn = isToken && Boolean(buyToken && address && amountIn);
    
    const approve = useApprove({
        address:buyToken,
        amountValue:amountIn,
        spender:address,
        maxApprove:false,
        enabled:enableApproveBtn
    })
    
    const purchase = usePurchase({
        address,
        isToken,
        amountIn
    });
    

    const enablePurchaseBtn = (!isToken||approve.isApproved) && Boolean(address && amountIn && purchase.write);

    const error = approve.error || purchase.error;

    return (

        <>
            { Boolean(error) && 
                <Alert color="error">
                    <Typography>{e_msg(error)}</Typography>
                </Alert>
            }

            { purchase.success && 
                <Alert color="success">
                    <Typography>Action successful</Typography>
                </Alert>
            }

            {
                (!isToken||approve.isApproved)?
                <LoadingButton
                loading={purchase.loading}
                onClick={()=>purchase?.write()}
                disabled={!enablePurchaseBtn} variant="contained">
                    <span>Exchange</span>
                </LoadingButton>:
                <LoadingButton
                loading={approve.loading}
                onClick={()=>approve?.write()}
                disabled={!enableApproveBtn} variant="contained">
                    <span>Approve</span>
                </LoadingButton>
            }
        </>
    )
}

export default ({data, address})=>{
    
    const defValue = useMemo(()=>purchaseLaunchDefValue(data),[data]);

    const methods = useForm({
        resolver:yupResolver(purchaseLaunchSchema),
        mode:"onChange",
        reValidateMode:"onChange",
        defaultValues:defValue
    });

    return (
    <FormProvider {...methods}>
        <Stack spacing={0.5}>
            <InputWithSymbol tokenField="buyToken" name="value"/>
            <RecieveBox address={address} launchSym={data?.launchSym} outDecimal={data?.launchToken?.decimals}/>
            <PurchaseAction address={address}/>
        </Stack>
    </FormProvider>
    )
}