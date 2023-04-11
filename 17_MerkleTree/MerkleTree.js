import { ethers } from "ethers";
import { MerkleTree } from "merkletreejs";
import * as contractJson from "./contract.json" assert {type: "json"};

// 1. 生成merkle tree
console.log("\n1. 生成merkle tree")
// 白名单地址
const tokens = [
    "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4", 
    "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2",
    "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db",
    "0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB"
];
// leaf, merkletree, proof
const leaf       = tokens.map(x => ethers.keccak256(x))
const merkletree = new MerkleTree(leaf, ethers.keccak256, { sortPairs: true });
const proof      = merkletree.getHexProof(leaf[0]);
const root = merkletree.getHexRoot()
console.log("Leaf:")
console.log(leaf)
console.log("\nMerkleTree:")
console.log(merkletree.toString())
console.log("\nProof:")
console.log(proof)
console.log("\nRoot:")
console.log(root)

// 2. 创建provider和wallet
// 准备 alchemy API 可以参考https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md 
const ALCHEMY_GOERLI_URL = 'https://eth-goerli.alchemyapi.io/v2/GlaeWuylnNM3uuOo-SAwJxuwTdqHaY5l';
const provider = new ethers.JsonRpcProvider(ALCHEMY_GOERLI_URL);
// 利用私钥和provider创建wallet对象
const privateKey = '0x227dbb8586117d55284e26620bc76534dfbd2394be34cf4a09cb775d593b6f2b'
const wallet = new ethers.Wallet(privateKey, provider)

// 3. 创建合约工厂
// NFT的人类可读abi
const abiNFT = [
    "constructor(string memory name, string memory symbol, bytes32 merkleroot)",
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function mint(address account, uint256 tokenId, bytes32[] calldata proof) external",
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

const main = async () => {
    // 读取钱包内ETH余额
    const balanceETH = await provider.getBalance(wallet)

    // 如果钱包ETH足够
    if(ethers.formatEther(balanceETH) > 0.002){
        // 4. 利用contractFactory部署NFT合约
        console.log("\n2. 利用contractFactory部署NFT合约")
        // 部署合约，填入constructor的参数
        const contractNFT = await factoryNFT.deploy("WTF Merkle Tree", "WTF", root)
        console.log(`合约地址: ${contractNFT.target}`);
        console.log("等待合约部署上链")
        await contractNFT.waitForDeployment()
        // 也可以用 contractNFT.deployTransaction.wait()
        console.log("合约已上链")

        // 5. 调用mint()函数，利用merkle tree验证白名单，给第0个地址铸造NFT
        console.log("\n3. 调用mint()函数，利用merkle tree验证白名单，给第一个地址铸造NFT")
        console.log(`NFT名称: ${await contractNFT.name()}`)
        console.log(`NFT代号: ${await contractNFT.symbol()}`)
        let tx = await contractNFT.mint(tokens[0], "0", proof)
        console.log("铸造中，等待交易上链")
        await tx.wait()
        console.log(`mint成功，地址${tokens[0]} 的NFT余额: ${await contractNFT.balanceOf(tokens[0])}\n`)

    }else{
        // 如果ETH不足
        console.log("ETH不足，去水龙头领一些Goerli ETH")
        console.log("1. alchemy水龙头: https://goerlifaucet.com/")
        console.log("2. paradigm水龙头: https://faucet.paradigm.xyz/")
    }
}

main()
