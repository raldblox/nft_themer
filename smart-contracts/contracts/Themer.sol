// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./tokens/ThemedERC721.sol";

contract NFTThemer {
    ThemedERC721 public themedNFT;
    address masterAdmin;
    uint256 themingFee;
    uint256 assetId;

    struct PaymentTokenInfo {
        IERC20 token;
        bool isSupported;
        uint256 paymentAmount;
    }

    mapping(address => PaymentTokenInfo) public paymentTokens;
    address[] public paymentTokenAddresses;

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

    constructor(address _paymentToken) {
        masterAdmin = msg.sender;
        addPaymentTokenInfo(_paymentToken, 1 ether); // @note Add APE Token as payment token
        themedNFT = new ThemedERC721(msg.sender, address(this));
    }

    modifier onlyAdmin() {
        require(masterAdmin == msg.sender, "Caller is not an admin");
        _;
    }

    function addPaymentTokenInfo(
        address _tokenAddress,
        uint256 _paymentAmount
    ) public onlyAdmin {
        require(
            !paymentTokens[_tokenAddress].isSupported,
            "Token already supported"
        );

        IERC20 token = IERC20(_tokenAddress);
        paymentTokens[_tokenAddress] = PaymentTokenInfo(
            token,
            true,
            _paymentAmount
        );
        paymentTokenAddresses.push(_tokenAddress);
    }

    // Function to tokenize asset
    function tokenizeAsset(
        string memory _imageUrl,
        address _reciever
    ) external payable {
        // mint to ThemedNFT
    }

    function createThemedNFT(
        address _paymentAddress,
        uint256 _tokenId,
        string memory _imageUrl,
        address _tokenAddress,
        address _themeAddress,
        bool _isNFT
    ) external payable {
        require(
            paymentTokens[_paymentAddress].isSupported,
            "Token not supported"
        );

        uint256 paymentAmount = paymentTokens[_paymentAddress].paymentAmount;
        IERC20 paymentToken = paymentTokens[_paymentAddress].token;

        require(
            paymentToken.balanceOf(msg.sender) >= paymentAmount,
            "Insufficient tokens"
        );

        require(
            paymentToken.transferFrom(msg.sender, address(this), paymentAmount),
            "Token transfer failed"
        );

        // NFT factory minting tx

        uint256 newToken;

        if (!_isNFT) {
            newToken = themedNFT.mint(msg.sender, _themeAddress, _imageUrl);
        } else {
            newToken = themedNFT.addTheme(
                _tokenId,
                _imageUrl,
                _tokenAddress,
                _themeAddress
            );
        }

        // add theming to NFT

        emit AssetThemed(assetId, msg.sender);
    }

    function getFactory() public view returns (address) {
        return address(themedNFT);
    }
}
