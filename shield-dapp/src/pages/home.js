
import { Container, Box, Stack, Typography} from "@mui/material";

import DisplayBanner from "../../components/DisplayBanner";
import DisplayFaq from "../../components/DisplayFaq";

//import SwipeableDisplay from "../../components/SwipeableDisplay";

import ListPriceSection from '../../components/ListPriceSection';


export default ()=>{
    
    return (
        <Container component={Stack} spacing={4} sx={{mt:4, mb:3}}>
            <DisplayBanner/>
            
           {/* 
           <Box>
                <Typography variant="h4" fontWeight="bold" mb={5}>Live Biding</Typography>
                <SwipeableDisplay/>
            </Box>
            */}

            <Box>
                <Typography variant="h4" mb={8} fontWeight="bold">Create and Sell Your NFT</Typography>
                <DisplayFaq/>
            </Box>
            
            <ListPriceSection/>
            
        </Container>

    );
}
