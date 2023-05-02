---
title: 26. EIP712 签名脚本
---

# Ethers极简入门: 26. EIP712 签名脚本

我最近在重新学`ethers.js`，巩固一下细节，也写一个`WTF Ethers极简入门`，供小白们使用。

推特：[@0xAA_Science](https://twitter.com/0xAA_Science)｜[@WTFAcademy_](https://twitter.com/WTFAcademy_)

WTF Academy 社群：[Discord](https://discord.gg/5akcruXrsk)｜[微信群](https://docs.google.com/forms/d/e/1FAIpQLSe4KGT8Sh6sJ7hedQRuIYirOoZK_85miz3dw7vA1-YjodgJ-A/viewform?usp=sf_link)｜[官网 wtf.academy](https://wtf.academy)

所有代码和教程开源在 github: [github.com/WTFAcademy/WTFEthers](https://github.com/WTFAcademy/WTF-Ethers)

---

在本教程中，我们将介绍如何使用 Ethers.js 写 EIP712 签名脚本。请结合 [WTF Solidity 第52讲：EIP712](https://github.com/AmazingAng/WTFSolidity/blob/main/52_EIP712/readme.md) 一起阅读。

## EIP712

[EIP712 类型化数据签名](https://eips.ethereum.org/EIPS/eip-712)提供了一种更高级、更安全的签名方法。当支持 EIP712 的 Dapp 请求签名时，钱包会展示签名消息的原始数据，用户可以在验证数据符合预期之后签名。此外，你也可以使用脚本生成 EIP712 签名。

## EIP712 签名脚本

1. 创建 `provider` 和 `wallet` 对象。在本例中，我们使用 Remix 测试钱包的私钥。

    ```js
    // 使用 Alchemy 的 RPC 节点连接以太坊网络
    // 准备 Alchemy API 可以参考 https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md 
    const ALCHEMY_GOERLI_URL = 'https://eth-goerli.alchemyapi.io/v2/GlaeWuylnNM3uuOo-SAwJxuwTdqHaY5l';
    const provider = new ethers.JsonRpcProvider(ALCHEMY_GOERLI_URL);

    // 使用私钥和 provider 创建 wallet 对象
    const privateKey = '0x503f38a9c967ed597e47fe25643985f032b072db8075426a92110f82df48dfcb'
    const wallet = new ethers.Wallet(privateKey, provider)
    ```

2. 创建 EIP712 Domain，它包含了合约的 `name`、`version`（通常约定为 “1”）、`chainId` 以及 `verifyingContract`（验证签名的合约地址）。

    ```js
    // 创建 EIP712 Domain
    let contractName = "EIP712Storage"
    let version = "1"
    let chainId = "1"
    let contractAddress = "0xf8e81D47203A594245E36C48e151709F0C19fBe8"

    const domain = {
        name: contractName,
        version: version,
        chainId: chainId,
        verifyingContract: contractAddress,
    };
    ```

3. 创建签名消息的类型化数据，其中 `types` 声明类型，而 `message` 包含数据。

    ```js
    // 创建类型化数据，Storage
    let spender = "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4"
    let number = "100"

    const types = {
        Storage: [
            { name: "spender", type: "address" },
            { name: "number", type: "uint256" },
        ],
    };

    const message = {
        spender: spender,
        number: number,
    };
    ```

4. 调用 wallet 对象的 `signTypedData()` 签名方法，参数为之前创建的 `domain`、`types` 和 `message` 变量：

    ```js
    // EIP712 签名
    const signature = await wallet.signTypedData(domain, types, message);
    console.log("Signature:", signature);
    // Signature: 0xdca07f0c1dc70a4f9746a7b4be145c3bb8c8503368e94e3523ea2e8da6eba7b61f260887524f015c82dd77ebd3c8938831c60836f905098bf71b3e6a4a09b7311b
    ```

5. 你可以使用 `verifyTypedData()` 方法复原出签名的 `signer` 地址并验证签名的有效性。通常，这一步会在智能合约中执行。

    ```js
    // 验证 EIP712 签名，从签名和消息复原出 signer 地址
    let eip712Signer = ethers.verifyTypedData(domain, types, message, signature)
    console.log("EIP712 Signer: ", eip712Signer)
    //EIP712 Signer: 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4
    ```

## 总结

在本教程中，我们介绍了如何使用 Ethers.js 编写 EIP712 签名脚本。