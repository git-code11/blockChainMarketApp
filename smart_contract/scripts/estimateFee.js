
const formatEther = ethers.utils.formatEther;
const AddressZero = ethers.constants.AddressZero
const _estimate = (gprice)=>async({name, args})=>{
    const provider = ethers.provider;
    gprice = gprice || (await provider.getGasPrice());
    const factory = await ethers.getContractFactory(name);
    const raw_tx = await factory.getDeployTransaction(...args);
    const gasLimit = await provider.estimateGas(raw_tx);
    return gasLimit.mul(gprice);
} 

const info = {
    weth:process.env.DEPLOYED_WETH,
    manager:process.env.MANAGER,
    managerWeth:process.env.MANAGER_WETH,

    name:process.env.NFT_NAME,
    symbol:process.env.NFT_SYMBOL,
}

const fact = [
    {name:"WETH",args:[]},
    {name:"TokenFactory",args:[]},
    {name:"PadFactory",args:[info.manager, info.managerWeth, info.weth]},
    {name:"MarketSales",args:[]},
    {name:"NFT",args:[info.name, info.symbol, info.weth, info.weth]},
    {name:"MarketAuction",args:[info.weth, info.weth]},
]


async function main(){
    const user = await ethers.getSigner();
    console.log(`User Balance is ${formatEther(await user.getBalance())}`)
    
    const estimate = _estimate()
    let totalFee = ethers.BigNumber.from(0);
    
    for(let opt of fact){
        const fee = await estimate(opt);
        totalFee = totalFee.add(fee);
        console.log(`Gas Estimate For ${opt.name}`);
        console.log(`Gas Fee ${formatEther(fee)}`);
        console.log(`Commmulative Fee ${formatEther(totalFee)}`);
        console.log(`--------------------------------\n`);
    }
    
    console.log(`User Balance is ${formatEther(await user.getBalance())}`)
    console.log("\n Done\n");
}

main()
    .catch(e=>console.log(e))
    .finally(()=>process.exit(0));


