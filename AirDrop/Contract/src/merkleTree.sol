// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.22;

import {MerkleProof} from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import {IERC20, SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract CCC3AirDrop {
    using SafeERC20 for IERC20;

    event CCC3AirDrop_Claimed(address account, uint256 amount);

    error CCC3AirDrop_InvaildAmount();
    error CCC3AirDrop_AlreadyClaimed();
    error CCC3AirDrop_InvaildProof();

    IERC20 public immutable CCC3;
    bytes32 private immutable merkleRoot;
    mapping(address => bool) public hasClaimed;

    constructor(bytes32 _merkle, IERC20 _erc) {
        CCC3 = _erc;
        merkleRoot = _merkle;
    }

    function Claim(address account, uint256 amount, bytes32[] calldata merkleProof) external {
        if (amount == 0 || CCC3.balanceOf(address(this)) < amount) {
            revert CCC3AirDrop_InvaildAmount();
        }

        // AlreadyClaimed
        if (hasClaimed[account]) {
            revert CCC3AirDrop_AlreadyClaimed();
        }

        // Double hash safe
        bytes32 leaf = keccak256(bytes.concat(keccak256(abi.encode(account, amount))));

        // Proof
        if (!MerkleProof.verify(merkleProof, merkleRoot, leaf)) {
            revert CCC3AirDrop_InvaildProof();
        }

        emit CCC3AirDrop_Claimed(account, amount);
        CCC3.safeTransfer(account, amount);
        hasClaimed[account] = true;
    }

    function getMerkleRoot() external view returns (bytes32) {
        return merkleRoot;
    }

    function getAirDropTokenAddress() external view returns (IERC20) {
        return CCC3;
    }

    function getClaimState(address account) external view returns (bool) {
        return hasClaimed[account];
    }
}
