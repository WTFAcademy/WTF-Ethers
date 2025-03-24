import {ethers} from "ethers";

// 配置
const WALLET_ADDRESS = `0x220866B1A2219f40e72f5c628B65D54268cA3A9D`;

// 使用 Alchemy 的 RPC 节点连接以太坊网络
// 准备 Alchemy API 可以参考 https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md
const ALCHEMY_GOERLI_URL = 'https://eth-goerli.alchemyapi.io/v2/GlaeWuylnNM3uuOo-SAwJxuwTdqHaY5l';
const provider = new ethers.JsonRpcProvider(ALCHEMY_GOERLI_URL);

async function monitorWallet() {
    console.log(`开始监控钱包: ${WALLET_ADDRESS}`);

    // 获取初始余额
    let previousBalance = await provider.getBalance(WALLET_ADDRESS);
    console.log(`初始余额: ${ethers.formatEther(previousBalance)} ETH`);

    // 监听新区块
    provider.on('block', async (blockNumber) => {
        console.log(`新区块: ${blockNumber}`);

        // 检查余额变化
        const currentBalance = await provider.getBalance(WALLET_ADDRESS);
        if (currentBalance !== previousBalance) {
            console.log(`余额变化: ${ethers.formatEther(currentBalance)} ETH`);
            previousBalance = currentBalance;
        }

        // 获取区块
        const block = await provider.getBlock(blockNumber);

        // 检查交易
        if (block && block.transactions) {
            for (const txHash of block.transactions) {
                const tx = await provider.getTransaction(txHash);

                if (!tx) continue;

                if (tx.from && tx.from.toLowerCase() === WALLET_ADDRESS.toLowerCase() ||
                    (tx.to && tx.to.toLowerCase() === WALLET_ADDRESS.toLowerCase())) {

                    console.log(`检测到交易: ${tx.hash}`);
                    console.log(`从: ${tx.from}`);
                    console.log(`到: ${tx.to || 'Contract Creation'}`);
                    console.log(`金额: ${ethers.formatEther(tx.value)} ETH`);

                    // 检查是否是合约交互
                    if (tx.data && tx.data !== '0x') {
                        console.log('检测到合约交互');

                        // 获取交易收据以查看事件日志
                        const receipt = await provider.getTransactionReceipt(tx.hash);

                        if (receipt && receipt.logs) {
                            console.log(`事件日志数量: ${receipt.logs.length}`);

                            for (const log of receipt.logs) {
                                console.log(`  事件主题: ${log.topics[0]}`);
                                console.log(`  合约地址: ${log.address}`);
                            }
                        }
                    }

                    console.log('---');
                }
            }
        }
    });
}

monitorWallet().catch(console.error);
