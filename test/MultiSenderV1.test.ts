import { expect } from 'chai';
import { Contract, Signer } from 'ethers';
import { ethers, network, upgrades, waffle } from 'hardhat';

describe("MultiSender", (): void => {
    // let decimals = Math.pow(10, 18);
    // let decimalsBigInt = 10n ** 18n;
    let owner: any;
    let user0: any, user1: any, user2: any, user3: any, user4: any, user5: any, user6: any, user7: any, user8: any, user9: any;
    let multiSender: any;
    let token: any;


    // const impersonateAddress = async (address: Address) => {
    //     const hre = require('hardhat');
    //     await hre.network.provider.request({
    //         method: 'hardhat_impersonateAccount',
    //         params: [address],
    //     });
    //     const signer = await ethers.provider.getSigner(address);
    //     signer.address = signer._address;
    //     return signer;
    // };

    beforeEach(async () => {
        [owner, user0, user1, user2, user3, user4, user5, user6, user7, user8, user9] = await ethers.getSigners();
        const MultiSender = await ethers.getContractFactory('MultiSenderV1');
        multiSender = await upgrades.deployProxy(MultiSender, [42, ethers.utils.parseEther("0")], {
            initializer: "initialize",
        });
        await multiSender.deployed();

    });


    it("should have correct default settings", async () => {
        expect(await multiSender.arrayLimit()).eq(42);
        expect(await multiSender.feePerAccount()).eq(ethers.utils.parseEther("0"));
    });

    it("shouldnt let initialize twice", async () => {
        await expect(multiSender.initialize(11, ethers.utils.parseEther("0.05"))).revertedWith("Initializable: contract is already initialized");
    });

    it("should withdraw ether from contract to owner", async () => {
        const provider = waffle.provider;
        expect(await provider.getBalance(multiSender.address)).to.eq(0);
        const sendEth = await owner.sendTransaction({
            to: multiSender.address,
            value: ethers.utils.parseEther("3000")
        });
        expect(await provider.getBalance(multiSender.address)).to.eq(ethers.utils.parseEther("3000"));
        await multiSender.withdraw(user0.address);
        expect(await provider.getBalance(multiSender.address)).to.eq(ethers.utils.parseEther("0"));

    });

    it("method setFeePerAccount should set fee", async () => {
        await multiSender.setFeePerAccount(ethers.utils.parseEther("1"))
        expect(await multiSender.feePerAccount()).to.equal(ethers.utils.parseEther("1"));
    });

    it("method setFeePerAccount can be called only by Owner", async () => {
        await expect(multiSender.connect(user0).setFeePerAccount(ethers.utils.parseEther("1"))).to.be.revertedWith("Ownable: caller is not the owner");
    });


    it("method setArrayLimit should setArrayLimit", async () => {
        await multiSender.setArrayLimit(244);
        expect(await multiSender.arrayLimit()).to.equal(244);
    });

    it("methos setArrayLimit should setArrayLimit", async () => {
        await multiSender.setArrayLimit(244);
        expect(await multiSender.arrayLimit()).to.equal(244);
    });

    it("Multisend should send tokens ERC20 to addresses ", async () => {
        const Token = await ethers.getContractFactory("BimkonToken");
        token = await Token.deploy("BimkonToken", "BTK", ethers.utils.parseEther("100"));
        await token.deployed();
        await token.approve(multiSender.address, ethers.utils.parseEther("100"))

        const usersAddresses = [user0.address, user1.address, user2.address, user3.address, user4.address, user5.address, user6.address, user7.address, user8.address, user9.address];

        const tokenValues = [ethers.utils.parseEther("10"), ethers.utils.parseEther("10"), ethers.utils.parseEther("10"), ethers.utils.parseEther("10"), ethers.utils.parseEther("10"), ethers.utils.parseEther("10"), ethers.utils.parseEther("10"), ethers.utils.parseEther("10"), ethers.utils.parseEther("10"), ethers.utils.parseEther("10")];

        await multiSender.multiSend(token.address, usersAddresses, tokenValues);
        expect(await token.balanceOf(user0.address)).eq(ethers.utils.parseEther("10"));
        expect(await token.balanceOf(user1.address)).eq(ethers.utils.parseEther("10"));
        expect(await token.balanceOf(user2.address)).eq(ethers.utils.parseEther("10"));
        expect(await token.balanceOf(user3.address)).eq(ethers.utils.parseEther("10"));
        expect(await token.balanceOf(user4.address)).eq(ethers.utils.parseEther("10"));
        expect(await token.balanceOf(user5.address)).eq(ethers.utils.parseEther("10"));
        expect(await token.balanceOf(user6.address)).eq(ethers.utils.parseEther("10"));
        expect(await token.balanceOf(user7.address)).eq(ethers.utils.parseEther("10"));
        expect(await token.balanceOf(user8.address)).eq(ethers.utils.parseEther("10"));
        expect(await token.balanceOf(user9.address)).eq(ethers.utils.parseEther("10"));
        expect(await token.balanceOf(owner.address)).eq(ethers.utils.parseEther("0"));
    });

    it("Multisend should send ether to addresses ", async () => {
        const etherAddress = "0xeFEfeFEfeFeFEFEFEfefeFeFefEfEfEfeFEFEFEf";
        const provider = waffle.provider;

        const usersAddresses = [user0.address, user1.address, user2.address, user3.address, user4.address, user5.address, user6.address, user7.address, user8.address, user9.address];

        const tokenValues = [ethers.utils.parseEther("10"), ethers.utils.parseEther("10"), ethers.utils.parseEther("10"), ethers.utils.parseEther("10"), ethers.utils.parseEther("10"), ethers.utils.parseEther("10"), ethers.utils.parseEther("10"), ethers.utils.parseEther("10"), ethers.utils.parseEther("10"), ethers.utils.parseEther("10")];

        await multiSender.multiSend(etherAddress, usersAddresses, tokenValues, {value: ethers.utils.parseEther("100")});
        // expect(await provider.getBalance(user0.address)).eq(ethers.utils.parseEther("10010"));
        expect(await provider.getBalance(user1.address)).eq(ethers.utils.parseEther("10010"));
        expect(await provider.getBalance(user2.address)).eq(ethers.utils.parseEther("10010"));
        expect(await provider.getBalance(user3.address)).eq(ethers.utils.parseEther("10010"));
        expect(await provider.getBalance(user4.address)).eq(ethers.utils.parseEther("10010"));
        expect(await provider.getBalance(user5.address)).eq(ethers.utils.parseEther("10010"));
        expect(await provider.getBalance(user6.address)).eq(ethers.utils.parseEther("10010"));
        expect(await provider.getBalance(user7.address)).eq(ethers.utils.parseEther("10010"));
        expect(await provider.getBalance(user8.address)).eq(ethers.utils.parseEther("10010"));
        expect(await provider.getBalance(user9.address)).eq(ethers.utils.parseEther("10010"));
    });

    //TO DO  - make nft sending test




});