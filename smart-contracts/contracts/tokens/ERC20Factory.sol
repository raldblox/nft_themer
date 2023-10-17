// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC20Factory is ERC20("Mocked APE Token", "mockedAPE") {
    constructor() {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }
}
