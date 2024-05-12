// Send ETH using the Wallet class
import { ethers } from "ethers";
// Connect to the Ethereum test network using the Infura or Alchemy RPC node
const provider = new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/8b9750710d56460d940aeff47967c4ba`)

const INFURA_SEPOLIA_URL = 'https://sepolia.infura.io/v3/8b9750710d56460d940aeff47967c4ba';
const provider = new ethers.JsonRpcProvider(INFURA_SEPOLIA_URL);

// Send ETH using the Wallet class
import { ethers } from "ethers";
// Connect to the Ethereum test network using the Infura or Alchemy RPC node
const provider = new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/8b9750710d56460d940aeff47967c4ba`)

// Input your testwallet(sender) with the private key and a random receiver address
const account1 ='0xD616f5A49571e7BCb1BB5326031bC8078BDA9Faa' //sender
const account2 = '0x70e8dE73cE538DA2bEEd35d14187F6959a8ecA96' //recipient

const privateKey1 = 'cd82a7d0d6e528322e8c26f9ccbc18767543786d073c48ef38a753f29b1e8f39' //sender private key
const wallet = new ethers.Wallet(privateKey1, provider)

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
