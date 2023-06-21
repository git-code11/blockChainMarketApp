import Grid from "@mui/material/Unstable_Grid2"
import { useListCreatedPadIds } from "../../context/hook/app/factory/launch/useListPad"
import LazyScroll from "../LazyScroll"
import LaunchItemCard from "./LaunchItemCard"


export default ()=>{

    const {data:padIds, isLoading} = useListCreatedPadIds({});

    return (

        <LazyScroll end={padIds?.length||0} loading={isLoading}
                Parent={({children})=><Grid container spacing={4}>{children}</Grid>}
                >
                {({index})=>
                    <Grid xs={12} md={6} >
                        <LaunchItemCard key={padIds[index]} id={padIds[index]}/>
                    </Grid>
                }
        </LazyScroll>
    )

}