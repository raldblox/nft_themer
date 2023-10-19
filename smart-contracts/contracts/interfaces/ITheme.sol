// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface ITheme {
    function viewTheme(string memory) external view returns (string memory);
}
