const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("ERC721NFT", function () {
    it("Should return the correct symbol", async function () {
        const BasicNFT = await ethers.getContractFactory("Tyskos")
        const basicNFT = await BasicNFT.deploy()
        await basicNFT.deployed()

        expect(await basicNFT.symbol()).to.equal("Tyskos")
    })

    it("Should return the correct name", async function () {
        const BasicNFT = await ethers.getContractFactory("Tyskos")
        const basicNFT = await BasicNFT.deploy()
        await basicNFT.deployed()

        expect(await basicNFT.name()).to.equal("Tyskos")
    })
})
