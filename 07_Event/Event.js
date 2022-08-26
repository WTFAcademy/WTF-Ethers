// 声明只可写合约的规则：
// const contract = new ethers.Contract(address, abi, signer);
// 参数分别为合约地址`address`，合约ABI `abi`，Signer变量`signer`

import { ethers } from "ethers";
// playcode免费版不能安装ethers，用这条命令，需要从网络上import包（把上面这行注释掉）
// import { ethers } from "https://cdn-cors.ethers.io/lib/ethers-5.6.9.esm.min.js";

// 利用Infura的rpc节点连接以太坊网络
// 准备Infura API Key, 教程：https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL02_Infura/readme.md
const INFURA_ID = '184d4c5ec78243c290d151d3f1a10f1d'
// 连接rinkeby测试网
const provider = new ethers.providers.JsonRpcProvider(`https://rinkeby.infura.io/v3/${INFURA_ID}`)

// WETH ABI，只包含我们关心的Transfer事件
const abiWETH = [
    "event Transfer(address indexed from, address indexed to, uint amount)"
];

// 测试网WETH地址
const addressWETH = '0xc778417e063141139fce010982780140aa0cd5ab'
// 声明合约实例
const contract = new ethers.Contract(addressWETH, abiWETH, provider)

const main = async () => {
    // 得到当前block
    const block = await provider.getBlockNumber()
    console.log(`当前区块高度: ${block}`);
    // 获取过去10个block内的Transfer事件
    console.log("获取过去10个block内的Transfer事件，并打印出1个");
    const transferEvents = await contract.queryFilter('Transfer', block - 10, block)
    // 打印第1个Transfer事件
    console.log(transferEvents[0])
    // 解析Transfer事件的数据
    console.log("解析事件：")
    const amount = ethers.utils.formatUnits(ethers.BigNumber.from(transferEvents[0].args["amount"]), "ether");
    console.log(`地址 ${transferEvents[0].args["from"]} 转账 ${amount} WETH到地址 ${transferEvents[0].args["to"]}`)
}

main()
