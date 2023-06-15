//command to compile
//yarn hardhat compile

//command to deploy
//yarn hardhat run --network localhost ./scripts/deploy_token.js

async function main() {

    console.log("Deploying WETH Contract...");
    const factory = await ethers.getContractFactory("WETH");
    const weth = await factory.deploy();
    console.log("DEBUG:WETH", weth.address);
    const reciept = await weth.deployTransaction.wait();
    console.log("WETH:", reciept.contractAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});
