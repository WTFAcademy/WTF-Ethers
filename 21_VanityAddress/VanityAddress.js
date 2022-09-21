// 正则表达式，
// ^0x之后跟前几位要匹配的字符
// .*为通配符
// $之前写最后几位要匹配的字符
// 例子：首位两个0，末尾两个1 
// const regex = /^0x00.*11$/

import { ethers } from "ethers";

var isValid = false
var wallet
const regex = /^0x0000.*$/
while(!isValid){
    wallet = ethers.Wallet.createRandom()
    isValid = regex.test(wallet.address)
    //console.log(wallet.address)
}

console.log(`靓号地址：${wallet.address}`)
console.log(`靓号私钥：${wallet.privateKey}`)

