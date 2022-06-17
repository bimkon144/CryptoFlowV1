# CryotoFlow

## Description

This app let you to send native token, ERC-20, NFTs - ERC-721, ERC-1155 to many addresses in one transaction

## Demo 
[demo] https://bimkon144.github.io/CryptoFlowV1/;

## Contribution

### Installation and run

```bash
git clone https://github.com/bimkon144/CryptoFlowV1.git
cd CryptoFlowV1
npm i
create morallis bsct testnet server
create .env based on .env.example and your wallet key, mnemonic , moralis URL, etherscan key, 

run ```run npx hardhat run tasks/deploy.ts --network testnet```
run ```npx hardhat  verify --network testnet "putDeployedAddress"```
put your deployed address to the variable multiSendContractAddress in CsvContainer.tsx
cd frontend
npm i

npm start
```

### Managing

cd frontend scripts:

* Run project  - ```npm start```
* Run build  - ```npm build```
* Run deploy  - ```npm deploy```

cd MultiSenderV1 scripts:

* Run localhost tests  - ```npx hardhat test```
* Run forked bsc mainnet - ```npx hardhat node --fork https://bsc-dataseed.binance.org/```
* Run forked bsc testnet```npx hardhat node --fork https://bsc-dataseed.binance.org/```
