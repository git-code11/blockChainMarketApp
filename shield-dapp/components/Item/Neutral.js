import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import ElTypography from "../ElTypography";
import Skeleton from "@mui/material/Skeleton";
import Link from 'next/link';
import Avatar from '@mui/material/Avatar'


const Item = ({tokenId, loading, name, image, creator, owner})=>{
   
    return (
        <Paper>
            <CardActionArea component={Link} href={loading?`/item/${tokenId?.toString()}`:""}>
                <Stack sx={{p:1}} spacing={1}>
                    {loading?
                    <Skeleton component={Box} variant="rectangular" height={230} width="100%"/>:
                    <Avatar variant="rounded" sx={{height:230, width:"100%"}} src={image}/>
                    }
                    <Typography fontWeight="bold">{loading?<Skeleton width={100}/>:name}</Typography>
                    <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2">{loading?<Skeleton width={30}/>:"Creator"}</Typography>
                        <ElTypography>{loading?<Skeleton width={40}/>:creator}</ElTypography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2">{loading?<Skeleton width={30}/>:"Owner"}</Typography>
                        <ElTypography>{loading?<Skeleton width={30}/>:owner}</ElTypography>
                    </Stack>
                </Stack>
            </CardActionArea>
        </Paper>
    );
}

export default Item;