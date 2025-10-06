// 用 debug_traceBlockByNumber 检测合约创建

// RPC端点
const RPC_URL = "https://api.zan.top/bsc-mainnet";

// RPC调用函数
async function makeRPCCall(method, params = []) {
  const response = await fetch(RPC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method,
      params,
      id: Date.now()
    })
  });

  const data = await response.json();
  
  if (data.error) {
    throw new Error(`RPC错误: ${data.error.message}`);
  }
  
  return data.result;
}

// 分析调用追踪中的合约创建
function findContractCreations(trace, txHash) {
  const creations = [];
  
  if (!trace) return creations;
  
  // 检查是否为合约创建
  if (trace.type === 'CREATE' || trace.type === 'CREATE2') {
    creations.push({
      txHash: txHash,
      type: trace.type,
      creator: trace.from,
      contractAddress: trace.to,
      gasUsed: trace.gasUsed,
      success: !trace.error
    });
  }
  
  // 递归检查子调用
  if (trace.calls && Array.isArray(trace.calls)) {
    for (const call of trace.calls) {
      creations.push(...findContractCreations(call, txHash));
    }
  }
  
  return creations;
}

// 使用 debug_traceBlockByNumber 分析区块
async function analyzeBlock(blockNumber) {
  console.log(`🔍 分析区块 ${blockNumber}...`);
  
  try {
    const blockHex = '0x' + blockNumber.toString(16);
    
    // 获取区块信息
    const block = await makeRPCCall('eth_getBlockByNumber', [blockHex, true]);
    
    if (!block) {
      throw new Error('区块未找到');
    }
    
    console.log(` 区块 ${blockNumber} - 交易数量: ${block.transactions.length}`);
    
    // 批量追踪整个区块
    const traceOptions = {
      tracer: "callTracer",
      timeout: "30s"
    };
    
    console.log(' 执行批量追踪...');
    const blockTraces = await makeRPCCall('debug_traceBlockByNumber', [blockHex, traceOptions]);
    

    console.log(` 获取到 ${blockTraces.length} 个交易的追踪数据`);
    // console.log(blockTraces)
    // 分析合约创建
    const allCreations = [];
    let directCreations = 0;
    let internalCreations = 0;
    
    for (let i = 0; i < blockTraces.length; i++) {
      const traceResult = blockTraces[i];
      const tx = block.transactions[i];
      
      if (!traceResult || traceResult.error) {
        continue;
      }
      
      // 统一使用trace数据检查所有合约创建
      if (traceResult.result) {
        const creations = findContractCreations(traceResult.result, tx.hash);
        
        if (creations.length > 0) {
          // 区分直接创建和内部创建
          const isDirectCreation = !tx.to;
          
          if (isDirectCreation) {
            console.log(`🏗️  直接合约创建: ${tx.hash} (${creations.length}个)`);
            directCreations += creations.length;
            // 标记为直接创建
            creations.forEach(creation => {
              creation.type = 'direct';
            });
          } else {
            console.log(`🏭 内部合约创建: ${tx.hash} (${creations.length}个)`);
            internalCreations += creations.length;
            // 标记为内部创建
            creations.forEach(creation => {
              creation.type = 'internal';
            });
          }
          
          allCreations.push(...creations);
        }
      }
    }
    
    // 输出结果
    console.log('\n 分析结果:');
    console.log(`   直接合约创建: ${directCreations}`);
    console.log(`   内部合约创建: ${internalCreations}`);
    console.log(`   总合约创建: ${allCreations.length}`);
    
    if (allCreations.length > 0) {
      console.log('\n 合约创建列表:');
      allCreations.forEach((creation, index) => {
        console.log(`${index + 1}. ${creation.type} - ${creation.contractAddress}`);
        console.log(`   创建者: ${creation.creator}`);
        console.log(`   交易: ${creation.txHash}`);
      });
    }
    
    return allCreations;
    
  } catch (error) {
    console.error(' 错误:', error.message);
    return [];
  }
}

// 获取当前区块号
async function getCurrentBlock() {
  try {
    const blockNumber = await makeRPCCall('eth_blockNumber', []);
    return parseInt(blockNumber, 16);
  } catch (error) {
    return 23433800; // 默认区块号
  }
}

// 主函数
async function main() {
  const blockNumber = parseInt(process.argv[2]) || await getCurrentBlock();

  console.log(`RPC端点: ${RPC_URL}`);
  console.log(`目标区块: ${blockNumber}\n`);
  
  const creations = await analyzeBlock(blockNumber);
  
  console.log('\n 分析完成!');
  return creations;
}

main()