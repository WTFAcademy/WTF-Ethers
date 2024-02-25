import { ethers } from "ethers";

// 1. 创建HD钱包
console.log("\n1. 创建HD钱包")
// 生成随机助记词
const mnemonic = ethers.Mnemonic.entropyToPhrase(ethers.randomBytes(32))
// 创建HD钱包
const hdNode = ethers.HDNodeWallet.fromPhrase(mnemonic)
console.log(hdNode);

// 2. 通过HD钱包派生20个钱包
console.log("\n2. 通过HD钱包派生20个钱包")
const numWallet = 20
// 派生路径：m / purpose' / coin_type' / account' / change / address_index
// 我们只需要切换最后一位address_index，就可以从hdNode派生出新钱包
let basePath = "m/44'/60'/0'/0";
let wallets = [];
for (let i = 0; i < numWallet; i++) {

    /**
     * @issue
     * @dev 在ethers v6中，derivePath()方法的源码与v5大不相同，它存在将之前的钱包实例化时候保留的
     *      偏移路径path与新传递进来的路径值捏合在一起的行为，我对这一行为暂时不能理解其意图。截至v6.11.1
     *      版本，此行为依然存在。导致的结果会是，利用v6的derivePath()方法衍生的后续钱包地址，会与
     *      当前市场上流行的钱包应用（MetaMask等等）所产生的后续地址完全不同。原因就在于意料之外的偏移路径。
     * 
     *      Proof of Concept：
     *          const ethers = require("ethers");
                const path = "44'/60'/0'/0/1";

                const phrase = "word word word word word word word word word word word word";

                const mnemonic = ethers.Mnemonic.fromPhrase(phrase);
                const wallet = ethers.HDNodeWallet.fromMnemonic(mnemonic, path);

                console.log(wallet.path);
                // output: m/44'/60'/0'/0/1
                const wallet1 = wallet.derivePath(path);
                console.log(wallet1.path);
                // output: m/44'/60'/0'/0/1/44'/60'/0'/0/1

     *      建议：
            在v6的repo中已有于此相关的报告等待处理中。在源码更新之前，若想达到通常期待的与v5相一致的结果，
            可以使用下面的方式来衍生钱包，暂时避免使用derivePath()：
                ethers.HDNodeWallet.fromPhrase(seedPhrase, '', path)
            seedPhrase即为助记词, 就用mnemonic即可。
     */
    let hdNodeNew = hdNode.derivePath(basePath + "/" + i);
    let walletNew = new ethers.Wallet(hdNodeNew.privateKey);
    console.log(`第${i+1}个钱包地址： ${walletNew.address}`)
    wallets.push(walletNew);
}

// 3. 保存钱包（加密json）
console.log("\n3. 保存钱包（加密json）")
const wallet = ethers.Wallet.fromPhrase(mnemonic)
console.log("通过助记词创建钱包：")
console.log(wallet)
// 加密json用的密码，可以更改成别的
const pwd = "password"
const json = await wallet.encrypt(pwd)
console.log("钱包的加密json：")
console.log(json)

// 4. 从加密json读取钱包
const wallet2 = await ethers.Wallet.fromEncryptedJson(json, pwd);
console.log("\n4. 从加密json读取钱包：")
console.log(wallet2)

