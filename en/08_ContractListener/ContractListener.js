// Contract Method Listening:
// 1. Continuous listening
// contractUSDT.on("event name", Listener)
// 2. Listen only once
// contractUSDT.once("event name", Listener)

import { ethers } from "ethers";

// Prepare Alchemy API
// Refer to https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md
const ALCHEMY_MAINNET_URL = 'https://eth-mainnet.g.alchemy.com/v2/oKmOQKbneVkxgHZfibs-iFhIlIAl6HDN';
// Connect to the mainnet provider
const provider = new ethers.JsonRpcProvider(ALCHEMY_MAINNET_URL);

// USDT contract address
const contractAddress = '0xdac17f958d2ee523a2206206994597c13d831ec7'
// Build the ABI for USDT Transfer
const abi = [
  "event Transfer(address indexed from, address indexed to, uint value)"
];
// Generate the USDT contract object
const contractUSDT = new ethers.Contract(contractAddress, abi, provider);


const main = async () => {
  // Listen for the Transfer event of the USDT contract

  try{
    // Listen only once
    console.log("\n1. Use contract.once(), listen for the Transfer event once");
    contractUSDT.once('Transfer', (from, to, value)=>{
      // Print the result
      console.log(
        `${from} -> ${to} ${ethers.formatUnits(ethers.getBigInt(value),6)}`
      )
    })

    // Continuously listen for the USDT contract
    console.log("\n2. Use contract.on(), continuously listen for the Transfer event");
    contractUSDT.on('Transfer', (from, to, value)=>{
      console.log(
       // Print the result
       `${from} -> ${to} ${ethers.formatUnits(ethers.getBigInt(value),6)}`
      )
    })

  }catch(e){
    console.log(e);

  } 
}
main()