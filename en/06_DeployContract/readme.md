---
title: 6. Deploy Contract
tags:
  - ethers
  - javascript
  - provider
  - wallet
  - contract
  - create
  - frontend
  - web
---

# Ethers Quick Start: 6. Deploy Contract

I have been learning `ethers.js` recently to solidify some details and write a "WTF Ethers Quick Start" guide for beginners.

**Twitter**: [@0xAA_Science](https://twitter.com/0xAA_Science)

**WTF Academy Community**: [Official website wtf.academy](https://wtf.academy) | [WTF Solidity Tutorial](https://github.com/AmazingAng/WTF-Solidity) | [Discord](https://discord.gg/5akcruXrsk) | [WeChat Group Application](https://docs.google.com/forms/d/e/1FAIpQLSe4KGT8Sh6sJ7hedQRuIYirOoZK_85miz3dw7vA1-YjodgJ-A/viewform?usp=sf_link)

All codes and tutorials are open-source on GitHub: [github.com/WTFAcademy/WTFEthers](https://github.com/WTFAcademy/WTF-Ethers)

-----

Note: This tutorial is based on ethers.js 6.3.0. If you are using v5, you can refer to the [ethers.js v5 documentation](https://docs.ethers.io/v5/).

In this lesson, we will introduce the `ContractFactory` type in `ethers.js` and use it to deploy a contract.

For more details, refer to the [ethers.js documentation](https://docs.ethers.io/v5/api/contract/contract-factory).

## Deploying Smart Contracts

On Ethereum, deploying a smart contract is a special transaction: it involves sending the bytecode obtained from compiling the smart contract to address 0. If the contract has constructor arguments, you need to encode the arguments into bytecode using `abi.encode` and append it to the end of the contract bytecode. For an introduction to ABI encoding, refer to the WTF Solidity Quick Start [Lesson 27: ABI Encoding](https://github.com/AmazingAng/WTFSolidity/blob/main/27_ABIEncode/readme.md).

## Contract Factory

`ethers.js` provides the `ContractFactory` type that allows developers to easily deploy contracts. You can create an instance of `ContractFactory` by providing the contract's `abi`, compiled `bytecode`, and the `signer` variable to prepare for contract deployment.

```js
const contractFactory = new ethers.ContractFactory(abi, bytecode, signer);
```

**Note**: If the contract has a constructor with arguments, the `abi` must include the constructor.

After creating an instance of the contract factory, you can call its `deploy` function and pass the arguments `args` of the contract constructor to deploy and obtain an instance of the contract:

```js
const contract = await contractFactory.deploy(args);
```

You can wait for the contract to be deployed and confirmed on the chain before interacting with it using either of the following commands:

```js
await contractERC20.waitForDeployment();
```

## Example: Deploying an ERC20 Token Contract

For an introduction to the `ERC20` standard token contract, refer to the WTF Solidity Quick Start [Lesson 31: ERC20](https://github.com/AmazingAng/WTFSolidity/blob/main/31_ERC20/readme.md).

1. Create `provider` and `wallet` variables.
    ```js
    import { ethers } from "ethers";

    // Connect to the Ethereum network using Alchemy's RPC node
    // Connect to the Goerli test network
    const ALCHEMY_GOERLI_URL = 'https://eth-goerli.alchemyapi.io/v2/GlaeWuylnNM3uuOo-SAwJxuwTdqHaY5l';
    const provider = new ethers.JsonRpcProvider(ALCHEMY_GOERLI_URL);

    // Create a wallet object using the private key and provider
    const privateKey = '0x227dbb8586117d55284e26620bc76534dfbd2394be34cf4a09cb775d593b6f2b';
    const wallet = new ethers.Wallet(privateKey, provider);
    ```

2. Prepare the bytecode and ABI of the ERC20 contract. Since the ERC20 contract has a constructor with arguments, we must include it in the ABI. You can obtain the contract bytecode by clicking the `Bytecode` button in the compilation panel of Remix. The "object" field corresponds to the bytecode data. If the contract is already deployed on the chain, you can find it in the `Contract Creation Code` section on etherscan.

    ```js
    // Human-readable ABI of ERC20
    const abiERC20 = [
        "constructor(string memory name_, string memory symbol_)",
        "function name() view returns (string)",
        "function symbol() view returns (string)",
        "function totalSupply() view returns (uint256)",
        "function balanceOf(address) view returns (uint)",
        "function transfer(address to, uint256 amount) external returns (bool)",
        "function mint(uint amount) external",
    ];
    // Fill in the contract bytecode. In Remix, you can find the bytecode in two places:
    // 1. Click the Bytecode button in the compilation panel.
    // 2. In the artifact file with the same name as the contract in the file panel's artifact folder.
    // The data corresponding to the "object" field under the "bytecode" attribute is the bytecode, which is quite long, starting with 608060
    // "object": "608060405260646000553480156100...

```
const bytecodeERC20 = "60806040526012600560006101000a81548160ff021916908360ff1602179055503480156200002d57600080fd5b5060405162001166380380620011668339818101604052810190620000539190620001bb565b81600390805190602001906200006b9291906200008d565b508060049080519060200190620000849291906200008d565b505050620003c4565b8280546200009b90620002d5565b90600052602060002090601f016020900481019282620000bf57600085556200010b565b82601f10620000da57805160ff19168380011785556200010b565b828001600101855582156200010b579182015b828111156200010a578251825591602001919060010190620000ed565b5b5090506200011a91906200011e565b5090565b5b80821115620001395760008160009055506001016200011f565b5090565b6000620001546200014e8462000269565b62000240565b905082815260208101848484011115620001735762000172620003a4565b5b620001808482856200029f565b509392505050565b600082601f830112620001a0576200019f6200039f565b5b8151620001b28482602086016200013d565b91505092915050565b60008060408385031215620001d557620001d4620003ae565b5b600083015167ffffffffffffffff811115620001f657620001f5620003a9565b5b620002048582860162000188565b925050602083015167ffffffffffffffff811115620002285762000227620003a9565b5b620002368582860162000188565b9150509250929050565b60006200024c6200025f565b90506200025a82826200030b565b919050565b6000604051905090565b600067ffffffffffffffff82111562000287576200028662000370565b5b6200029282620003b3565b9050602081019050919050565b60005b83811015620002bf578082015181840152602081019050620002a2565b83811115620002cf576000848401525b50505050565b60006002820490506001821680620002ee57607f821691505b6020821081141562000305576200030462000341565b5b50919050565b6200031682620003b3565b810181811067ffffffffffffffff8211171562000338576200033762000370565b5b80604052505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b610d9280620003d46000396000f3fe608060405234801561001057600080fd5b50600436106100a95760003560e01c806342966c681161007157806342966c681461016857806370a082311461018457806395d89b41146101b4578063a0712d68146101d2578063a9059cbb146101ee578063dd62ed3e1461021e576100a9565b806306fdde03146100ae578063095ea7b3146100cc57806318160ddd146100fc57806323b872dd1461011a578063313ce5671461014a575b600080fd5b6100b661024e565b6040516100c39190610b02565b60405180910390f35b6100e660048036038101906100e19190610a14565b6102dc565b6040516100f39190610ae7565b60405180910390f35b6101046103ce565b6040516101119190610b24565b60405180910390f35b610134600480360381019061012f91906109c1565b6103d4565b6040516101419190610ae7565b60405180910390f35b610152610583565b60405161015f9190610b3f565b60405180910390f35b610182600480360381019061017d91906109c1565b610596565b005b61019e60048036038101906101999190610954565b61066d565b6040516101ab9190610b24565b60405180910390f35b6101bc610685565b6040516101c99190610b02565b60405180910390f35b6101ec60048036038101906101e79190610a54565b610713565b005b61020860048036038101906102039190610a14565b6107ea565b6040516102159190610ae7565b60405180910390f35b61023860048036038101906102339190610981565b610905565b6040516102459190610b24565b60405180910390f35b6003805461025b90610c88565b80601f016020809104026020016040519081016040528092919081815260200182805461028790610c88565b80156102d45780601f106102a9576101008083540402835291602001916102d4565b820191906000526020600020905b8154815290600101906020018083116102b757829003601f168201915b505050505081565b600081600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925846040516103bc9190610b24565b60405180910390a3600190509291505056";
```

![Obtaining bytecode in Remix](img/6-1.png)
![json](img/json.jpg)
![object](img/object.jpg)

3. Create an instance of the contract factory `ContractFactory`.

    ```js
    const factoryERC20 = new ethers.ContractFactory(abiERC20, bytecodeERC20, wallet);
    ```

4. Call the `deploy()` function of the factory contract and provide the constructor arguments (token name and symbol) to deploy the `ERC20` token contract and obtain the contract instance. You can use:
    - `contract.target` to get the contract address,
    - `contract.deployTransaction` to get the deployment details,
    - `contractERC20.waitForDeployment()` to wait for confirmation of contract deployment on the blockchain.

    ```js
    // 1. Deploy the ERC20 token contract using contractFactory
    console.log("\n1. Deploy the ERC20 token contract using contractFactory")
    // Deploy the contract and provide constructor arguments
    const contractERC20 = await factoryERC20.deploy("WTF Token", "WTF")
    console.log(`Contract Address: ${contractERC20.target}`);
    console.log("Deployment transaction details")
    console.log(contractERC20.deploymentTransaction())
    console.log("\nWait for contract deployment on the blockchain")
    await contractERC20.waitForDeployment()
    // You can also use contractERC20.deployTransaction.wait()
    console.log("Contract deployed on the blockchain")
    ```

    ![Deploying Contract](img/6-2.png)

5. After the contract is deployed on the blockchain, call the `name()` and `symbol()` functions to print the token name and symbol. Then call the `mint()` function to mint `10,000` tokens for yourself.

    ```js
    // Print the contract's name() and symbol(), then call the mint() function to mint 10,000 tokens for your address
    console.log("\n2. Call the mint() function to mint 10,000 tokens for your address")
    console.log(`Contract Name: ${await contractERC20.name()}`)
    console.log(`Contract Symbol: ${await contractERC20.symbol()}`)
    let tx = await contractERC20.mint("10000")
    console.log("Wait for the transaction to be confirmed on the blockchain")
    await tx.wait()
    console.log(`Token balance in your address after minting: ${await contractERC20.balanceOf(wallet)}`)
    console.log(`Total token supply: ${await contractERC20.totalSupply()}`)
    ```
    ![Minting Tokens](img/6-3.png)

6. Call the `transfer()` function to transfer `1,000` tokens to Vitalik.

    ```js
    // 3. Call the transfer() function to transfer 1000 tokens to Vitalik
    console.log("\n3. Call the transfer() function to transfer 1,000 tokens to Vitalik")
    tx = await contractERC20.transfer("vitalik.eth", "1000")
    console.log("Wait for the transaction to be confirmed on the blockchain")
    await tx.wait()
    console.log(`Token balance in Vitalik's wallet: ${await contractERC20.balanceOf("vitalik.eth")}`)
    ```

    ![Transfer Tokens](img/6-4.png)

## Summary

In this lesson, we introduced the `ContractFactory` type in ether.js and used it to deploy an `ERC20` token contract and transfer `1,000` tokens to Vitalik.