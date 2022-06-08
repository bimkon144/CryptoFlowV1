import  { ethers, upgrades } from "hardhat";

async function main() {
    const Box = await ethers.getContractFactory("MultiSenderV1");
    console.log("Deploying Box...");
    const box = await upgrades.deployProxy(Box, [100, 0], {
        initializer: "initialize",
    });
    await box.deployed();
    console.log("Box deployed to:", box.address) ;

    // const Token0 = await ethers.getContractFactory("BimkonToken");
    // const token0 = await Token0.deploy("BimkonToken", "BTK", 10500);
    // console.log("token deployed to:", token0.address) ;
    
}

main();