// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title USD.o Stablecoin (ERC-20)
/// @notice A fiat-backed or hybrid stablecoin contract for the USD.o Chain
/// @author OCOS

contract USDOToken is ERC20, Ownable {
    constructor() ERC20("USD.ocos Stablecoin", "USD.o") {
        _mint(msg.sender, 1_000_000 * 10 ** decimals()); // Initial supply to deployer
    }

    /// @notice Mint new tokens (Only owner - Treasury or Minter role)
    /// @param to Receiver address
    /// @param amount Number of tokens to mint
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    /// @notice Burn your own tokens (voluntary)
    /// @param amount Number of tokens to burn
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }

    /// @notice Burn tokens from an approved account (with allowance)
    /// @param account Address to burn from
    /// @param amount Number of tokens to burn
    function burnFrom(address account, uint256 amount) external {
        uint256 currentAllowance = allowance(account, msg.sender);
        require(currentAllowance >= amount, "Burn exceeds allowance");
        _approve(account, msg.sender, currentAllowance - amount);
        _burn(account, amount);
    }
}
