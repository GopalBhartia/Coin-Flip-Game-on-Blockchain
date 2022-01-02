import './App.css';
import { useState } from 'react';
import { ethers } from 'ethers'
import EtherCoinFlip from './artifacts/contracts/EtherCoinFlip.sol/EtherCoinFlip.json'


const ECFAddress = "0x23346F061c52b1CF07B514beF521F9c401A9bE52"

function App() {
  const [wager, setWager] = useState()
  const [coinFlipId, setCoinFlipId] = useState()

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }


  async function startCoinFlip() {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(ECFAddress, EtherCoinFlip.abi, signer);
      let updatedWager = ethers.utils.parseEther(wager.toString());
      const tx = await contract.newCoinFlip({ value: updatedWager });
      tx.wait();
      console.log(`You started the wager with ${ethers.utils.formatEther(updatedWager)} ETH`);
      let event = contract.on('EtherCoinFlipped', (coinFlipId) => {
        alert(`CoinFlipID ${coinFlipId} was flipped`);
      });
      event.wait();
    }
  }


  async function endCoinFlip() {
    await requestAccount()
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(ECFAddress, EtherCoinFlip.abi, signer);
    let updatedWager = ethers.utils.parseEther(wager.toString());
    const tx = await contract.endCoinFlip(coinFlipId, { value: updatedWager });
    tx.wait();
    console.log(tx);
    let event = contract.on('EtherCoinFinishedFlip', (winner) => {
      alert(`${winner} won the coin flip.`);
    });
    event.wait();
  }

  return (
    <div className="App">

      <header className="App-header">
        <h1>Coin Flip Game on Blockchain</h1>
        <h4>Send ETH to this contract, share the Flip ID and wager amount with your friends to play!!</h4>
        <p> Make sure to use Polygon Mumbai Testnet to play the game. </p>
        <h2>Player 1 :</h2>
        <button value={wager} onClick={startCoinFlip}>Start the coin flip!</button><br></br>
        <input onChange={e => setWager(e.target.value)} placeholder="Send your ETH" />
        <br />
        <h2>Player 2 :</h2>
        <h4>Send ETH to this contract with the Flip ID shared by your friend!!</h4>
        <p>Make sure to send the same wager amount of ETH as your friend, else the transaction will fail.</p>
        <button value={wager} onClick={endCoinFlip}>End a coin flip!</button><br></br>
        <input onChange={e => setWager(e.target.value)} placeholder="Send your ETH" /><br></br>
        <input value={coinFlipId} onChange={e => setCoinFlipId(e.target.value)} placeholder="Coin Flip ID" />
      </header>
    </div>
  );
}

export default App;