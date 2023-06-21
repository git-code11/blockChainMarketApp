
import { Web, OpenInBrowser } from "@mui/icons-material"
import { Avatar, Typography, Stack, IconButton} from "@mui/material"
import { LaunchStatus } from '.'

const LinkInfo = ({social, web})=>{

    return (
        <Stack direction="row">
            <IconButton component="a" href={social} target="_blank" size="small">
                <OpenInBrowser/>
            </IconButton>
            <IconButton component="a" href={web} target="_blank" size="small">
                <Web/>
            </IconButton>
        </Stack>
    )
}

export default ({
   detail,
   data,
    })=>{
  
    return (
    <Stack>
        <Stack direction="row" justifyContent="space-between">
            
                <Avatar src={detail?.logoUrl}
                    sx={{
                        width:70,
                        height:70
                    }}
                />
                
            <LaunchStatus data={data}/>
        </Stack>
        <Typography variant="h5" fontWeight="bold" fontStyle="italic">
           
                {detail?.name || data?.name}
           
        </Typography>
        <LinkInfo social={detail?.social} web={detail?.web}/>
        <Typography>
                <>
                    <b><i>Description: </i></b>
                    {detail?.desc}
                </>
        </Typography>
    </Stack>
    )
}