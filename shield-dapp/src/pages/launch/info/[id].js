import { useRouter } from "next/router"
import LaunchInfo from "../../../../components/launchpad/LaunchInfo"

export default ()=>{
    const router = useRouter();

    return router.isReady?
        <LaunchInfo address={router.query.id}/>
        :<div/>
}