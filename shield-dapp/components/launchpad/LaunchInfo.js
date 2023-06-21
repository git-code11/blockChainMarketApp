import { useMemo } from "react";
import Stack from "@mui/material/Stack"
import Grid from "@mui/material/Unstable_Grid2"
import Card from "@mui/material/Card"
import Backdrop from "@mui/material/Backdrop"
import CircularProgress from "@mui/material/CircularProgress"
import CardContent from "@mui/material/CardContent"
import Container from "@mui/material/Container"
import LaunchAction from "./LaunchAction";
import LaunchPurchaseForm from "./LaunchPurchaseForm";
import BasicInfo from "./view/BasicInfo";
import RateInfo from "./view/RateInfo";
import { useGetInvestedAmount } from "../../context/hook/app/factory/launch/padInfo";
import useLaunchInfo from './useLaunchInfo';
import PoolInformation from "./view/PoolInformation";
import {useAccount} from 'wagmi'
import { formatEther } from "ethers/lib/utils.js";
import { useRemainAmountIn } from "../../context/hook/app/factory/launch/useAmountIn";

export default ({address})=>{

    const {isConnected} = useAccount();
    const {parsedData, loading, detail} = useLaunchInfo({address});
    
    const {data:_investedAmount} = useGetInvestedAmount({address});
    const {data:_remainAmount} = useRemainAmountIn({address});
    
    const investedAmount = useMemo(()=>_investedAmount && formatEther(_investedAmount),[_investedAmount]);
    const remainAmount = useMemo(()=>_remainAmount && formatEther(_remainAmount),[_remainAmount]);
    
    if(loading){
        return <Backdrop open={true}>
            <CircularProgress/>
        </Backdrop>
    }

    return(
    <Container sx={{my:4}}>
        <Grid container spacing={4}>

            <Grid xs={12} md={4}>
                <Card>
                    <CardContent>
                        <Stack>
                            <BasicInfo detail={detail} data={parsedData}/>
                            <LaunchAction data={parsedData} address={address}/>
                        </Stack>
                    </CardContent>
                </Card>
            </Grid>

            <Grid xs={12} md={4}>
                <Stack>
                    <Card>
                        <CardContent>
                            {
                                isConnected &&
                                <RateInfo data={parsedData} investedAmount={investedAmount} remainAmount={remainAmount}/>
                            }
                            
                            {   
                                isConnected &&
                                <LaunchPurchaseForm address={address} data={parsedData}/>
                            }
                        </CardContent>
                    </Card>
                </Stack>
            </Grid>
            
            <Grid xs={12} md={4}>
                <PoolInformation data={parsedData}/>
            </Grid>

        </Grid>
    </Container>
    )
}