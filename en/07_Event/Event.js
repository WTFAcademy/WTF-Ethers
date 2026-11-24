// Method for retrieving events:
// const transferEvents = await contract.queryFilter("Event Name", [Start Block Height, End Block Height])
// Start Block Height and End Block Height are optional parameters.

import { ethers } from "ethers";
// Connect to the Ethereum network using Infura's RPC node 
// If you use a testnet, it may throw error "undefined", so mainnet is advisable.
if (!process.env.TESTNET_RPC_URL) throw new Error("Set TESTNET_RPC_URL for Sepolia or a local devnet.");
const provider = new ethers.JsonRpcProvider(process.env.TESTNET_RPC_URL);

// WETH ABI, only including the Transfer event of interest
const abiWETH = [
"event Transfer(address indexed from, address indexed to, uint amount)"
];

// Mainnet WETH address
const addressWETH = process.env.WETH_ADDRESS;
if (!ethers.isAddress(addressWETH)) throw new Error("Set WETH_ADDRESS for the selected network.");
// Declare the contract instance
const contract = new ethers.Contract(addressWETH, abiWETH, provider)

const main = async () => {

// Get Transfer events within the past 10 blocks
console.log("\n1. Get Transfer events within the past 10 blocks and print 1 event");
// Get the current block
const block = await provider.getBlockNumber()
console.log(`Current block number: ${block}`);
console.log(`Print event details`);
const transferEvents = await contract.queryFilter('Transfer', Math.max(0, block - 10), block)
// Print the first Transfer event
if (!transferEvents.length) {
    console.log("No Transfer events in the selected blocks.");
    return;
}
console.log(transferEvents[0]);
// Parse the Transfer event data (variables are in args)
console.log("\n2. Parsing the event:");
const amount = ethers.formatUnits(ethers.getBigInt(transferEvents[0].args["amount"]), "ether");
console.log(`Address ${transferEvents[0].args["from"]} transferred ${amount} WETH to address ${transferEvents[0].args["to"]}`);

}

main()
