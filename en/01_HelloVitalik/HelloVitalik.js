// Import the ethers package
import { ethers } from "ethers";
// playcode's free version cannot install ethers, use this command to import the package from the internet (comment out the line above)
// import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.2.3/ethers.js";

// Connect to the Ethereum network using the default ethers provider
// const provider = new ethers.getDefaultProvider();
const ALCHEMY_MAINNET_URL = 'https://eth-mainnet.g.alchemy.com/v2/oKmOQKbneVkxgHZfibs-iFhIlIAl6HDN';
const provider = new ethers.JsonRpcProvider(ALCHEMY_MAINNET_URL)

const main = async () => {
    // Query the ETH balance of vitalik
    const balance = await provider.getBalance(`vitalik.eth`);
    // Output the balance to the console
    console.log(`ETH Balance of vitalik: ${ethers.formatEther(balance)} ETH`);}
main()