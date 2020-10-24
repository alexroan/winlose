// SPDX-License-Identifier: MIT
pragma solidity ^0.6.10;

import "@chainlink/contracts/src/v0.6/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "./utils/WadMath.sol";

/**
 * @dev HighOrLow
 * @author Alex Roan (@alexroan)
 */
contract HighOrLow is ERC1155 {
    using WadMath for uint;
    using Address for address;

    // Results
    uint constant public LOW = 1;
    uint constant public HIGH = 2;

    // Total supplies of each result token
    mapping(uint => uint) public supplies;

    // Constants
    uint public minimumBet;
    int public target;
    uint public deadline;
    address public feed;

    // Actual result
    uint public result;

    modifier beforeDeadline() {
        require(block.timestamp <= deadline, "Too late for that");
        _;
    }

    modifier resultNotConcludedYet() {
        require(result == 0, "Result already concluded");
        _;
    }

    modifier resultConcluded() {
        require(result != 0, "Result not concluded yet");
        _;
    }

    event BetPlaced(address punter, uint outcome, uint ethAmount, uint tokensMinted);
    event ResultConcluded(uint outcome);
    event RewardClaimed(address punter, uint ethAmount);

    /**
     * @dev Contstruct
     * @param name string
     * @param priceTarget uint (must be in same format as oracle price)
     * @param timeDeadline uint
     * @param betMinimum uint (WAD format)
     * @param feedAddress address
     */
    constructor(
        string memory name,
        int priceTarget,
        uint timeDeadline,
        uint betMinimum,
        address feedAddress
    ) public ERC1155(name) {
        target = priceTarget;
        deadline = timeDeadline;
        minimumBet = betMinimum;
        feed = feedAddress;

        _mint(msg.sender, LOW, WadMath.WAD, "");
        supplies[LOW] = WadMath.WAD;
        _mint(msg.sender, HIGH, WadMath.WAD, "");
        supplies[HIGH] = WadMath.WAD;
    }

    /**
     * @dev Bet on an outcome occuring
     * @param outcome uint
     * @return uint amount of tokens
     */
    function bet(uint outcome) external payable beforeDeadline() resultNotConcludedYet() returns (uint) {
        require(msg.value >= minimumBet, "Min bet not reached");
        uint tokens = msg.value.wadDiv(priceOf(outcome));
        supplies[outcome] = supplies[outcome].add(tokens);
        emit BetPlaced(msg.sender, outcome, msg.value, tokens);
        _mint(msg.sender, outcome, tokens, "");
        return tokens;
    }

    /**
     * @dev Get the target price, and the current price
     * to see if it needs verifying. If the price is above the
     * target, and the deadline has not yet been reached, someone
     * should verify it!
     * @return (int target, int price)
     */
    function checkResult() external view returns (int, int) {
        (,int price,,,) = AggregatorV3Interface(feed).latestRoundData();
        return (target, price);
    }

    /**
     * @dev Verify the result to see if has concluded
     * @return uint result
     */
    function verifyResult() public resultNotConcludedYet() returns (uint) {
        (,int price,,uint feedTimestamp,) = AggregatorV3Interface(feed).latestRoundData();
        // If current time is after deadline
        // check if the price feed timestamp is before
        // if it is, and the price is above the target
        // then result = HIGH, otherwise LOW
        if (block.timestamp > deadline) {
            if (feedTimestamp <= deadline && price > target) {
                return setResult(HIGH);
            }
            return setResult(LOW);
        }
        // If the current time is before the deadline
        // just check if the price is higher than the target
        else{
            if (price > target) {
                return setResult(HIGH);
            }
            // else nothing, still ongoing
        }
        return result;
    }

    /**
     * @dev Set the result
     * @param outcome uint
     * @return result uint
     */
    function setResult(uint outcome) internal resultNotConcludedYet() returns (uint) {
        result = outcome;
        emit ResultConcluded(outcome);
        return result;
    }

    /**
     * @dev Claim your reward upon the result concluding
     * @return uint amount
     */
    function claimReward() external resultConcluded() returns (uint) {
        uint amount = balanceOf(msg.sender, result);
        RewardClaimed(msg.sender, amount);
        Address.sendValue(msg.sender, amount);
        return amount;
    }

    /**
     * @dev Get the current price of an outcome
     * @param outcome uint
     * @return uint price
     */
    function priceOf(uint outcome) public view returns (uint) {
        return supplies[outcome].wadDiv(totalSupply());
    }

    /**
     * @dev Total supply of all results
     * @return uint total supply
     */
    function totalSupply() public view returns (uint) {
        return supplies[HIGH].add(supplies[LOW]);
    }
}