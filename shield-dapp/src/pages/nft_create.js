import {useState, useEffect, useCallback} from "react";
import { Button, Paper, Container, Stack, Typography, Checkbox, Box, MenuItem} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import UploadFileOutlined from "@mui/icons-material/UploadFileOutlined";
import TextInput from "../../components/ControlledInput";
import { FormProvider, useFormContext } from "react-hook-form";
import {temp_p} from "../../temp";
import Overlay from "../../components/Overlay";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

import _contract from "../../contract/address.json";

import NFTCreateDialog from '../../components/dialog/createItem';
import Provider, { useDataContext } from "../../components/dialog/context";
import { constants } from "ethers";
import exchangeCurrency from'../../currency-list';


import Collapse from "@mui/material/Collapse";

const schema = yup.object({
    name: yup.string().required("Name field required"),
    description:yup.string().required("Description field required"),
    file:yup.mixed().test({
        name:"File Test",
        test:value=>{
            return value?.length > 0;
        },
        message:"File needed"
    }),
    sale:yup.object({
        price:yup.number().required(),
        currency:yup.string().required(),
    }).required(),
}).required();

const UploadSection = ()=>{
    const {register} = useFormContext();

    const [imageUrl, setImage] = useState(temp_p[4]);

    const setImageBlob = (e)=>{
        if(e.target.files[0]){
            URL.revokeObjectURL(imageUrl);
            setImage(URL.createObjectURL(e.target.files[0]));
        }
    }

    const opts = register('file', {
            onChange:(e)=>{
                setImageBlob(e);
            }
        });

    return (
        <Stack justifyContent="center" alignItems="center" position="relative"
            sx={{border:"dashed 2px #575767", borderRadius:2, overflow:"hidden"}}
        >
            <input hidden  type="file" id="___upload_file_input__" {...opts}/>
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

const ContainerWrapper =  ()=>{    
    const {show} = useDataContext();
    const methods = useFormContext();
    
    const [forSale, setForSale] = useState(false);
    
    const onSubmit = useCallback((e)=>{
        e.preventDefault();
        if(methods.trigger())
            show("createItem");
    },[methods, show]);

    return (

        <Container>
            <Box mb={3}/>
            <FormProvider {...methods}>
                <form onSubmit={onSubmit}>
                    <Grid container spacing={3}>
                    
                        <Grid xs={12} md={3} mdOffset={1}>
                            <Stack spacing={2}>
                                <Typography>Upload File</Typography>
                                <Typography>Drag or choose your file to upload</Typography>
                            
                                <UploadSection/>
                                {methods.formState.errors.file && <Typography color="error">{methods.formState.errors.file?.message}</Typography>}
                            </Stack>
                        </Grid>

                        <Grid component={Paper} md={7} sx={{bgcolor:"#111111", color:"#fff"}}>
                            <Grid>
                                <TextInput label="Product Name" name="name"/>
                            </Grid>
                            
                            <Grid>
                                <TextInput multiline rows={3}  label="Description" name="description"/>
                            </Grid>
                            
                            <Grid container>
                                <Grid md={6}>
                                    <TextInput label="Item Size" fullWidth name="properties.size"/>
                                </Grid>
                                <Grid md={6}>
                                    <TextInput label="Item Properties" fullWidth name="properties.more"/>
                                </Grid>
                            </Grid>
                            
                            <Collapse in={forSale} unmountOnExit>
                                <Grid container>
                                    <Grid md={6}>
                                        <TextInput label="Price" fullWidth name="sale.price"/>
                                    </Grid>
                                    <Grid md={6}>
                                        <TextInput label="Currency" select fullWidth name="sale.currency">
                                            {Object.entries(exchangeCurrency).map(([key, value])=><MenuItem key={value} value={value}>{key}</MenuItem>)}
                                        </TextInput>
                                    </Grid>  
                                </Grid>
                            </Collapse>

                            <Grid>
                                <Typography component={Stack} alignItems="center" direction="row">
                                    <Checkbox color="secondary" onChange={()=>{
                                        setForSale(d=>!d);
                                    }}/>show price
                                </Typography>
                            </Grid>

                            <Grid>
                                <Button 
                                    disabled={!(methods.formState.isDirty && methods.formState.isValid)}
                                    type="submit" 
                                    sx={{
                                        color:"#fff",
                                        borderColor:"#fff",  
                                        "&:hover":{
                                            borderColor:"#fff",
                                            
                                    }}} variant="outlined" size="large">Create</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </form>
            </FormProvider>

        </Container>

    );
}


export default ()=>{
    const methods = useForm({
        mode:"onChange",
        resolver: yupResolver(schema),
        defaultValues:{
            sale:{
                currency:constants.AddressZero,
                price:0,
            }
        }
    });

    return (
    <Container>
        <Provider globalData={{getData:methods.getValues}}>
            <FormProvider {...methods}>
                <ContainerWrapper/>
                <NFTCreateDialog id="createItem"/>
            </FormProvider>
        </Provider>
    </Container>
    )
}