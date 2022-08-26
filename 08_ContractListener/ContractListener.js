const { ethers } = require('ethers');

//准备 alchemy API  可以参考https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md 
const ALCHEMY_MAINNET_URL = 'YOUR_ALCHEMY_MAINNET_URL';

const provider = new ethers.providers.JsonRpcProvider(ALCHEMY_MAINNET_URL);
// 合约地址
const contractAddress = '0xdac17f958d2ee523a2206206994597c13d831ec7'
// 交易所地址
const balanceAccount = '0x28C6c06298d514Db089934071355E5743bf21d60'
// 构建ABI
const abi = [
  "event Transfer(address indexed from, address indexed to, uint value)"
];
// 构建合约对象
const contractUSDT = new ethers.Contract(contractAddress, abi, provider);


(async () => {
  try {
    console.log('start');
    // 创建过滤器，监听转移USDT进交易所
    let filterBinanceIn = contractUSDT.filters.Transfer(null, balanceAccount);
    console.log(filterBinanceIn);
	// 创建过滤器，监听交易所转出USDT
    let filterToBinanceOut = contractUSDT.filters.Transfer(balanceAccount, null);
    console.log(filterToBinanceOut);
    console.log('In');
    contractUSDT.on(filterBinanceIn, (from, to, value) => {
      console.log('---------监听USDT进入交易所--------');
      console.log(
        `${from} -> ${to} ${ethers.BigNumber.from(value).toString()}`
      )
    }).on('error', (error) => {
      console.log(error)
    })
    console.log('out');
    contractUSDT.on(filterToBinanceOut, (from, to, value) => {
      console.log('---------监听USDT转出交易所--------');
      console.log(
        `${from} -> ${to} ${ethers.BigNumber.from(value).toString()}`
      )
    }
    ).on('error', (error) => {
      console.log(error)
    });
  } catch (e) {
    console.log(e);
  }
})()