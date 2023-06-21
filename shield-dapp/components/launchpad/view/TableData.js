import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material"


export default ({header, data})=>{

    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell colSpan={2}>
                            <b>{header}</b>
                            </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        Object.entries(data).map(([key, value])=>
                            <TableRow>
                                <TableCell>{key}</TableCell>
                                <TableCell>{value}</TableCell>
                            </TableRow>
                        )
                    }
                </TableBody>
            </Table>
        </TableContainer>
    )
}