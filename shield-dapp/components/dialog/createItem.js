import {useEffect, useCallback, useState} from "react";
import Router from "next/router";
import { Button, Stack, Typography} from "@mui/material";

import Dialog from "@mui/material/Dialog";
import Link from "@mui/material/Link";
import Alert from "@mui/material/Alert";

import { StepImage, StepSection } from "../../components/StepProcess";

import {useIpfsStore} from "../../context/lib/ipfs";;


import _contract from "../../contract/address.json";
import nftAbi from "../../contract/NFT.sol/NFT.json";
import saleAbi from "../../contract/Sale.sol/MarketSales.json";

import {constants, BigNumber} from "ethers";
import { parseEther } from "ethers/lib/utils.js";
import { useContractWrite, usePrepareContractWrite, useAccount, useContractRead, useContractEvent } from "wagmi";
import e_msg from "../../context/lib/e_msg";
import { useDataContext } from "./context";
import { useDebounce } from "use-debounce";


export default ({id})=>{
    const {address:ownerAddress} = useAccount();

    const {globalData, hide, visible} = useDataContext();
    
    const isVisible = !!visible[id];

    const {getData} = globalData;

    const formValue = getData();

    const creatorAddress = ownerAddress;
    const duration = 0;

    const {trigger, ..._ipfs} = useIpfsStore(d=>onAddMarket(d));

    const onUpload = useCallback(()=>{
        trigger(formValue);
    },[trigger]);

    const _fargs = [creatorAddress, ownerAddress, _ipfs.data?.ipnft, parseEther((parseFloat(formValue.sale.price) || 0).toString()), formValue.sale.currency, duration];
    const [fargs] = useDebounce(_fargs, 500);

    const {config:saleConfig, ...salePrepare} = usePrepareContractWrite({
        address:_contract.sale,
        abi:saleAbi.abi,
        functionName:"createItem",
        args:fargs,
        enabled:!!_ipfs.data?.ipnft && isVisible
    });
    const {write:toSale, ...toSaleOpts} = useContractWrite(saleConfig);

    useEffect(()=>{
        if(isVisible && _ipfs.data && salePrepare.isFetched && toSale && !(toSaleOpts.isLoading || toSaleOpts.isSuccess || toSaleOpts.isError)){
            toSale();
        }
    },[_ipfs.data, salePrepare.isFetched,
        toSale, toSaleOpts.isLoading, toSaleOpts.isSuccess, toSaleOpts.isError, isVisible]);
    
    const [tokenId, setTokenId] = useState(0);

    useContractEvent({
        address:_contract.nft,
        abi:nftAbi.abi,
        eventName:"Transfer",
        listener:(_from, _to, _id)=>{
            if(_from === constants.AddressZero && _to === ownerAddress){
                setTokenId(_id);
            }
        },
        once:!!tokenId
    });

    const needApprove  = +formValue.sale.price > 0;

    const {data:_isApproved} = useContractRead({
        address:_contract.nft,
        abi:nftAbi.abi,
        functionName:"getApproved",
        args:[tokenId],
        enabled:!!tokenId,
        watch:true
    });

    const isApproved = _isApproved == _contract.sale;

    const {config:approveConfig, ...approvePrepare} = usePrepareContractWrite({
        address:_contract.nft,
        abi:nftAbi.abi,
        functionName:"approve",
        args:[_contract.sale, tokenId],
        enabled:!(!tokenId && isApproved) && toSaleOpts.isSuccess && isVisible
    });

    const {write:approve, ...approveOpts} = useContractWrite(approveConfig);

    useEffect(()=>{
    
        if(isVisible && needApprove && approve && !(isApproved || approveOpts.isLoading || approveOpts.isSuccess || approveOpts.isError)){
            approve();
        }
    },[approve, approveOpts.isLoading, approveOpts.isSuccess, approveOpts.isError, isApproved, toSaleOpts.isSuccess, needApprove, isVisible]);

    const hasLoading = _ipfs.isLoading  || toSaleOpts.isLoading || approveOpts.isLoading;

    //console.log({tokenId, cid:_ipfs.data, approve, approveOpts});

    return (
        <Dialog open={isVisible} onClose={()=>hasLoading || isApproved || !needApprove || hide(id)} fullWidth>
            <Stack p={2.5} spacing={2}>
                <Stack>
                    <StepSection>
                        <StepImage
                            loading={_ipfs.isLoading}
                            status={(_ipfs.data&&"success") || (_ipfs.error && "error")}
                        />
                        <Stack>
                            <Typography>Upload to server</Typography>
                            {_ipfs.error && 
                                <>
                                    <Alert severity="error">{_ipfs.error?.message}</Alert>
                                    <Typography component={Link} onClick={onUpload} variant="caption">Retry Uploading to server</Typography>
                                </>
                            }
                        </Stack>
                    </StepSection>

                    <StepSection>
                        <StepImage
                            loading={toSaleOpts.isLoading}
                            status={(toSaleOpts.isSuccess&&"success") || (toSaleOpts.isError && "error")}
                        />
                        <Stack>
                            <Typography>Add To market</Typography>
                            {toSaleOpts.isError &&
                                <>
                                    <Alert severity="error">{e_msg(toSaleOpts.error)}</Alert>
                                    <Typography disabled={!toSale} component={Link} onClick={()=>toSale?.()} variant="caption">retry</Typography>
                                </>
                            }
                        </Stack>
                    </StepSection>

                    {needApprove &&
                    <StepSection>
                        <StepImage
                            loading={approveOpts.isLoading}
                            status={(approveOpts.isSuccess &&"success") || (approveOpts.isError && "error")}
                        />
                        <Stack>
                            <Typography>Give Market Permission</Typography>
                            {approveOpts.isError &&
                                    <>
                                        <Alert severity="error">{e_msg(approveOpts.error)}</Alert>
                                        <Typography disabled={!approve} component={Link} onClick={()=>approve?.()} variant="caption">retry</Typography>
                                    </>
                            }
                            </Stack>
                    </StepSection>
                    }
                </Stack>
                {(approveOpts.isSuccess || (!needApprove && toSaleOpts.isSuccess))?<Button variant="outlined" onClick={()=>Router.replace(`/item/${tokenId?.toString()}`)}>Preview</Button>:
                <Button disabled={!!(_ipfs.data || _ipfs.isLoading)} variant="outlined" onClick={onUpload}>Proceed</Button>}
            </Stack>
        </Dialog>
     )
}