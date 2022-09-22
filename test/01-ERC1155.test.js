const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("ERC1155NFT", function () {
    it("Deployment success", async function () {
        deployer = (await getNamedAccounts()).deployer
        const NFTMint = await ethers.getContractFactory("NFTMint")
        const nftMint = await NFTMint.deploy()
        await nftMint.deployed()
    })
    it("Should revert when minting the reward token", async function () {
        accounts = await ethers.getSigners()
        player1 = accounts[1]
        // deployer = (await getNamedAccounts()).deployer
        deployer = (await getNamedAccounts()).deployer
        const NFTMint = await ethers.getContractFactory("NFTMint")
        const nftMint = await NFTMint.deploy()
        await nftMint.deployed()
        await nftMint.setSkakingpooladdress(player1.address)
        await expect(nftMint.mint(player1.address, 1)).to.be.revertedWith('Not__Tyskos()')
    })
})
