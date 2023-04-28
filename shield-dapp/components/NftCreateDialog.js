import {useMemo, useCallback} from 'react';
import { usePrepareContractWrite, useContractWrite, useContractRead } from "wagmi";

import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";

import { StepImage, StepSection } from "./StepProcess";

import {useIpfsStore} from "../context/lib/ipfs";;


const _component =  ({getData, open, setOpen})=>{

    const {trigger, ..._ipfs} = useIpfsStore(d=>onAddMarket(d));

    const {config:marketConfig} = usePrepareContractWrite({});

    const {write:marketWrite, ..._market} = useContractWrite({
        ...marketConfig,
        onSuccess:d=>onApprove(d)
    });

    const readApprove = useContractRead({});
    const isApproved = useMemo(()=>readApprove.data === "0x",[readApprove.data]);

    const {config:approveConfig} = usePrepareContractWrite({});
    const {write:approveWrite, ..._approve} = useContractWrite(approveConfig);
    
    console.log("IPfs", _ipfs);
    console.log("Market", _market);
    console.log("Approve", _approve);

    const onUpload = useCallback(async ()=>{
        const data = await getData();
        console.log("onUpload",data);
        trigger(data);
    },[trigger, getData]);

    const onAddMarket =  useCallback((data)=>{
        marketWrite({
            args:[data.ipnft]
        });
    },[marketWrite]);


    const onApprove = useCallback((data)=>{
        approveWrite({
            args:[data]
        });
    },[approveWrite]);

    const hasLoading = _ipfs.isLoading  || _market.isLoading || _approve.isLoading;


    return (
        <Dialog open={open} onClose={()=>hasLoading && setOpen(false)} fullWidth>
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
                                    <Alert>{_ipfs.error?.message}</Alert>
                                    <Typography component={Link} onClick={onUpload} variant="caption">Retry Uploading to server</Typography>
                                </>
                            }
                        </Stack>
                    </StepSection>

                    <StepSection>
                        <StepImage
                            loading={_market.isLoading}
                            status={(_market.isSuccess&&"success") || (_market.isError && "error")}
                        />
                        <Stack>
                            <Typography>Add To market</Typography>
                            {_market.isError &&
                                <>
                                    <Alert severity="error">{_market.error?.message}</Alert>
                                    <Typography component={Link} onClick={()=>onAddMarket(_ipfs.data)} variant="caption">retry</Typography>
                                </>
                            }
                        </Stack>
                    </StepSection>

                    <StepSection>
                        <StepImage
                            loading={_approve.isLoading}
                            status={(isApproved&&"success") || (_approve.isError && "error")}
                        />
                        <Stack>
                            <Typography>Give Market Permission</Typography>
                            {_approve.isError &&
                                    <>
                                        <Alert severity="error">{_approve.error?.message}</Alert>
                                        <Typography component={Link} onClick={()=>onApprove(_market.data)} variant="caption">retry</Typography>
                                    </>
                            }
                            </Stack>
                    </StepSection>
                </Stack>
                {(_ipfs.data || _ipfs.isLoading) || <Button variant="outlined" onClick={onUpload}>Proceed</Button>}
            </Stack>
        </Dialog>
     )
}


export default _component;