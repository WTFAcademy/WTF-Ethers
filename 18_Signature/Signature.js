// 通过签名分发NFT白名单流程：
//    
//    在服务器保管signer钱包的私钥-公钥对
// -> 在服务器记录allowlist（白名单地址）和tokenId，并生成对应的msgHash，
// -> 用signer钱包给msgHash签名
// -> 部署NFT合约，初始化时signer的公钥保存在合约中。
// -> 用户mint时填地址和tokenId，并向服务器请求签名。
// -> 调用合约的mint()函数进行铸造

import { ethers } from "ethers";
import * as contractJson from "./contract.json" assert {type: "json"};

// 1. 创建provider和wallet
// 准备 alchemy API 可以参考https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md 
const ALCHEMY_GOERLI_URL = 'https://eth-goerli.alchemyapi.io/v2/GlaeWuylnNM3uuOo-SAwJxuwTdqHaY5l';
const provider = new ethers.JsonRpcProvider(ALCHEMY_GOERLI_URL);
// 利用私钥和provider创建wallet对象
const privateKey = '0x227dbb8586117d55284e26620bc76534dfbd2394be34cf4a09cb775d593b6f2b'
const wallet = new ethers.Wallet(privateKey, provider)

// 2. 根据allowlist地址和tokenId生成msgHash，并签名
console.log("\n1. 生成签名")
// 创建消息
const account = "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4"
const tokenId = "0"
// 等效于Solidity中的keccak256(abi.encodePacked(account, tokenId))
const msgHash = ethers.solidityPackedKeccak256(
    ['address', 'uint256'],
    [account, tokenId])
console.log(`msgHash：${msgHash}`)

const main = async () => {
    // 签名
    const messageHashBytes = ethers.getBytes(msgHash)
    const signature = await wallet.signMessage(messageHashBytes);
    console.log(`签名：${signature}`)

    // 3. 创建合约工厂
    // NFT的人类可读abi
    const abiNFT = [
        "constructor(string memory _name, string memory _symbol, address _signer)",
        "function name() view returns (string)",
        "function symbol() view returns (string)",
        "function mint(address _account, uint256 _tokenId, bytes memory _signature) external",
        "function ownerOf(uint256) view returns (address)",
        "function balanceOf(address) view returns (uint256)",
    ];
    // 合约字节码，在remix中，你可以在两个地方找到Bytecode
    // i. 部署面板的Bytecode按钮
    // ii. 文件面板artifact文件夹下与合约同名的json文件中
    // 里面"object"字段对应的数据就是Bytecode，挺长的，608060起始
    // "object": "608060405260646000553480156100...
    const bytecodeNFT = contractJson.default.object;
    const factoryNFT = new ethers.ContractFactory(abiNFT, bytecodeNFT, wallet);

    // 读取钱包内ETH余额
    const balanceETH = await provider.getBalance(wallet)

    // 如果钱包ETH足够
    if(ethers.formatEther(balanceETH) > 0.002){
        // 4. 利用contractFactory部署NFT合约
        console.log("\n2. 利用contractFactory部署NFT合约")
        // 部署合约，填入constructor的参数
        const contractNFT = await factoryNFT.deploy("WTF Signature", "WTF", wallet.address)
        console.log(`合约地址: ${contractNFT.target}`);
        console.log("等待合约部署上链")
        await contractNFT.waitForDeployment()
        // 也可以用 contractNFT.deployTransaction.wait()
        console.log("合约已上链")

        // 5. 调用mint()函数，利用签名验证白名单，给account地址铸造NFT
        console.log("\n3. 调用mint()函数，利用签名验证白名单，给第一个地址铸造NFT")
        console.log(`NFT名称: ${await contractNFT.name()}`)
        console.log(`NFT代号: ${await contractNFT.symbol()}`)
        let tx = await contractNFT.mint(account, tokenId, signature)
        console.log("铸造中，等待交易上链")
        await tx.wait()
        console.log(`mint成功，地址${account} 的NFT余额: ${await contractNFT.balanceOf(account)}\n`)

    }else{
        // 如果ETH不足
        console.log("ETH不足，去水龙头领一些Goerli ETH")
        console.log("1. chainlink水龙头: https://faucets.chain.link/goerli")
        console.log("2. paradigm水龙头: https://faucet.paradigm.xyz/")
    }
}

main()