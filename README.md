A Coin-Flip game on Blockchain that offers 50-50 shot to double your ethers.

This learning project is built using hardhat and create-react-app and the smart contract is written in solidity. The smart contract is deployed on
Polygon's Mumbai testnet using Alchemy on the below url: 

https://mumbai.polygonscan.com/address/0x23346F061c52b1CF07B514beF521F9c401A9bE52

To try the game, make sure you are connected polygon mumbai testnet on metamask. You can refer the below url to configure metamask with mumbai testnet:

https://docs.polygon.technology/docs/develop/metamask/config-polygon-on-metamask

For selecting the winner, the smart contract uses Chainlink's VRF to get a Random Number and choose the winner according to the random number generated.

