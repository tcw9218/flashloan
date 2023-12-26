require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    mainnet: {
      url: "https://eth-mainnet.alchemyapi.io/v2/<API_KEY>"
    },
    goerli: {
      url: "https://eth-goerli.alchemyapi.io/v2/<API_KEY>"
    }
  }
};
