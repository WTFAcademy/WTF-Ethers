// Interface Interface class
// Generated from abi
// const interface = ethers.Interface(abi)
// Get directly from the contract
// const interface2 = contract.interface
const { ethers } = require("ethers");

const provider = new ethers.JsonRpcProvider(
  "https://sepolia.infura.io/v3/8b9750710d56460d940aeff47967c4ba"
);

// Create a wallet object using the private key and provider
const privateKey = '0x227dbb8586117d55284e26620bc76534dfbd2394be34cf4a09cb775d593b'
const wallet = new ethers.Wallet(privateKey, provider)

// WETH ABI
const abiWETH = [
    "function balanceOf(address) public view returns(uint)",
    "function deposit() public payable",
];
// WETH contract address (Goerli or Sepolia testnet)
const addressWETH = '0xb16F35c0Ae2912430DAc15764477E179D9B9EbEa' //Sepolia testnet

// Declare WETH contract
const contractWETH = new ethers.Contract(addressWETH, abiWETH, wallet)

const main = async () => {

    const address = await wallet.getAddress()
    // 1. Read on-chain information of WETH contract (WETH abi)
    console.log("\n1. Read WETH balance")
    // Encode calldata
    const param1 = contractWETH.interface.encodeFunctionData(
        "balanceOf",
        [address]
    );
    console.log(`Encoded result: ${param1}`)
    // Create transaction
    const tx1 = {
        to: addressWETH,
        data: param1
    }
    // Initiate transaction, view/pure operations can use provider.call(tx)
    const balanceWETH = await provider.call(tx1)
    console.log(`Pre-deposit WETH balance: ${ethers.formatEther(balanceWETH)}\n`)

    // Read wallet ETH balance
    const balanceETH = await provider.getBalance(wallet)
    // If wallet has enough ETH
    if (ethers.formatEther(balanceETH) > 0.0015) {

        // 2. Call deposit() function, convert 0.001 ETH to WETH
        console.log("\n2. Call deposit() function, deposit 0.001 ETH")
        // Encode calldata
        const param2 = contractWETH.interface.encodeFunctionData(
            "deposit"
        );
        console.log(`Encoded result: ${param2}`)
        // Create transaction
        const tx2 = {
            to: addressWETH,
            data: param2,
            value: ethers.parseEther("0.001")
        }
        // Initiate transaction, writing operations require wallet.sendTransaction(tx)
        const receipt1 = await wallet.sendTransaction(tx2)
        // Wait for transaction to be mined
        await receipt1.wait()
        console.log(`Transaction details:`)
        console.log(receipt1)
        const balanceWETH_deposit = await contractWETH.balanceOf(address)
        console.log(`Post-deposit WETH balance: ${ethers.formatEther(balanceWETH_deposit)}\n`)

    } else {
        // If ETH is not sufficient
        console.log("Insufficient ETH, go to faucet to get some Sepolia ETH")
        console.log("1. Chainlink Faucet: https://faucets.chain.link/sepolia")
        console.log("2. Paradigm Faucet: https://faucet.paradigm.xyz/")
    }
}

main()
