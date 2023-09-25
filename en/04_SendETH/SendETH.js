// Sending ETH using the Wallet class
// Since playcode does not support the ethers.Wallet.createRandom() function, we can only run this code in VScode
import { ethers } from "ethers";

// Connect to the Ethereum test network using Alchemy's rpc node
// You can refer to https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md for setting up Alchemy API
const ALCHEMY_GOERLI_URL = 'https://eth-goerli.alchemyapi.io/v2/GlaeWuylnNM3uuOo-SAwJxuwTdqHaY5l';
const provider = new ethers.JsonRpcProvider(ALCHEMY_GOERLI_URL);

// Create a random wallet object
const wallet1 = ethers.Wallet.createRandom()
const wallet1WithProvider = wallet1.connect(provider)
const mnemonic = wallet1.mnemonic // Retrieve the mnemonic phrase

// Create wallet object using the private key and provider
const privateKey = '0x227dbb8586117d55284e26620bc76534dfbd2394be34cf4a09cb775d593b6f2b'
const wallet2 = new ethers.Wallet(privateKey, provider)

// Create wallet object from mnemonic phrase
const wallet3 = ethers.Wallet.fromPhrase(mnemonic.phrase)

const main = async () => {
    // 1. Get wallet addresses
    const address1 = await wallet1.getAddress()
    const address2 = await wallet2.getAddress() 
    const address3 = await wallet3.getAddress() // Retrieve the addresses
    console.log(`1. Get wallet addresses`);
    console.log(`Wallet 1 address: ${address1}`);
    console.log(`Wallet 2 address: ${address2}`);
    console.log(`Wallet 3 address: ${address3}`);
    console.log(`Are wallets 1 and 3 addresses the same: ${address1 === address3}`);
    
    // 2. Get the mnemonic phrase
    console.log(`\n2. Get the mnemonic phrase`);
    console.log(`Wallet 1 mnemonic phrase: ${wallet1.mnemonic.phrase}`)
    // Note: Wallets generated from private keys do not have a mnemonic phrase
    // console.log(wallet2.mnemonic.phrase)

    // 3. Get the private keys
    console.log(`\n3. Get the private keys`);
    console.log(`Wallet 1 private key: ${wallet1.privateKey}`)
    console.log(`Wallet 2 private key: ${wallet2.privateKey}`)

    // 4. Get the transaction count on the chain
    console.log(`\n4. Get the transaction count on the chain`);
    const txCount1 = await provider.getTransactionCount(wallet1WithProvider)
    const txCount2 = await provider.getTransactionCount(wallet2)
    console.log(`Wallet 1 transaction count: ${txCount1}`)
    console.log(`Wallet 2 transaction count: ${txCount2}`)

    // 5. Send ETH
    // If this wallet doesn't have any goerli testnet ETH, you can go to a faucet and claim some, wallet address: 0xe16C1623c1AA7D919cd2241d8b36d9E79C1Be2A2
    // 1. chainlink faucet: https://faucets.chain.link/goerli
    // 2. paradigm faucet: https://faucet.paradigm.xyz/
    console.log(`\n5. Send ETH (testnet)`);
    // i. Print balance before sending
    console.log(`i. Balance before sending`)
    console.log(`Wallet 1: ${ethers.formatEther(await provider.getBalance(wallet1WithProvider))} ETH`)
    console.log(`Wallet 2: ${ethers.formatEther(await provider.getBalance(wallet2))} ETH`)
    // ii. Construct the transaction request, with 'to' as the receiving address and 'value' as the ETH amount
    const tx = {
        to: address1,
        value: ethers.parseEther("0.001")
    }
    // iii. Send the transaction and get the receipt
    console.log(`\nii. Waiting for the transaction to be confirmed on the blockchain (may take a few minutes)`)
    const receipt = await wallet2.sendTransaction(tx)
    await receipt.wait() // Wait for the transaction to be confirmed on the chain
    console.log(receipt) // Print transaction details
    // iv. Print balance after sending
    console.log(`\niii. Balance after sending`)
    console.log(`Wallet 1: ${ethers.formatEther(await provider.getBalance(wallet1WithProvider))} ETH`)
    console.log(`Wallet 2: ${ethers.formatEther(await provider.getBalance(wallet2))} ETH`)
}

main()