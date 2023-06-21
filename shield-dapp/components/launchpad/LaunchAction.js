import { LoadingButton } from "@mui/lab"
import { Stack } from "@mui/material"
import useClaim from "../../context/hook/app/factory/launch/useClaim";
import useComplete from "../../context/hook/app/factory/launch/useComplete";


const CompleteAction = ({address})=>{
    
    const complete = useComplete({
        address
    });

    return (
        <LoadingButton 
        onClick={()=>complete.write?.()}
        disabled={!complete.write} loading={complete.loading}  variant="contained" size="small">
            <span>Complete</span>
        </LoadingButton>
    )
}

const ClaimAction = ({address})=>{

    const claim = useClaim({
        address
    });

    return (
        <LoadingButton 
        onClick={()=>claim.write?.()}
        disabled={!claim.write} loading={claim.loading} variant="contained" size="small">
            <span>Claim</span>
        </LoadingButton>
    )
}


export default ({address})=>{

    return (
        <Stack spacing={4} justifyContent="center" direction="row" mt={2}>
            <CompleteAction address={address}/>
            <ClaimAction address={address}/>
        </Stack>
    )
}