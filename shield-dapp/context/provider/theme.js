import {createTheme, ThemeProvider} from '@mui/material/styles';
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import MuiGlobalStyles from '@mui/material/GlobalStyles';

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
    },
    zIndex:{
      high:1055
    }
});


//console.log(theme);
const GlobalStyles = ({theme})=>
  <MuiGlobalStyles
    styles={{
      body:{
        backgroundColor:theme.palette.background.paper,
        color:theme.palette.text.primary,
        boxSizing:"border-box",
        a:{
          textDecoration:"none"
        },
      }
    }}
  />

const cssBaseLine = <CssBaseline enableColorScheme={true}/>

export default ({children})=>{

    return (
        <ThemeProvider theme={theme}>
      {/* <GlobalStyles theme={theme}/>*/}
            {/*cssBaseLine*/}
            {/* <Box sx={{minHeight:"100vh"}}> */}
                {children}
            {/* </Box> */}
          
        </ThemeProvider>
    );
}
