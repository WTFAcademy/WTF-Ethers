// Import the ethers package
import { ethers } from "ethers";
// playcode's free version cannot install ethers, use this command to import the package from the internet (comment out the line above)
// import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.2.3/ethers.js";

// Connect to the Ethereum network using any desired provider (e.g INFURA or ALCHEMY) 
// const provider = new ethers.JsonRpcProvider();
// Note: if the current URL cannot be used, you need to register at NFURA or ALCHEMY's official website and get URL by yourself.
const provider = new ethers.JsonRpcProvider(`https://mainnet.infura.io/v3/8b9750710d56460d940aeff47967c4ba`)
// Specify the address you want to query
const address = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045' //or 'vitalik.eth'

const main = async () => {
    // Query the ETH balance of vitalik
      const balance = await provider.getBalance(address) //or 'vitalik.eth'
    // Output the balance to the console
      console.log(`\nETH Balance of ${address} --> ${ethers.formatEther(balance)} ETH\n`)
        }
main()
