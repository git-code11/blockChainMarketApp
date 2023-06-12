import { Button, ButtonGroup } from "@mui/material";
import useSwapChain from "../../../context/swap/hooks/useSwapChain";
import { MAP_ID_CHAIN, CHAIN_NAME } from "../../../swap/src/smart/_utils";

const defaultChains = Object.values(MAP_ID_CHAIN);


export default ()=>{
    
    const method = useSwapChain();
    
    return (
        <ButtonGroup disabled={method.loading}>
            {
                (method.chains.length > 0 ? method.chains : defaultChains).map(
                    chain=>
                        <Button variant="contained" 
                            size="small"
                            key={chain.id}
                            color={chain.id === method.chainId?"basic":"secondary"}
                            onClick={chain.id === method.chainId?null:()=>method.update(chain.id)}
                            >
                                { CHAIN_NAME[chain.id] }
                            </Button>
                )
            }
        </ButtonGroup>
    )
}