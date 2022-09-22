const { assert, expect } = require("chai")
const { network, deployments, ethers, getNamedAccounts } = require("hardhat")

describe("Staking", () => {
    let player1
    let Staking
    let NFTMint
    let ERC721h

    beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer
        accounts = await ethers.getSigners()
        player1 = accounts[1]
        player2 = accounts[2]
        await deployments.fixture(["all"])
        ERC721h = await ethers.getContract("Tyskos")
        NFTMint = await ethers.getContract("NFTMint")
        Staking = await ethers.getContract("Staking")
        await NFTMint.setSkakingpooladdress(Staking.address)
    })

    it("mint the 721", async () => {
        await ERC721h.publicMint(2)
        let number = await ERC721h.balanceOf(deployer)
        assert.equal(number.toString(), 2)
    })

    it("stake 2 NFT and check the stake number whether equal to 2 or not", async () => {
        await ERC721h.connect(player1).publicMint(2)
        await ERC721h.connect(player1).setApprovalForAll(Staking.address, true)
        await Staking.connect(player1).stakeNFT(1)
        await Staking.connect(player1).stakeNFT(2)
        let result = await Staking.stakers(player1.address)
        assert.equal(result.amountStaked.toString(), 2)
    })

    it("unstake the NFT after 2 month and claim 2 rewards nft", async () => {
      await ERC721h.connect(player1).publicMint(2)
      await ERC721h.connect(player1).setApprovalForAll(Staking.address, true)
      await Staking.connect(player1).stakeNFT(1)
      await ethers.provider.send("evm_increaseTime", [2 * 2629743])
      await Staking.connect(player1).unStakeNFT(1)
      let number = await NFTMint.balanceOf(player1.address, 0)
      assert.equal(number.toString(), 2)
    })
})
