// Import the ethers package
const { ethers } require "ethers";
// For the free version of playcode that cannot install ethers, use this command to import the package from the web (comment out the line above)
// import { ethers } from "https://cdn-cors.ethers.io/lib/ethers-5.6.9.esm.min.js";

// Connect to the Ethereum network using Infura's RPC node
// Prepare the Infura API by signing up on app.infura.io
const INFURA_MAINNET_URL = new ethers.JsonRpcProvider(`https://mainnet.infura.io/v3/8b9750710d56460d940aeff47967c4ba`)
const SEPOLIA_TESTNET_URL = new ethers.JsonRpcProvider('https://sepolia.infura.io/v3/8b9750710d56460d940aeff47967c4ba')
// Connect to the Ethereum mainnet
const providerETH = new ethers.JsonRpcProvider(INFURA_MAINNET_URL)
// Connect to the Sepolia testing network
const providerSepolia = new ethers.JsonRpcProvider(INFURA_SEPOLIA_URL)

const main = async () => {
    // Retrieve on-chain information using the provider
    // 1. Query the ETH balance of vitalik on the mainnet and Sepolia testnet
    console.log("1. Retrieving the ETH balance of Vitalik on the mainnet and the Sepolia testnet");
    const balanceETH = await providerETH.getBalance(`vitalik.eth`);
    const balanceSepolia = await providerSepolia.getBalance(`vitalik.eth`);
    // Output the balances on the console (mainnet)
    console.log(`\nETH Balance of ${address} --> ${ethers.formatEther(balanceETH)} ETH\n`)
    // Output the Sepolia testnet ETH balance
    console.log(`\nSepoliaETH Balance of ${address} --> ${ethers.formatEther(balanceSepolia)} ETH\n`)
    
    // 2. Query the network that the provider is connected to
      const network1 = await provider1.getNetwork();
      const network2 = await provider2.getNetwork();

      console.log("Network 1:", network1.name, "ID:", network1.chainId);
      console.log("Network 2:", network2.name, "ID:", network2.chainId);

    // 3. Query the block number
    const main = async () => {
    const blockNumber = await provider1.getBlockNumber();
    console.log(blockNumber);

    // 4. Query the transaction count of vitalik's wallet
    const main = async () => {
    const txcount = await provider1.getTransactionCount('vitalik.eth');
    console.log(txcount);

    // 5. Query the current suggested gas settings
    const main = async () => {
    const feeData = await provider1.getFeeData();
    console.log(feeData);

    // 6. Query block information
    const main = async () => {
    const block = await provider1.getBlock(0);
    console.log(block);

    // 7. Query the bytecode of a given contract address, using WETH address as an example
    const main = async () => {
    const bytecode = await provider1.getCode('0xc778417e063141139fce010982780140aa0cd5ab');
    console.log(bytecode);
    };

main()
