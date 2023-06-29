import {useState, useCallback, useMemo} from "react";
import { Button, Paper, Container, Stack, Typography, MenuItem} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import UploadFileOutlined from "@mui/icons-material/UploadFileOutlined";
import TextInput from "../../components/ControlledInput";
import { FormProvider, useFormContext } from "react-hook-form";
import {temp_p} from "../../temp";
import Overlay from "../../components/Overlay";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import {useAccount} from "wagmi"

import _contract from "../../contract/address.js";

import NFTCreateDialog from '../../components/dialog/createItem';

import { constants } from "ethers";
import exchangeCurrency from'../../currency-list';
import categoryList from'../../category-list';

import ModalProvider,{useModal} from "../../context/modal";

const TEMP_IMG = temp_p[4];

const schema = yup.object({
    name: yup.string().required("Name field required"),
    description:yup.string().required("Description field required"),
    file:yup.mixed().test({
        name:"File Test",
        test:value=>value?.length > 0,
        message:"File needed"
    }),
    sale:yup.object({
        price:yup.number().min(0).required(),
        currency:yup.string().required(),
    }).required(),
    category:yup.string().required('category required'),
    cid:yup.string(),
}).required();


const UploadSection = ()=>{
    const {register, setValue} = useFormContext();

    const [imageUrl, setImage] = useState(TEMP_IMG);

    const setImageBlob = useCallback((e)=>{
        URL.revokeObjectURL(imageUrl);
        if(e.target.files[0]){
            setImage(URL.createObjectURL(e.target.files[0]));
            setValue('cid','');//clear cid values
        }else if(imageUrl !== TEMP_IMG){
            setImage(TEMP_IMG);
        }
    },[]);

    const opts = register('file', {
            onChange:setImageBlob
        });

    return (
        <Stack justifyContent="center" alignItems="center" position="relative"
            sx={{border:"dashed 2px #575767", borderRadius:2}}
        >
            <input hidden  type="file" id="___upload_file_input__" {...opts}/>
            <Overlay component="img"  src={imageUrl} width="100%" height={300} bgcolor="#000"/>
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

const ContainerWrapper =  ({modal})=>{  
    
    const {isConnected} = useAccount();

    const methods = useFormContext();
    
    const onSubmit = useCallback((data, e)=>{
        e.preventDefault();
        if(methods.trigger()){
            //if method valid open modal
            
            modal.toggle();
        }
    },[methods.trigger, modal.toggle]);

    //const submitBtnDisabled = useMemo(()=>!(methods.formState.isDirty && methods.formState.isValid),[methods]);

    return (
    <Container 
        sx={{
            my:4
        }}
        component="form" onSubmit={methods.handleSubmit(onSubmit)}>      
        
            <Grid container 
                rowGap={4}
                direction={{xs:"column", md:"row"}}
                justifyContent="space-between"
                >
            
                <Grid md={3} lgOffset={1}>
                    <Stack spacing={1} fontWeight="bold">
                        <Typography>Upload File</Typography>
                        <Typography>Drag or choose your file to upload</Typography>
                    
                        <UploadSection/>
                        { methods.formState.errors.file && 
                            <Typography color="error">
                                {methods.formState.errors.file?.message}
                            </Typography>
                        }
                    </Stack>
                </Grid>

                <Grid 
                    container md={7} 
                    direction="column" spacing={3}
                    component={Paper} m={0}
                    sx={{bgcolor:"#111111", color:"#fff"}}>
                    
                    <Grid>
                        <TextInput label="Product Name" name="name"/>
                    </Grid>
                    
                    <Grid>
                        <TextInput multiline rows={3}  label="Description" name="description"/>
                    </Grid>

                    <Grid>
                        <TextInput label="Category" select name="category">
                            {Object.entries(categoryList).map(
                                    ([key, value])=>
                                        <MenuItem key={value} value={value}>
                                            {key}
                                        </MenuItem>
                                    )
                            }
                        </TextInput>
                    </Grid>
                    

                    {/* <Grid container spacing={2} direction={{xs:"column", md:"row"}}>
                        <Grid md={6}>
                            <TextInput label="Item Size" fullWidth name="properties.size"/>
                        </Grid>
                        <Grid md={6}>
                            <TextInput label="Item Properties" fullWidth name="properties.more"/>
                        </Grid>
                    </Grid> */}
                        
                    <Grid  container spacing={2} direction={{xs:"column", md:"row"}}>
                        <Grid md={6}>
                            <TextInput label="Price" name="sale.price"/>
                        </Grid>
                        <Grid md={6}>
                            <TextInput label="Currency" select name="sale.currency">
                                {Object.entries(exchangeCurrency).map(
                                        ([key, value])=>
                                            <MenuItem key={value} value={value}>
                                                {key}
                                            </MenuItem>
                                        )
                                }
                            </TextInput>
                        </Grid>  
                    </Grid>


                    <Grid>
                        <Stack>
                            <Button 
                                disabled={!isConnected}
                                type="submit" 
                                sx={{
                                    color:"#fff",
                                    borderColor:"#fff",  
                                    "&:hover":{
                                        borderColor:"#fff",
                                        
                                }}} variant="outlined" size="large">Create</Button>
                        </Stack>
                    </Grid>
                </Grid>
                
            </Grid>
        
    </Container>
    );
}


const PageContainer =  ()=>{
    const methods = useForm({
        mode:"onChange",
        resolver: yupResolver(schema),
        defaultValues:{
            name:"",
            description:"",
            file:"",
            properties:{},
            sale:{
                currency:constants.AddressZero,
                price:0,
            },
            category:"",
            cid:"",
            
        }
    });

    const modal = useModal("createItem");
    
    return (
    
        <FormProvider {...methods}>
            <ContainerWrapper modal={modal}/>
           { modal.visible && 
            <NFTCreateDialog modal={modal} form={methods}/>
            }
        </FormProvider>
    
    )
}

export default ()=>
    <ModalProvider>
        <PageContainer/>
    </ModalProvider>