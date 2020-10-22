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

    enum Outcome {
        LOW, HIGH
    }

    mapping(Outcome => uint) public supplies;

    /**
     * Construct using a 
     */
    constructor() public ERC1155("ETH 2020 Above 1k") {
        _mint(msg.sender, Outcome.LOW, WadMath.WAD, "");
        supplies[Outcome.LOW] = WAD;
        _mint(msg.sender, Outcome.HIGH, WadMath.WAD, "");
        supplies[Outcome.HIGH] = WAD;
    }

    function bet(Outcome outcome) external payable returns (uint) {
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

    function priceOf(Outcome outcome) public returns (uint) {
        return WadMath.WAD.sub(supplies[outcome].wadDiv(totalSupply()));
    }

    function totalSupply() public view returns (uint) {
        return supplies[Outcome.HIGH].add(supplies[Outcome.LOW]);
    }
}