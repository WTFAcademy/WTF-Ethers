import { ethers } from "ethers";
import fs from "fs/promises";


// 生成钱包，传入regexList数组并进行匹配，如匹配到则从数组中删除对应regex
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

// 需要生成的钱包数量
const total = 20;

// 生成正则表达式
const regexL = CreateRegex(total)
// 数组存储生成地址
const privateKeys = []


for (let index = 1; index < total + 1; index++) {
    privateKeys.push(await CreateWallet(regexL))
}

// 异步写入seeds.txt，因顺序生成钱包地址前三位，使用自带sort()函数即可排序，并在每个地址后添加换行符保存
await fs.appendFile('seeds.txt', privateKeys.sort().join('\n'));