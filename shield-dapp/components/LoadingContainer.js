import { useRouter } from "next/router";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";

export default ({children, loading})=>{
    const router = useRouter();

    return (
        router.isReady && !loading?
        children:
        <Backdrop in={true}>
            <CircularProgress size={50}/>
        </Backdrop>
    );
}