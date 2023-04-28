import {useState, useCallback} from 'react';
import { Container, Box, Stack, Typography} from "@mui/material";

import Grid from "@mui/material/Unstable_Grid2";

import {temp_c, temp_p} from "../../temp";

import DisplayBanner from "../../components/DisplayBanner";
import DisplayFaq from "../../components/DisplayFaq";

import SwipeableDisplay from "../../components/SwipeableDisplay";
import ItemBid from "../../components/Item/Bid";

import Sal,{useSal} from "../../components/SalBox";

import ListPriceSection from '../../components/ListPriceSection';
import BidSection from '../../components/BidSection';

export default ()=>{
    //useSal();
    
    return (
        <Container component={Stack} spacing={4} sx={{mt:4, mb:3}}>
            <DisplayBanner/>
            
            <Box>
                <Typography variant="h4" fontWeight="bold" mb={5}>Live Biding</Typography>
                {/*<SwipeableDisplay/>*/}
            </Box>

            <Box>
                <Typography variant="h4" mb={8} fontWeight="bold">Create and Sell Your NFT</Typography>
                <DisplayFaq/>
            </Box>
            
            <ListPriceSection/>
            
            {/**TODO: LIVE BIDDING MUST BE IMPLEMENTED */}
            {/*<BidSection/>*/}
            
        </Container>

    );
}

