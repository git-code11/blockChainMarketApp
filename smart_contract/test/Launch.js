const { expect } = require("chai");
const { test } = require("mocha");


const name = "TELNET#1"
const symbol = "TEL1"
const totalSupply = 500;

const parseAddr = (addr)=>ethers.utils.defaultAbiCoder.decode(["address"], addr)[0] ;
const _OutputPerinputBps = (input, output)=> Math.round((output * 10000) / input);
//belive for input to have 18 decimals
const _1inputToOutputBps = (output)=>_OutputPerinputBps(parseEther("1"), output);
const manager =  ethers.constants.AddressZero;
const managerWeth = ethers.constants.AddressZero;
//let weth;
const {parseEther, formatEther} = ethers.utils;

describe("LaunchPad Test", function () {
	let deployer;
    let user1;
    let user2;
    let tokenFactory;
    let buyTk;
    let launchTk;
    let weth;
    let launchFactory;
    let launchPad;

 	before("Initializing Account", async function(){
 		[deployer, user1, user2] = await ethers.getSigners();
	});

    test("TokenFactory", async ()=>{
        const factory = await ethers.getContractFactory("TokenFactory");
        tokenFactory = await factory.deploy();
        await tokenFactory.deployed();
        expect(Boolean(tokenFactory.address)).to.be.true;
    });

    test("Launch Token", async ()=>{
        let tokenParams = {
            name:"Launch",
            symbol:"LCH",
            decimals:18,
            totalSupply:100000
          }

        let tx = await tokenFactory.create(tokenParams);
        let reciept = await tx.wait();
        let tkAddr = parseAddr(reciept.logs[1].topics[2]);
        launchTk = await ethers.getContractAt("TokenERC20",tkAddr);
        expect(await launchTk.name()).to.equal("Launch");
    });

    test("Buy Token", async ()=>{  
        let tokenParams = {
            name:"BUYTK",
            symbol:"BTK",
            decimals:18,
            totalSupply:100000
          }

        let tx = await tokenFactory.create(tokenParams);
        let reciept = await tx.wait();
        let tkAddr = parseAddr(reciept.logs[1].topics[2]);
        buyTk = await ethers.getContractAt("TokenERC20",tkAddr);
        expect(await buyTk.name()).to.equal("BUYTK");
    });

    test("WETH Token", async ()=>{
        const factory = await ethers.getContractFactory("WETH");
        weth = await factory.deploy();
        await weth.deployed();
        let tx = await weth.deposit({value:1});
        await tx.wait();
        expect(await weth.balanceOf(deployer.address)).to.equal(1);
    });

    test("LaunchFactory", async ()=>{
        const factory = await ethers.getContractFactory("PadFactory");
        launchFactory = await factory.deploy(manager, managerWeth, weth.address);
        await launchFactory.deployed();
        expect(await launchFactory.weth()).to.equal(weth.address);
    });

    test("CreateLaunch", async ()=>{
        // 1 bnb = 23LCH;

        // 1LCH = 1/23 BNB
        // 23LCH = 1BNB
        //1/23 LCH per BNB;
        const sellRate = _1inputToOutputBps(parseEther("15"));
        const dexRate = _1inputToOutputBps(parseEther("10"));
        console.log({sellRate, dexRate});
        const params = {
            ihash:"Pad Hash",
            launchToken:launchTk.address,
            buyToken:buyTk.address,
            startTime:Math.round(Date.now()/1000),
            endTime:Math.round(Date.now()/1000) + 60*60*1,//1hr
        
            capped:parseEther("20"),
            saleRate:sellRate,//parseEther("1"),
            dexRate:dexRate,
            dexBps:7000,//70%
        
            minBuy:parseEther("0.01"),
            maxBuy:parseEther("20"),
        
            feeTier:0,
        
            lpLockPeriod:1,//1day
                
            whiteListEnabled:false,
        }
        let predict = await launchFactory.predictAmount({
            capped:params.capped,
            saleRate:params.saleRate,
            feeTier:params.feeTier,
            dexRate:params.dexRate,
            dexBps:params.dexBps
        });
        console.log(predict, formatEther(predict));
        let tx = await launchTk.approve(launchFactory.address, predict);
        await tx.wait();
        tx = await launchFactory.createpad(params,{value:await launchFactory.fee()});
        let reciept = await tx.wait();
        let addr = parseAddr(reciept.logs[3].topics[2]);
        launchPad = await ethers.getContractAt("LaunchPad",addr);
        let info = await launchPad.getInfo();
        expect(info.launchToken).to.equal(launchTk.address);
        const _purchaseAmountIn = parseEther("20");
        const _launchAmount = await launchPad.saleExAmount(_purchaseAmountIn)
        console.log("launch Token buy ", formatEther(_launchAmount));
        let _buyAmount = await launchFactory.amountIn(_launchAmount, info.saleRate);
        expect(_purchaseAmountIn).to.equal(_buyAmount);
        _buyAmount = await launchFactory.amountIn(predict, info.saleRate);
        //expect(_buyAmount).to.equal(params.capped);
        console.log(formatEther(_buyAmount))
        //console.log(await launchPad.dexExAmount());
    });

    // test("Purchase", async()=>{
    //     launchPad.purchase()
    // });
});


