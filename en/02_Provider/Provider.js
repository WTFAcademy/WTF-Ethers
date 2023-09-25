// Import the ethers package
import { ethers } from "ethers";
// For the free version of playcode that cannot install ethers, use this command to import the package from the web (comment out the line above)
// import { ethers } from "https://cdn-cors.ethers.io/lib/ethers-5.6.9.esm.min.js";

// Connect to the Ethereum network using Alchemy's RPC node
// Prepare the alchemy API, please refer to https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md 
const ALCHEMY_MAINNET_URL = 'https://eth-mainnet.g.alchemy.com/v2/oKmOQKbneVkxgHZfibs-iFhIlIAl6HDN';
const ALCHEMY_GOERLI_URL = 'https://eth-goerli.alchemyapi.io/v2/GlaeWuylnNM3uuOo-SAwJxuwTdqHaY5l';
// Connect to the Ethereum mainnet
const providerETH = new ethers.JsonRpcProvider(ALCHEMY_MAINNET_URL)
// Connect to the Goerli testing network
const providerGoerli = new ethers.JsonRpcProvider(ALCHEMY_GOERLI_URL)

const main = async () => {
    // Retrieve on-chain information using the provider
    // 1. Query the ETH balance of vitalik on the mainnet and Goerli testnet
    console.log("1. Query the ETH balance of vitalik on the mainnet and Goerli testnet");
    const balance = await providerETH.getBalance(`vitalik.eth`);
    const balanceGoerli = await providerGoerli.getBalance(`vitalik.eth`);
    // Output the balance to the console (mainnet)
    console.log(`ETH Balance of vitalik: ${ethers.formatEther(balance)} ETH`);
    // Output the Goerli testnet ETH balance
    console.log(`Goerli ETH Balance of vitalik: ${ethers.formatEther(balanceGoerli)} ETH`);
    
    // 2. Query the network that the provider is connected to
    console.log("\n2. Query the network that the provider is connected to")
    const network = await providerETH.getNetwork();
    console.log(network.toJSON());

    // 3. Query the block height
    console.log("\n3. Query the block height")
    const blockNumber = await providerETH.getBlockNumber();
    console.log(blockNumber);

    // 4. Query the transaction count of vitalik's wallet
    console.log("\n4. Query the transaction count of vitalik's wallet")
    const txCount = await providerETH.getTransactionCount("vitalik.eth");
    console.log(txCount);

    // 5. Query the current suggested gas settings
    console.log("\n5. Query the current suggested gas settings")
    const feeData = await providerETH.getFeeData();
    console.log(feeData);

    // 6. Query block information
    console.log("\n6. Query block information")
    const block = await providerETH.getBlock(0);
    console.log(block);

    // 7. Query the bytecode of a given contract address, using WETH address as an example
    console.log("\n7. Query the bytecode of a given contract address, using WETH address as an example")
    const code = await providerETH.getCode("0xc778417e063141139fce010982780140aa0cd5ab");
    console.log(code);

}

main()