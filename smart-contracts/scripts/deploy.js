const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deployer: ", deployer.address);
  console.log("Balance: ", ethers.utils.formatEther(await deployer.getBalance()), " ETH");

  // Deploy APE Payment Token
  const MockedAPE = await hre.ethers.getContractFactory("ERC20Factory");
  const mockedAPE = await MockedAPE.deploy();
  await mockedAPE.deployed();
  console.log("Mocked APE Address: ", mockedAPE.address);

  // Deploy Themer
  const Themer = await hre.ethers.getContractFactory("NFTThemer");
  const themer = await Themer.deploy(mockedAPE.address);
  await themer.deployed();
  console.log("NFT Themer address: ", themer.address);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });