import {createTheme, ThemeProvider} from '@mui/material/styles';
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";

const theme = createTheme({
    palette: {
      mode:"light",
      primary: {
        main: '#081229'
      },
      secondary: {
        main: '#325b6e'
      },
    }
});


//console.log(theme);

export default ({children})=>{

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline enableColorScheme={true}/>
            <Box sx={{backgroundColor:"background.paper", color:"text.primary", minHeight:"100vh", boxSizing:"border-box"}}>
                {children}
            </Box>
        </ThemeProvider>
    );
}