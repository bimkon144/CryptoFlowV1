import { expect } from 'chai';
import  { ethers, upgrades } from "hardhat";

describe('NultiSender Upgradeable', (): void => {
  it("upgrade proxy to MultiSenderV2", async  (): Promise<void> => {
    const MultiSender = await ethers.getContractFactory('MultiSenderV1');
    const multiSender = await upgrades.deployProxy(MultiSender, [42,22], {
        initializer: "initialize",
    });
    await multiSender.deployed();
    expect(await multiSender.feePerAccount()).to.equal(22);
    const MultiSenderV2 = await ethers.getContractFactory("MultiSenderV2");
    console.log("Upgrading MultiSender to V2...");
    const upgraidedMultiSender = await upgrades.upgradeProxy(multiSender.address, MultiSenderV2);
    console.log("MultiSender upgraded to V2");
    expect (await multiSender.address).to.equal(upgraidedMultiSender.address);
    expect (await upgraidedMultiSender.feePerUser()).to.equal(22);

  });
});
