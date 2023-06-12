import {createTheme, ThemeProvider} from '@mui/material/styles';
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";

const color = [
  "#fb4e02",
  "#ffffff",
  "#2abfff",
  "#0e2142"
];
const theme = createTheme({
    palette: {
      mode:"light",
      primary: {
        main: color[3]
      },
      secondary: {
        main: color[0]
      },
      basic:{
        main: "#2abfff",
        dark:"#1d85b2",
        light:"#54cbff",
        contrastText:"#171717"
      }
    }
});


//console.log(theme);

export default ({children})=>{

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline enableColorScheme={true}/>
            <Box sx={{backgroundColor:"background.paper", color:"text.primary", minHeight:"100vh", boxSizing:"border-box", "& a":{textDecoration:"none"}}}>
                {children}
            </Box>
        </ThemeProvider>
    );
}