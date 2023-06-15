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

    feeTier:2,

    lpLockPeriod:1,//1day
        
    whiteListEnabled:false,
}
let predict = await launchFactory.predictAmount({
    capped:params.capped,
    saleRate:params.saleRate,
    feeTier:params.feeTier
});
console.log(predict, formatEther(predict));
let tx = await launchTk.approve(launchFactory.address, predict);
await tx.wait();
tx = await launchFactory.createpad(params,{value:parseEther("1")});