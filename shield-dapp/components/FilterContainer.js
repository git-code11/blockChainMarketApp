import {useState, useCallback} from "react";

import Router, { useRouter } from "next/router";

import { Typography, MenuItem, TextField, Box, Stack,Button } from "@mui/material";

import Grid from "@mui/material/Unstable_Grid2";

import {FilterAltOffRounded, FilterAltRounded} from "@mui/icons-material"

import {IconButton, Slider, Collapse} from "@mui/material";

const filter_categoryTag = "Art".split(',');
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
    const {id, goTo} = useFilter();
    
    return (
            <Grid container py={1} spacing={3} justifyContent="end">
                <Grid xs={12} md={4}>
                    <Typography pb={1} variant="caption">CATEGORY TAG</Typography>
                    <TextField select fullWidth defaultValue={filter_categoryTag[0]}>
                        {filter_categoryTag.map(d=><MenuItem key={d} value={d}>{d}</MenuItem>)}
                    </TextField>
                </Grid>

                <Grid xs={12} md={4}>
                    <Typography pb={1} variant="caption">SALE TYPE</Typography>
                    <TextField select fullWidth value={id} onChange={e=>goTo(+e.target.value)}>
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


export const useFilter = ()=>{
    const {isReady, query:{id}} = useRouter();
    const _max = 3;
    const _id = (+id||0)%_max;

    const goTo = useCallback((id)=>Router.push(`/explore/${(+id||0)%_max}`));

    return {id:_id, isReady, goTo}
}

export default FilterContainer;