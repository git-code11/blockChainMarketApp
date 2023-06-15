#SMART CONTRACT

##How to deploy Smart Contract

1. Managing Configuration

At _backend\smart_contract_ update *.env*
```
	ADMIN={address of admin wallet should be specified here}
	NFT_NAME={NFT Name}
	NFT_SYMBOL={NFT Symbol}
	WALLET_KEY={Deployer WALLET KEY}
``` 

2. Deploying to Mainnet
	
```	
	 cd _backend\smart_contract_
	 pnpm -i
	 yarn hardhat compile
	 yarn hardhat run ./scripts/deploy_weth.js --network mainnet
	 yarn hardhat run ./scripts/deploy_token.js --network mainnet
	 yarn hardhat run ./scripts/deploy_nft.js --network mainnet
	 yarn hardhat run ./scripts/deploy_launch.js --network mainnet
```

3. copy the addresses from the console and update the addressConfig File at frontend and specify the production mode as true