---
title: 27. 批量靓号生成器
tags:
  - ethers
  - javascript
  - vanity
  - address
  - frontend
  - web
---

# Ethers极简入门: 27. 批量靓号生成器

我最近在重新学`ethers.js`，巩固一下细节，也写一个`WTF Ethers极简入门`，供小白们使用。

**推特**：[@0xAA_Science](https://twitter.com/0xAA_Science)

**WTF Academy社群：** [官网 wtf.academy](https://wtf.academy) | [WTF Solidity教程](https://github.com/AmazingAng/WTFSolidity) | [discord](https://discord.gg/5akcruXrsk) | [微信群申请](https://docs.google.com/forms/d/e/1FAIpQLSe4KGT8Sh6sJ7hedQRuIYirOoZK_85miz3dw7vA1-YjodgJ-A/viewform?usp=sf_link)

所有代码和教程开源在github: [github.com/WTFAcademy/WTFEthers](https://github.com/WTFAcademy/WTF-Ethers)

-----

这一讲，我们基于21讲靓号生成器，扩充部分代码，批量生成指定开头的地址（比如001，002，…，999），以便在各种场景（空投交互）中进行简单的标识，方便自己进行管理。

~~~shell
0x0017c58B5F7199198C490E7b602Dd559aC22EDcA:0x087922c19c90b41b2786968ee04300a34d99e8e556e71057ab7a30e9b8e34f4e
0x0023F31fdc08FCD3296870F67e1eEC5d71bf2633:0x39f66b17c6ad3e8cc919f4d767fad2f8dd82a341b4431f4eb18365f52be7d0cd
0x003a605E6E59B569bC37bb1287514357E311da34:0x2c4c787d155ef78e6d1ca364c808ec33a68937bead8bc7fd4eac360f6626d206
~~~

![靓号生成](./img/27-1.png)

## 需求问题

在21讲中，我们想得到一个指定开头的地址，因此只要大量生成再使用正则匹配到对应的地址即可，复习一下21讲代码：

~~~js
import { ethers } from "ethers";
var wallet // 钱包
const regex = /^0x000.*$/ // 表达式
var isValid = false
while(!isValid){
    wallet = ethers.Wallet.createRandom() // 随机生成钱包，安全
    isValid = regex.test(wallet.address) // 检验正则表达式
    //console.log(wallet.address)
}
// 打印靓号地址与私钥
console.log(`\n靓号地址：${wallet.address}`)
console.log(`靓号私钥：${wallet.privateKey}\n`)

~~~

### 需求1

那如今需求增加，想得到001、002、003，这`3个`地址。

最简单的方式就是直接修改第3行的regex，依次改为001、002、003，共计运行3次脚本，成功生成对应钱包。

~~~js
const regex = /^0x001.*$/
const regex = /^0x002.*$/
const regex = /^0x003.*$/
~~~

我们在不增加代码的基础上很简单的完了需求1，只不过是多运行了几次脚本而已。



### 需求2

继续增加需求，需要001、002、…、100，共计`100个`地址。

现在再手动更改正则表达式就有点过分了，那就使用循环进行处理，简单增加一个for循环和`padStart()`（填充补0，比如001，002）。

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



## 时间问题

在生成100个地址时，时间耗费时极其巨大的，因为上段中所用的脚本做了很多的重复工作，举个例子

有一个小游戏，面前的盒子中有编号1-10000的玻璃珠（编号会重复），需要从中找到编号1-100的玻璃珠，我们抓起一把，其中的编号是：
`[1545,2,5,8544,6,44858,1112]`

这其中`[2,5,6]`是符合条件的，那我们就需要把这三颗玻璃珠挑出，并且不再要这三个编号的珠子。

但是上段中的代码仅进行了简单的挑选，先挑选编号为`[1]`的玻璃珠，即使这把玻璃珠内恰好有`[2,3,…,99,100]`，也会将其丢弃，然后重复步骤，这显然是不符合要求的，也是耗费时间过长的原因。



要解决这个问题，首先增加一个创建所有需要的正则表达式的函数

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

接着在生成钱包的函数中传入regexList数组并进行匹配，如匹配到则从数组中删除对应regex

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

![靓号生成](./img/27-2.png)

## 总结

这一讲，我们利用`ethers.js`写了批量的靓号生成器，方便在撸空投的时候进行简单的标识管理。