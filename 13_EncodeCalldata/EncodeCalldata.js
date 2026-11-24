// Interface 接口类
// 利用abi生成
// const iface = new ethers.Interface(abi)
// 直接从contract中获取
// const interface2 = contract.interface
import { ethers } from "ethers";

const { SEPOLIA_RPC_URL, SEPOLIA_WETH_ADDRESS, TESTNET_PRIVATE_KEY } = process.env;
if (!SEPOLIA_RPC_URL || !ethers.isAddress(SEPOLIA_WETH_ADDRESS ?? "")) {
    throw new Error("Set SEPOLIA_RPC_URL and SEPOLIA_WETH_ADDRESS.");
}
if (!/^0x[0-9a-fA-F]{64}$/.test(TESTNET_PRIVATE_KEY ?? "")) {
    throw new Error("Set TESTNET_PRIVATE_KEY to a 32-byte test wallet key with the 0x prefix.");
}
const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
const wallet = new ethers.Wallet(TESTNET_PRIVATE_KEY, provider)

// WETH的ABI
const abiWETH = [
    "function balanceOf(address) public view returns(uint)",
    "function deposit() public payable",
];
// WETH合约地址（Sepolia测试网）
const addressWETH = SEPOLIA_WETH_ADDRESS

// 声明WETH合约
const contractWETH = new ethers.Contract(addressWETH, abiWETH, wallet)

const main = async () => {
    const network = await provider.getNetwork();
    if (network.chainId !== 11155111n) {
        throw new Error("The configured RPC must be on Sepolia.");
    }

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
    const balanceData = await provider.call(tx1)
    const [balanceWETH] = contractWETH.interface.decodeFunctionResult("balanceOf", balanceData)
    console.log(`存款前WETH持仓: ${ethers.formatEther(balanceWETH)}\n`)

    //读取钱包内ETH余额
    const balanceETH = await provider.getBalance(wallet)
    // 如果钱包ETH足够
    if(balanceETH > ethers.parseEther("0.0015")){

        // 2. 调用deposit()函数，将0.001 ETH转为WETH
        console.log("\n2. 调用deposit()函数，存入0.001 ETH")
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
        console.log("ETH不足，去水龙头领一些Sepolia ETH")
        console.log("1. chainlink水龙头: https://faucets.chain.link/sepolia")
    }
}

main()


