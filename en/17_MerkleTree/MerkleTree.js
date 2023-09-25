import { ethers } from "ethers";
import { MerkleTree } from "merkletreejs";
import * as contractJson from "./contract.json" assert {type: "json"};

// 1. Generate merkle tree
console.log("\n1. Generate merkle tree")
// Whitelist addresses
const tokens = [
    "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4", 
    "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2",
    "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db",
    "0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB"
];
// leaf, merkletree, proof
const leaf       = tokens.map(x => ethers.keccak256(x))
const merkletree = new MerkleTree(leaf, ethers.keccak256, { sortPairs: true });
const proof      = merkletree.getHexProof(leaf[0]);
const root = merkletree.getHexRoot()
console.log("Leaf:")
console.log(leaf)
console.log("\nMerkleTree:")
console.log(merkletree.toString())
console.log("\nProof:")
console.log(proof)
console.log("\nRoot:")
console.log(root)

// 2. Create provider and wallet
// Prepare the alchemy API, please refer to https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md 
const ALCHEMY_GOERLI_URL = 'https://eth-goerli.alchemyapi.io/v2/GlaeWuylnNM3uuOo-SAwJxuwTdqHaY5l';
const provider = new ethers.JsonRpcProvider(ALCHEMY_GOERLI_URL);
// Create wallet object using private key and provider
const privateKey = '0x227dbb8586117d55284e26620bc76534dfbd2394be34cf4a09cb775d593b6f2b'
const wallet = new ethers.Wallet(privateKey, provider)

// 3. Create contract factory
// Human-readable ABI of NFT
const abiNFT = [
    "constructor(string memory name, string memory symbol, bytes32 merkleroot)",
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function mint(address account, uint256 tokenId, bytes32[] calldata proof) external",
    "function ownerOf(uint256) view returns (address)",
    "function balanceOf(address) view returns (uint256)",
];
// Contract bytecode, in Remix, you can find the bytecode in two places
// i. Bytecode button in the deployment panel
// ii. The "object" field in the json file with the same name as the contract in the artifact folder of the file panel
// The data corresponding to "object" is the bytecode, which is quite long, starting from 608060
// "object": "608060405260646000553480156100...
const bytecodeNFT = contractJson.default.object;
const factoryNFT = new ethers.ContractFactory(abiNFT, bytecodeNFT, wallet);

const main = async () => {
    // Get ETH balance in the wallet
    const balanceETH = await provider.getBalance(wallet)

    // If the wallet has enough ETH
    if(ethers.formatEther(balanceETH) > 0.002){
        // 4. Deploy NFT contract using contractFactory
        console.log("\n2. Deploy NFT contract using contractFactory")
        // Deploy the contract and fill in the constructor parameters
        const contractNFT = await factoryNFT.deploy("WTF Merkle Tree", "WTF", root)
        console.log(`Contract address: ${contractNFT.target}`);
        console.log("Waiting for contract deployment")
        await contractNFT.waitForDeployment()
        // You can also use contractNFT.deployTransaction.wait()
        console.log("Contract deployed")

        // 5. Call the mint() function, use the merkle tree to verify the whitelist, and mint NFT for the first address
        console.log("\n3. Call the mint() function, use the merkle tree to verify the whitelist, and mint NFT for the first address")
        console.log(`NFT name: ${await contractNFT.name()}`)
        console.log(`NFT symbol: ${await contractNFT.symbol()}`)
        let tx = await contractNFT.mint(tokens[0], "0", proof)
        console.log("Minting, waiting for transaction to be mined")
        await tx.wait()
        console.log(`Minting successful, NFT balance of address ${tokens[0]}: ${await contractNFT.balanceOf(tokens[0])}\n`)

    }else{
        // If there is not enough ETH
        console.log("Not enough ETH, go to the faucet to get some Goerli ETH")
        console.log("1. Alchemy faucet: https://goerlifaucet.com/")
        console.log("2. Paradigm faucet: https://faucet.paradigm.xyz/")
    }
}

main()