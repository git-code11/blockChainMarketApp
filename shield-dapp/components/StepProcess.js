import {styled} from "@mui/material";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Check from "@mui/icons-material/Check";
import Info from "@mui/icons-material/Info";
import Error from "@mui/icons-material/Error";
import Warning from "@mui/icons-material/Warning";


const StepSectionContainer = styled((props)=><Stack direction="row" spacing={2} {...props}/>)(()=>({
    position:"relative",
    paddingBottom:"30px",
    alignItems:"top",
    "&:before":{
        content:'""',
        position:"absolute",
        display:"block",
        width:"4px",
        height:"calc(100% - 44px)",
        bottom:"2px",
        backgroundColor:"#cccccccc",
        transform:"translate(18px)"
    },

    "&:last-child":{
        paddingBottom:"0px",
        "&:before":{
            backgroundColor:"transparent"
        }
        
    }
}));


const StepImage = ({loading, src, status, inner, ...props})=>
                <Avatar
                    sx={{bgcolor:theme=>loading?"transparent":(theme.palette[status]||theme.palette["info"]).main}}
                    src={loading?"/ajax-loader.gif":src}
                    {...props}>
                    { inner ? inner:
                        (
                            (status === "success" && <Check/>) ||
                            (status === "error" && <Error/>) ||
                            (status === "warning" && <Warning/>) ||
                            <Info/>
                        )
                    }
                </Avatar>


const StepStatus = ({loading, status, content})=>{

    return (
        <StepSectionContainer spacing={2}>
            <StepImage {...{loading, status}}/>
            <Typography flexGrow={1}>{content}</Typography>
        </StepSectionContainer>
    )
}


const StepSection = StepSectionContainer;

export {StepSection, StepImage, StepStatus};