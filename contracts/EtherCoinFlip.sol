// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

contract EtherCoinFlip is VRFConsumerBase {
    constructor()
        VRFConsumerBase(
            0x8C7382F9D8f56b33781fE506E897a4F1e2d17255, // VRF Coordinator
            0x326C977E6efc84E512bB9C30f76E30c160eD06FB // LINK Token
        )
    {
        keyHash = 0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4;
        fee = 0.0001 * 10**18;
    }

    function getRandomNumber() public returns (bytes32 requestId) {
        require(
            LINK.balanceOf(address(this)) >= fee,
            "Not enough LINK - fill contract with faucet"
        );
        return requestRandomness(keyHash, fee);
    }

    function fulfillRandomness(bytes32 requestId, uint256 randomness)
        internal
        override
    {
        randomResult = randomness;
    }

    struct EtherCoinFlipStruct {
        uint256 ID;
        address payable betStarter;
        uint256 startingWager;
        address payable betEnder;
        uint256 endingWager;
        uint256 etherTotal;
        address payable winner;
        address payable loser;
    }

    bytes32 internal keyHash;
    uint256 internal fee;
    uint256 public randomResult;

    uint256 numCoinFlips = 300;
    mapping(uint256 => EtherCoinFlipStruct) EtherCoinFlipStructs;

    event EtherCoinFlipped(uint256 indexed theCoinFlipID);

    function newCoinFlip() public payable returns (uint256 coinFlipID) {
        address theBetStarter = msg.sender;
        address payable player1 = payable(theBetStarter);

        coinFlipID = numCoinFlips++;

        EtherCoinFlipStructs[coinFlipID] = EtherCoinFlipStruct(
            coinFlipID,
            player1,
            msg.value,
            player1,
            msg.value,
            0,
            player1,
            player1
        );
        emit EtherCoinFlipped(coinFlipID);
    }

    event EtherCoinFinishedFlip(address indexed winner);

    function endCoinFlip(uint256 coinFlipID) public payable {
        EtherCoinFlipStruct memory c = EtherCoinFlipStructs[coinFlipID];

        address theBetender = msg.sender;
        address payable player2 = payable(theBetender);

        require(coinFlipID == c.ID);
        require(msg.value == c.startingWager);

        c.betEnder = player2;
        c.endingWager = msg.value;
        c.etherTotal = c.startingWager + c.endingWager;

        fulfillRandomness(getRandomNumber(), coinFlipID);

        if ((randomResult % 2) == 0) {
            c.winner = c.betStarter;
        } else {
            c.winner = c.betEnder;
        }

        c.winner.transfer(c.etherTotal);
        emit EtherCoinFinishedFlip(c.winner);
    }
}
