// scripts/upgrade_box.js
import  { ethers, upgrades } from "hardhat";

const PROXY = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

async function main() {
    const BoxV2 = await ethers.getContractFactory("MultiSenderV2");
    console.log("Upgrading Box...");
    await upgrades.upgradeProxy(PROXY, BoxV2);
    console.log("Box upgraded");
}

main();