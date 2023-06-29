//command to compile
//yarn hardhat compile


//command to deploy
//yarn hardhat run --network localhost ./scripts/deploy_nft.js

const admin = process.env.ADMIN;

if(!(process.env.NFT_NAME && process.env.NFT_SYMBOL && process.env.DEPLOYED_WETH && admin)){
    throw Error("Environment Error");
}

const info = {
  name:process.env.NFT_NAME,
  symbol:process.env.NFT_SYMBOL,
  weth:process.env.DEPLOYED_WETH
}

const _result = {};

async function main() {
  let factory;
  const [deployer] = await ethers.getSigners();

  console.log("Deploying Sale Contract...");
  factory = await ethers.getContractFactory("MarketSales");
  const sale = await factory.deploy();
  console.log("DEBUG:SALE", sale.address);
  _result.sale = sale.address;
  await sale.deployTransaction.wait();

  console.log("Deploying NFT Contract...");
  factory = await ethers.getContractFactory("NFT");
  const nft = await factory.deploy(info.name, info.symbol, admin, _result.sale);
  console.log("DEBUG:NFT", nft.address);
  _result.nft = nft.address;
  await nft.deployTransaction.wait();

  console.log("Deploying Auction Contract...");
  factory = await ethers.getContractFactory('MarketAuction');
  const auction = await factory.deploy(_result.nft, info.weth);
  console.log("DEBUG:AUCTION", auction.address);
  _result.auction = auction.address;
  await auction.deployTransaction.wait();

  console.log("Setting Up Managers");
  console.log(_result);
  let tx = await sale.updateManager(_result.nft, _result.auction);
  await tx.wait();

  console.log({_result})
  
  console.log("OwnerShip Transfer to ", admin);

  for(let contract of [sale, auction]){
    const tx = await contract.transferOwnership(admin);
    await tx.wait();
    console.log(`${contract.address} transfered`);
  }

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});
