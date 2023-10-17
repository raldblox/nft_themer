// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ThemedERC721 is ERC721 {
    address themer;
    address admin;

    constructor(
        address _admin,
        address _themer
    ) ERC721("Themed NFT", "themedNFT") {
        _mint(msg.sender, 1);
        themer = _themer;
        admin = _admin;
    }

    function mint(address to, uint256 tokenId) public onlyOwner {
        _mint(to, tokenId);
    }
}
