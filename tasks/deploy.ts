import { ethers, upgrades } from "hardhat";

async function main() {
    const Box = await ethers.getContractFactory("MultiSenderV1");
    console.log("Deploying Box...");
    const box = await upgrades.deployProxy(Box, [100, 0], {
        initializer: "initialize",
    });
    await box.deployed();
    console.log("Box deployed to:", box.address);
}

main();