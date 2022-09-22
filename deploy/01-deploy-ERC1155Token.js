const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
const { Tyskos } = require("./00-deploy-ERC721Token")

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    log("-----------------")
    const arguments = []
    const NFTMint = await deploy("NFTMint", {
        from: deployer,
        args: arguments,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("verifying...")
        await verify(NFTMint.address, arguments)
    }
    log("-----------------")
}
module.exports.tags = ["all", "BasicNFT", "main"]
