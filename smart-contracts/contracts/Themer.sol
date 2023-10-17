// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./tokens/ThemedERC721.sol";

contract NFTThemer {
    ThemedERC721 public themedNFT;
    address masterAdmin;
    uint256 themingFee;
    uint256 assetId;

    struct SupportedPaymentToken {
        IERC20 token;
        bool isSupported;
        uint256 paymentAmount;
    }

    mapping(address => SupportedPaymentToken) public supportedPaymentTokens;
    address[] public supportedPaymentTokenAddresses;

    struct ThemedNFT {
        uint256 tokenId; // tokenId of NFT Themed
        address themedBy; // current owner when theming executed
        uint256 themedDate; // block.timestamp when theming executed
        address parentContract; // collection address of the NFT themes
    }

    // Mapping to themed NFTs
    mapping(address => ThemedNFT) public assets;
    mapping(uint256 => address) public assetAdrresses;

    // Event to log asset themed
    event AssetThemed(uint256 indexed assetId, address indexed creator);

    constructor(address _initialTokens) {
        masterAdmin = msg.sender;
        addSupportedPaymentToken(addressOfToken, paymentAmount); // @note Add APE Token as payment token
        themedNFT = new ThemedERC721();
    }

    modifier onlyAdmin() {
        require(masterAdmin == msg.sender, "Caller is not an admin");
        paymentToken = IERC20(_paymentTokenAddress);
        _;
    }

    function addSupportedPaymentToken(
        address _tokenAddress,
        uint256 _paymentAmount
    ) public onlyOwner {
        require(
            !supportedPaymentTokens[_tokenAddress].isSupported,
            "Token already supported"
        );

        IERC20 token = IERC20(_tokenAddress);
        supportedPaymentTokens[_tokenAddress] = SupportedPaymentToken(
            token,
            true,
            _paymentAmount
        );
        supportedPaymentTokenAddresses.push(_tokenAddress);
    }

    // Function to tokenize asset
    function tokenizeAsset(
        string memory _imageUrl,
        address _reciever
    ) external payable {
        // mint to ThemedNFT
    }

    function tokenizeAsset(string memory _imageUrl, address _receiver) external payable {
        // Mint ThemedNFT
    }

    function createThemedNFT(
        address _assetAddress,
        string memory _imageUrl,
        bool _isNFT
    ) external payable {
        require(supportedPaymentTokens[_tokenAddress].isSupported, "Token not supported");
        uint256 paymentAmount = supportedPaymentTokens[_tokenAddress].paymentAmount;

        require(msg.value >= paymentAmount, "Payment not enough");

        assetAddresses[assetId] = _assetAddress;

        IERC20 paymentToken = supportedPaymentTokens[_tokenAddress].token;
        require(paymentToken.balanceOf(msg.sender) >= paymentAmount, "Insufficient tokens");

        require(paymentToken.transferFrom(msg.sender, address(this), paymentAmount), "Token transfer failed");

        require(paymentToken.transfer(owner(), paymentAmount), "Token transfer to owner failed");

        emit AssetThemed(assetId, msg.sender);
    }
}
}
