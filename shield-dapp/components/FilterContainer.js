import {useState} from "react";

import { Typography, MenuItem, TextField, Box, Stack,Button } from "@mui/material";

import Grid from "@mui/material/Unstable_Grid2";

import {FilterAltOffRounded, FilterAltRounded} from "@mui/icons-material"

import {IconButton, Slider, Collapse} from "@mui/material";

const filter_categoryTag = "Art, Photography".split(',');
const filter_saleType = "Fixed Price, Live Auction, Open for Offer".split(',');

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
    return (
            <Grid container py={1} spacing={3}>
                <Grid xs={12} md={4}>
                    <Typography pb={1} variant="caption">CATEGORY TAG</Typography>
                    <TextField select fullWidth defaultValue={filter_categoryTag[0]}>
                        {filter_categoryTag.map(d=><MenuItem key={d} value={d}>{d}</MenuItem>)}
                    </TextField>
                </Grid>

                <Grid xs={12} md={4}>
                    <Typography pb={1} variant="caption">SALE TYPE</Typography>
                    <TextField select fullWidth defaultValue={filter_saleType[0]}>
                        {filter_saleType.map(d=><MenuItem key={d} value={d}>{d}</MenuItem>)}
                    </TextField>
                </Grid>

                <Grid xs={12} md={4}>
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
                </Grid>
            </Grid>
    );
}


export default FilterContainer;