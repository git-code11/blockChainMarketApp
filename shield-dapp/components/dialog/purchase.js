
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import {useAccount, useBalance, useContractRead, useContractWrite, usePrepareContractWrite} from "wagmi";
import { erc20ABI } from "wagmi";
import { formatEther } from "ethers/lib/utils.js";

import saleAbi from "../../contract/Sale.sol/MarketSales.json";
import _contract from "../../contract/address.json";
import { constants } from "ethers";

import e_msg from "../../context/lib/e_msg";
import { useDataContext } from "./context";

import CustomInput from "../CustomInput";

export default ({id})=>{
    const {globalData, visible, hide} = useDataContext();
    const {tokenId} = globalData;
    const {address} = useAccount();

    const isVisible = !!visible[id];

    const {data:item, ...itemRead} = useContractRead({
        abi:saleAbi.abi,
        address:_contract.sale,
        functionName:"ItemForSale",
        args:[tokenId],
        enabled:!!tokenId
    });
    
    const is_erc20 = itemRead.isSuccess && item?.currency != constants.AddressZero;

    const {data:balance, ...balRead} = useBalance({
        address,
        token:is_erc20? item?.currency:'',
        watch:true,
        enabled:!!tokenId
    });

    const {data:allowance, ...allwRead} = useContractRead({
        abi:erc20ABI,
        address:item?.currency,
        functionName:"allowance",
        args:[address, _contract.sale],
        enabled:is_erc20,
        watch:true
    });

    const has_amount = itemRead.isSuccess && balance?.value.gte(item?.amount);
    const can_pay = has_amount && (is_erc20? allowance?.gte(item?.amount):true)

    const {config:approveConfig, ...approvePrepare} = usePrepareContractWrite({ 
        address:item?.currency,
        abi:erc20ABI,
        functionName:"approve",
        args:[_contract.sale, item?.amount],
        enabled:is_erc20 && isVisible
    });

    const {write:approve, ...approveWrite} = useContractWrite(approveConfig);

    const {config:purchaseConfig, ...purchasePrepare} = usePrepareContractWrite({
        address:_contract.sale,
        abi:saleAbi.abi,
        functionName:"purchase",
        args:[tokenId],
        enabled:can_pay && isVisible,
        overrides:{
            value:is_erc20? 0: item?.amount
        }
    });
    
    const {write:purchase, ...purchaseWrite} = useContractWrite(purchaseConfig);


    const _error = itemRead.error || approvePrepare.error || approveWrite.error || (can_pay && purchasePrepare.error) || purchaseWrite.error;
    
    const _loading = approveWrite.isLoading || purchaseWrite.isLoading;

    return(
        <Dialog open={isVisible} onClose={()=>hide(id)}>
            <Box p={2} component={Stack} spacing={2}>
                <Box component={Paper} position="relative" p={1} bgcolor="#ccc">
                    <Typography position="absolute" fontWeight={500}>PRICE AMOUNT</Typography>
                    <Stack width="100%" direction="row" alignSelf="end" alignItems="baseline">
                        <CustomInput placeholder="0.00" value={formatEther(item?.amount??0)} disabled/>
                        <Typography fontWeight={600}>{balance?.symbol}</Typography>
                    </Stack>
                </Box>
                <Typography>Account Balance: <b>${balance?.formatted}{balance?.symbol}</b></Typography>
            
                {
                   purchaseWrite.isSuccess || itemRead.isSuccess && (can_pay?
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

                {purchaseWrite.isSuccess && 
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


                {purchaseWrite.isSuccess || is_erc20 && has_amount && !can_pay && 
                    <>
                        <Typography>Give Market Approval to spend token from wallet</Typography>
                        <Button variant="outlined" 
                            disabled={can_pay || !approve || approveWrite.isLoading} 
                            size="large" 
                            onClick={()=>approve?.()}
                        >Approve</Button>
                    </>
                }

                <Button variant="outlined" 
                    disabled={!can_pay || !purchase || purchaseWrite.isLoading || purchaseWrite.isSuccess} 
                    size="large" 
                    onClick={()=>purchase?.()}
                >Purchase</Button>
            </Box>     
        </Dialog>
    )
}
