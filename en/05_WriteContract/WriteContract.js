// Declaration of the rules for writing contracts:
// const contract = new ethers.Contract(address, abi, signer);
// The parameters are the contract address `address`, contract ABI `abi`, and the signer variable `signer`

import { ethers } from "ethers";
// The free version of playcode does not allow the installation of ethers.
// Use this command to import the package from the web (comment out the line above)
// import { ethers } from "https://cdn-cors.ethers.io/lib/ethers-5.6.9.esm.min.js";

// Connect to the Ethereum network using Alchemy's rpc node
// You can refer to https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md for preparing the Alchemy API
const ALCHEMY_GOERLI_URL = 'https://eth-goerli.alchemyapi.io/v2/GlaeWuylnNM3uuOo-SAwJxuwTdqHaY5l';
const provider = new ethers.JsonRpcProvider(ALCHEMY_GOERLI_URL);

// Create a wallet object using the private key and provider
const privateKey = '0x227dbb8586117d55284e26620bc76534dfbd2394be34cf4a09cb775d593b6f2b'
const wallet = new ethers.Wallet(privateKey, provider)

// ABI of WETH
const abiWETH = [
    "function balanceOf(address) public view returns(uint)",
    "function deposit() public payable",
    "function transfer(address, uint) public returns (bool)",
    "function withdraw(uint) public",
];
// WETH contract address (Goerli testnet)
const addressWETH = '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6' 
// WETH Contract

// Declaration of a writable contract
const contractWETH = new ethers.Contract(addressWETH, abiWETH, wallet)
// You can also declare a read-only contract and then convert it to a writable contract using the connect(wallet) function.
// const contractWETH = new ethers.Contract(addressWETH, abiWETH, provider)
// contractWETH.connect(wallet)

const main = async () => {

    const address = await wallet.getAddress()
    // 1. Read the on-chain information of the WETH contract (WETH abi)
    console.log("\n1. Read WETH balance")
    const balanceWETH = await contractWETH.balanceOf(address)
    console.log(`WETH balance before deposit: ${ethers.formatEther(balanceWETH)}\n`)
    // Read the ETH balance in the wallet
    const balanceETH = await provider.getBalance(wallet)
    
    // If the wallet has enough ETH
    if(ethers.formatEther(balanceETH) > 0.0015){

        // 2. Call the desposit() function to convert 0.001 ETH to WETH
        console.log("\n2. Call the desposit() function to deposit 0.001 ETH")
        // Send the transaction
        const tx = await contractWETH.deposit({value: ethers.parseEther("0.001")})
        // Wait for the transaction to be confirmed on the chain
        await tx.wait()
        console.log(`Transaction details:`)
        console.log(tx)
        const balanceWETH_deposit = await contractWETH.balanceOf(address)
        console.log(`WETH balance after deposit: ${ethers.formatEther(balanceWETH_deposit)}\n`)

        // 3. Call the transfer() function to transfer 0.001 WETH to vitalik
        console.log("\n3. Call the transfer() function to transfer 0.001 WETH to vitalik")
        // Send the transaction
        const tx2 = await contractWETH.transfer("vitalik.eth", ethers.parseEther("0.001"))
        // Wait for the transaction to be confirmed on the chain
        await tx2.wait()
        const balanceWETH_transfer = await contractWETH.balanceOf(address)
        console.log(`WETH balance after transfer: ${ethers.formatEther(balanceWETH_transfer)}\n`)

    }else{
        // If ETH is not enough
        console.log("ETH is not enough, go to the faucet to get some Goerli ETH")
        console.log("1. Chainlink faucet: https://faucets.chain.link/goerli")
        console.log("2. Paradigm faucet: https://faucet.paradigm.xyz/")
    }
}

main()