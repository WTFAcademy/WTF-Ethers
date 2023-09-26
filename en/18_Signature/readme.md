---
title: 18. Digital Signature Script
tags:
  - ethers
  - javascript
  - airdrop
  - signature
  - ecdsa
  - frontend
  - web
---

# WTF Ethers: 18. Digital Signature Script

Recently, I have been revising `ethers.js` to solidify the details and write a simplified guide for beginners, called "WTF Ethers Tutorial".

**Twitter**: [@0xAA_Science](https://twitter.com/0xAA_Science)

**WTF Academy Community**: [Official Website wtf.academy](https://wtf.academy) | [WTF Solidity Tutorial](https://github.com/AmazingAng/WTF-Solidity) | [Discord](https://discord.gg/5akcruXrsk) | [WeChat Group Application](https://docs.google.com/forms/d/e/1FAIpQLSe4KGT8Sh6sJ7hedQRuIYirOoZK_85miz3dw7vA1-YjodgJ-A/viewform?usp=sf_link)

All code and tutorials are open-source on GitHub: [github.com/WTFAcademy/WTF-Ethers](https://github.com/WTFAcademy/WTF-Ethers)

-----

In this article, we introduce a method of using off-chain signatures as a whitelist for distributing NFTs. If you are not familiar with the `ECDSA` contract, please refer to [WTF Solidity Simplified Tutorial 37: Digital Signature](https://github.com/AmazingAng/WTF-Solidity/blob/main/37_Signature/readme.md).

## Digital Signature

If you have used `opensea` to trade NFTs, you will be familiar with signatures. The image below shows the window that pops up when signing with the small fox (`Metamask`) wallet. It proves that you own the private key without needing to disclose it publicly.

![Metamask Signature](./img/18-1.png)

The digital signature algorithm used by Ethereum is called Elliptic Curve Digital Signature Algorithm (`ECDSA`), based on the digital signature algorithm of elliptic curve "private key - public key" pairs. It serves three main purposes: 

1. **Identity Authentication**: Proves that the signer is the holder of the private key.
2. **Non-Repudiation**: The sender cannot deny sending the message.
3. **Integrity**: The message cannot be modified during transmission.

## Digital Signature Contract Overview

The `SignatureNFT` contract in the [WTF Solidity Simplified Tutorial 37: Digital Signature](https://github.com/AmazingAng/WTF-Solidity/blob/main/37_Signature/readme.md) uses `ECDSA` to validate whitelist addresses and mint NFTs. Let's discuss two important functions:

1. Constructor: Initializes the name, symbol, and signing public key `signer` of the NFT.

2. `mint()`: Validates the whitelist address using `ECDSA` and mints the NFT. The parameters are the whitelist address `account`, the `tokenId` to be minted, and the signature.

## Generating a Digital Signature

1. Message Packaging: According to the `ECDSA` standard in Ethereum, the `message` to be signed is the `keccak256` hash of a set of data, represented as `bytes32`. We can use the `solidityKeccak256()` function provided by `ethers.js` to pack and compute the hash of any content we want to sign. It is equivalent to `keccak256(abi.encodePacked())` in Solidity.

   In the code below, we pack an `address` variable and a `uint256` variable, and calculate the hash to obtain the `message`:
   ```js
   // Create message
   const account = "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4";
   const tokenId = "0";
   // Equivalent to keccak256(abi.encodePacked(account, tokenId)) in Solidity
   const msgHash = ethers.solidityKeccak256(
       ['address', 'uint256'],
       [account, tokenId]);
   console.log(`msgHash: ${msgHash}`);
   // msgHash: 0x1bf2c0ce4546651a1a2feb457b39d891a6b83931cc2454434f39961345ac378c
   ```

2. Signing: To prevent users from mistakenly signing malicious transactions, `EIP191` advocates adding the `"\x19Ethereum Signed Message:\n32"` character at the beginning of the `message`, hashing it again with `keccak256` to obtain the `Ethereum signed message`, and then signing it. The wallet class in `ethers.js` provides the `signMessage()` function for signing according to the `EIP191` standard. Note that if the `message` is of type `string`, it needs to be processed using the `arrayify()` function. Example:
   ```js
   // Signing
   const messageHashBytes = ethers.getBytes(msgHash);
   const signature = await wallet.signMessage(messageHashBytes);
   console.log(`Signature: ${signature}`);
   // Signature: 0x390d704d7ab732ce034203599ee93dd5d3cb0d4d1d7c600ac11726659489773d559b12d220f99f41d17651b0c1c6a669d346a397f8541760d6b32a5725378b241c
   ```

## Off-Chain Signature Whitelist Minting of NFTs

1. Create a `provider` and `wallet`, where `wallet` is the wallet used for signing.
   ```js
   // Prepare Alchemy API (Refer to https://github.com/AmazingAng/WTF-Solidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md for details)
   const ALCHEMY_GOERLI_URL = 'https://eth-goerli.alchemyapi.io/v2/GlaeWuylnNM3uuOo-SAwJxuwTdqHaY5l';
   const provider = new ethers.JsonRpcProvider(ALCHEMY_GOERLI_URL);
   // Create wallet object using the private key and provider
   const privateKey = '0x227dbb8586117d55284e26620bc76534dfbd2394be34cf4a09cb775d593b6f2b';
   const wallet = new ethers.Wallet(privateKey, provider);
   ```

2. Generate the `message` and sign it based on the whitelist addresses and the `tokenId` they can mint.
   ```js
   // Create message
   const account = "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4";
   const tokenId = "0";
   // Equivalent to keccak256(abi.encodePacked(account, tokenId)) in Solidity
   const msgHash = ethers.solidityPackedKeccak256(
       ['address', 'uint256'],
       [account, tokenId]);
   console.log(`msgHash: ${msgHash}`);
   // Signing
   const messageHashBytes = ethers.getBytes(msgHash);
   const signature = await wallet.signMessage(messageHashBytes);
   console.log(`Signature: ${signature}`);
   ```
   ![Creating Signature](./img/18-2.png)

3. Create a contract factory to prepare for deploying the NFT contract.
   ```js
   // Human-readable ABI of the NFT
   const abiNFT = [
       "constructor(string memory _name, string memory _symbol, address _signer)",
       "function name() view returns (string)",
       "function symbol() view returns (string)",
   ...
   ```
```markdown
---
title: "Deploy and Mint NFT with Off-chain Signature Verification"
---

# Deploy and Mint NFT with Off-chain Signature Verification

In this tutorial, we will learn how to deploy and mint an NFT (Non-Fungible Token) using off-chain signature verification. The process involves creating a whitelist of addresses and verifying signatures off-chain before minting the NFT.

## Prerequisites

- Knowledge of Solidity and Ethereum smart contracts
- An Ethereum wallet with testnet ETH

## Steps

1. Define the whitelist of addresses that are allowed to mint the NFT.

2. Generate a message and sign it using a backend wallet for each address in the whitelist.

3. Deploy the NFT contract, and store the public key of the signing wallet (`signer`) in the contract.

4. When a user wants to mint an NFT, request the corresponding signature for their address from the backend.

5. Call the `mint()` function of the NFT contract, passing the user's address, token ID, and signature as parameters. Verify the signature off-chain to ensure the user is in the whitelist before minting the NFT.

## Deployment

To deploy and mint an NFT using off-chain signature verification, follow these steps:

1. Create a whitelist of addresses that are allowed to mint the NFT.

2. Generate a message and sign it using a backend wallet for each address in the whitelist. For example, using the `ethers.js` library:

   ```javascript
   const signer = ethers.utils.Wallet.fromMnemonic('<your mnemonic>');
   const message = ethers.utils.hexlify(ethers.utils.randomBytes(32));
   const signature = await signer.signMessage(message);
   ```

3. Deploy the NFT contract, passing the signer's public key (`signer.publicKey`) as a constructor parameter. You can use the `ethers.js` library for deployment:

   ```javascript
   const abiNFT = ...; // NFT contract ABI
   const bytecodeNFT = ...; // NFT contract bytecode

   const factoryNFT = new ethers.ContractFactory(abiNFT, bytecodeNFT, wallet);

   // Deploy the contract
   const contractNFT = await factoryNFT.deploy("WTF Signature", "WTF", wallet.address);

   console.log(`Contract address: ${contractNFT.target}`);
   console.log("Waiting for contract deployment on the blockchain...");
   await contractNFT.waitForDeployment();
   console.log("Contract has been deployed!");
   ```

4. Call the `mint()` function of the NFT contract using the user's address, token ID, and signature. Verify the signature off-chain before minting the NFT:

   ```javascript
   console.log(`NFT Name: ${await contractNFT.name()}`);
   console.log(`NFT Symbol: ${await contractNFT.symbol()}`);
   const tx = await contractNFT.mint(account, tokenId, signature);

   console.log("Minting in progress, waiting for the transaction to be confirmed...");
   await tx.wait();

   console.log(`Minted successfully! Balance of NFTs for address ${account}: ${await contractNFT.balanceOf(account)}`);
   ```

Note: The `abiNFT` and `bytecodeNFT` variables should contain the ABI and bytecode of your NFT contract.

This tutorial explained how to deploy and mint an NFT using off-chain signature verification. It is an efficient and cost-effective way to verify a whitelist before minting the NFTs. Remember to maintain the whitelist and generate signatures securely in the backend to ensure the integrity and security of the process.
```