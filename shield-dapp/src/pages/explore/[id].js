
import { Container, Stack, Typography, Backdrop, CircularProgress} from "@mui/material";

import FilterContainer,{useFilter} from "../../../components/FilterContainer";

import ListPriceSection from "../../../components/ListPriceSection";
import ListAuctionSection from "../../../components/ListAuctionSection";
import ListAllSection from "../../../components/ListAllSection";




export default ()=>{
    const {isReady, id} = useFilter();

    if(!isReady){
        return (    
            <Backdrop in={true}>
                <CircularProgress size={50}/>
            </Backdrop>
                );
    }

    return (
        <Container component={Stack} spacing={1} sx={{mt:4, mb:3}}> 
            <Typography variant="h4" fontWeight="bold">Explore</Typography>
            <FilterContainer/>
            <div>
                {id === 0 && <ListAllSection/>}
                {id === 1 && <ListPriceSection/>}
                {id === 2 && <ListAuctionSection/>}
            </div>
        </Container>
    );
}