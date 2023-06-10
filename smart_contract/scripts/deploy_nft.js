//command to compile
//yarn hardhat compile

//const { ethers } = require("ethers");

//command to deploy
//yarn hardhat run --network localhost ./scripts/deploy_nft.js

const symbol = "RGG NFT";
const name = "RESIDUEGRAFT";

const adminAddress = "0x6592b3ae337bD50010FBc63907FB2dC92a450502"

const _contract = {
  "admin":"0x6592b3ae337bD50010FBc63907FB2dC92a450502",
  "sale":"0x7914969a7C722c3C6Bb4235B2a8AE12869C655EF",
  "nft":"0x86b6f8F05b8c8B148dE4560f2062c578000688C9",
  "weth":"0x558ffe0b5bb82d4501a8F579F3F15D30AE0fCd2A",
  "auction":"0x6bfB461CeaBf3A862Ff44c132D464DFc81fE9fb7"
}

async function main() {
  const [deployer] = await ethers.getSigners();

  // const salefactory = await ethers.getContractFactory("MarketSales");
  // const sale = await salefactory.deploy();

  // console.log('{')
  // console.log(`"admin":"${adminAddress}",`)
  // console.log(`"sale":"${sale.address}",`);
  // await sale.deployed();
  

  // const nftFactory = await ethers.getContractFactory("NFT");
  // const nft = await nftFactory.deploy(name, symbol, adminAddress, sale.address);
  
  // console.log(`"nft":"${nft.address}",`);
  // await nft.deployed();

  // let result = await sale.updateNft(nft.address);
  // await result.wait();

  // const wethFactory = await ethers.getContractFactory('WETH');
  // const weth = await wethFactory.deploy();
  
  // console.log(`"weth":"${weth.address}",`);
  // await weth.deployed();


  // const offerFactory = await ethers.getContractFactory('MarketOffer');
  // const offer = await offerFactory.deploy(nft.address, weth.address);
  
  // console.log(`"offer":"${offer.address}",`);
  // await offer.deployed();

  // const auctionFactory = await ethers.getContractFactory('MarketAuction');
  // const auction = await auctionFactory.deploy(_contract.nft, _contract.weth);
  
  // console.log(`"auction":"${auction.address}",`);
  // await auction.deployed();

  // // const stakeFactory = await ethers.getContractFactory('Staking');
  // // const stake = await stakeFactory.deploy();
  
  // // console.log(`"stake":"${stake.address}",`);
  // // await stake.deployed();
  // console.log('}')


  console.log("OwnerShip Transfer to ", adminAddress);

  for(let contract of [1/* auction, offer, stake*/]){
    contract = await ethers.getContractAt('MarketSales', _contract.sale);
    result = await contract.transferOwnership(adminAddress);
    await result.wait();
    console.log(`${contract.address} transfered`);
  }

  

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});
