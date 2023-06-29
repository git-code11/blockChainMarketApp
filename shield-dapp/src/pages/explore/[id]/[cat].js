
import { Container, Stack, Typography, Backdrop, CircularProgress} from "@mui/material";
import { useRouter } from "next/router";
import FilterContainer,{useFilter} from "../../../../components/FilterContainer";

import AllListMainSection from "../../../../components/List/all/main";
import CatListMainSection from "../../../../components/List/category/main";

import AllListPriceSection from "../../../../components/List/all/price";
import CatListPriceSection from "../../../../components/List/category/price";


import AllListAuctionSection from "../../../../components/List/all/auction";
import CatListAuctionSection from "../../../../components/List/category/auction";


// /id/cat
// /Id

const FilterPage = ()=>{

    const {id, catEnabled, category} = useFilter();

    if(id === 1){
        //price
        return catEnabled?<CatListPriceSection category={category}/>:<AllListPriceSection/>
    }else if(id === 2){
        //auction
        return catEnabled?<CatListAuctionSection category={category}/>:<AllListAuctionSection/>
    }else{
        //main
        return catEnabled?<CatListMainSection category={category}/>:<AllListMainSection/>
    }
}


export default ()=>{
    const {isReady} = useRouter();

    // if(!isReady){
    //     return (    
    //         <Backdrop in={true}>
    //             <CircularProgress size={50}/>
    //         </Backdrop>
    //             );
    // }
    if(!isReady)
        return <div></div>

    return (
        <Container component={Stack} spacing={1} sx={{mt:4, mb:3}}> 
            <Typography variant="h4" fontWeight="bold">Explore</Typography>
            <FilterContainer/>
            <FilterPage/>
        </Container>
    );
}