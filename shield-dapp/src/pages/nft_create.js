import {useState, useEffect, useCallback, useRef, useMemo} from "react";

import { Button, Paper, Container, Stack, Typography, Checkbox, Box} from "@mui/material";

import Grid from "@mui/material/Unstable_Grid2";

import UploadFileOutlined from "@mui/icons-material/UploadFileOutlined";

import TextInput from "../../components/ControlledInput";

import { FormProvider, useFormContext } from "react-hook-form";

const DEMO_TEXT =  "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Error aperiam, dolor nesciunt dicta.";

import {temp_p} from "../../temp";

import Overlay from "../../components/Overlay";

import { useForm } from "react-hook-form";

import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";


//import {useMemo, useCallback} from 'react';
//import Typography from "@mui/material/Typography";
//import Stack from "@mui/material/Stack";
import Dialog from "@mui/material/Dialog";
//import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Alert from "@mui/material/Alert";

import { StepImage, StepSection } from "../../components/StepProcess";

import {useIpfsStore} from "../../context/lib/ipfs";;


import _addr from "../../contract/address.json";
import nftAbi from "../../contract/NFT.sol/NFT.json";
import saleAbi from "../../contract/Sale.sol/MarketSales.json";


import {constants} from "ethers";

import { prepareWriteContract, writeContract, getAccount, watchContractEvent } from "wagmi/actions";

import { useRouter } from "next/router";


const NFTCreateDialog =  ({getData, open, setOpen})=>{

    const router = useRouter();

    const [gData, setData] = useState({});

    const [_market, updateMarket] = useState({});

    const [_approve, updateApprove] = useState({});

    const {trigger, ..._ipfs} = useIpfsStore(d=>onAddMarket(d));

    const onUpload = useCallback(async ()=>{
        const data = await getData();
        trigger(data);
    },[trigger, getData]);

    const onApprove = useCallback(async (data)=>{
        updateApprove({isLoading:true});
        setData(d=>({...d, market:data}));
        try{
            const config = await prepareWriteContract({
                address:_addr.nft,
                abi:nftAbi.abi,
                functionName:"approve",
                args:[_addr.sale, data]
            });
            const result = await writeContract(config);
            const reciept = await result.wait()
            updateApprove({isSuccess:true});
        }catch(err){
            updateApprove({error:err, isError:true});
        }

    },[setData, updateApprove]);

    const onAddMarket = useCallback(async (data)=>{
        updateMarket({isLoading:true});
        setData(d=>({...d, ipfs:data}));
        try{
            const {address:userAddress} = getAccount();
            
            const config = await prepareWriteContract({
                address:_addr.sale,
                abi:saleAbi.abi,
                functionName:"createItem",
                args:[userAddress, userAddress, data?.ipnft, 0, constants.AddressZero, 0]
            });
            
            const result = await writeContract(config);
            
            let unwatch;
            unwatch = watchContractEvent({
                address:_addr.nft,
                abi:nftAbi.abi,
                eventName:"Transfer",
            },(from, to, itemId, ...args)=>{
                updateMarket({isSuccess:true});
                if(from === constants.AddressZero && to === userAddress){
                    unwatch();
                    onApprove(itemId);
                }
            });
            const reciept = await result.wait();
        }catch(err){
            updateMarket({error:err, isError:true});
        }

    },[updateMarket, setData, onApprove]);


    const hasLoading = _ipfs.isLoading  || _market.isLoading || _approve.isLoading;


    return (
        <Dialog open={open} onClose={()=>hasLoading || _approve.isSuccess || setOpen(false)} fullWidth>
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
                            loading={_market.isLoading}
                            status={(_market.isSuccess&&"success") || (_market.isError && "error")}
                        />
                        <Stack>
                            <Typography>Add To market</Typography>
                            {_market.isError &&
                                <>
                                    <Alert severity="error">{_market.error?.message}</Alert>
                                    <Typography component={Link} onClick={()=>onAddMarket(gData.ipfs)} variant="caption">retry</Typography>
                                </>
                            }
                        </Stack>
                    </StepSection>

                    <StepSection>
                        <StepImage
                            loading={_approve.isLoading}
                            status={(_approve.isSuccess &&"success") || (_approve.isError && "error")}
                        />
                        <Stack>
                            <Typography>Give Market Permission</Typography>
                            {_approve.isError &&
                                    <>
                                        <Alert severity="error">{_approve.error?.message}</Alert>
                                        <Typography component={Link} onClick={()=>onApprove(gData.market?.toString())} variant="caption">retry</Typography>
                                    </>
                            }
                            </Stack>
                    </StepSection>
                </Stack>
                {_approve.isSuccess?<Button variant="outlined" onClick={()=>router.replace(`/item/${gData.market?.toString()}`)}>Preview</Button>:
                <Button disabled={!!(_ipfs.data || _ipfs.isLoading)} variant="outlined" onClick={onUpload}>Proceed</Button>}
            </Stack>
        </Dialog>
     )
}

