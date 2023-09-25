import { ethers } from "ethers";

// 1. Create provider and wallet for sending tokens
// Prepare Alchemy API, refer to https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md
const ALCHEMY_GOERLI_URL = 'https://eth-goerli.alchemyapi.io/v2/GlaeWuylnNM3uuOo-SAwJxuwTdqHaY5l';
const provider = new ethers.JsonRpcProvider(ALCHEMY_GOERLI_URL);
// Create wallet object using private key and provider
const privateKey = '0x21ac72b6ce19661adf31ef0d2bf8c3fcad003deee3dc1a1a64f5fa3d6b049c06'
const wallet = new ethers.Wallet(privateKey, provider)

// 2. Declare WETH contract
// WETH ABI
const abiWETH = [
    "function balanceOf(address) public view returns(uint)",
    "function transfer(address, uint) public returns (bool)",
];
// WETH contract address (Goerli testnet)
const addressWETH = '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6' // WETH Contract
// Declare WETH contract
const contractWETH = new ethers.Contract(addressWETH, abiWETH, wallet)

// 3. Create HD wallet
console.log("\n1. Create HD wallet")
// Generate HD wallet using mnemonic phrase
const mnemonic = `air organ twist rule prison symptom jazz cheap rather dizzy verb glare jeans orbit weapon universe require tired sing casino business anxiety seminar hunt`
const hdNode = ethers.HDNodeWallet.fromPhrase(mnemonic)
console.log(hdNode);

// 4. Get 20 wallets from HD wallet
console.log("\n2. Derive 20 wallets from HD wallet")
const numWallet = 20
// Derivation path: m / purpose' / coin_type' / account' / change / address_index
// We only need to switch the last address_index to derive new wallets from hdNode
let basePath = "m/44'/60'/0'/0";
let wallets = [];
for (let i = 0; i < numWallet; i++) {
    let hdNodeNew = hdNode.derivePath(basePath + "/" + i);
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