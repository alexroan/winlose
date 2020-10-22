// SPDX-License-Identifier: MIT
pragma solidity ^0.6.10;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "./utils/WadMath.sol";

/**
 * @dev HighOrLow
 * @author Alex Roan (@alexroan)
 */
contract HighOrLow is ERC1155{
    using WadMath for uint;

    uint constant public LOW = 0;
    uint constant public HIGH = 1;

    mapping(uint => uint) public supplies;

    /**
     * Construct using a 
     */
    constructor() public ERC1155("ETH 2020 Above 1k") {
        _mint(msg.sender, LOW, WadMath.WAD, "");
        supplies[LOW] = WadMath.WAD;
        _mint(msg.sender, HIGH, WadMath.WAD, "");
        supplies[HIGH] = WadMath.WAD;
    }

    function bet(uint outcome) external payable returns (uint) {
        require(msg.value >= 0.01 ether, "Bet at least 0.01 ETH");
        // TODO require block before deadline
        uint tokens = msg.value.wadMul(priceOf(outcome));
        supplies[outcome] = supplies[outcome].add(tokens);
        _mint(msg.sender, outcome, tokens, "");
        return tokens;
    }

    function claimReward() external {
        // TODO require block after deadline
        // TODO
    }

    function checkResult() public returns (uint) {
        // TODO require block before deadline
        // TODO
    }

    function priceOf(uint outcome) public returns (uint) {
        return WadMath.WAD.sub(supplies[outcome].wadDiv(totalSupply()));
    }

    function totalSupply() public view returns (uint) {
        return supplies[HIGH].add(supplies[LOW]);
    }
}