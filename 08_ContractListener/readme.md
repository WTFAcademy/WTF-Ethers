# Ethers极简入门: 8. 合约监听

我最近在重新学`ethers.js`，巩固一下细节，也写一个`WTF Ethers极简入门`，供小白们使用。

**推特**：[@0xAA_Science](https://twitter.com/0xAA_Science)

**WTF Academy社群：** [官网 wtf.academy](https://wtf.academy) | [WTF Solidity教程](https://github.com/AmazingAng/WTFSolidity) | [discord](https://discord.wtf.academy) | [微信群申请](https://docs.google.com/forms/d/e/1FAIpQLSe4KGT8Sh6sJ7hedQRuIYirOoZK_85miz3dw7vA1-YjodgJ-A/viewform?usp=sf_link)

所有代码和教程开源在github: [github.com/WTFAcademy/WTFEthers](https://github.com/WTFAcademy/WTFEthers)

-----

这一讲，我们将介绍如何监听合约，实现监听USDT合约的`Transfer`事件。

## ethers
ethers入门的话可以看 [GitHub - WTFAcademy/WTFEthers](https://github.com/WTFAcademy/WTFEthers) 

官方文档：[Documentation](https://docs.ethers.io/v5/)

如何通过ethers实现监听呢？在ethersjs中，我们可以通过合约对象来实现监听。合约对象有一个`contract.on`的监听方法。

## 准备AlchemyAPI

AlchemyAPI是一个免费的ETH node提供商。需要先申请一个，后续会用到。

[Solidity极简入门-工具篇4：Alchemy, 区块链API和节点基础设施](https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md )

## Contract 合约对象

### 创建合约对象

创建合约对象需要三个参数
* `address` :合约的地址
* `abi`:合约的abi
* `provider`:ethers的provider
```js
new ethers.Contract( address , abi , signerOrProvider )
```

### 合约类的事件
合约类有很多事件，具体的可以自己直接看文档：[Contract - events](https://docs.ethers.io/v5/api/contract/contract/#Contract--events)

这次主要了解一下`cnotract.on`就好了，只需要一个合约对象，就可以监听对应的事件了。
```js
contract.on( event , listener )
```

## 获取ABI
### 通过etherscan.io查找abi
因为我们新建`contract`对象对时候需要三个参数，其中`provider`和`address`我们都可以很容易获得，ABI参数有2种方法可以获得。
### 一、通过开源合约代码获得ABI
首先打开[Tether: USDT Stablecoin | Address 0xdac17f958d2ee523a2206206994597c13d831ec7 | Etherscan](https://etherscan.io/address/0xdac17f958d2ee523a2206206994597c13d831ec7#code)USDT的合约地址，切换到合约`Contract`

![etherscan contract 截图](./img/1.png)

搜索合约代码中的监听`event Transfer`

```js
/**
 * @title ERC20Basic
 * @dev Simpler version of ERC20 interface
 * @dev see https://github.com/ethereum/EIPs/issues/20
 */
contract ERC20Basic {
    uint public _totalSupply;
    function totalSupply() public constant returns (uint);
    function balanceOf(address who) public constant returns (uint);
    function transfer(address to, uint value) public;
    event Transfer(address indexed from, address indexed to, uint value);
}

```

可以看到`Transfer`事件，那么我们就可以直接拿来嵌入ethersjs生成对应的ABI

```js
const abi = [
  "event Transfer(address indexed from, address indexed to, uint value)"
];
```

### 二、通过etherscan网站获得abi

你也可以通过etherscan获得具体的ABI

![etherscan 合约abi](img/2.png)

## 完整代码

通过该代码你可以实现监听USDT的合约转账事件。

```js
// 获取alchealchemy的节点
import { ethers } from "ethers";
// 准备 alchemy API  
// 可以参考https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md 
const ALCHEMY_MAINNET_URL = 'YOUR_ALCHEMY_MAINNET_URL';

// 连接主网的提供者
const provider = new ethers.providers.JsonRpcProvider(config.ALCHEMY_MAINNET_URL);
// USDT的合约地址
const contractAddress = '0xdac17f958d2ee523a2206206994597c13d831ec7'

// 构建USDT的Transfer的ABI
const abi = [
  "event Transfer(address indexed from, address indexed to, uint value)"
];
// 生成USDT合约对象
const contractUSDT = new ethers.Contract(contractAddress, abi, provider);


(async ()=>{
  try{
  // 监听USDT合约
    contractUSDT.on('Transfer', (from, to, value)=>{
      console.log(
        `${from} -> ${to} ${ethers.BigNumber.from(value).toString()}`
      )
    })
  }catch(e){
    console.log(e);
  } 
})()
```

## 总结
至此我们就完成了最简单的链上监听功能,通过上述方法，可以你可以监听指定合约的指定事件。