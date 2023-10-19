// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ThemedERC721 is ERC721 {
    uint256 tokenIDs;
    address themer;
    address admin;

    constructor(
        address _admin,
        address _themer
    ) ERC721("Themed NFT", "themedNFT") {
        themer = _themer;
        admin = _admin;
    }

    function mint(address to) public returns (uint256) {
        tokenIDs++;
        _safeMint(to, tokenIDs);
        return tokenIDs;
    }
}
