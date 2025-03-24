import { ethers } from "ethers";

// Connect to the Ethereum network using Infura or Alchemy's RPC endpoint
const SEPOLIA_TESTNET_URL = 'https://sepolia.infura.io/v3/8b9750710d56460d940aeff47967c4ba';
const provider = new ethers.JsonRpcProvider(SEPOLIA_TESTNET_URL);

// Create wallet object using private key and provider
const privateKey = 'cd82a7d0d6e528322e8c26f9ccbc18767543786d073c48ef38a753f29b1e8f39';
const wallet = new ethers.Wallet(privateKey, provider)

// Create EIP712 Domain
const contractName = "EIP712Storage"
const version = "1"
const chainId = "1"
const contractAddress = "0xf8e81D47203A594245E36C48e151709F0C19fBe8"

const domain = {
    name: contractName,
    version: version,
    chainId: chainId,
    verifyingContract: contractAddress,
};

// Create typed data, Storage
const spender = "0xD616f5A49571e7BCb1BB5326031bC8078BDA9Faa"
const number = "100"

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
    // EIP712 signature
    const signature = await wallet.signTypedData(domain, types, message);
    console.log("Signature:", signature);
    // Verify EIP712 signature and recover signer address from the signature and message
    const eip712Signer = ethers.verifyTypedData(domain, types, message, signature)
    console.log("EIP712 Signer: ", eip712Signer)
}

main();
