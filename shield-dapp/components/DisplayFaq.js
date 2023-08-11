
import { Typography, Box, styled} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";

import Sal,{useSal} from "./SalBox";


const FaqData = [
    {
        text1:"Set Up Your Wallet",
        text2:"Setting up a DeFI wallet is the first step to embarking on your blockchain journey.",
        icon:"/images/icon/wallet.png"
    },
    {
        text1:"Add your NFT's",
        text2:"Use our robust NFT minter to design and launch your NFT project.",
        icon:"/images/icon/save.png"
    },
    {
        text1:"Sell Your NFT's",
        text2:"Publish your NFT project and share across social media, let the world know you have arrived.",
        icon:"/images/icon/share.png"
    }
]

const FaqImage = styled("img")(()=>({
    position:"absolute",
    top:-30,
    right:-15,
    width:"auto",
    height:90
}));

const FaqBox = ({text1, text2, text0, icon})=>{
    return (
        <Box height="100%" py={4} px={3} position="relative" bgcolor="#010e14" color="#fff" borderRadius={3}
            sx={{
                cursor:"pointer",
                "&:hover > *":{
                    transform:"translateY(0px)"
                },
                "& > *":{
                    transition:theme=>theme.transitions.create('transform',{duration:700, easing:"cubic-bezier(0.17, 0.67, 0, 1.01)"}),
                    transform:"translateY(10px)"
                }
            }}
            >
            <FaqImage src={icon}/>
            <Box>
                <Typography variant="subtitle1">{text0}</Typography>
                <Typography mt={4} mb={3} variant="h5">{text1}</Typography>
                <Typography lineHeight={1.8}>{text2}</Typography>
            </Box>
        </Box>
    )
}


const DisplayFaq = ()=>{
    useSal();

    return (
        <Box px={{lg:4}}>
            <Grid container spacing={{xs:4, lg:8}} justifyContent="center">
                {FaqData.map((d, i)=>
                    <Grid xs={12} md={4} key={d.text1}>
                        <Sal>
                            <FaqBox text0={`STEP-0${i+1}`}
                                {...d}
                            />
                        </Sal>
                    </Grid>
                )}
            </Grid>
        </Box>
    )
}


export default DisplayFaq;