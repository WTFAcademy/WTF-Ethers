import { ethers } from "ethers";
// 1. Create provider and wallet, recommend using wss connection for event listening instead of http
// Prepare alchemy API, can refer to https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md
const ALCHEMY_MAINNET_WSSURL = 'wss://eth-mainnet.g.alchemy.com/v2/oKmOQKbneVkxgHZfibs-iFhIlIAl6HDN';
const provider = new ethers.WebSocketProvider(ALCHEMY_MAINNET_WSSURL);
let network = provider.getNetwork()
network.then(res => console.log(`[${(new Date).toLocaleTimeString()}]Connected to chain-id:${res.chainId}`))

// 2. Create interface object for decoding transaction details.
const contractABI = [
    "function transfer(address, uint) public returns (bool)",
]
const iface = new ethers.utils.Interface(contractABI)

// 3. Get function signature.
const functionSignature = 'transfer(address,uint)'
const selector = iface.getSighash(functionSignature)
console.log(`Function selector is ${selector}`)

// 4. Listen to pending erc20 transfer transactions, get transaction details and decode them.
let j = 0
provider.on('pending', async (txHash) => {
    if (txHash) {
        const tx = await provider.getTransaction(txHash)
        j++
        if (tx !== null && tx.data.indexOf(selector) !== -1) {
            console.log(`[${(new Date).toLocaleTimeString()}]Listened to ${j + 1}th pending transaction:${txHash}`)
            console.log(`Print decoded transaction details:${JSON.stringify(iface.parseTransaction(tx), null, 2)}`)
            console.log(`Transfer target address:${iface.parseTransaction(tx).args[0]}`)
            console.log(`Transfer amount:${ethers.utils.formatEther(iface.parseTransaction(tx).args[1])}`)
            provider.removeListener('pending', this)
        }
    }
})