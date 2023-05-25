import { createTrade, executeTrade } from "../libs/trading";
import {displayTrade} from '../libs/conversion';

async function main(){
    const trade = await createTrade();
    console.log(displayTrade(trade));
    const result = await executeTrade(trade);
    console.log({result});
}

main();