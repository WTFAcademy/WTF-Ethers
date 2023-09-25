// Method for retrieving events:
// const transferEvents = await contract.queryFilter("Event Name", [Start Block Height, End Block Height])
// Start Block Height and End Block Height are optional parameters.

import { ethers } from "ethers";
// playcode free version cannot install ethers, use this command and import the package from the web (comment out the line above)
// import { ethers } from "https://cdn-cors.ethers.io/lib/ethers-5.6.9.esm.min.js";

// Connect to the Ethereum network using an Alchemy rpc node
// Prepare the Alchemy API, refer to https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md
const ALCHEMY_GOERLI_URL = 'https://eth-goerli.alchemyapi.io/v2/GlaeWuylnNM3uuOo-SAwJxuwTdqHaY5l';
const provider = new ethers.JsonRpcProvider(ALCHEMY_GOERLI_URL);

// WETH ABI, only includes the Transfer event we care about
const abiWETH = [
    "event Transfer(address indexed from, address indexed to, uint amount)"
];

// Testnet WETH address
const addressWETH = '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6'
// Declare contract instance
const contract = new ethers.Contract(addressWETH, abiWETH, provider)

const main = async () => {

    // Get Transfer events within the past 10 blocks
    console.log("\n1. Get Transfer events within the past 10 blocks and print 1 event");
    // Get the current block
    const block = await provider.getBlockNumber()
    console.log(`Current block height: ${block}`);
    console.log(`Print event details:`);
    const transferEvents = await contract.queryFilter('Transfer', block - 10, block)
    // Print the first Transfer event
    console.log(transferEvents[0])

    // Parse the data of the Transfer event (variables are in args)
    console.log("\n2. Parse the event:");
    const amount = ethers.formatUnits(ethers.getBigInt(transferEvents[0].args["amount"]), "ether");
    console.log(`Address ${transferEvents[0].args["from"]} transferred ${amount} WETH to address ${transferEvents[0].args["to"]}`)
}

main()