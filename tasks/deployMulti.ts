import  { ethers, upgrades } from "hardhat";

async function main() {
    const Box = await ethers.getContractFactory("MultiSender");
    console.log("Deploying Box...");
    const box = await upgrades.deployProxy(Box, [42,22], {
        initializer: "initialize",
    });
    await box.deployed();
    console.log("Box deployed to:", box.address) ;
}

main();