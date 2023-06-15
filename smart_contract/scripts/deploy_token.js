//command to compile
//yarn hardhat compile

//command to deploy
//yarn hardhat run --network localhost ./scripts/deploy_token.js


async function main() {

  console.log("Deploying TokenFactory Contract...");
  let factory = await ethers.getContractFactory("TokenFactory");
  const tokenFactory = await factory.deploy();
  console.log("DEBUG:TokenFactory", tokenFactory.address);
  const reciept = await tokenFactory.deployTransaction.wait();
  console.log("TokenFactory:", reciept.contractAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});
