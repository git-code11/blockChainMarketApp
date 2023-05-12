import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useProfileUpdate, getProfile } from "../../context/hook/user/profile";
import { useAccount } from "wagmi";
import { CircularProgress, Snackbar } from "@mui/material";
import Alert from "@mui/material/Alert";

export default ()=>{

    const {address} = useAccount();

    const update = useProfileUpdate();

    const {register, handleSubmit} = useForm({
        defaultValues: ()=>getProfile(address)
    });

    const onSubmit = (data, e)=>{
        e.preventDefault();
        update.trigger(data);
    }

    return (
        <Container>
            <Box mb={3}/>
            <Stack direction="row" alignItems="center">
                <Typography>User Profile Update</Typography>
                {update.isLoading && <CircularProgress size={20}/>}    
            </Stack>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={3}>
                    <TextField placeholder="userName" {...register('name')}/>
                    <Button  disabled={update.isLoading} type="submit">Update</Button>
                </Stack>
            </form>

            <Snackbar open={!!update.error} onClose={()=>update.reset()}>
                <Alert severity="error">An Error Occured: {update.error?.message}</Alert>
            </Snackbar>

            <Snackbar open={!!update.data} onClose={()=>update.reset()}>
                <Alert>Updated Successfully</Alert>
            </Snackbar>
        </Container>
    )
}