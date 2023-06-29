
import { Container, Box, Stack, Typography} from "@mui/material";

import DisplayBanner from "../../components/DisplayBanner";
import DisplayFaq from "../../components/DisplayFaq";

//import SwipeableDisplay from "../../components/SwipeableDisplay";

import AllListPriceSection from "../components/List/all/price";


export default ()=>{
    
    return (
        <Box sx={{mb:3}}>
            <DisplayBanner/>

            
            <Container component={Stack} spacing={4} sx={{mt:5}}>
                
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
                
                <AllListPriceSection/>
                
            </Container>
 

        </Box>
    );
}
