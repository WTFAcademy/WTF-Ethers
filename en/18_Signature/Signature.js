// Distribute NFT whitelist process through signature:
//
// Store the private key-public key pair of the signer wallet on the server
// -> Record allowlist (whitelist address) and tokenId on the server and generate the corresponding msgHash
// -> Sign msgHash with the signer wallet
// -> Deploy NFT contract, with signer's public key saved in the contract during initialization
// -> When the user mints, fill in the address and tokenId, and request a signature from the server
// -> Call the mint() function of the contract to mint

import { ethers } from "ethers";
import * as contractJson from "./contract.json" assert {type: "json"};

// 1. Create provider and wallet
// Prepare alchemy API, refer to https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md 
const ALCHEMY_GOERLI_URL = 'https://eth-goerli.alchemyapi.io/v2/GlaeWuylnNM3uuOo-SAwJxuwTdqHaY5l';
const provider = new ethers.JsonRpcProvider(ALCHEMY_GOERLI_URL);
// Create wallet object using private key and provider
const privateKey = '0x227dbb8586117d55284e26620bc76534dfbd2394be34cf4a09cb775d593b6f2b'
const wallet = new ethers.Wallet(privateKey, provider)

// 2. Generate msgHash based on allowlist address and tokenId, and sign
console.log("\n1. Generate signature")
// Create message
const account = "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4"
const tokenId = "0"
// Equivalent to keccak256(abi.encodePacked(account, tokenId)) in Solidity
const msgHash = ethers.solidityPackedKeccak256(
    ['address', 'uint256'],
    [account, tokenId])
console.log(`msgHash: ${msgHash}`)

const main = async () => {
    // Sign
    const messageHashBytes = ethers.getBytes(msgHash)
    const signature = await wallet.signMessage(messageHashBytes);
    console.log(`Signature: ${signature}`)

    // 3. Create contract factory
    // Human-readable abi of NFT
    const abiNFT = [
        "constructor(string memory _name, string memory _symbol, address _signer)",
        "function name() view returns (string)",
        "function symbol() view returns (string)",
        "function mint(address _account, uint256 _tokenId, bytes memory _signature) external",
        "function ownerOf(uint256) view returns (address)",
        "function balanceOf(address) view returns (uint256)",
    ];
    // Contract bytecode, in remix, you can find bytecode in two places
    // i. Bytecode button in the deployment panel
    // ii. In the json file with the same name as the contract in the artifact folder in the file panel
    // The data in the "object" field is the bytecode, it's quite long, starting with 608060
    // "object": "608060405260646000553480156100...
    const bytecodeNFT = contractJson.default.object;
    const factoryNFT = new ethers.ContractFactory(abiNFT, bytecodeNFT, wallet);

    // Get ETH balance in the wallet
    const balanceETH = await provider.getBalance(wallet)

    // If wallet has enough ETH
    if(ethers.formatEther(balanceETH) > 0.002){
        // 4. Deploy NFT contract using contractFactory
        console.log("\n2. Deploy NFT contract using contractFactory")
        // Deploy contract and fill in the constructor parameters
        const contractNFT = await factoryNFT.deploy("WTF Signature", "WTF", wallet.address)
        console.log(`Contract address: ${contractNFT.target}`);
        console.log("Waiting for contract to be deployed on chain")
        await contractNFT.waitForDeployment()
        // Can also use contractNFT.deployTransaction.wait()
        console.log("Contract deployed on chain")

        // 5. Call mint() function to verify whitelist with signature and mint NFT for account address
        console.log("\n3. Call mint() function to verify whitelist with signature and mint NFT for the first address")
        console.log(`NFT name: ${await contractNFT.name()}`)
        console.log(`NFT symbol: ${await contractNFT.symbol()}`)
        let tx = await contractNFT.mint(account, tokenId, signature)
        console.log("Minting, waiting for transaction to be included on chain")
        await tx.wait()
        console.log(`Mint successful, NFT balance of address ${account}: ${await contractNFT.balanceOf(account)}\n`)

    }else{
        // If ETH is not enough
        console.log("Insufficient ETH, go to a faucet to get some Goerli ETH")
        console.log("1. Chainlink faucet: https://faucets.chain.link/goerli")
        console.log("2. Paradigm faucet: https://faucet.paradigm.xyz/")
    }
}

main()