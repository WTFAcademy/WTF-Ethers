import { ethers } from "ethers";

// 1. Create provider and wallet for sending tokens
// Prepare Alchemy API, refer to https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md
if (!process.env.TESTNET_RPC_URL) throw new Error("Set TESTNET_RPC_URL for Sepolia or a local devnet.");
const provider = new ethers.JsonRpcProvider(process.env.TESTNET_RPC_URL);
// Create wallet object using private key and provider
const privateKey = process.env.TESTNET_PRIVATE_KEY;
if (!privateKey) throw new Error("Set TESTNET_PRIVATE_KEY for a disposable test account.");
const wallet = new ethers.Wallet(privateKey, provider)

// 2. Declare WETH contract
// WETH ABI
const abiWETH = [
    "function balanceOf(address) public view returns(uint)",
    "function transfer(address, uint) public returns (bool)",
];
// WETH contract address (Sepolia testnet)
const addressWETH = process.env.WETH_ADDRESS;
if (!ethers.isAddress(addressWETH)) throw new Error("Set WETH_ADDRESS for the selected network.");
// Declare WETH contract
const contractWETH = new ethers.Contract(addressWETH, abiWETH, wallet)

// 3. Create HD wallet
console.log("\n1. Create HD wallet")
// Generate HD wallet using mnemonic phrase
const mnemonic = process.env.TESTNET_MNEMONIC;
if (!mnemonic) throw new Error("Set TESTNET_MNEMONIC for test wallets you control.");
const hdNode = ethers.HDNodeWallet.fromPhrase(mnemonic, undefined, "m")

// 4. Get 20 wallets from HD wallet
console.log("\n2. Derive 20 wallets from HD wallet")
const numWallet = 20
// Derivation path: m / purpose' / coin_type' / account' / change / address_index
// We only need to switch the last address_index to derive new wallets from hdNode
let wallets = [];
for (let i = 0; i < numWallet; i++) {
    let hdNodeNew = hdNode.derivePath(i.toString());
    let walletNew = new ethers.Wallet(hdNodeNew.privateKey);
    wallets.push(walletNew);
    console.log(walletNew.address)
}
// Define amount to send
const amount = ethers.parseEther("0.0001")
console.log(`Amount to send: ${amount}`)


const main = async () => {
    // 5. Read ETH and WETH balance of one address
    console.log("\n3. Read ETH and WETH balance of one address")
    // Read WETH balance
    const balanceWETH = await contractWETH.balanceOf(wallets[19])
    console.log(`WETH balance: ${ethers.formatEther(balanceWETH)}`)
    // Read ETH balance
    const balanceETH = await provider.getBalance(wallets[19])
    console.log(`ETH balance: ${ethers.formatEther(balanceETH)}\n`)

    // If the wallet has enough ETH
    if (ethers.formatEther(balanceETH) > ethers.formatEther(amount) &&
        ethers.formatEther(balanceWETH) >= ethers.formatEther(amount)) {

        // 6. Batch collect ETH from 20 wallets
        console.log("\n4. Batch collect ETH from 20 wallets")
        const txSendETH = {
            to: wallet.address,
            value: amount
        }
        for (let i = 0; i < numWallet; i++) {
            // Connect the wallet to the provider
            let walletiWithProvider = wallets[i].connect(provider)
            var tx = await walletiWithProvider.sendTransaction(txSendETH)
            console.log(`Wallet ${i+1} ${walletiWithProvider.address} start collecting ETH`)
        }
        await tx.wait()
        console.log(`ETH collection finished`)

        // 7. Batch collect WETH from 20 wallets
        console.log("\n5. Batch collect WETH from 20 wallets")
        for (let i = 0; i < numWallet; i++) {
            // Connect the wallet to the provider
            let walletiWithProvider = wallets[i].connect(provider)
            // Connect the contract to the new wallet
            let contractConnected = contractWETH.connect(walletiWithProvider)
            var tx = await contractConnected.transfer(wallet.address, amount)
            console.log(`Wallet ${i+1} ${wallets[i].address} start collecting WETH`)
        }
        await tx.wait()
        console.log(`WETH collection finished`)

        // 8. Read ETH and WETH balance of one address after collection
        console.log("\n6. Read ETH and WETH balance of one address after collection")
        // Read WETH balance
        const balanceWETHAfter = await contractWETH.balanceOf(wallets[19])
        console.log(`WETH balance after collection: ${ethers.formatEther(balanceWETHAfter)}`)
        // Read ETH balance
        const balanceETHAfter = await provider.getBalance(wallets[19])
        console.log(`ETH balance after collection: ${ethers.formatEther(balanceETHAfter)}\n`)
    }
}

main()
