import Typography from '@mui/material/Typography';
import Grid from "@mui/material/Unstable_Grid2";
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import ItemBid from "./Item/Bid";


import { useContractRead } from 'wagmi';

import saleAbi from '../contract/Sale.sol/MarketSales.json';
import _contract from '../contract/address.js';

import {temp_c, temp_p} from "../temp";


const BidSection = ()=>{
    return (
        <Box>
            <Typography variant="h4" mb={4} fontWeight="bold">Live Bidding</Typography>
            <Grid container spacing={2} rowSpacing={3}>
                {Array(6).fill(0).map((d,i)=>
                    <Grid key={i} xs={12} sm={6} md={4} lg={3}  justifyContent="space-evenly">
                        <ItemBid image={temp_p[i%5]} name="Futuristic Tunnel #205" currentBidBase="$34.56" noOfBidPlaced={(i+34*i%33)}
                            creatorName="Angelina Franca" last3TopBiddersImage={temp_c.slice(i%2, i%2 + 3)}/>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
}


export default BidSection;