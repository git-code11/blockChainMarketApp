import {useState} from "react";
import { Box, Stack } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import {useMediaQuery, MobileStepper, useTheme} from "@mui/material";
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import ItemBid from "./Item/Bid";

import { temp_c, temp_p } from "../temp";

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);


const ListSlideRender = ({index})=>{
    const theme = useTheme();
    const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));
    const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
    const totalRecord = 5;
    const _size = isMdUp?3:(isSmUp?2:1);
    const base = index * _size;
   
    return(
        <Box px={4} pb={4} >
            <Grid container justifyContent="space-evenly" spacing={2}>
                
                    {Array(_size).fill(0).map((d,_i)=>{
                        const i = (_i + base)%totalRecord;
                        return  (
                        <Grid key={_i} xs={12} sm={6} md={4} lg={3}>
                            <ItemBid image={temp_p[i]} name="Futuristic Tunnel #205" currentBidBase="$34.56" noOfBidPlaced={(i+34*i%33)}
                                creatorName="Angelina Franca" last3TopBiddersImage={temp_c.slice(i%2, i%2 + 3)}/>
                        </Grid>
                        )}
                        )}
                
            </Grid>
        </Box>
    )
}

const SwipeableDisplay = ()=>{
    const [activeStep, updateStep] = useState(0);

    return (
    <Box>
        <AutoPlaySwipeableViews
        index={activeStep}
        onChangeIndex={updateStep}
        enableMouseEvents
      >
            {Array(5).fill(0).map((d,i)=><ListSlideRender key={i} index={i}/>)}
        </AutoPlaySwipeableViews>
        <Stack alignItems="center">
            <MobileStepper variant="dots" steps={5} activeStep={activeStep} position="static"/>
        </Stack>
    </Box>
    );
}

export default SwipeableDisplay;