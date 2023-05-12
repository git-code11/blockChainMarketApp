
import Grid from "@mui/material/Unstable_Grid2";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useContractRead, useContractReads } from "wagmi";

import LazyScroll from "../../LazyScroll";
import Item from '../item/Item';
import nftAbi from "../../../contract/NFT.sol/NFT.json";
import _contract from "../../../contract/address.json";
import { useIpfsData } from "../../../context/lib/ipfs";

import useUserId from "../../../context/hook/user/useId";


export default ()=>{
    const {uid:address, isReady} = useUserId();
    
    const {data, isLoading, isError, error, refetch, isRefetching} = useContractRead({
        abi:nftAbi.abi,
        address:_contract.nft,
        functionName:"totalCreated",
        args:[address],
        enabled:isReady
    });

    if(isLoading || !isReady){
        return <Stack py={5} alignItems="center">
            <CircularProgress/>
        </Stack>
    }

    if(data?.eq(0) || isError){
        return (
        <Stack pb={1} alignItems="center" spacing={1}>
            <Typography>No entries{`:${error?.message??""}`}</Typography>
            {isError && <Button variant="outlined" disabled={isLoading || isRefetching} onClick={()=>refetch()}>Reload</Button>}
        </Stack>
        )
    }
        

    return (
            <LazyScroll end={data}
                Parent={({children})=><Grid container spacing={2}>{children}</Grid>}
                >
                {({index})=>
                    <Grid xs={12} sm={6} md={4} lg={3}>
                        <ItemContainer {...{address, index}}/>
                    </Grid>
                }
            </LazyScroll>
    );
}


const ItemContainer = ({address, index})=>{

    const {data, isLoading, isSuccess} = useContractRead({
        abi:nftAbi.abi,
        address:_contract.nft,
        functionName:"itemCreated",
        args:[address, index]
    });

    const {data:idata, ...info} = useContractReads({
        contracts:[
            {
                abi:nftAbi.abi,
                address:_contract.nft,
                functionName:"tokenURI",
                args:[data]
            },
            {
                abi:nftAbi.abi,
                address:_contract.nft,
                functionName:"ownerOf",
                args:[data]
            }
        ],
        enabled:isSuccess
    });

    const {data:fdata, ...ipfs} = useIpfsData(idata?.[0]);

    return <Item tokenId={data} loading={isLoading || info.isLoading || ipfs.isLoading} {...fdata} addrLabel="Owner" addr={idata?.[1]}/>
}



