import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import ElTypography from '../../ElTypography';
import Skeleton from "@mui/material/Skeleton";
import Link from 'next/link';

const Item = ({tokenId, loading, name, image, addr, addrLabel})=>{

    return (
        loading?
        <Skeleton variant="rounded" height={250}/>:
        <Link href={`/item/${tokenId?.toString()}`}>
            <Paper component={CardActionArea} sx={{height:"100%"}}>
                <Stack sx={{p:1, minHeight:250, height:"100%"}} spacing={1}>
                    <Box component="img" sx={{width:"100%", height:"100%", bgcolor:"#bbb", borderRadius:1, objectFit:"cover"}} src={image}/>
                    <Typography fontWeight="bold">{name}</Typography>
                    <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2">{addrLabel??"Creator"}</Typography>
                        <ElTypography>{addr}</ElTypography>
                    </Stack>
                </Stack>
            </Paper>
        </Link>
    );
}

export default Item;