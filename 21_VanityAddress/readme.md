---
title: 21. 靓号生成器
tags:
  - ethers
  - javascript
  - vanity
  - address
  - frontend
  - web
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

## 扩展——顺序地址生成

我们基于靓号生成器，扩充部分代码，批量生成指定开头的地址（比如001，002，…，999），以便在各种场景（空投交互）中进行简单的标识，方便自己进行管理。

~~~shell
0x0017c58B5F7199198C490E7b602Dd559aC22EDcA:0x087922c19c90b41b2786968ee04300a34d99e8e556e71057ab7a30e9b8e34f4e
0x0023F31fdc08FCD3296870F67e1eEC5d71bf2633:0x39f66b17c6ad3e8cc919f4d767fad2f8dd82a341b4431f4eb18365f52be7d0cd
0x003a605E6E59B569bC37bb1287514357E311da34:0x2c4c787d155ef78e6d1ca364c808ec33a68937bead8bc7fd4eac360f6626d206
~~~



如果现在需要生成001、002、…、100，共计`100个`地址。那我们手动更改正则表达式工作量就太大了，因此使用循环进行处理，简单增加一个for循环和`padStart()`（填充补0，比如001，002）。

~~~js
import { ethers } from "ethers";

var wallet // 钱包
for (let i = 1; i <= 101; i += 1) {
    // 填充3位数字，比如001，002，003，...，999
    const paddedIndex = (i).toString().padStart(3, '0');
    const regex = new RegExp(`^0x${paddedIndex}.*$`);  // 表达式
    var isValid = false
    while(!isValid){
        wallet = ethers.Wallet.createRandom() // 随机生成钱包
        isValid = regex.test(wallet.address) // 检验正则表达式
    }
    // 打印地址与私钥
    console.log(`钱包地址：${wallet.address}`)
    console.log(`钱包私钥：${wallet.privateKey}`)
}
~~~



### 时间问题

但上述脚本实际使用时，耗费的时间是极其巨大的，因为上段中所用的脚本做了很多的重复工作，举个例子

有一个小游戏，面前的盒子中有编号1-10000的玻璃珠（编号会重复），需要从中找到编号1-100的玻璃珠，我们抓起一把，其中的编号是：`[1545,2,5,8544,6,44858,1112]`这其中`[2,5,6]`是符合条件的，那我们就需要把这三颗玻璃珠挑出，并且不再要这三个编号的珠子。

但是上段中的代码仅进行了简单的挑选，先挑选编号为`[1]`的玻璃珠，即使这把玻璃珠内恰好有`[2,3,…,99,100]`，也会将其丢弃，然后继续挑选步骤，这显然是不符合要求的，也是耗费时间过长的原因。

要解决这个问题，首先增加一个创建存有所有需要的正则表达式的数组。

~~~js
// 生成正则匹配表达式，并返回数组
function CreateRegex(total) {
    const regexList = [];
    for (let index = 0; index < total; index++) {
        // 填充3位数字，比如001，002，003，...，999
        const paddedIndex = (index + 1).toString().padStart(3, '0');
        const regex = new RegExp(`^0x${paddedIndex}.*$`);
        regexList.push(regex);
    }
    return regexList;
}
~~~

接着在生成钱包的函数中传入该数组并进行匹配，如匹配到则从数组中删除对应regex

~~~js
async function CreateWallet(regexList) {
    let wallet;
    var isValid = false;

    //从21讲的代码扩充
    //https://github.com/WTFAcademy/WTFEthers/blob/main/21_VanityAddress/readme.md
    while (!isValid && regexList.length > 0) {
        wallet = ethers.Wallet.createRandom();
        const index = regexList.findIndex(regex => regex.test(wallet.address));
        // 移除匹配的正则表达式
        if (index !== -1) {
            isValid = true;
            regexList.splice(index, 1);
        }
    }
    const data = `${wallet.address}:${wallet.privateKey}`
    console.log(data);
    return data
}
~~~

此时时间缩短至可接受范围，测试生成100个顺序地址耗费时间大概为2分钟。





## 总结

这一讲，我们利用`ethers.js`写了一个10行代码不到的靓号生成器，并省了$1.6亿。

另外扩展了该代码，编写了一个顺序地址生成器并进行优化，方便在空投交互等场景中对地址进行简单的标识。