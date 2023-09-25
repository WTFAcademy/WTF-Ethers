import { ethers } from "ethers";

// 1. Create HD wallet
console.log("\n1. Create HD wallet")
// Generate random mnemonic
const mnemonic = ethers.Mnemonic.entropyToPhrase(ethers.randomBytes(32))
// Create HD wallet
const hdNode = ethers.HDNodeWallet.fromPhrase(mnemonic)
console.log(hdNode);

// 2. Derive 20 wallets from HD wallet
console.log("\n2. Derive 20 wallets from HD wallet")
const numWallet = 20
// Derivation path: m / purpose' / coin_type' / account' / change / address_index
// We only need to switch the last address_index to derive new wallets from hdNode
let basePath = "m/44'/60'/0'/0";
let wallets = [];
for (let i = 0; i < numWallet; i++) {
    let hdNodeNew = hdNode.derivePath(basePath + "/" + i);
    let walletNew = new ethers.Wallet(hdNodeNew.privateKey);
    console.log(`Wallet ${i+1} address: ${walletNew.address}`)
    wallets.push(walletNew);
}

// 3. Save wallet (encrypted JSON)
console.log("\n3. Save wallet (encrypted JSON)")
const wallet = ethers.Wallet.fromPhrase(mnemonic)
console.log("Create wallet from mnemonic:")
console.log(wallet)
// Password for encrypting JSON, can be changed to another password
const pwd = "password"
const json = await wallet.encrypt(pwd)
console.log("Encrypted JSON of the wallet:")
console.log(json)

// 4. Read wallet from encrypted JSON
const wallet2 = await ethers.Wallet.fromEncryptedJson(json, pwd);
console.log("\n4. Read wallet from encrypted JSON:")
console.log(wallet2)