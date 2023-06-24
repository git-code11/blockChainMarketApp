import {useEffect, useCallback, useState, useMemo} from "react";
import Router from "next/router";
import { Button, Stack, Typography} from "@mui/material";

import Dialog from "@mui/material/Dialog";
import Link from "@mui/material/Link";
import Alert from "@mui/material/Alert";

import { StepImage, StepSection } from "../../components/StepProcess";

import {useIpfsStore} from "../../context/hook/ipfs";;

import _contract from "../../contract/address.json";
import { BigNumber } from "ethers";

import {constants} from "ethers";
import { parseEther } from "ethers/lib/utils.js";
import {  useAccount, useContractEvent } from "wagmi";
import e_msg from "../../context/lib/e_msg";

import { useDebounce } from "use-debounce";
import useCreateItem from "../../context/hook/app/erc721/useCreateItem";
import useApprove from "../../context/hook/app/erc721/useApprove";


export default ({modal, form})=>{
    const {address:ownerAddr} = useAccount();
    const creatorAddr = ownerAddr;

    const formValue = form.watch();
    
    //no deadline (duration for sale of item)
    const duration = 0;

    const ipfs = useIpfsStore();
    const cid = formValue.cid;
    
    const onUpload = useCallback(()=>
        ipfs.trigger(formValue).then(
            data=>form.setValue('cid', data?.ipnft)
        )
    ,[ipfs.trigger, formValue]);

    //Args for create item as follows
    //[creator, owner, cid, salePrice, saleCurrency(0x0 for native or erc20 addresses), duration]
    //it is believed that the saleCurrency has a decimal equal to ether (18)
    const toSaleArgs = useMemo(()=>
                                [creatorAddr, ownerAddr, 
                                    cid,
                                    parseEther(formValue.sale.price.toString()),
                                    formValue.sale.currency, duration],
                        [creatorAddr, ownerAddr, cid, form.sale, duration]);
                                    
    const [debouncedToSaleArgs] = useDebounce(toSaleArgs, 500);
    
    const _toSaleEnabled = Boolean(cid) && !ipfs.error && ipfs.data;
    
    const toSale = useCreateItem({
        args:debouncedToSaleArgs,
        enabled:_toSaleEnabled
    });

    /**
     * Side effect to call after ipfs & toSale success
     */
    useEffect(()=>{
        if(_toSaleEnabled  && !(toSale.loading || toSale.success || Boolean(toSale.error)) ){
            toSale.write?.();
        }
    },[_toSaleEnabled, toSale]);
    
    //To Check for minted token Id
    //Another implementation would be to get token Id from the transaction reciept logs
    const tokenId = useMemo(()=>
        (toSale.success && toSale.reciept)?BigNumber.from(toSale.reciept.logs[0].topics[3]):null
        ,[toSale.reciept, toSale.success]);
    
    //const [tokenId, setTokenId] = useState(null);
    // useContractEvent({
    //     address:_contract.nft,
    //     abi:nftAbi.abi,
    //     eventName:"Transfer",
    //     listener:(_from, _to, _id)=>{
    //         if(_from === constants.AddressZero && _to === ownerAddr){
    //             setTokenId(_id);
    //         }
    //     },
    //     once:!!tokenId
    // });

    
    //if the sale Price > 0 then this item created need to approve the market
    const needApproval  = formValue.sale.price > 0 ;//&& toSale.success; 
    //Approval is enabled on if token
    const approve = useApprove({
        item:tokenId,
        spender:_contract.sale,
        enabled:needApproval && toSale.success
    });

    // side effect to call when created token needs approval to be added to market
    useEffect(()=>{
        if(needApproval && !(approve.isApproved || approve.loading || approve.success || Boolean(approve.error)) && toSale.success){
            approve.write?.();
        }
    },[approve, toSale.success, needApproval]);
    
    const hasLoading = ipfs.loading  || toSale.loading || approve.loading

    //modal can only be toggled off only when upload is made
    return (
        <Dialog open={modal.visible} onClose={()=>Boolean(hasLoading || cid)?null:modal.toggle()} fullWidth>
            <Stack p={2.5} spacing={2}>
                <Stack>
                    <StepSection>
                        <StepImage
                            loading={ipfs.loading}
                            status={(ipfs.data && "success") || (ipfs.error && "error")}
                        />
                        <Stack>
                            <Typography>Upload to server</Typography>
                            {ipfs.error && 
                                <>
                                    <Alert severity="error">{ipfs.error?.message}</Alert>
                                    <Typography component={Link} onClick={onUpload} variant="caption">Retry Uploading to server</Typography>
                                </>
                            }
                        </Stack>
                    </StepSection>

                    <StepSection>
                        <StepImage
                            loading={toSale.loading}
                            status={(toSale.success &&"success") || (Boolean(toSale.error) && "error")}
                        />
                        <Stack>
                            <Typography>Add To market</Typography>
                            {Boolean(toSale.error) &&
                                <>
                                    <Alert severity="error">{e_msg(toSale.error)}</Alert>
                                    <Typography disabled={!toSale.write} component={Link} onClick={()=>toSale.write?.()} variant="caption">retry</Typography>
                                </>
                            }
                        </Stack>
                    </StepSection>

                    {needApproval &&
                    <StepSection>
                        <StepImage
                            loading={approve.loading}
                            status={(approve.success &&"success") || (Boolean(approve.error) && "error")}
                        />
                        <Stack>
                            <Typography>Give Market Permission</Typography>
                            { Boolean(approve.error) &&
                                    <>
                                        <Alert severity="error">{e_msg(approve.error)}</Alert>
                                        <Typography disabled={!approve.write} component={Link} onClick={()=>approve.write?.()} variant="caption">retry</Typography>
                                    </>
                            }
                            </Stack>
                    </StepSection>
                    }
                </Stack>
                {   //if the token is approved or tosale was created without approval the preview
                    (approve.success || (!needApproval && toSale.success))?
                    <Button variant="outlined" onClick={()=>Router.replace(`/item/${tokenId?.toString()}`)}>Preview</Button>:
                    <Button disabled={Boolean(ipfs.data || ipfs.loading)} variant="outlined" onClick={onUpload}>Proceed</Button>
                }
            </Stack>
        </Dialog>
     )
}