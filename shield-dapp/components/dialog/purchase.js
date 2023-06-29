import {useMemo} from 'react';
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import {useAccount, useBalance, useContractRead} from "wagmi";

import { formatEther } from "ethers/lib/utils.js";

import saleAbi from "../../contract/Sale.sol/MarketSales.json";
import _contract from "../../contract/address.js";
import { constants } from "ethers";

import e_msg from "../../context/lib/e_msg";

import CustomInput from "../CustomInput";
import useApprove from "../../context/hook/app/erc20/useApprove";
import usePurchaseItem from "../../context/hook/app/erc721/usePurchaseItem";

export default ({toggle, tokenId})=>{
  
    const {address} = useAccount();

    const tokenIdValid = Boolean(tokenId);

    const {data:sale, ...saleRead} = useContractRead({
        abi:saleAbi.abi,
        address:_contract.sale,
        functionName:"ItemForSale",
        args:[tokenId],
        enabled:tokenIdValid
    });
    
    const is_erc20 = saleRead.isSuccess && sale.currency !== constants.AddressZero;

    const {data:balance} = useBalance({
        address,
        token:is_erc20?sale.currency:'',
        watch:true,
        enabled:tokenIdValid && saleRead.isSuccess
    });

    const {allowance, ...approve} = useApprove({
        address:sale?.currency,
        amountValue:sale?.amount,
        spender:_contract.sale,
        enabled:is_erc20 && Boolean(sale)
    });

    const has_amount = useMemo(()=>
            saleRead.isSuccess && balance && sale && balance.value.toBigInt()>= sale.amount.toBigInt(),
            [saleRead.isSuccess, balance, sale]);

    const can_pay = useMemo(()=>
        has_amount && (is_erc20? Boolean(allowance?.toBigInt() >= sale?.amount?.toBigInt()):true),
        [has_amount, is_erc20, allowance, sale]);

    const purchase = usePurchaseItem({
        item:tokenId,
        enabled:can_pay,
        value:is_erc20? 0: sale?.amount
    });
    
    const _error = saleRead.error || approve.error || purchase.error;
    
    const _loading = approve.loading || purchase.loading

    const salePrice = sale?formatEther(sale?.amount):'- - -';

    return(
        <Dialog open={true} onClose={_loading?null:toggle}>
            <Box p={2} component={Stack} spacing={2}>
                <Box component={Paper} position="relative" p={1} bgcolor="#ccc">
                    <Typography position="absolute" fontWeight={500}>PRICE AMOUNT</Typography>
                    <Stack width="100%" direction="row" alignSelf="end" alignItems="baseline">
                        <CustomInput placeholder="0.00" value={salePrice} disabled/>
                        <Typography fontWeight={600}>{balance?.symbol}</Typography>
                    </Stack>
                </Box>
                <Typography>Account Balance: <b>${balance?.formatted}{balance?.symbol}</b></Typography>
            
                {
                   approve.success || saleRead.isSuccess && (can_pay?
                    <Alert variant="outlined" severity="info">
                        <Typography>
                            {   is_erc20?
                                "Market Approved to Spend token from account":
                                "Amount would be withdrawn from account"
                            }
                        </Typography>
                    </Alert>:
                    <Alert variant="outlined" severity="error">
                        <Typography>
                            { is_erc20 && has_amount?
                                "Need market Approval to spend token":
                                "InSufficient Funds to pay"
                            }
                        </Typography>
                    </Alert>)
                }

                {purchase.success && 
                    <Alert variant="outlined">
                        <Typography>Request Successful</Typography>
                    </Alert>
                }

                {_error  && 
                    <Alert variant="outlined" severity="error">
                        <Typography>Error Occured:{e_msg(_error)}</Typography>
                    </Alert>
                }
                
                {_loading && 
                    <Alert variant="outlined" severity="info">
                        <Stack px={1} direction="row" spacing={1} alignItems="center">
                            <Typography>Processing </Typography>
                            <CircularProgress/>
                        </Stack>
                    </Alert>
                }


                {purchase.success || is_erc20 && has_amount && !can_pay && 
                    <>
                        <Typography>Give Market Approval to spend token from wallet</Typography>
                        <Button variant="outlined" 
                            disabled={!approve.write || approve.loading} 
                            size="large" 
                            onClick={()=>approve.write?.()}
                        >Approve</Button>
                    </>
                }

                <Button variant="outlined" 
                    disabled={!can_pay || !purchase.write || purchase.loading || purchase.success} 
                    size="large" 
                    onClick={()=>purchase.write?.()}
                >Purchase</Button>
            </Box>     
        </Dialog>
    )
}
