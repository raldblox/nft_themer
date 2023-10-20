require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-contract-sizer");
require("dotenv").config();

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {},
    "mumbai": {
      timeout: 60000,
      gasPrice: 50000000000,
      url: process.env.MUMBAI_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
    scrollSepolia: {
      url: "https://sepolia-rpc.scroll.io/" || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },

    mantle: {
      url: "https://rpc.mantle.xyz", //mainnet
      accounts: [process.env.PRIVATE_KEY ?? ''],
    },
    mantleTest: {
      url: "https://rpc.testnet.mantle.xyz", // testnet
      accounts: [process.env.PRIVATE_KEY ?? '']
    },
    zkEVM: {
      url: `https://rpc.public.zkevm-test.net`,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  etherscan: {
    // apiKey: process.env.POLYGON_ETHERSCAN,
    // apiKey: process.env.ETHERSCAN,
    apiKey: {
      scrollSepolia: 'abc',
    },
    customChains: [
      {
        network: "mantleTest",
        chainId: 5001,
        urls: {
          apiURL: "https://explorer.testnet.mantle.xyz/api",
          browserURL: "https://explorer.testnet.mantle.xyz"
        }
      },
      {
        network: 'scrollSepolia',
        chainId: 534351,
        urls: {
          apiURL: 'https://sepolia-blockscout.scroll.io/api',
          browserURL: 'https://sepolia-blockscout.scroll.io/',
        },
      },
    ]
  },
};


