
import {Container, Box, Paper, Stack , Typography, TextField, MenuItem, Button,
        TableContainer, Table, TableHead, TableBody, TableRow, TableCell,
        Skeleton    } from "@mui/material";



export default ()=>{

    return (
        <Container sx={{mt:5, mb:2}}>
            <Stack spacing={5}>
                
                <Box>
                    <Typography variant="h5" fontWeight="bold" mb={2}>Token Creation</Typography>
                    <form>
                        
                        <Stack sx={{p:2}} component={Paper} spacing={3} >
                            <Typography variant="subtitle1">Details</Typography>

                            <TextField name="tokenType" select defaultValue={0}>
                                <MenuItem value={0}>Standard Token</MenuItem>
                                <MenuItem value={1}>Liquidity Token</MenuItem>
                                <MenuItem value={2}>Reflection Token</MenuItem>
                            </TextField>

                            <TextField name="name" placeholder="name"/>
                            <TextField name="symbol" placeholder="symbol"/>
                            <TextField name="decimals" placeholder="decimals"/>
                            <TextField name="totalSupply" placeholder="totalSupply"/>

                            <Stack alignItems="center">
                                <Button type="submit" variant="outlined" color="primary" size="large">Create</Button>
                            </Stack>
                        </Stack>
                    </form>
                </Box>

                <Stack>
                    <Typography variant="h5" fontWeight="bold">Created Token</Typography>
                    <CreatedTokenTable/>
                </Stack>

            </Stack>
        </Container>
    );

}


const CreatedTokenTable = ()=>{

    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Address</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Symbol</TableCell>
                        <TableCell>Decimals</TableCell>
                        <TableCell>TotalSupply</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell>0x328abc399f0330399400399</TableCell>
                        <TableCell>Custom</TableCell>
                        <TableCell>CUST</TableCell>
                        <TableCell>18</TableCell>
                        <TableCell>1920</TableCell>
                    </TableRow>
                    <TableRowLoading/>
                </TableBody>
            </Table>
        </TableContainer>
    );
}


const TableRowLoading = ()=>
    <TableRow>
        <TableCell><Skeleton width={200}/></TableCell>
        <TableCell><Skeleton width={60}/></TableCell>
        <TableCell><Skeleton width={50}/></TableCell>
        <TableCell><Skeleton width={20}/></TableCell>
        <TableCell><Skeleton width={40}/></TableCell>
    </TableRow>;