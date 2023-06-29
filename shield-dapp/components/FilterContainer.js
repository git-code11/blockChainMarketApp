import {useState, useCallback} from "react";

import Router, { useRouter } from "next/router";

import { Typography, MenuItem, TextField, Box, Stack,Button } from "@mui/material";

import Grid from "@mui/material/Unstable_Grid2";

import {FilterAltOffRounded, FilterAltRounded} from "@mui/icons-material"

import {IconButton, Slider, Collapse} from "@mui/material";

import categoryList from "../category-list";

const filter_categoryTag = ["ALL", ...Object.keys(categoryList)];
const filter_saleType = "ALL, Fixed Price, Live Auction".split(',');

const FilterContainer = ()=>{
    const [open, setOpen] = useState(false);

    return (
        <Box>
            <Stack alignItems="end">
                <IconButton onClick={()=>setOpen(e=>!e)} color="primary">
                    {open?<FilterAltOffRounded/>:<FilterAltRounded/>}
                </IconButton>
            </Stack>
            <Collapse in={open}>
                <FilterMenu/>
            </Collapse>
        </Box>
    );
}




const FilterMenu = ()=>{
    const {id, catEnabled, catId, goTo} = useFilter();

    return (
            <Grid container py={1} spacing={3} justifyContent="end">
                <Grid xs={12} md={4}>
                    <Typography pb={1} variant="caption">CATEGORY TAG</Typography>
                    <TextField select fullWidth value={catId} onChange={e=>goTo(id, true, e.target.value)}
                    >
                        {filter_categoryTag.map((d, i)=><MenuItem key={d} value={i}>{d}</MenuItem>)}
                    </TextField>
                </Grid>

                <Grid xs={12} md={4}>
                    <Typography pb={1} variant="caption">LIST TYPE</Typography>
                    <TextField select fullWidth value={id} onChange={e=>goTo(e.target.value)}>
                        {filter_saleType.map((d, i)=><MenuItem key={d} value={i}>{d}</MenuItem>)}
                    </TextField>
                </Grid>

                {/*<Grid xs={12} md={4}>
                    <Box>
                        <Typography pb={1} variant="caption">PRICE RANGE</Typography>
                        <Slider
                            getAriaLabel={() => 'Temperature range'}
                            defaultValue={[23, 56]}
                        />
                    </Box>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle2">Price $230 - $300</Typography>
                        <Button size="small" variant="contained">filter</Button>
                    </Stack>
                </Grid>*/}
            </Grid>
    );
}

const normId = id=> (Number(id)||0)%filter_saleType.length;

const normCatId = id=> (Number(id)||0)%filter_categoryTag.length;

//to boolean
const normCatEnabledBool = id=>Boolean(Number(id))

//to number
const normCatEnabledNum = bool=>Number(Boolean(bool))

export const useFilter = ()=>{
    const {isReady, query:{id:_id, cat, category:_category}} = useRouter();
    const id = normId(_id);
    const catId = normCatId(_category);
    const catEnabled = normCatEnabledBool(cat) && catId !== 0;
    
    const category = categoryList[filter_categoryTag[catId]]??"";

    const goTo = useCallback((id, catEnabled=false, category=0)=>
                    Router.push(`/explore/${normId(id)}/${normCatEnabledNum(catEnabled)}?category=${normCatId(category)}`),[]);

    return {id, catId, catEnabled, category, isReady, goTo}
}

export default FilterContainer;