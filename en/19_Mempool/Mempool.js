// provider.on("pending", listener)
import { ethers } from "ethers";

// 1. Create provider and wallet, recommend using wss connection instead of http when listening for events
console.log("\n1. Connecting to wss RPC")
// Prepare alchemy API, can refer to https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md 
const ALCHEMY_MAINNET_WSSURL = 'wss://eth-mainnet.g.alchemy.com/v2/oKmOQKbneVkxgHZfibs-iFhIlIAl6HDN';
const provider = new ethers.WebSocketProvider(ALCHEMY_MAINNET_WSSURL);
let network = provider.getNetwork()
// network.then(res => console.log(`[${(new Date).toLocaleTimeString()}] Connected to chain ID ${res.chainId}`));

console.log("\n2. Rate limiting the rpc interface calls")
// 2. Limit the rate of accessing rpc, otherwise the call frequency will exceed the limit and result in errors.
function throttle(fn, delay) {
    let timer;
    return function(){
        if(!timer) {
            fn.apply(this, arguments)
            timer = setTimeout(()=>{
                clearTimeout(timer)
                timer = null
            },delay)
        }
    }
}

const main = async () => {
    let i = 0;
    // 3. Listen for pending transactions and get txHash
    console.log("\n3. Listen for pending transactions and print txHash.")
    provider.on("pending", async (txHash) => {
        if (txHash && i < 100) {
            // Print txHash
            console.log(`[${(new Date).toLocaleTimeString()}] Listening for Pending transaction ${i}: ${txHash} \r`);
            i++
            }
    });

    // 4. Listen for pending transactions and get transaction details
    console.log("\n4. Listen for pending transactions, get txHash, and output transaction details.")
    let j = 0
    provider.on("pending", throttle(async (txHash) => {
        if (txHash && j <= 100) {
            // Get tx details
            let tx = await provider.getTransaction(txHash);
            console.log(`\n[${(new Date).toLocaleTimeString()}] Listening for Pending transaction ${j}: ${txHash} \r`);
            console.log(tx);
            j++
            }
    }, 1000));
};

main()