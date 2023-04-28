

const ItemOffer = ({name, image, isOfferFrom, addr})=>{

    return (
        <Paper component={Stack} direction="row" sx={{p:.5}} spacing={1}>
            <Avatar variant="rounded" sx={{width:120, height:120, bgcolor:"#bbb"}} src={image}/>
            <Box sx={{width:"100%"}}>
                <Stack>
                        <Typography fontWeight="bold">{name}</Typography>
                        <Stack direction="row" spacing={.5}>
                            <Typography component="div" variant="body2">{isOfferFrom?"To:":"From:"}</Typography>
                            <ElTypography variant="body2">{addr}</ElTypography> 
                        </Stack>
                        <Typography variant="body2">Reserve: 0.375ETH</Typography>
                    
                        <Stack alignItems="end" spacing={.5}>
                        <Typography variant="body2" fontStyle="italic" alignSelf="center" color="info">{"pending"}</Typography>
                        {isOfferFrom?
                        <Button size="small" variant="outlined" color="error">Cancel</Button>:
                        <ButtonGroup>
                            <Button size="small" variant="outlined" color="success">Accept</Button>
                            <Button size="small" variant="outlined" color="error">Reject</Button>
                        </ButtonGroup>}
                        </Stack>
                </Stack>
           </Box>
        </Paper>
    );
}