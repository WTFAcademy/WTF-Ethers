import { ethers } from "ethers";

if (!process.env.TESTNET_RECIPIENT || !ethers.isAddress(process.env.TESTNET_RECIPIENT)) {
    throw new Error("Set TESTNET_RECIPIENT to an account on the test network.");
}
const account2 = process.env.TESTNET_RECIPIENT;
const privateKey = process.env.TESTNET_PRIVATE_KEY;
if (!privateKey) throw new Error("Set TESTNET_PRIVATE_KEY for a disposable test account.");
if (!process.env.TESTNET_RPC_URL) throw new Error("Set TESTNET_RPC_URL for Sepolia or a local devnet.");
const provider = new ethers.JsonRpcProvider(process.env.TESTNET_RPC_URL);
const wallet = new ethers.Wallet(privateKey, provider);
const account1 = wallet.address;

const main = async() => {
        //show account 1 balance before transfer
        const senderBalanceBefore = await provider.getBalance(account1)
        //show account 2 balance before transfer
        const receiverBalanceBefore = await provider.getBalance(account2)

        console.log(`\nSender balance before: ${ethers.formatEther(senderBalanceBefore)}\n`)
        console.log(`\nReceiver balance before: ${ethers.formatEther(receiverBalanceBefore)}\n`)

        // send ether
        const tx = await wallet.sendTransaction({
            to: account2, 
            value: ethers.parseEther("0.025") 
        })

        // fetch transaction or wait for transaction to be mined 
        await tx.wait()
        console.log(tx)

        //show account 1 balance after transfer
        const senderBalanceAfter = await provider.getBalance(account1)
        //show account 2 balance after transfer
        const receiverBalanceAfter = await provider.getBalance(account2)

        console.log(`\nSender balance after: ${ethers.formatEther(senderBalanceAfter)}\n`)
        console.log(`\nReceiver balance after: ${ethers.formatEther(receiverBalanceAfter)}\n`)
}

main()

/* Create a wallet object with a random private key
const randomWallet = ethers.Wallet.createRandom();
console.log("Address details:", randomWallet);
// you need to console log the private key or else it won't display automatically for security reasons
console.log("Private Key:", randomWallet.privateKey);

// // Create a wallet object from a mnemonic
const mnemonicWallet = ethers.Wallet.fromPhrase(mnemonic.phrase)
console.log(mnemonicWallet);
// you need to console log the private key or else it won't display automatically for security reasons
console.log("Private Key:", mnemonicWallet.privateKey); */
