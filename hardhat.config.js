require("@nomiclabs/hardhat-waffle");
require("dotenv").config();
module.exports = {
  solidity: "0.8.0",
  paths: {
    artifacts: './src/artifacts',
  },
  networks: {
    hardhat: {
    },
    mumbai: {
      url: "https://polygon-mumbai.g.alchemy.com/v2/s53qEIz7WWzeoqyjtRRngblps-shbek3",
      accounts: [`0x${process.env.REACT_APP_PRIVATE_KEY}`]
    }
  }
};