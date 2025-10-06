// 获取交易的trace调用信息
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

// 递归输出所有调用
function logAllCalls(trace, depth = 0) {
  if (!trace) return;
  
  // console.log(trace);

  const indent = '  '.repeat(depth);
  
  console.log(`${indent}📞 调用信息:`);
  console.log(`${indent}   类型: ${trace.type}`);
  console.log(`${indent}   发送者: ${trace.from}`);
  console.log(`${indent}   接收者: ${trace.to}`);
  console.log(`${indent}   Gas: ${trace.gas}`);
  console.log(`${indent}   Gas使用: ${trace.gasUsed}`);
  console.log(`${indent}   值: ${trace.value || '0x0'}`);
  
  if (trace.input && trace.input.length > 10) {
    console.log(`${indent}   输入数据: ${trace.input.substring(0, 42)}...`);
  }
  
  if (trace.output && trace.output.length > 2) {
    console.log(`${indent}   输出数据: ${trace.output.substring(0, 42)}...`);
  }
  
  if (trace.error) {
    console.log(`${indent}   ❌ 错误: ${trace.error}`);
  }
  
  console.log(`${indent}   深度: ${depth}`);
  console.log('');
  
  // 递归处理子调用
  if (trace.calls && Array.isArray(trace.calls)) {
    console.log(`${indent}🔗 子调用 (${trace.calls.length}个):`);
    trace.calls.forEach((call, index) => {
      console.log(`${indent}--- 子调用 ${index + 1} ---`);
      logAllCalls(call, depth + 1);
    });
  }
}

// 主函数
async function traceTransaction() {
  const txHash = '0x6e942769ddc74773aaed4318a020b4dac30798530dadf4c72b8b4fe489f7ee86';
  
  console.log('🔍 获取交易trace调用信息');
  console.log('============================');
  console.log(`交易哈希: ${txHash}`);
  console.log(`RPC端点: ${RPC_URL}\n`);
  
  try {
    // 获取交易基本信息
    console.log('📋 获取交易基本信息...');
    const tx = await makeRPCCall('eth_getTransactionByHash', [txHash]);
    
    if (!tx) {
      throw new Error('交易未找到');
    }
    
    console.log(`✅ 交易信息:`);
    console.log(`   区块号: ${parseInt(tx.blockNumber, 16)}`);
    console.log(`   发送者: ${tx.from}`);
    console.log(`   接收者: ${tx.to || '合约创建'}`);
    console.log(`   Gas限制: ${parseInt(tx.gas, 16).toLocaleString()}`);
    console.log(`   Gas价格: ${parseInt(tx.gasPrice, 16)} wei`);
    console.log(`   值: ${tx.value} wei`);
    console.log('');
    
    // 获取交易回执
    console.log('📋 获取交易回执...');
    const receipt = await makeRPCCall('eth_getTransactionReceipt', [txHash]);
    
    if (receipt) {
      console.log(`✅ 交易回执:`);
      console.log(`   状态: ${receipt.status === '0x1' ? '✅ 成功' : '❌ 失败'}`);
      console.log(`   Gas使用: ${parseInt(receipt.gasUsed, 16).toLocaleString()}`);
      console.log(`   合约地址: ${receipt.contractAddress || '无'}`);
      console.log(`   日志数量: ${receipt.logs.length}`);
      console.log('');
    }
    
    // 获取trace调用
    console.log('🔍 获取trace调用信息...');
    const traceOptions = {
      tracer: "callTracer",
      timeout: "30s"
    };
    
    const trace = await makeRPCCall('debug_traceTransaction', [txHash, traceOptions]);
    
    console.log(trace);

    console.log('✅ Trace调用信息:');
    console.log('==================\n');
    
    // 输出所有调用
    logAllCalls(trace);
    
    console.log('✅ 分析完成!');
    
  } catch (error) {
    console.error('❌ 错误:', error.message);
  }
}

// 运行
traceTransaction(); 