
import { Container, Box, Stack, Typography} from "@mui/material";

import Grid from "@mui/material/Unstable_Grid2";

import {temp_c, temp_p} from "../../temp";

import FilterContainer from "../../components/FilterContainer";
import ItemBid from "../../components/Item/Bid";
import Item from "../../components/Item/ListPrice";
import Sal,{useSal} from "../../components/SalBox";

export default ()=>{
    useSal();
    return (
        <Container component={Stack} spacing={1} sx={{mt:4, mb:3}}> 
            <Typography variant="h4" fontWeight="bold">Explore</Typography>
            <FilterContainer/>
            <Grid container spacing={2} rowSpacing={3}>
                <ListPriceSection/>
                <BidSection/>
            </Grid>
        </Container>

    );
}


const ListPriceSection = ()=>{
    return (
        <>
                {Array(6).fill(0).map((d,i)=>
                    <Grid key={i} xs={12} sm={6} md={4} lg={3}  justifyContent="space-evenly">
                        <Sal>
                            <Item image={temp_p[i%5]} name="Futuristic Tunnel #205" price="34.5BNB" 
                                    basePrice="$34.56" creator="0xe843882488347738826688"
                                    creatorImage={temp_c[i%5]}/>
                        </Sal>
                    </Grid>
                )}
        </>
    );
}


const BidSection = ()=>{
    return (
       <>
                {Array(6).fill(0).map((d,i)=>
                    <Grid key={i} xs={12} sm={6} md={4} lg={3}  justifyContent="space-evenly">
                        <Sal>
                            <ItemBid image={temp_p[i%5]} name="Futuristic Tunnel #205" currentBidBase="$34.56" noOfBidPlaced={(i+34*i%33)}
                                    creatorName="Angelina Franca" last3TopBiddersImage={temp_c.slice(i%2, i%2 + 3)}/>
                        </Sal>
                    </Grid>
                )}
        </>
    );
}