//import NFTCreateDialog from "../../components/NFTCreateDialog";


const schema1 = yup.object({
  name: yup.string().required(),
  description: yup.string().required(),
  file:yup.string().required(),
  properties:yup.object({
    size:yup.number().positive().integer().required(),
    more:yup.string().required()
  })
}).required();

const schema = yup.object({});

const UploadSection = ()=>{
    const {setValue, register, clearErrors} = useFormContext();

    useEffect(()=>{
        register('file');
    },[]);

    const [imageUrl, setImage] = useState(temp_p[4]);

    const onFileChange = (e)=>{
        if(e.target.files[0]){
            URL.revokeObjectURL(imageUrl);
            setImage(URL.createObjectURL(e.target.files[0]));
            
            clearErrors('file');
            setValue('file', e.target.value);
        }
    }

    return (
        <Stack justifyContent="center" alignItems="center" position="relative"
            sx={{border:"dashed 2px #575767", borderRadius:2, overflow:"hidden"}}
        >
            <input hidden type="file" name="file" id="___upload_file_input__" onChange={onFileChange}/>
            <Overlay component="img"  src={imageUrl} width="100%" height={300} bgcolor="#cb3"/>
            <Stack component="label" 
                    htmlFor="___upload_file_input__"
                    spacing={1}
                    sx={{
                        position:"absolute",
                        alignItems:"center",
                        justifyContent:"center",
                        textAlign:"center",
                        p:2,
                        height:"100%",
                        color:"#eee",
                        transition:theme=>theme.transitions.create('transform'),
                        cursor:"pointer",
                        "&:hover":{
                            transform:"scale(0.9)"
                           
                        }
                    }}>
                <UploadFileOutlined fontSize="large"/>
                <Typography>Upload File</Typography>
                <Typography variant="subtitle1">PNG, GIF, WEBP, MP4 or MP3.</Typography>
            </Stack>
        </Stack>

    );
}

export default ()=>{

    const [dialogOpen, setDialogOpen] = useState(false);

    const formRef = useRef();
    const methods = useForm({
        resolver: yupResolver(schema)
    });

    
    //const {data:_data} = useIpfsData('bafyreifvh77tyggjtsnk66atzhpmm2kgtjxmqwp6s3grhfzbqk4nh5vt6q')
    //console.log("data", _data);

    const onSubmit = useCallback((_, e)=>{
        e.preventDefault();
        setDialogOpen(true);
    },[setDialogOpen]);

    const getData = useCallback(()=>new Promise((_func)=>{
        methods.handleSubmit((_data)=>{
            const data = {..._data};
            data.image = formRef.current.elements.file.files[0];
            _func(data);
        })();
    }),[methods.handleSubmit, formRef.current]);

    return (

        <Container>
            <Box mb={3}/>
            <FormProvider {...methods}>
                <form ref={formRef} onSubmit={methods.handleSubmit(onSubmit)}>
                    <Grid container spacing={3}>
                    
                        <Grid xs={12} md={3} mdOffset={1}>
                            <Stack spacing={2}>
                                <Typography>Upload File</Typography>
                                <Typography>Drag or choose your file to upload</Typography>
                            
                                <UploadSection/>
                                {methods.formState.errors.file && <Typography color="error">{methods.formState.errors.file?.message}</Typography>}
                            </Stack>
                        </Grid>

                        <Grid xs={12} md={7}>
                            <Paper sx={{p:3, bgcolor:"#111111", color:"#fff"}}>
                                <Stack spacing={3}>
                                    <TextInput label="Product Name" name="name"/>
                                    <TextInput multiline rows={3}  label="Description" name="description"/>
                                    <Stack direction={{sm:"row"}} rowGap={3} columnGap={2} justifyContent="stretch">
                                        <TextInput label="Item Price" fullWidth name="price"/>
                                        <TextInput label="Item Size" fullWidth name="properties.size"/>
                                        <TextInput label="Item Properties" fullWidth name="properties.more"/>
                                    </Stack>
                                    <TextInput label="Royalty" name="royalty"/>     
                                    <Typography component={Stack} alignItems="center" direction="row"><Checkbox color="secondary"/> on Purchase Mint</Typography>
                                    <Button type="submit" sx={{
                                            color:"#fff",
                                            borderColor:"#fff",
                                            "&:hover":{
                                                borderColor:"#fff",
                                                
                                            }}} variant="outlined" size="large">Create</Button>
                                </Stack>
                            </Paper>
                        </Grid>

                    </Grid>
                </form>
            </FormProvider>
            
            <NFTCreateDialog getData={getData} setOpen={setDialogOpen} open={dialogOpen}/>

        </Container>

    );
}