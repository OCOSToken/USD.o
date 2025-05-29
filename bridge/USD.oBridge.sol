// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IChainlinkOracle {
    function latestAnswer() external view returns (int256);
}

/// @title USD.o Bridge Contract
/// @notice Allows users to bridge USD.o to another chain (e.g., WBTC, BTCB)
/// @dev Integrates Chainlink for real-time price oracle
contract USDOBRIDGE is Ownable {
    IERC20 public usdo;
    address public destinationBridge;
    IChainlinkOracle public btcPriceOracle;

    event BridgeInitiated(address indexed user, uint256 amount, string targetChain, string targetAddress);
    event DestinationBridgeUpdated(address oldAddr, address newAddr);
    event OracleUpdated(address oldOracle, address newOracle);

    constructor(address _usdo, address _btcOracle) {
        usdo = IERC20(_usdo);
        btcPriceOracle = IChainlinkOracle(_btcOracle);
    }

    /// @notice Initiates a bridge to another chain
    /// @param amount Amount of USD.o to bridge
    /// @param targetChain Name of the target chain
    /// @param targetAddress Receiver address on the target chain
    function bridgeTo(string calldata targetChain, string calldata targetAddress, uint256 amount) external {
        require(amount > 0, "Invalid amount");
        require(bytes(targetChain).length > 0 && bytes(targetAddress).length > 0, "Incomplete bridge info");

        usdo.transferFrom(msg.sender, address(this), amount);

        emit BridgeInitiated(msg.sender, amount, targetChain, targetAddress);
    }

    /// @notice Get the real-time price of BTC in USD (used for comparison/mapping)
    function getBTCPrice() external view returns (int256) {
        return btcPriceOracle.latestAnswer();
    }

    /// @notice Update Chainlink Oracle address
    function setOracle(address newOracle) external onlyOwner {
        emit OracleUpdated(address(btcPriceOracle), newOracle);
        btcPriceOracle = IChainlinkOracle(newOracle);
    }

    /// @notice Set destination bridge handler (for off-chain sync or multi-chain control)
    function setDestinationBridge(address newDest) external onlyOwner {
        emit DestinationBridgeUpdated(destinationBridge, newDest);
        destinationBridge = newDest;
    }

    /// @notice Owner can withdraw bridged tokens to off-chain or multi-chain handler
    function withdrawBridged(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "Invalid withdraw address");
        usdo.transfer(to, amount);
    }
}
