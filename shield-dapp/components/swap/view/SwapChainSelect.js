import { Button, ButtonGroup } from "@mui/material";
import useSwapChain from "../../../context/swap/hooks/useSwapChain";
import { MAP_ID_CHAIN, CHAIN_NAME } from "../../../swap/src/smart/_utils";

const defaultChains = Object.values(MAP_ID_CHAIN);


export default ()=>{
    
    const method = useSwapChain();
    console.log({upchange:method})
    return (
        <ButtonGroup disabled={method.loading}>
            {
                (method.chains.length > 0 ? method.chains : defaultChains).map(
                    chain=>
                        <Button variant="contained" 
                            key={chain.id}
                            color="success"
                            disabled={chain.id === method.chainId}
                            onClick={()=>method.update(chain.id)}
                            >
                                { CHAIN_NAME[chain.id] }
                            </Button>
                )
            }
        </ButtonGroup>
    )
}