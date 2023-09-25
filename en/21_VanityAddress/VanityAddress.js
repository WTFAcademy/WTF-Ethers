// Regular expression,
// Match the characters after ^0x with the characters to be matched in the previous few positions
// .* is a wildcard
// Write the characters to be matched in the last few positions before $
// Example: two 0 at the beginning and two 1 at the end 
// const regex = /^0x00.*11$/

import { ethers } from "ethers";
var wallet // Wallet
const regex = /^0x000.*$/ // Expression
var isValid = false
while(!isValid){
    wallet = ethers.Wallet.createRandom() // Generate a random wallet for security
    isValid = regex.test(wallet.address) // Validate the regular expression
    //console.log(wallet.address)
}
// Print the fancy address and private key
console.log(`\nFancy address: ${wallet.address}`)
console.log(`Fancy private key: ${wallet.privateKey}\n`)