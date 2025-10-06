import { ethers } from "ethers";
console.log("\n1. Create HD wallet")
// Generate random mnemonic
console.log("\n1. Create an HD wallet");
// Generate an HD wallet from the mnemonic
const mnemonic = `air organ twist rule prison symptom jazz cheap rather dizzy verb glare jeans orbit weapon universe require tired sing casino business anxiety seminar hunt`;
const hdNode = ethers.HDNodeWallet.fromPhrase(mnemonic);
console.log(hdNode);

console.log("\n2. Derive 20 wallet addresses from the HD wallet");
const numWallet = 20;
// Derivation path: m / purpose' / coin_type' / account' / change / address_index
// We only need to change the last part, address_index, to derive new wallets from hdNode
let basePath = "m/44'/60'/0'/0";
let addresses = [];
for (let i = 0; i < numWallet; i++) {
    let hdNodeNew = hdNode.derivePath(basePath + "/" + i);
    let walletNew = new ethers.Wallet(hdNodeNew.privateKey);
    addresses.push(walletNew.address);
}
console.log(addresses);
const amounts = Array(20).fill(ethers.parseEther("0.0001"));
console.log(`Amounts to send: ${amounts}`);

const INFURA_GOERLI_URL = 'https://goerli.infura.io/v3/8b9750710d56460d940aeff47967c4ba';
const provider = new ethers.JsonRpcProvider(INFURA_GOERLI_URL);

// Create a wallet object from the private key and provider
// If this wallet is out of Goerli testnet ETH
// Please use your own testnet wallet, wallet address: 0x338f8891D6BdC58eEB4754352459cC461EfD2a5E, please don't send any ETH to this address
// Note: Do not upload your private key to GitHub
const privateKey = '0x21ac72b6ce19661adf31ef0d2bf8c3fcad003deee3dc1a1a64f5fa3d6b049c06';
const wallet = new ethers.Wallet(privateKey, provider);

// Airdrop ABI
const abiAirdrop = [
  "function multiTransferToken(address,address[],uint256[]) external",
  "function multiTransferETH(address[],uint256[]) public payable",
];
// Airdrop contract address (Goerli testnet)
const addressAirdrop = '0x71C2aD976210264ff0468d43b198FD69772A25fa'; // Airdrop Contract
// Instantiate the Airdrop contract
const contractAirdrop = new ethers.Contract(addressAirdrop, abiAirdrop, wallet);

// WETH ABI
const abiWETH = [
  "function balanceOf(address) public view returns(uint)",
  "function transfer(address, uint) public returns (bool)",
  "function approve(address, uint256) public returns (bool)"
];
// WETH contract address (Goerli testnet)
const addressWETH = '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6'; // WETH Contract
// Instantiate the WETH contract
const contractWETH = new ethers.Contract(addressWETH, abiWETH, wallet);
 
main = async()=> {

console.log("\n3. Read ETH and WETH balance of an address")
    // Read WETH balance
    const balanceWETH = await contractWETH.balanceOf(addresses[10])
    console.log(`WETH balance: ${ethers.formatEther(balanceWETH)}\n`)
    // Read ETH balance
    const balanceETH = await provider.getBalance(addresses[10])
    console.log(`ETH balance: ${ethers.formatEther(balanceETH)}\n`)

    const myETH = await provider.getBalance(wallet)
    const myToken = await contractWETH.balanceOf(wallet.getAddress())
    // If the wallet has enough ETH and WETH
    if(ethers.formatEther(myETH) > 0.002 && ethers.formatEther(myToken) >= 0.002){

        // 7. Call multiTransferETH() function to transfer 0.0001 ETH to each wallet
        console.log("\n4. Call multiTransferETH() function to transfer 0.0001 ETH to each wallet")
        // Initiate transaction
        const tx = await contractAirdrop.multiTransferETH(addresses, amounts, {value: ethers.parseEther("0.002")})
        // Wait for transaction to be mined
        await tx.wait()
        // console.log(`Transaction details:`)
        // console.log(tx)
        const balanceETH2 = await provider.getBalance(addresses[10])
        console.log(`ETH balance of the address after transfer: ${ethers.formatEther(balanceETH2)}\n`)
        
        // 8. Call multiTransferToken() function to transfer 0.0001 WETH to each wallet
        console.log("\n5. Call multiTransferToken() function to transfer 0.0001 WETH to each wallet")
        // Approve WETH to Airdrop contract first
        const txApprove = await contractWETH.approve(addressAirdrop, ethers.parseEther("1"))
        await txApprove.wait()
        // Initiate transaction
        const tx2 = await contractAirdrop.multiTransferToken(addressWETH, addresses, amounts)
        // Wait for transaction to be mined
        await tx2.wait()
        // console.log(`Transaction details:`)
        // console.log(tx2)
        // Read WETH balance
        const balanceWETH2 = await contractWETH.balanceOf(addresses[10])
console.log(`Wallet WETH balance after sending: ${ethers.formatEther(balanceWETH2)}\n`)

    }else{
        // If ETH and WETH are not sufficient
        console.log("Insufficient ETH, please use your own test wallet and exchange some WETH")
        console.log("1. Chainlink Faucet: https://faucets.chain.link/goerli")
        console.log("2. Paradigm Faucet: https://faucet.paradigm.xyz/")
    }
}

main()
