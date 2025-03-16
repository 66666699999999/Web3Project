// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.22;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract CCC3 is ERC20, Ownable {
    constructor(address initialOwner) ERC20("CCC3", "C3") Ownable(initialOwner) {}

    function Mint(uint256 _amount) public {
        _mint(msg.sender, _amount);
    }

    function Burn(uint256 _amount) public {
        _burn(msg.sender, _amount);
    }
}
