// Method for retrieving events:
// const transferEvents = await contract.queryFilter("Event Name", [Start Block Height, End Block Height])
// Start Block Height and End Block Height are optional parameters.

const { ethers } = require("ethers");
// Connect to the Ethereum network using Infura's RPC node 
// If you use testnet, it may throw error "undefined", so mainnet is advisable.
const INFURA_MAINNET_URL = 'ttps://mainnet.infura.io/v3/8b9750710d56460d940aeff47967c4ba'
const provider = new ethers.JsonRpcProvider('INFURA_MAINNET_URL');

// WETH ABI, only including the Transfer event of interest
const abiWETH = [
"event Transfer(address indexed from, address indexed to, uint amount)"
];

// Mainnet WETH address
const addressWETH = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' // weth contract address
// Declare the contract instance
const contract = new ethers.Contract(addressWETH, abiWETH, provider)

const main = async () => {

// Get Transfer events within the past 10 blocks
console.log("\n1. Get Transfer events within the past 10 blocks and print 1 event");
// Get the current block
const block = await provider.getBlockNumber()
console.log(`Current block number: ${block}`);
console.log(`Print event details`);
const transferEvents = await contract.queryFilter('Transfer', block - 10, block)
// Print the first Transfer event
console.log(transferEvents[0])
// Parse the Transfer event data (variables are in args)
console.log("\n2. Parsing the event:");
const amount = ethers.formatUnits(ethers.getBigInt(transferEvents[0].args["amount"]), "ether");
console.log(`Address ${transferEvents[0].args["from"]} transferred ${amount} WETH to address ${transferEvents[0].args["to"]}`);

}

main()
