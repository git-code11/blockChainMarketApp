import { LoadingButton } from "@mui/lab"
import { Stack, Alert } from "@mui/material"
import useClaim from "../../context/hook/app/factory/launch/useClaim";
import useComplete from "../../context/hook/app/factory/launch/useComplete";
import e_msg from "../../context/lib/e_msg";

const CompleteAction = ({address})=>{
    
    const complete = useComplete({
        address
    });

    return (
        <Stack spacing={1}>
            {complete.error &&
                <Alert color="error">{e_msg(complete.error)}</Alert>
            }

            {complete.success &&
                <Alert>success</Alert>
            }

            <LoadingButton 
                onClick={()=>complete.write?.()}
                disabled={!complete.write} loading={complete.loading}  variant="contained" size="small">
                <span>Complete</span>
            </LoadingButton>
        </Stack>
        
    )
}

const ClaimAction = ({address})=>{

    const claim = useClaim({
        address
    });

    
    return (

    <Stack spacing={1}>
        {claim.error &&
            <Alert color="error">{e_msg(claim.error)}</Alert>
        }

        {claim.success &&
            <Alert>success</Alert>
        }

        <LoadingButton 
        onClick={()=>claim.write?.()}
        disabled={!claim.write} loading={claim.loading} variant="contained" size="small">
            <span>Claim</span>
        </LoadingButton>
    
    </Stack>
    )
}


export default ({address})=>{

    return (
        <Stack spacing={1} justifyContent="center" direction="column" mt={2}>
            <CompleteAction address={address}/>
            <ClaimAction address={address}/>
        </Stack>
    )
}