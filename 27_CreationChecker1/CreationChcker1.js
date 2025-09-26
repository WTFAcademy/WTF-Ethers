// 验证合约创建1 - 检查 receipt 确认成功
// 使用方法: node ContractCreationValidation.js [区块号]
import { ethers } from "ethers";

const RPC_URL = 'https://bsc-rpc.publicnode.com';
const provider = new ethers.JsonRpcProvider(RPC_URL);

// 检查是否为合约创建尝试
function isContractCreationAttempt(tx) {
    return tx.to === null && tx.data && tx.data.length > 2;
}

// 完整验证合约创建是否成功，返回详细信息
async function validateContractCreation(tx) {
    // 1. 基本检查
    if (!isContractCreationAttempt(tx)) {
        return { success: false, reason: '不是合约创建' };
    }
    
    try {
        // 2. 获取交易回执
        const receipt = await provider.getTransactionReceipt(tx.hash);
        
        // 3. 检查执行状态和合约地址
        if (!receipt || receipt.status !== 1 || !receipt.contractAddress) {
            return { 
                success: false, 
                reason: !receipt ? '无回执' : receipt.status !== 1 ? '执行失败' : '无合约地址' 
            };
        }
        
        // console.log(tx)

        // 4. 获取合约地址的代码
        const code = await provider.getCode(receipt.contractAddress);
        
        // 5. 返回成功信息
        return {
            success: true,
            receipt,
            code,
            contractAddress: receipt.contractAddress,
            gasUsed: receipt.gasUsed?.toString(),
            codeLength: code.length
        };
        
    } catch (error) {
        return { success: false, reason: `验证出错: ${error.message}` };
    }
}

// 分析区块中的成功合约创建
async function analyzeSuccessfulContractCreations(blockNumber) {
    console.log(`🔍 分析区块 ${blockNumber} 的成功合约创建\n`);
    
    try {
        const block = await provider.getBlock(blockNumber, true);
        
        if (!block || !block.prefetchedTransactions) {
            console.log('   无法获取区块数据');
            return [];
        }
        
        console.log(`   区块 ${block.number} (${block.hash})`);
        console.log(`   交易数量: ${block.prefetchedTransactions.length}`);
        console.log(`   时间戳: ${new Date(block.timestamp * 1000).toLocaleString('zh-CN')}`);
        

        // console.log(`block.prefetchedTransactions: `, block.prefetchedTransactions)
        // 1. 筛选合约创建尝试
        const attempts = block.prefetchedTransactions.filter(isContractCreationAttempt);
        console.log(`\n发现 ${attempts.length} 个合约创建尝试`);
        
        if (attempts.length === 0) {
            console.log('该区块中没有合约创建尝试');
            return [];
        }
        
        // 2. 验证哪些成功了
        const successfulCreations = [];
        
        for (let i = 0; i < attempts.length; i++) {
            const tx = attempts[i];
            console.log(`\n${i + 1}. 验证交易: ${tx.hash}`);
            
            const validation = await validateContractCreation(tx);
            
            if (validation.success) {
                // 使用验证函数返回的信息，避免重复RPC调用
                const creation = {
                    txHash: tx.hash,
                    from: tx.from,
                    contractAddress: validation.contractAddress,
                    gasUsed: validation.gasUsed,
                    gasLimit: tx.gasLimit?.toString(),
                    gasPrice: ethers.formatUnits(tx.gasPrice || 0, 'gwei'),
                    codeLength: validation.codeLength,
                    dataLength: tx.data.length
                };
                
                successfulCreations.push(creation);
                
                console.log(`      成功创建合约`);
                console.log(`      合约地址: ${creation.contractAddress}`);
                console.log(`      Gas使用: ${creation.gasUsed}`);
                console.log(`      代码长度: ${creation.codeLength} 字符`);
            } else {
                console.log(`      创建失败: ${validation.reason}`);
            }
            
            // 添加延迟
            if (i < attempts.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }
        
        console.log(`\n 统计结果:`);
        console.log(`   合约创建尝试: ${attempts.length}`);
        console.log(`   成功创建: ${successfulCreations.length}`);
        console.log(`   成功率: ${attempts.length > 0 ? (successfulCreations.length / attempts.length * 100).toFixed(1) : 0}%`);
        
        if (successfulCreations.length > 0) {
            console.log(`\n 成功创建的合约:`);
            successfulCreations.forEach((creation, index) => {
                console.log(`${index + 1}. ${creation.contractAddress} (${creation.txHash})`);
            });
        }
        
        return successfulCreations;
        
    } catch (error) {
        console.error(` 分析失败:`, error.message);
        return [];
    }
}

// 主函数
async function main() {
    const blockNumber = parseInt(process.argv[2]) || 62416961;
    
    console.log('合约创建验证');
    console.log('=========================================\n');
    
    const creations = await analyzeSuccessfulContractCreations(blockNumber);
}

main().catch(console.error); 