// Interface 接口类
// 利用abi生成
// const interface = ethers.Interface(abi)
// 直接从contract中获取
// const interface2 = contract.interface
import { ethers } from "ethers";

//准备 alchemy API 可以参考https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md 
const ALCHEMY_GOERLI_URL = 'https://eth-goerli.alchemyapi.io/v2/GlaeWuylnNM3uuOo-SAwJxuwTdqHaY5l';
const provider = new ethers.JsonRpcProvider(ALCHEMY_GOERLI_URL);

// 利用私钥和provider创建wallet对象
const privateKey = '0x227dbb8586117d55284e26620bc76534dfbd2394be34cf4a09cb775d593b'
const wallet = new ethers.Wallet(privateKey, provider)

// WETH的ABI
const abiWETH = [
    "function balanceOf(address) public view returns(uint)",
    "function deposit() public payable",
];
// WETH合约地址（Goerli测试网）
const addressWETH = '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6'

// 声明WETH合约
const contractWETH = new ethers.Contract(addressWETH, abiWETH, wallet)

const main = async () => {

    const address = await wallet.getAddress()
    // 1. 读取WETH合约的链上信息（WETH abi）
    console.log("\n1. 读取WETH余额")
    // 编码calldata
    const param1 = contractWETH.interface.encodeFunctionData(
        "balanceOf",
        [address]
      );
    console.log(`编码结果： ${param1}`)
    // 创建交易
    const tx1 = {
        to: addressWETH,
        data: param1
    }
    // 发起交易，可读操作（view/pure）可以用 provider.call(tx)
    const balanceWETH = await provider.call(tx1)
    console.log(`存款前WETH持仓: ${ethers.formatEther(balanceWETH)}\n`)

    //读取钱包内ETH余额
    const balanceETH = await provider.getBalance(wallet)
    // 如果钱包ETH足够
    if(ethers.formatEther(balanceETH) > 0.0015){

        // 2. 调用desposit()函数，将0.001 ETH转为WETH
        console.log("\n2. 调用desposit()函数，存入0.001 ETH")
        // 编码calldata
        const param2 = contractWETH.interface.encodeFunctionData(
            "deposit"          
            );
        console.log(`编码结果： ${param2}`)
        // 创建交易
        const tx2 = {
            to: addressWETH,
            data: param2,
            value: ethers.parseEther("0.001")}
        // 发起交易，写入操作需要 wallet.sendTransaction(tx)
        const receipt1 = await wallet.sendTransaction(tx2)
        // 等待交易上链
        await receipt1.wait()
        console.log(`交易详情：`)
        console.log(receipt1)
        const balanceWETH_deposit = await contractWETH.balanceOf(address)
        console.log(`存款后WETH持仓: ${ethers.formatEther(balanceWETH_deposit)}\n`)

    }else{
        // 如果ETH不足
        console.log("ETH不足，去水龙头领一些Goerli ETH")
        console.log("1. chainlink水龙头: https://faucets.chain.link/goerli")
        console.log("2. paradigm水龙头: https://faucet.paradigm.xyz/")
    }
}

main()


