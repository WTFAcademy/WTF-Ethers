// Contract Method Listening:
// 1. Continuous listening
// contractUSDT.on("event name", Listener)
// 2. Listen only once
// contractUSDT.once("event name", Listener)

import { ethers } from "ethers";
// Connect to the mainnet provider
const provider = new ethers.JsonRpcProvider(`https://mainnet.infura.io/v3/8b9750710d56460d940aeff47967c4ba`);

// USDT contract address
const contractAddress = '0xdac17f958d2ee523a2206206994597c13d831ec7';
// Build the ABI for the Transfer event of USDT
const abi = [
  "event Transfer(address indexed from, address indexed to, uint value)"
];
// Generate the USDT contract object
const contractUSDT = new ethers.Contract(contractAddress, ABI, provider);


const main = async () => {
  // Listen for the Transfer event of the USDT contract

  // Listen to the event only once
  console.log("\n1. Using contract.once(), listen to the Transfer event once");
  contractUSDT.once('Transfer', (from, to, value)=>{
    // Print the result
    console.log(
      `${from} -> ${to} ${ethers.formatUnits(ethers.getBigInt(value),6)}`
    )
  })

  // Continuously listen to the USDT contract
  console.log("\n2. Using contract.on(), continuously listen to the Transfer event");
  contractUSDT.on('Transfer', (from, to, value)=>{
    console.log(
     // Print the result
     `${from} -> ${to} ${ethers.formatUnits(ethers.getBigInt(value),6)}`
    )
  })

}
main()
