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

  // Deploy Theme
  const Theme = await hre.ethers.getContractFactory("SquareCard");
  const theme = await Theme.deploy();
  await theme.deployed();
  console.log("Square Card Theme Address: ", theme.address);

  // Deploy Themer
  const Themer = await hre.ethers.getContractFactory("NFTThemer");
  const themer = await Themer.deploy(mockedAPE.address);
  await themer.deployed();
  console.log("NFT Themer Address: ", themer.address);
  console.log("NFT Factory Address: ", await themer.getFactory());

  // Get the allowance before approval
  const allowanceBefore = await mockedAPE.allowance(deployer.address, themer.address);
  console.log("Allowance before approval: ", allowanceBefore.toString());

  // Approve Themer contract to spend tokens
  const approvalTx = await mockedAPE.approve(themer.address, ethers.constants.MaxUint256);
  await approvalTx.wait();
  console.log("Approval transaction hash: ", approvalTx.hash);

  // Get the allowance after approval
  const allowanceAfter = await mockedAPE.allowance(deployer.address, themer.address);
  console.log("Allowance after approval: ", allowanceAfter.toString());

  // Get the Themer contract balance before the transaction
  const themerBalanceBefore = await mockedAPE.balanceOf(themer.address);
  console.log("Themer Contract Balance before createThemedNFT: ", themerBalanceBefore.toString());

  // Get the totalSupply before minting from the NFT Factory
  const nftFactoryAddress = await themer.getFactory();
  const NFTFactory = await hre.ethers.getContractFactory("ThemedERC721");
  const nftFactory = NFTFactory.attach(nftFactoryAddress);
  const totalSupplyBefore = await nftFactory.totalSupply();
  console.log("TotalSupply before mint: ", totalSupplyBefore.toString());

  // Call the createThemedNFT function
  const paymentAddress = mockedAPE.address;
  const tokenAddress = mockedAPE.address;
  const themeAddress = theme.address;
  const tokenId = 1;
  const imageUrl = "https://images.unsplash.com/photo-1557672199-6e8c8b2b8fff?ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80";
  const isNFT = false; // Set this to true or false as needed

  const paymentAmount = ethers.utils.parseEther("1"); // Set the payment amount

  const createThemedNFTTx = await themer.createThemedNFT(paymentAddress, tokenId, imageUrl, tokenAddress, themeAddress, isNFT, {
    value: paymentAmount, // Sending ether for payment
  });
  await createThemedNFTTx.wait();
  console.log("createThemedNFT Transaction Hash: ", createThemedNFTTx.hash);

  // Get the Themer contract balance after the transaction
  const themerBalanceAfter = await mockedAPE.balanceOf(themer.address);
  console.log("Themer Contract Balance after createThemedNFT: ", themerBalanceAfter.toString());

  // Get the totalSupply after minting from the NFT Factory
  const totalSupplyAfter = await nftFactory.totalSupply();
  console.log("TotalSupply after mint: ", totalSupplyAfter.toString());
  console.log("Token Address: ", await nftFactory.tokenThemeAddress(1));
  console.log("Theme URI: ", await nftFactory.tokenURI(1));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });