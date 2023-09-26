---
title: 26. EIP712 Signature Script
tags:
  - ethers
  - javascript
  - eip712
  - signature
  - airdrop
  - frontend
  - web
---

# WTF Ethers: 26. EIP712 Signature Script

I've been revisiting `ethers.js` recently to refresh my understanding of the details and to write a simple tutorial called "WTF Ethers" for beginners.

**Twitter**: [@0xAA_Science](https://twitter.com/0xAA_Science)

**Community**: [Website wtf.academy](https://wtf.academy) | [WTF Solidity](https://github.com/AmazingAng/WTFSolidity) | [discord](https://discord.gg/5akcruXrsk) | [WeChat Group Application](https://docs.google.com/forms/d/e/1FAIpQLSe4KGT8Sh6sJ7hedQRuIYirOoZK_85miz3dw7vA1-YjodgJ-A/viewform?usp=sf_link)

All the code and tutorials are open-sourced on GitHub: [github.com/WTFAcademy/WTF-Ethers](https://github.com/WTFAcademy/WTF-Ethers)

-----

In this tutorial, we will introduce how to use `ethers.js` to write an EIP712 signature script. Please refer to [WTF Solidity 52: EIP712](https://github.com/AmazingAng/WTFSolidity/blob/main/52_EIP712/readme.md) for details on EIP712 contract.

## EIP712

[EIP712 Typed Data Signatures](https://eips.ethereum.org/EIPS/eip-712) provides a more advanced and secure method for signatures. When a Dapp supporting EIP712 requests a signature, the wallet will display the original data of the signature message, allowing the user to verify the message data before signing.

## EIP712 Signature Script

In this section, we will write a script to sign ERP712 signature.

1. Create `provider` and `wallet` objects. In this example, we will use the private key of the Remix test wallet.

    ```js
    // Connect to the Ethereum network using Alchemy's RPC node
    // For instructions on setting up Alchemy API, please refer to https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md 
    const ALCHEMY_GOERLI_URL = 'https://eth-goerli.alchemyapi.io/v2/GlaeWuylnNM3uuOo-SAwJxuwTdqHaY5l';
    const provider = new ethers.JsonRpcProvider(ALCHEMY_GOERLI_URL);

    // Create a wallet object using the private key and provider
    const privateKey = '0x503f38a9c967ed597e47fe25643985f032b072db8075426a92110f82df48dfcb'
    const wallet = new ethers.Wallet(privateKey, provider)
    ```

2. Create the EIP712 Domain, which includes the contract's `name`, `version` (usually set to "1"), `chainId`, and `verifyingContract` (the address of the contract that verifies the signature).

    ```js
    // Create the EIP712 Domain
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

3. Create the typed data for the signature message, where `types` declares the types, and `message` contains the data.

    ```js
    // Create typed data, Storage
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

4. Call the `signTypedData()` signing method of the wallet object with the previously created `domain`, `types`, and `message` variables:

    ```js
    // EIP712 signature
    const signature = await wallet.signTypedData(domain, types, message);
    console.log("Signature:", signature);
    // Signature: 0xdca07f0c1dc70a4f9746a7b4be145c3bb8c8503368e94e3523ea2e8da6eba7b61f260887524f015c82dd77ebd3c8938831c60836f905098bf71b3e6a4a09b7311b
    ```

5. You can use the `verifyTypedData()` method to recover the signer address from the signature and message, and verify the validity of the signature. Typically, this step is executed in a smart contract.

    ```js
    // Verify the EIP712 signature and recover the signer address from the signature and message
    let eip712Signer = ethers.verifyTypedData(domain, types, message, signature)
    console.log("EIP712 Signer: ", eip712Signer)
    // EIP712 Signer: 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4
    ```

## Summary

In this tutorial, we have introduced how to write an EIP712 signature script using `ethers.js`.