const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()

  log("-----------------")
  const arguments = []
  const Tyskos = await deploy("Tyskos", {
    from: deployer,
    args: arguments,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  })
  if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    log("verifying...")
    await verify(Tyskos.address, arguments)
  }
  log("-----------------")
}
module.exports.tags = ["all", "Tyskos", "ERC721"]
