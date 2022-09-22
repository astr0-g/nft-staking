const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const tyskos = await ethers.getContract('Tyskos')
  const NFTMint = await ethers.getContract('NFTMint')

  log("-----------------")
  const arguments = [
    tyskos.address,
    NFTMint.address
  ]
  const Staking = await deploy("Staking", {
    from: deployer,
    args: arguments,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  })

  if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    log("verifying...")
    await verify(Staking.address, arguments)
  }
  log("-----------------")
}
module.exports.tags = ["all", "NftMarketplace", "main","frontend"]
