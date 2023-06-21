import { Box, Stack, Typography, CircularProgress, InputAdornment, FormLabel,
    MenuItem,
    Alert
} from "@mui/material";

import {Input, InputWithLaunchSymbol, RadioInput, useFormTokenDetails} from '.'

import currencylist from '../../../currency-list';

const FEEOPTION = (tkSym)=>({
    0:`1${tkSym} + 5% of sold`,
    1:`1${tkSym} + 2% of sold + 2% of token`
});

const BNBFEEOPTION = FEEOPTION("BNB");


const FeeTypes = ()=>{
    return (
        <Box>
            <FormLabel>Creation Pool FeeTier</FormLabel>
            <RadioInput name="token.feeTier" data={BNBFEEOPTION}/>
        </Box>
    )
}

export default ()=>{
    
    return (
    <Box>
        <Typography variant="h6" mb={1}>Token Information</Typography>
        <Stack spacing={2}>
            <InputWithLaunchSymbol label="Token Address" name="token.address" helperText="NOTE:prefers token with decimals 18 for rate accuracy"/>
            <Input label="Buying Currency" name="token.buyToken" select>
                {
                    Object.entries(currencylist).map(([key, value])=>
                        <MenuItem key={value} value={value}>{key}</MenuItem>
                    )
                }
            </Input>
            <FeeTypes/>
        </Stack>
    </Box>
    )
}
