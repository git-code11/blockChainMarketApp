import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

import UserInfo from "../../../components/UserInfo";

import TabSection from "../../../components/user/TabSection";


export default ()=>{

    return (
        <Box>
            <UserInfo/>
            <Container>
               <TabSection/>
            </Container>
        </Box>
    );
}
