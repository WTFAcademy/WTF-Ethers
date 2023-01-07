import { ethers } from "ethers";
import { FlashbotsBundleProvider } from "@flashbots/ethers-provider-bundle";

// 1. 普通rpc （非flashbots）
const ALCHEMY_GOERLI_URL = 'https://eth-goerli.alchemyapi.io/v2/GlaeWuylnNM3uuOo-SAwJxuwTdqHaY5l';
const provider = new ethers.providers.JsonRpcProvider(ALCHEMY_GOERLI_URL);

// 2. flashbots声誉私钥，用于建立“声誉”，详情见: https://docs.flashbots.net/flashbots-auction/searchers/advanced/reputation
// 这个账户，不要储存资金，也不是flashbots主私钥。
const privateKey = '0x227dbb8586117d55284e26620bc76534dfbd2394be34cf4a09cb775d593b6f2b'
const authSigner = new ethers.Wallet(privateKey, provider)

const main = async () => {
    // 3. 创建在goerli测试网的flashbots provider，用于发送交易
    const flashbotsProvider = await FlashbotsBundleProvider.create(
        provider,
        authSigner,
        'https://relay-goerli.flashbots.net/',
        'goerli'
        );
    
    // 4. 新建一个包含两个交易的bundle
    // 第1笔交易: 发送0.1 ETH测试币到WTF Academy地址
    const privateKey = '0x227dbb8586117d55284e26620bc76534dfbd2394be34cf4a09cb775d593b6f2b'
    const wallet = new ethers.Wallet(privateKey, provider)
    const transaction0 = {
    to: "0x25df6DA2f4e5C178DdFF45038378C0b08E0Bce54",
    value: ethers.utils.parseEther("0.001")
    }
    // 创建Bundle
    const transactionBundle = [
        {
            signer: wallet, // ethers signer
            transaction: transaction0 // ethers populated transaction object
        }
        // 也可以加入mempool中签名好的交易（可以是任何人发送的）
        // ,{
        //     signedTransaction: SIGNED_ORACLE_UPDATE_FROM_PENDING_POOL // serialized signed transaction hex
        // }
    ]

    const signedTransactions = await flashbotsProvider.signBundle(transactionBundle)
    const targetBlockNumber = (await provider.getBlockNumber()) + 1
    const simulation = await flashbotsProvider.simulate(signedTransactions, targetBlockNumber)
    console.log(JSON.stringify(simulation, null, 2))
  
}

main()