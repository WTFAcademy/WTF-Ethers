// 声明只读合约的规则：
// 参数分别为合约地址`address`，合约ABI `abi`，Provider变量`provider`
// const contract = new ethers.Contract(`address`, `abi`, `provider`);

import { ethers } from "ethers";
// playcode免费版不能安装ethers，用这条命令，需要从网络上import包（把上面这行注释掉）
// import { ethers } from "https://cdn-cors.ethers.io/lib/ethers-5.6.9.esm.min.js";

// 利用Infura的rpc节点连接以太坊网络
// 准备Infura API Key, 教程：https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL02_Infura/readme.md
const INFURA_ID = '184d4c5ec78243c290d151d3f1a10f1d'
// 连接以太坊主网
const provider = new ethers.providers.JsonRpcProvider(`https://rinkeby.infura.io/v3/${INFURA_ID}`)


// 第2种输入abi的方式：输入程序需要用到的函数，逗号分隔，ethers会自动帮你转换成相应的abi
// 人类可读abi，以ERC20合约为例
const abiERC20 = [
    "function increment() external view returns(uint)",
];
// 代理合约: 0x9e5654cc8e0a147e1Dc884F462195E2d0313c63D
// Implementation合约: 0x748e00F7cD688a5Ab100F004Cb64F99b854cd72D
const addressDAI = '0x9e5654cc8e0a147e1Dc884F462195E2d0313c63D' // DAI Contract
const contractDAI = new ethers.Contract(addressDAI, abiERC20, provider)


const main = async () => {
    // 2. 读取DAI合约的链上信息（IERC20接口合约）
    const number = await contractDAI.increment()
    console.log("\n2. 读取Logic合约信息")
    console.log(`合约地址: ${addressDAI}`)
    console.log(`输出: ${number}`)
}

main()