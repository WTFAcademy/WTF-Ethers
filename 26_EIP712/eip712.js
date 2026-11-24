import { ethers } from "ethers";

const wallet = ethers.Wallet.createRandom();

// 创建 EIP712 Domain
let contractName = "EIP712Storage"
let version = "1"
const chainId = 31337n;
let contractAddress = "0xf8e81D47203A594245E36C48e151709F0C19fBe8"

const domain = {
    name: contractName,
    version: version,
    chainId: chainId,
    verifyingContract: contractAddress,
};

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

const main = async () => {
    console.log("Message: ", message)
    // EIP712 签名
    const signature = await wallet.signTypedData(domain, types, message);
    console.log("Signature:", signature);
    // 验证 EIP712 签名，从签名和消息复原出 signer 地址
    let eip712Signer = ethers.verifyTypedData(domain, types, message, signature)
    console.log("EIP712 Signer: ", eip712Signer)
}

main();
