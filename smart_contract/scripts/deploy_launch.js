//command to compile
//yarn hardhat compile

//command to deploy
//yarn hardhat run --network localhost ./scripts/deploy_token.js

const admin = process.env.ADMIN;

if(!(process.env.MANAGER && process.env.MANAGER_WETH && process.env.DEPLOYED_WETH && admin)){
    throw Error("Environment Error");
}

const info = {
    weth:process.env.DEPLOYED_WETH,
    manager:process.env.MANAGER,
    managerWeth:process.env.MANAGER_WETH
}

console.log({info})

async function main() {
   console.log("Deploying PadFactory Contract...");
  const factory = await ethers.getContractFactory("PadFactory");
  const launchFactory = await factory.deploy(info.manager, info.managerWeth, info.weth);
  console.log("DEBUG:launchFactory", launchFactory.address);
  const reciept = await launchFactory.deployTransaction.wait();
  console.log("LaunchFactory:", reciept.contractAddress);
  await launchFactory.deployed();

  console.log("TransferOwnerShip to", admin);
  const tx = await launchFactory.transferOwnership(admin);
  console.log("Done txHash=>", (await tx.wait()).transactionHash)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});
