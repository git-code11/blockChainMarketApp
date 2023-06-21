import Container from "@mui/material/Container";
import LaunchTokenForm from "../../../components/launchpad/LaunchTokenForm";
import ListCreatedToken from '../../../components/launchpad/ListCreatedToken';


export default ()=>{

    return (
        <Container sx={{my:4}}>
            <LaunchTokenForm/>
            <ListCreatedToken/>
        </Container>
    )
}
