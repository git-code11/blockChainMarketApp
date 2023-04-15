
import {AppBar, ToolBar, Grid, Box, Paper, Stack, Typography, TextField, Button} from "@mui/material";

export default ()=>{
    <Box>
        <AppBar>
            <ToolBar sx={{px:{md:10}}}>
                <Stack>
                    <Box sx={{flexGrow:1}}>
                        <Typography variant="body1">SHIELD</Typography>
                    </Box>
                    <Button>Connect Wallet</Button>
                </Stack>
            </ToolBar>
        </AppBar>;
    </Box>
}