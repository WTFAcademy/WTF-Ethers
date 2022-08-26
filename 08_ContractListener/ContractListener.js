import { ethers } from "ethers";

//准备 alchemy API  可以参考https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md 
const ALCHEMY_MAINNET_URL = 'YOUR_ALCHEMY_MAINNET_URL';

// 连接主网的提供者
const provider = new ethers.providers.JsonRpcProvider(ALCHEMY_MAINNET_URL);
// USDT的合约地址
const contractAddress = '0xdac17f958d2ee523a2206206994597c13d831ec7'

// 构建USDT的Transfer的ABI
const abi = [
  "event Transfer(address indexed from, address indexed to, uint value)"
];
// 生成USDT合约对象
const contractUSDT = new ethers.Contract(contractAddress, abi, provider);


(async ()=>{
  try{
  // 监听USDT合约
    contractUSDT.on('Transfer', (from, to, value)=>{
      console.log(
        `${from} -> ${to} ${ethers.BigNumber.from(value).toString()}`
      )
    })
  }catch(e){
    console.log(e);
  } 
})()