import {useEffect} from "react";
import {useRouter} from "next/router";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop"

import {useRouteLoading} from '../context/route'

const useLoading = ()=>{
    const router = useRouter();
    const {state, update} = useRouteLoading();

    useEffect(()=>{
        const routeChangeStart = ()=>{
            //console.log("RouteChnageStarte");
            update(true);
        };
        const routeChangeEnd = ()=>{
            //console.log("Route End");
            update(false)
        };

        router.events.on("routeChangeStart", routeChangeStart);
        router.events.on("routeChangeComplete", routeChangeEnd);
        router.events.on("routeChangeError", routeChangeEnd);

        return ()=>{
            router.events.off("routeChangeStart", routeChangeStart);
            router.events.off("routeChangeComplete", routeChangeEnd);
            router.events.off("routeChangeError", routeChangeEnd);
        }
    },[]);

    return {state}
}

export default ()=>{
    const {state} = useLoading();

    return state && 
            <Backdrop open={true}
                sx={{
                    zIndex:theme=>theme.zIndex.modal + 1
                }}
            >
                <CircularProgress color="basic"/>
            </Backdrop>
}