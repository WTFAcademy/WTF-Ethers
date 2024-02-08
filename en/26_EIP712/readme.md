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
    // Connect to the Ethereum network using Infura or Alchemy's RPC endpoint
    const SEPOLIA_TESTNET_URL = 'https://sepolia.infura.io/v3/8b9750710d56460d940aeff47967c4ba';
    const provider = new ethers.JsonRpcProvider(SEPOLIA_TESTNET_URL);

    // Create a wallet object using the private key and provider
    const privateKey = 'cd82a7d0d6e528322e8c26f9ccbc18767543786d073c48ef38a753f29b1e8f39'
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
    let spender = "0xD616f5A49571e7BCb1BB5326031bC8078BDA9Faa"
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
    // Signature: 0xcd63049dd2388870f3fd18d00b36e1691971e4aea57369c45df2ba54b79853a16f02a71b71d71cf2d6ff01e3e679bc45633eedea64e54478c666a1f07bb5bf221c
    ```

5. You can use the `verifyTypedData()` method to recover the signer address from the signature and message, and verify the validity of the signature. Typically, this step is executed in a smart contract.

    ```js
    // Verify the EIP712 signature and recover the signer address from the signature and message
    let eip712Signer = ethers.verifyTypedData(domain, types, message, signature)
    console.log("EIP712 Signer: ", eip712Signer)
    // EIP712 Signer: 0xD616f5A49571e7BCb1BB5326031bC8078BDA9Faa
    ```

## Summary

In this tutorial, we have introduced how to write an EIP712 signature script using `ethers.js`.
