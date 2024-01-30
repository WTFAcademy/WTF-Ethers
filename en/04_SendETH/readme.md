---
title: 4. Send ETH
tags:
  - ethers
  - javascript
  - provider
  - wallet
  - contract
  - frontend
  - web
---

# WTF Ethers: 4. Send ETH

I've been revisiting `ethers.js` recently to refresh my understanding of the details and to write a simple tutorial called "WTF Ethers" for beginners.

**Twitter**: [@0xAA_Science](https://twitter.com/0xAA_Science)

**Community**: [Website wtf.academy](https://wtf.academy) | [WTF Solidity](https://github.com/AmazingAng/WTFSolidity) | [discord](https://discord.gg/5akcruXrsk) | [WeChat Group Application](https://docs.google.com/forms/d/e/1FAIpQLSe4KGT8Sh6sJ7hedQRuIYirOoZK_85miz3dw7vA1-YjodgJ-A/viewform?usp=sf_link)

All the code and tutorials are open-sourced on GitHub: [github.com/WTFAcademy/WTF-Ethers](https://github.com/WTFAcademy/WTF-Ethers)

-----

In this lesson, we will introduce the `Signer` class and its derived class `Wallet`, and use it to send `ETH`.

## `Signer` Class

Unlike `Web3.js`, which assumes that users will deploy Ethereum nodes locally and manage private keys and network connection status through this node (which is not actually the case), `ethers.js` manages network connection status with the `Provider` class, and manages keys securely and flexibly with the `Signer` class or `Wallet` class, separately.

In `ethers`, the `Signer` class is an abstraction of an Ethereum account that can be used to sign messages and transactions, send signed transactions to the Ethereum network, and modify the blockchain state. The `Signer` class is an abstract class and cannot be instantiated directly, so we need to use its subclass: the `Wallet` class.

## `Wallet` Class

The `Wallet` class inherits from the `Signer` class. Developers can use it to sign transactions and messages just like they own an Externally Owned Account (EOA) with a private key.

Below are several ways to create instances of the `Wallet` class:
1. Creating a wallet object with a known private key
2. Creating a wallet object with a random private key
3. Creating a wallet object from a mnemonic
4. Creating a wallet object from a JSON file

For the sake of this tutorial, we will focus on number 1 above and touch on others.

### Method 1: Creating a wallet object with a known private key

If we know the private key, we can use the `ethers.Wallet()` function to create a `Wallet` object.

```javascript
// Create a wallet object with a private key and provider
const privateKey = 'cd82a7d0d6e528322e8c26f9ccbc18767543786d073c48ef38a753f29b1e8f39'
const wallet = new ethers.Wallet(privateKey, provider)
```

NB: For exercise purposes, connect a testnet address on your metamask with faucets.chain.link to get some usable ETH. 

![Fund ](img/4-1.png)

### 1. Create a `Provider` instance

```javascript
// Send ETH using the Wallet class
const { ethers } = require("ethers");
// Connect to the Ethereum test network using the Infura or Alchemy RPC node
const provider = new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/8b9750710d56460d940aeff47967c4ba`)
```

### 2. Create `Wallet` instance

Create a `Wallet` object with the private key for your testwallet. Wallets created using this method are standalone, and we need to use the `connect(provider)` function to connect to the Ethereum node. Wallets created using this method can be used to obtain a mnemonic phrase.

```javascript
// Input your testwallet(sender) with the private key and a random receiver address
const account1 ='0xD616f5A49571e7BCb1BB5326031bC8078BDA9Faa' //sender
const account2 = '0x70e8dE73cE538DA2bEEd35d14187F6959a8ecA96' //recipient

const privateKey1 = 'cd82a7d0d6e528322e8c26f9ccbc18767543786d073c48ef38a753f29b1e8f39' //sender private key
const wallet = new ethers.Wallet(privateKey1, provider)
```

### 3. Create an instance for both accounts before transfer and send ETH
```javascript
const main = async() => {
        //show account 1 balance before transfer
        const senderBalanceBefore = await provider.getBalance(account1)
        //show account 2 balance before transfer
        const receiverBalanceBefore = await provider.getBalance(account2)

        console.log(`\nSender balance before: ${ethers.formatEther(senderBalanceBefore)}\n`)
        console.log(`\nReceiver balance before: ${ethers.formatEther(receiverBalanceBefore)}\n`)

        // send ether
        const tx = await wallet.sendTransaction({
            to: account2, 
            value: ethers.parseEther("0.025") 
        })
```

### 4. Create an instance for both accounts after transfer and fetch balance using the `getBalance()` function.

```javascript
        // fetch transaction or wait for transaction to be mined 
        await tx.wait()
        console.log(tx)

        //show account 1 balance after transfer
        const senderBalanceAfter = await provider.getBalance(account1)
        //show account 2 balance after transfer
        const receiverBalanceAfter = await provider.getBalance(account2)

        console.log(`\nSender balance after: ${ethers.formatEther(senderBalanceAfter)}\n`)
        console.log(`\nReceiver balance after: ${ethers.formatEther(receiverBalanceAfter)}\n`)

}
```

![Result of above](img/4-2.png)

### Other methods for creating a wallet object: 

### Method 2: Creating a wallet object with a random private key

We can use the `ethers.Wallet.createRandom()` function to create a `Wallet` object with a randomly generated private key. The private key is generated from an encrypted secure entropy source. If there is no secure entropy source in the current environment, an error will be thrown.

```javascript
// Create a wallet object with a random private key
const randomWallet = ethers.Wallet.createRandom();
console.log("Address details:", randomWallet);
// you need to console log the private key or else it won't display automatically for security reasons
console.log("Private Key:", randomWallet.privateKey);
```

![Private key](img/4-3.png)

### Method 3: Creating a wallet object from a mnemonic

If we know the mnemonic, we can use the `ethers.Wallet.fromMnemonic()` function to create a `Wallet` object.

```javascript
// Create a wallet object from a mnemonic
const mnemonicWallet = ethers.Wallet.fromPhrase(mnemonic.phrase)
console.log(mnemonicWallet);
// you need to console log the private key or else it won't display automatically for security reasons
console.log("Private Key:", mnemonicWallet.privateKey);
```
![Mnemonic](img/4-4.png)

### Method 4: Creating a wallet object from a JSON file

We can also create a wallet instance by decrypting a JSON wallet file using `const wallet = ethers.Wallet.fromEncryptedJsonSync` decrypting a `JSON` wallet file. A `JSON` file is usually the `keystore` file for wallets like Geth and Parity, which would be familiar to anyone who has set up an Ethereum node using Geth.


## Summary

In this lesson, we introduced the `Signer` and `Wallet` classes and used the wallet instance to get the balance of a `to` and `from` addresses before and after the transaction. We also used some ethers.js functions to generate random wallets, mnemonic phrases, and private keys. 
