// contract.callStatic.函数名(参数)

import { ethers } from "ethers";

//准备 alchemy API  可以参考https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md 
const ALCHEMY_MAINNET_URL = 'https://eth-mainnet.g.alchemy.com/v2/oKmOQKbneVkxgHZfibs-iFhIlIAl6HDN';
const provider = new ethers.providers.JsonRpcProvider(ALCHEMY_MAINNET_URL);

// 利用私钥和provider创建wallet对象
const privateKey = '0x227dbb8586117d55284e26620bc76534dfbd2394be34cf4a09cb775d593b6f2b'
const wallet = new ethers.Wallet(privateKey, provider)

// WETH的ABI
const abiWETH = [
    "function balanceOf(address) public view returns(uint)",
    "function transfer(address, uint) public returns (bool)",
];
// WETH合约地址（Rinkeby测试网）
const addressWETH = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' // WETH Contract

// 创建WETH合约实例
const contractWETH = new ethers.Contract(addressWETH, abiWETH, wallet)


const main = async () => {

    const address = await wallet.getAddress()
    // 1. 读取WETH合约的链上信息
    console.log("\n1. 读取WETH余额")
    const balanceWETH = await contractWETH.balanceOf(address)
    console.log(`WETH持仓: ${ethers.utils.formatEther(balanceWETH)}\n`)


    // 2. 调用desposit()函数，将0.001 ETH转为WETH
    console.log("\n2. 利用callStatic，测试转账0.01 WETH能否成功")
    // 发起交易
    const tx = await contractWETH.callStatic.transfer("vitalik.eth", ethers.utils.parseEther("0.01"))
    console.log(`交易详情：`, tx)
}

main()
