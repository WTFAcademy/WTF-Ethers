---
title: 21. 靓号生成器
---

# Ethers极简入门: 21. 靓号生成器

我最近在重新学`ethers.js`，巩固一下细节，也写一个`WTF Ethers极简入门`，供小白们使用。

**推特**：[@0xAA_Science](https://twitter.com/0xAA_Science)

**WTF Academy社群：** [官网 wtf.academy](https://wtf.academy) | [WTF Solidity教程](https://github.com/AmazingAng/WTFSolidity) | [discord](https://discord.gg/5akcruXrsk) | [微信群申请](https://docs.google.com/forms/d/e/1FAIpQLSe4KGT8Sh6sJ7hedQRuIYirOoZK_85miz3dw7vA1-YjodgJ-A/viewform?usp=sf_link)

所有代码和教程开源在github: [github.com/WTFAcademy/WTFEthers](https://github.com/WTFAcademy/WTF-Ethers)

-----

这一讲，我们介绍如何利用`ethers.js`生成靓号地址，这是一个价值$1.6亿的教程（并不）。

## 靓号地址

现实生活中，有人追求车牌号“888888”，而在区块链中，大家也追求“靓号地址”。靓号地址（Vanity Address）是个性化的地址，易于识别，并且具有与其它地址一样的安全性。比如以`7`个`0`开头的地址：

```solidity
0x0000000fe6a514a32abdcdfcc076c85243de899b
```

是的，这也是知名做市商`Wintermute`被盗$1.6亿的靓号地址（[报道](https://www.blocktempo.com/head-market-maker-wintermute-hacked-loses-160-million-magnesium/)）。刚才我们说了，靓号和普通地址具有一样的安全性，那么这里为什么被攻击了呢？

问题出在生成靓号工具存在漏洞。`Wintermute`使用了一个叫`Profinity`的靓号生成器来生成地址，但这个生成器的随机种子有问题。本来随机种子应该有2的256次方可能性，但是`Profinity`使用的种子只有2的32次方的长度，可以被暴力破解。

## 靓号生成器

利用`ethers.js`，我们可以用`10`行代码就可以写出一个靓号生成器，它可能没有其它的工具快，但安全有保障。

### 生成随机钱包

我们可以利用下面的代码安全并随机的生成钱包：

```js
const wallet = ethers.Wallet.createRandom() // 随机生成钱包，安全
```

### 正则表达式

我们需要用正则表达式来筛选出目标靓号地址。这里简单的讲一下正则表达式：
    - 开头几位字符匹配，我们用`^`符号，例如`^0x000`就会匹配以`0x000`开头的地址。
    - 最后几位字符匹配，我们用`$`符号，例如`000$`就会匹配以`000`结尾的地址。
    - 中间几位我们不关心，可以利用`.*`通配符，例如`^0x000.*000$`就会匹配任何以`0x000`开头并以`000`结尾的地址。

在`js`中，我们可以用下面的表达式筛选靓号地址：
```js
const regex = /^0x000.*$/ // 表达式，匹配以0x000开头的地址
isValid = regex.test(wallet.address) // 检验正则表达式
```

### 靓号生成脚本

靓号生成器的逻辑非常简单，不断生成随机钱包，直到匹配到我们想要的靓号才结束。作为测试，以`0x000`开头的靓号仅需几秒就可以生成，每多一个`0`，耗时多16倍。

```js
import { ethers } from "ethers";
var wallet // 钱包
const regex = /^0x000.*$/ // 表达式
var isValid = false
while(!isValid){
    wallet = ethers.Wallet.createRandom() // 随机生成钱包，安全
    isValid = regex.test(wallet.address) // 检验正则表达式
}
// 打印靓号地址与私钥
console.log(`靓号地址：${wallet.address}`)
console.log(`靓号私钥：${wallet.privateKey}`)
```

![靓号生成](./img/21-1.png)

## 总结

这一讲，我们利用`ethers.js`写了一个10行代码不到的靓号生成器，并省了$1.6亿。