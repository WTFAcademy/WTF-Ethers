---
title: 2. 提供器 Provider
---

# Ethers极简入门: 2. Provider 提供器

我最近在重新学`ethers.js`，巩固一下细节，也写一个`WTF Ethers极简入门`，供小白们使用。

**推特**：[@0xAA_Science](https://twitter.com/0xAA_Science)

**WTF Academy社群：** [官网 wtf.academy](https://wtf.academy) | [WTF Solidity教程](https://github.com/AmazingAng/WTF-Solidity) | [discord](https://discord.gg/5akcruXrsk) | [微信群申请](https://docs.google.com/forms/d/e/1FAIpQLSe4KGT8Sh6sJ7hedQRuIYirOoZK_85miz3dw7vA1-YjodgJ-A/viewform?usp=sf_link)

所有代码和教程开源在github: [github.com/WTFAcademy/WTF-Ethers](https://github.com/WTFAcademy/WTF-Ethers)

-----

这一讲，我们将介绍ethers.js的`Provider`类，然后利用它连接上Infura节点，读取链上的信息。

## `Provider`类

`Provider`类是对以太坊网络连接的抽象，为标准以太坊节点功能提供简洁、一致的接口。在`ethers`中，`Provider`不接触用户私钥，只能读取链上信息，不能写入，这一点比`web3.js`要安全。

除了[之前](https://github.com/WTFAcademy/WTF-Ethers)介绍的默认提供者`defaultProvider`以外，`ethers`中最常用的是`jsonRpcProvider`，可以让用户连接到特定节点服务商的节点。

## `jsonRpcProvider`

### 创建节点服务商的API Key

首先，你需要去节点服务商的网站注册并创建`API Key`。在`WTF Solidity极简教程`的工具篇，我们介绍了[Infura](https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL02_Infura/readme.md)和[Alchemy](https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md)两家公司`API Key`的创建方法，大家可以参考。

![Infura API Key](img/2-1.png)

### 连接Infura节点

这里，我们用Infura节点作为例子。在创建好Infura API Key之后，就可以利用`ethers.JsonRpcProvider()`方法来创建`Provider`变量，该方法以节点服务的`url`链接作为参数。

在下面这个例子中，我们分别创建连接到`ETH`主网和`Goerli`测试网的`provider`：

```javascript
// 利用Infura的rpc节点连接以太坊网络
// 填入Infura API Key, 教程：https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL02_Infura/readme.md
const INFURA_ID = ''
// 连接以太坊主网
const providerETH = new ethers.JsonRpcProvider(`https://mainnet.infura.io/v3/${INFURA_ID}`)
// 连接Goerli测试网
const providerGoerli = new ethers.JsonRpcProvider(`https://goerli.infura.io/v3/${INFURA_ID}`)
```

### 利用`Provider`读取链上数据

`Provider`类封装了一些方法，可以便捷的读取链上数据：

**1.** 利用`getBalance()`函数读取主网和测试网V神的`ETH`余额：

```javascript
    // 1. 查询vitalik在主网和Goerli测试网的ETH余额
    console.log("1. 查询vitalik在主网和Goerli测试网的ETH余额");
    const balance = await providerETH.getBalance(`vitalik.eth`);
    const balanceGoerli = await providerGoerli.getBalance(`vitalik.eth`);
    // 将余额输出在console（主网）
    console.log(`ETH Balance of vitalik: ${ethers.utils.formatEther(balance)} ETH`);
    // 输出Goerli测试网ETH余额
    console.log(`Goerli ETH Balance of vitalik: ${ethers.utils.formatEther(balanceGoerli)} ETH`);
```

![V神余额](img/2-2.png)

**2.** 利用`getNetwork()`查询`provider`连接到了哪条链，`homestead`代表`ETH`主网：

```javascript
    // 2. 查询provider连接到了哪条链
    console.log("\n2. 查询provider连接到了哪条链")
    const network = await providerETH.getNetwork();
    console.log(network.toJSON());
```
> ethers v6版本, 以上代码中`network`不能直接`console.log()`, 具体原因参考: [discussion-3977](https://github.com/ethers-io/ethers.js/discussions/3977)

![getNetwork](img/2-3.png)

**3.** 利用`getBlockNumber()`查询当前区块高度：

```javascript
    // 3. 查询区块高度
    console.log("\n3. 查询区块高度")
    const blockNumber = await providerETH.getBlockNumber();
    console.log(blockNumber);
```

![getBlockNumber](img/2-4.png)

**4.** 利用`getTransactionCount()`查询某个钱包的历史交易次数。

```javascript
    // 4. 查询 vitalik 钱包历史交易次数
    console.log("\n4. 查询 vitalik 钱包历史交易次数")
    const txCount = await providerETH.getTransactionCount("vitalik.eth");
    console.log(txCount);
```

![getGasPrice](img/2-5.png)


**5.** 利用`getFeeData()`查询当前建议的`gas`设置，返回的数据格式为`bigint`。

```javascript
    // 5. 查询当前建议的gas设置
    console.log("\n5. 查询当前建议的gas设置")
    const feeData = await providerETH.getFeeData();
    console.log(feeData);
```

![getFeeData](img/2-6.png)

**6.** 利用`getBlock()`查询区块信息，参数为要查询的区块高度：

```javascript
    // 6. 查询区块信息
    console.log("\n6. 查询区块信息")
    const block = await providerETH.getBlock(0);
    console.log(block);
```

![getBlock](img/2-7.png)

**7.** 利用`getCode()`查询某个地址的合约`bytecode`，参数为合约地址，下面例子中用的主网`WETH`的合约地址：

```javascript
    // 7. 给定合约地址查询合约bytecode，例子用的WETH地址
    console.log("\n7. 给定合约地址查询合约bytecode，例子用的WETH地址")
    const code = await providerETH.getCode("0xc778417e063141139fce010982780140aa0cd5ab");
    console.log(code);
```

![getCode](img/2-8.png)

## 总结

这一讲，我们将介绍ethers.js的`Provider`类，并用Infura的节点API Key创建了`jsonRpcProvider`，读取了`ETH`主网和`Goerli`测试网的链上信息。
