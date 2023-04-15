import {useState} from "react";

import { TextField, DialogContentText } from "@mui/material";
import { Dialog, DialogActions, DialogTitle, DialogContent } from "@mui/material";
import { Button, Paper } from "@mui/material";
import { Typography } from "@mui/material";
import { Container, Box, Stack} from "@mui/material";

import Grid from "@mui/material/Unstable_Grid2";

import { UploadFileOutlined} from "@mui/icons-material";
import { Checkbox } from "@mui/material";


import TextInput from "../../components/BootStrapInput";

const DEMO_TEXT =  "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Error aperiam, dolor nesciunt dicta.";


import {temp_p} from "../../temp";

import Overlay from "../../components/Overlay";


const UploadSection = ()=>{

    const [imageUrl, setImage] = useState(temp_p[4]);

    const onFileChange = (e)=>{
        if(e.target.files[0]){
            URL.revokeObjectURL(imageUrl);
            setImage(URL.createObjectURL(e.target.files[0]));
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

    return (

        <Container>
            <Box mb={10}/>
            <Grid container spacing={3}>
               
                <Grid xs={12} md={3} mdOffset={1}>
                    <Stack spacing={2}>
                        <Typography>Upload File</Typography>
                        <Typography>Drag or choose your file to upload</Typography>

                        <UploadSection/>
                        
                    </Stack>
                </Grid>

                <Grid xs={12} md={7}>
                    <Paper sx={{p:3, bgcolor:"#111111", color:"#fff"}}>
                        <Stack spacing={3}>
                            <TextInput label="Product Name"/>
                            <TextInput multiline rows={3}  label="Description"/>
                            <Stack direction={{sm:"row"}} rowGap={3} columnGap={2} justifyContent="stretch">
                                <TextInput label="Item Price" fullWidth/>
                                <TextInput label="Item Size" fullWidth/>
                                <TextInput label="Item Properties" fullWidth/>
                            </Stack>
                            <TextInput label="Royalty"/>     
                            <Typography component={Stack} alignItems="center" direction="row"><Checkbox color="secondary"/> on Purchase Mint</Typography>
                            <Button sx={{
                                    color:"#000",
                                    borderColor:"#fff",
                                    "&:hover":{
                                        borderColor:"#fff",
                                        
                                    }}} variant="outlined" size="large">Create</Button>
                        </Stack>
                    </Paper>
                </Grid>

            </Grid>
        </Container>

    );
}



const DialogShow = ()=>{
    const [open, setOpen] = useState(true)
    return (
        <Dialog open={true} onClose={()=>setOpen(false)}>
            <DialogTitle>Placing Bid</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <Stack spacing={0.75} textAlign="justify">
                        <Typography>Bid place should be above reserved pricing</Typography>
                        <Typography>Previous Bid Amount: 34.29 ETH</Typography>
                        <Typography>Balance: 34.78 ETH</Typography>
                        <TextField variant="standard" name="bid_value" placeholder="Amount to bid (ETH)" type="number"/>
                    </Stack>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button>Bid</Button>
                <Button>Bid</Button>
            </DialogActions>
        </Dialog>
     )
}

