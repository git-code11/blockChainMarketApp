import { Stack, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, StepContent } from "@mui/material"
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from "@mui/material/Alert"
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { useIpfsBlobStore } from "../../../context/hook/ipfs";
import { useCallback, useMemo, useEffect } from "react";
import useApprove from "../../../context/hook/app/erc20/useApprove";
import usePredictAmount,{predictAmountParams} from "../../../context/hook/app/factory/launch/usePredictAmount";
import { useToken } from "wagmi";
import e_msg from "../../../context/lib/e_msg";
import useCreatePad, { prepareCreatePadParams } from "../../../context/hook/app/factory/launch/useCreatePad";
import _contract from "../../../contract/address.json";
import { parseAddress } from "../../../context/hook/app/factory/utils";
import { useFormContext } from "react-hook-form";
import { useDebounce } from "use-debounce";
import Link from "next/link";
import useFeeAmount from "../../../context/hook/app/factory/launch/useFeeAmount";


const steps = [
    {
        label:'Upload Description',
        description:"Editing not possible after uploading"
    },
    {
        label:'Approve Token',
    },
    {
        label:'Add To Chain',
    }
];

function StepperContainer({active, description}) {
    
    return (
      <Box sx={{ width: '100%' }}>
        <Stepper activeStep={active} orientation="vertical">
          {steps.map((d,i) => (
            <Step key={d.label}>
              <StepLabel>{d.label}</StepLabel>
              {
                active === i && 
                    <StepContent>{description||d.description}</StepContent>
              }
            </Step>
          ))}
        </Stepper>
      </Box>
    );
  }


const useSaveData  = ({detail}, setCID)=>{
    const {trigger, ...props} = useIpfsBlobStore();

    const save = useCallback(()=>
        trigger(detail)
    ,[detail]);

    useEffect(()=>{
        if(props.data){
            setCID(props.data);
        }
    },[props.data]);

    return {save, ...props}
}

const useCreate = ({token, launch, detail}, outputDecimals)=>{

    const fee = useFeeAmount({});
    const params = useMemo(()=>
        prepareCreatePadParams({
            ihash:detail.cid,
            launchToken:token.address,
            buyToken:token.buyToken,
            feeTier:token.feeTier,

            saleRate:launch.preSale,
            dexRate:launch.dexSale,
            capped:launch.capped,
            minBuy:launch.minBuy,
            maxBuy:launch.maxBuy,
            dexBps:launch.swapLiquidityPercent,
            startTime:launch.startTime,
            endTime:launch.endTime,
            lpLockPeriod:launch.lockUp,
            whiteListEnabled:launch.enablewhitelist
        },
        outputDecimals)
    ,[token, launch, detail.cid, outputDecimals]);
    //console.log({c:params})

    const method = useCreatePad({
        params,
        value:fee.data
    });
    //console.log({cr:method});

    return {...method, loading:method.loading||fee.isLoading, fee:fee.data};
}


export default ({onClose})=>{
    const {watch, setValue} = useFormContext();
    const __data = watch();
    const [data] = useDebounce(__data, 500);

    const setCID = useCallback((cid)=>setValue('detail.cid', cid),[setValue]);
    const ipfs = useSaveData(data, setCID);

    //const cid = ipfs.data || data.detail.cid;
    const cid = ipfs.data //if reupload on close
    console.log({cidi:ipfs.data, cid:data.detail.cid})
    const token = useToken({
        address:data.token.address
    });

    const params1 = useMemo(()=> predictAmountParams({
        capped:data.launch.capped,
        saleRate:data.launch.preSale,
        feeTier:data.token.feeTier,
        dexRate:data.launch.dexSale,
        dexBps:data.launch.swapLiquidityPercent,
        decimals:token.data?.decimals
    }),[token.data]);

    const predict = usePredictAmount({
        params:params1,
        enabled:token.isSuccess
    });

    const approve = useApprove({
        address:data.token.address,
        amountValue:predict.data,
        spender:_contract.padFactory,
        enabled:predict.isSuccess,
        maxApprove:false
    });

    const create = useCreate(data, token.data?.decimals);

    const _loading = ipfs.loading || predict.isLoading || approve.loading || create.loading;

    const activeId = useMemo(()=>{
        let id = 0;
        if(Boolean(cid)){
            if(approve.isApproved){
                if(create.success){
                    id= 3;
                }else{
                    id = 2
                }
            }else{
                id = 1;
            }
        }
        return id;
    },[cid, approve.isApproved, create.success]);

    const error = useMemo(()=>{
        let _error;
        switch(activeId){
            case 0:
                _error =  ipfs.error;//||predict.error;
                break;
            case 1:
                _error =  approve.error;
                break;
            case 2:
                _error = create.error;
                break;
        }

        
            return _error ?
                    <Typography color="error" variant="body2">{e_msg(_error)}</Typography>:
                    null;

    },[activeId, ipfs.error, approve.error, predict.error, create.error]);

    const padAddress = useMemo(()=>create.reciept && parseAddress(create.reciept.logs[4].topics[2]),[create.reciept]);

    return (
        <Dialog open={true} onClose={(_loading||create.success)?null:onClose} maxWidth="xs" fullWidth>
            <DialogTitle>
                <Stack direction="row" justifyContent="space-between">
                    <Typography>LaunchPad Creation</Typography>
                    {_loading && <CircularProgress size={20}/>}
                </Stack>
            </DialogTitle>
            <DialogContent>
                <Stack spacing={1}>
                    <StepperContainer active={activeId} description={error}/>
                    {create.success && <Alert color="success">SuccessFul</Alert>}
                    {create.success && 
                        <Button color="secondary"
                            component={Link}
                            href={`/launch/info/${padAddress}`}
                        >Preview</Button>
                        }
                </Stack>
            </DialogContent>
            <DialogActions>
                {!create.success && (!Boolean(cid)?
                    <Button disabled={ipfs.loading} onClick={ipfs.save}>Upload</Button>
                    :(
                        !approve.isApproved ? 
                            <Button disabled={approve.loading} onClick={()=>approve.write?.()}>Approve</Button>
                        :(
                            !create.success ? 
                                <Button disabled={create.loading} onClick={()=>create.write?.()}>Create</Button>
                                :(null)
                        )
                    )
                )}
            </DialogActions>
        </Dialog>
    )
}