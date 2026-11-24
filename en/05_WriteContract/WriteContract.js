// Declaration of the rules for writing contracts:
// const contract = new ethers.Contract(address, ABI, signer)
// The parameters are the contract address `address`, contract ABI `abi`, and the signer variable `signer`

import { ethers } from "ethers";
// The free version of playcode does not allow the installation of ethers.
// Use this command to import the package from the web (comment out the line above)
// import { ethers } from "https://cdn.jsdelivr.net/npm/ethers@6.17.0/dist/ethers.min.js";

// Connect to the Ethereum network using Infura's RPC node
if (!process.env.TESTNET_RPC_URL) throw new Error("Set TESTNET_RPC_URL for Sepolia or a local devnet.");
const provider = new ethers.JsonRpcProvider(process.env.TESTNET_RPC_URL);

// Create a wallet object using the private key and provider
const privateKey = process.env.TESTNET_PRIVATE_KEY;
if (!privateKey) throw new Error("Set TESTNET_PRIVATE_KEY for a disposable test account.");
const wallet = new ethers.Wallet(privateKey, provider)

// WETH ABI
const abiWETH = [
    "function balanceOf(address) public view returns(uint)",
    "function deposit() public payable",
    "function transfer(address, uint) public returns (bool)",
    "function withdraw(uint) public",
];

// WETH contract address (Sepolia Test Network)
const addressWETH = process.env.WETH_ADDRESS;
if (!ethers.isAddress(addressWETH)) throw new Error("Set WETH_ADDRESS for the selected network.");

// Declare the writable contract
const contract = new ethers.Contract(addressWETH, abiWETH, wallet);
// Alternatively, you can declare a readable contract and then convert it to a writable contract using the `connect(wallet)` function.
// const contract = new ethers.Contract(addressWETH, abiWETH, provider)
// contractWETH.connect(wallet)

const main = async () => {

// Read on-chain information of the WETH contract (WETH ABI)
const address = await wallet.getAddress();
console.log(`Read WETH balance`);

const balanceWETH = await contract.balanceOf(address);
console.log(`WETH balance before deposit: ${ethers.formatEther(balanceWETH)}`);
// Read the ETH balance in the wallet
const balanceETH = await provider.getBalance(wallet)
    
    // If the wallet has enough ETH
    if(ethers.formatEther(balanceETH) > 0.0015){
    console.log(`Balance of Eth: ${ethers.formatEther(balanceETH)}`);

      // 2. Call the deposit() function to deposit 0.001 ETH")
        console.log("\n2. Call the deposit() function to deposit 0.001 ETH")
        // Send the transaction
        const tx = await contract.deposit({value: ethers.parseEther('0.001')})
        // Wait for the transaction to be confirmed on the chain
        await tx.wait()
        console.log(tx)

        const balanceWETH_deposit = await contract.balanceOf(address)
        console.log(`WETH balance after deposit: ${ethers.formatEther(balanceWETH_deposit)}`)

        // 3. Call the transfer() function to transfer 0.001 WETH to vitalik
        console.log("Call the transfer() function to transfer 0.001 WETH to Vitalik")
        // Send the transaction
        const tx2 = await contract.transfer("vitalik.eth", ethers.parseEther("0.001"))
        // Wait for the transaction to be confirmed on the chain
        await tx2.wait()
        const balanceWETH_transfer = await contract.balanceOf(address)
        console.log(`WETH balance after transfer: ${ethers.formatEther(balanceWETH_transfer)}`)

    }else{
        // If ETH is not enough
        console.log("ETH is not enough, go to the faucet to get some Sepolia ETH")
        console.log("1. Chainlink faucet: https://faucets.chain.link")
    }
}

main()
