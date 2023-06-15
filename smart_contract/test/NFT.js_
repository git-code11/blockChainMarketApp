const { expect } = require("chai");


const name = "SHIELD PACK"
const symbol = "SHC"

describe("NFT contract", function () {
	let nft;
	let market;
	let deployer;
	let admin;
	let user1;
	let user2;

 	before("Initializing Account", async function(){
 		[deployer, admin, user1, user2] = await ethers.getSigners();
	});


	it("Deploy market and nft", async function () {
		let marketfactory = await ethers.getContractFactory("MarketSales");
		market = await marketfactory.deploy();
		await market.deployed();

		let nftFactory = await ethers.getContractFactory("NFT");
		nft = await nftFactory.deploy(name, symbol, admin.address, user1.address);
		await nft.deployed();
		
		let tx = await market.updateNft(nft.address);
		await tx.wait();

		expect(await market.nft()).to.equal(nft.address);

		expect(await nft.balanceOf(admin.address)).to.equal(0);
		expect(await nft.admin()).to.equal(admin.address);

		expect(await nft.producer()).to.equal(user1.address);
	});

	it("Create nft by same owner and creator", async function () {
		const _nft = await nft.connect(user1);
		const item1 = "ITEM 1";
		const tx = await _nft.create(user1.address, user1.address, item1);
		await tx.wait();
		expect(await _nft.totalCreated(user1.address)).to.equal(1);
		expect(await _nft.balanceOf(user1.address)).to.equal(1);
		expect(await _nft.itemCreated(user1.address, 0)).to.equal(1);
	});

	it("Create nft by different owner and creator", async function () {
		const _nft = await nft.connect(user1);
		const item2 = "ITEM 2";
		const tx = await _nft.create(user2.address, user1.address, item2);
		await tx.wait();
		expect(await _nft.totalCreated(user1.address)).to.equal(1);
		expect(await _nft.totalCreated(user2.address)).to.equal(1);
		expect(await _nft.balanceOf(user1.address)).to.equal(2);
		expect(await _nft.balanceOf(user2.address)).to.equal(0);
		expect(await _nft.itemCreated(user1.address, 0)).to.equal(1);
		expect(await _nft.itemCreated(user2.address, 0)).to.equal(2);
	});

	it("Create nft by same owner and creator", async function () {
		const _nft = await nft.connect(user1);
		const item3 = "ITEM 3";
		const tx = await _nft.create(user1.address, user1.address, item3);
		await tx.wait();
		expect(await _nft.totalCreated(user1.address)).to.equal(2);
		expect(await _nft.balanceOf(user1.address)).to.equal(3);
		expect(await _nft.itemCreated(user1.address, 1)).to.equal(3);
	});

	it("Using Market as producer", async function () {
		const _nft = await nft.connect(user1);
		const _market = await market.connect(user1);
		const _nftAdmin = await nft.connect(admin);
		let tx = await _nftAdmin.updateProducer(market.address);
		await tx.wait();

		const item = "ITEM 4";
		tx = await _market.createItem(user1.address, user1.address, item, 0, ethers.constants.AddressZero, 0);
		await tx.wait();

		expect(await _nft.totalCreated(user1.address)).to.equal(3);
		expect(await _nft.balanceOf(user1.address)).to.equal(4);
		expect(await _nft.itemCreated(user1.address, 2)).to.equal(4);
	});
});