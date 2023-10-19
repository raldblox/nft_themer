// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "../interfaces/ITheme.sol";

contract ThemedERC721 is ERC721 {
    uint256 tokenIds;
    address themer;
    address admin;

    struct TokenData {
        address themeAddress;
        string imageUrls;
        bool isLinked;
        address parentTokenAddress;
        uint256 parentTokenId;
    }

    mapping(uint256 => TokenData) tokenData;
    mapping(uint256 => TokenData) linkedNFT;

    constructor(
        address _admin,
        address _themer
    ) ERC721("Themed NFT", "themedNFT") {
        themer = _themer;
        admin = _admin;
    }

    function mint(
        address to,
        address themeAddress,
        string memory _imageUrl
    ) public returns (uint256) {
        tokenIds++;
        _safeMint(to, tokenIds);
        tokenData[tokenIds] = TokenData(
            themeAddress,
            _imageUrl,
            false,
            address(0),
            0
        );
        return tokenIds;
    }

    function addTheme(
        uint256 _tokenId,
        string memory _imageUrl,
        address _tokenAddress,
        address _themeAddress
    ) public returns (uint256) {
        tokenData[tokenIds] = TokenData(
            _themeAddress,
            _imageUrl,
            true,
            _tokenAddress,
            _tokenId
        );
        return tokenIds;
    }

    function totalSupply() public view returns (uint256) {
        return tokenIds;
    }

    function contractURI() external view returns (string memory) {
        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '{"name":"themedNFTs","description":"Themed NFTs""image": "',
                                tokenData[1].imageUrls,
                                '"}'
                            )
                        )
                    )
                )
            );
    }

    function tokenURI(
        uint256 tokenId
    ) public view virtual override returns (string memory) {
        string memory name_ = "";
        string memory image_ = tokenData[tokenId].imageUrls;
        string memory attribute_ = "";
        string memory description_ = "";
        string memory theme = ITheme(tokenData[tokenId].themeAddress).viewTheme(
            image_
        );
        // string memory dummyTheme = "theme";
        // string memory themedAsset = theme;

        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '{"name":"',
                                name_,
                                '", "description":"',
                                description_,
                                '", "image": "',
                                image_,
                                '", "attributes": ',
                                "[",
                                attribute_,
                                "]",
                                ', "animation_url": "',
                                theme,
                                '"}'
                            )
                        )
                    )
                )
            );
    }

    function tokenTheme(uint256 tokenId) public view returns (string memory) {
        string memory theme = ITheme(tokenData[tokenId].themeAddress).viewTheme(
            tokenData[tokenId].imageUrls
        );
        return theme;
    }

    function tokenThemeAddress(uint256 tokenId) public view returns (address) {
        return tokenData[tokenId].themeAddress;
    }
}
