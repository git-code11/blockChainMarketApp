

const ItemAuctionBid = ({name, image, addr})=>{

    return (
        <Paper component={Stack} direction="row-reverse" sx={{p:.5}} spacing={1}>
            <Box position="relative">
                <Avatar variant="rounded" sx={{width:100, height:100, bgcolor:"#bbb"}} src={image}/>
                <Typography sx={{position:"absolute", top:2, right:5}} fontWeight="bold" variant="subtitle2">24:34:67</Typography>
                <Stack sx={{position:"absolute", bottom:5, left:5}} direction="row" alignItems="end" spacing={0.25}>
                    <ArrowUpIcon color="success" fontSize="small"/>
                    <Typography variant="subtitle2" fontWeight="bold">0.35</Typography>
                </Stack>
            </Box>
           <Box sx={{width:"100%"}}>
                <Stack>
                        <Typography fontWeight="bold">{name}</Typography>
                        <Stack direction="row" spacing={.5}>
                            <Typography component="div" variant="body2">Top Bidder</Typography>
                            <ElTypography variant="body2">{addr}</ElTypography> 
                        </Stack>
                        <Typography variant="body2">Reserve: 0.375ETH</Typography>
                        <Typography variant="body2">Rank: 13/25</Typography>
                </Stack>
           </Box>
        </Paper>
    );
}