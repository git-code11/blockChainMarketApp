import LaunchTokenForm from "../../../components/launchpad/LaunchTokenForm";

import {Container, TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material";

export default ()=>{

    return (
        <Container>
            <LaunchTokenForm/>
            <CreatedTokenTable/>
        </Container>
    )
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
                </TableBody>
            </Table>
        </TableContainer>
    );
}