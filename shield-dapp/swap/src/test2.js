import { fetchRiskToken } from "./smart";

import { bscTokens } from "@pancakeswap/tokens";

const TOKEN = bscTokens["8pay"];
const main = async ()=>console.log(await fetchRiskToken(TOKEN.address, TOKEN.chainId));

main();