const DialogOffer = ()=>{
    const {state, onOffer} = useDialog();
    return(
        <Dialog open={state.offer} onClose={()=>onOffer(false)}>
            <Box p={2} component={Stack} spacing={2}>
                <Box component={Paper} position="relative" p={1} bgcolor="#ccc">
                    <Typography position="absolute" fontWeight={500}>OFFER AMOUNT</Typography>
                    <Stack width="100%" direction="row" alignSelf="end" alignItems="baseline">
                        <CustomInput placeholder="0.00"/>
                        <Typography fontWeight={600}>ETH</Typography>
                    </Stack>
                </Box>
                <Typography>Last Bid Amount: <b>45.33ETH</b></Typography>
                <Typography>Account Balance: <b>100.45ETH</b></Typography>
                <Alert variant="outlined" severity="info">
                    <Typography>
                        Offer can be cancelled before been accepted or rejected
                    </Typography>
                </Alert>
                <Typography color="warning">Estimated Gas Fee ~ <i><b>0.344ETH</b></i></Typography>
                <Button variant="outlined" size="large">Make Offer</Button>
            </Box>     
        </Dialog>
    )
}