//command to compile
//yarn hardhat compile

//const { ethers } = require("ethers");

//command to populate fake data
//yarn hardhat run --network localhost ./scripts/deploy_nft.js

const adminAddress = "0x6592b3ae337bD50010FBc63907FB2dC92a450502";
const externalOwner = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

const _contract = {
    "admin":"0x6592b3ae337bD50010FBc63907FB2dC92a450502",
    "sale":"0x5FbDB2315678afecb367f032d93F642f64180aa3",
    "nft":"0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    "weth":"0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
    "offer":"0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
    "auction":"0x5FC8d32690cc91D4c39d9d3abcBD16989F875707",
    "stake":"0x0165878A594ca255338adfa4d48449f69242Eb8F"
};

async function main() {
  const [deployer, user1, user2, user3] = await ethers.getSigners();

  const tkfactory = await ethers.getContractFactory('Token20');
  const tk = await tkfactory.deploy();
  await tk.deployed();

  console.log("tk Address", tk.address);

  for(let user of [user1, user2, user3]){
    let result = await tk.lend(user.address);
    await result.wait();
  }

  const salefactory = await ethers.getContractFactory("MarketSales");
  const sale = salefactory.attach(_contract.sale);

  const nftfactory = await ethers.getContractFactory("NFT");
  
  const nft = nftfactory.attach(_contract.nft);
  let _id = 1;

  for(let user of [user1, user2, user3]){
    console.log(`User Address=> ${user.address}`);
    const _sale = sale.connect(user);
    const _nft = nft.connect(user);

    for(let count = 0; count < 10; count++ ){
        console.log(`Creating Item-${count}`);
        price = count%2?ethers.BigNumber.from((Math.pow(10,17)*Math.random()).toFixed()):0;
        let result = await _sale.createItem(user.address, user.address, `Item_${count}_${user.address.slice(4, 9)}`, price, _id % 3 == 0?ethers.constants.AddressZero:tk.address, 3600 * 24 * _id);
        await result.wait();
        result = await _nft.approve(_sale.address, _id);
        await result.wait();
        _id++;
    }
    console.log('----');
  }

  for(let user of [deployer]){
    console.log(`User Address=> ${user.address}`);
    const _sale = sale.connect(user);
    const _nft = nft.connect(user);

    for(let count = 0; count < 10; count++ ){
        console.log(`Creating Item-${count}`);
        price = count%2?ethers.BigNumber.from((Math.pow(10,14)*Math.random()).toFixed()):0;
        let result = await _sale.createItem(count%2 == 0?deployer.address:externalOwner, 
          count%3 == 1?deployer.address:externalOwner, `Item_${count}_${user.address.slice(4, 9)}`, price, _id % 3 == 0?ethers.constants.AddressZero:tk.address, 3600 * 24 * _id);
        await result.wait();
        _id++;
    }
    console.log('----');
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});
