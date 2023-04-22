---
title: 8. 监听合约事件
---

# Ethers极简入门: 8. 监听合约事件

我最近在重新学`ethers.js`，巩固一下细节，也写一个`WTF Ethers极简入门`，供小白们使用。

**推特**：[@0xAA_Science](https://twitter.com/0xAA_Science)

**WTF Academy社群：** [官网 wtf.academy](https://wtf.academy) | [WTF Solidity教程](https://github.com/AmazingAng/WTF-Solidity) | [discord](https://discord.gg/5akcruXrsk) | [微信群申请](https://docs.google.com/forms/d/e/1FAIpQLSe4KGT8Sh6sJ7hedQRuIYirOoZK_85miz3dw7vA1-YjodgJ-A/viewform?usp=sf_link)

所有代码和教程开源在github: [github.com/WTFAcademy/WTFEthers](https://github.com/WTFAcademy/WTF-Ethers)

-----

提示：本教程基于ethers.js 6.3.0 ，如果你使用的是v5，可以参考[ethers.js v5文档](https://docs.ethers.io/v5/)。

这一讲，我们将介绍如何监听合约，并实现监听USDT合约的`Transfer`事件。

具体可参考[ethers.js文档](https://docs.ethers.org/v6/api/contract/#ContractEvent)。

## 监听合约事件

### `contract.on`
在`ethersjs`中，合约对象有一个`contract.on`的监听方法，让我们持续监听合约的事件：

```js
contract.on("eventName", function)
```
`contract.on`有两个参数，一个是要监听的事件名称`"eventName"`，需要包含在合约`abi`中；另一个是我们在事件发生时调用的函数。

### contract.once

合约对象有一个`contract.once`的监听方法，让我们只监听一次合约释放事件，它的参数与`contract.on`一样：

```js
contract.once("eventName", function)
```

## 监听`USDT`合约

1. 声明`provider`：Alchemy是一个免费的ETH节点提供商。需要先申请一个，后续会用到。你可以参考这篇攻略来申请Alchemy API[Solidity极简入门-工具篇4：Alchemy](https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md )

  ```js
  import { ethers } from "ethers";
  // 准备 alchemy API  
  // 可以参考https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md 
  const ALCHEMY_MAINNET_URL = 'https://eth-mainnet.g.alchemy.com/v2/oKmOQKbneVkxgHZfibs-iFhIlIAl6HDN';
  // 连接主网 provider
  const provider = new ethers.JsonRpcProvider(ALCHEMY_MAINNET_URL);
  ```

2. 声明合约变量：我们只关心`USDT`合约的`Transfer`事件，把它填入到`abi`中就可以。如果你关心其他函数和事件的话，可以在[etherscan](https://etherscan.io/address/0xdac17f958d2ee523a2206206994597c13d831ec7#code)上找到。

  ```js
  // USDT的合约地址
  const contractAddress = '0xdac17f958d2ee523a2206206994597c13d831ec7'
  // 构建USDT的Transfer的ABI
  const abi = [
    "event Transfer(address indexed from, address indexed to, uint value)"
  ];
  // 生成USDT合约对象
  const contractUSDT = new ethers.Contract(contractAddress, abi, provider);
  ```

3. 利用`contract.once()`函数，监听一次`Transfer`事件，并打印结果。

  ```js
    // 只监听一次
    console.log("\n1. 利用contract.once()，监听一次Transfer事件");
    contractUSDT.once('Transfer', (from, to, value)=>{
      // 打印结果
      console.log(
        `${from} -> ${to} ${ethers.formatUnits(ethers.getBigInt(value),6)}`
      )
    })
  ```
  ![只监听一次](img/8-1.png)

4. 利用`contract.on()`函数，持续监听`Transfer`事件，并打印结果。
  ```js
    // 持续监听USDT合约
    console.log("\n2. 利用contract.on()，持续监听Transfer事件");
    contractUSDT.on('Transfer', (from, to, value)=>{
      console.log(
       // 打印结果
       `${from} -> ${to} ${ethers.formatUnits(ethers.getBigInt(value),6)}`
      )
    })
  ```
  ![持续监听](img/8-2.png)

## 总结
这一讲，我们介绍了`ethers`中最简单的链上监听功能，`contract.on()`和`contract.once()`。通过上述方法，可以你可以监听指定合约的指定事件。
