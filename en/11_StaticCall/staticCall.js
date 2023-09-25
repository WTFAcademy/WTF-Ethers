// contract.functionName.staticCall(arguments, {override})
import { ethers } from "ethers";

// Prepare alchemy API, you can refer to https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md 
const ALCHEMY_MAINNET_URL = 'https://eth-mainnet.g.alchemy.com/v2/oKmOQKbneVkxgHZfibs-iFhIlIAl6HDN';
const provider = new ethers.JsonRpcProvider(ALCHEMY_MAINNET_URL);

// Create a wallet object using the private key and provider
const privateKey = '0x227dbb8586117d55284e26620bc76534dfbd2394be34cf4a09cb775d593b6f2b'
const wallet = new ethers.Wallet(privateKey, provider)

// ABI for DAI
const abiDAI = [
    "function balanceOf(address) public view returns(uint)",
    "function transfer(address, uint) public returns (bool)",
];
// DAI contract address (mainnet)
const addressDAI = '0x6B175474E89094C44Da98b954EedeAC495271d0F' // DAI Contract

// Create an instance of the DAI contract
const contractDAI = new ethers.Contract(addressDAI, abiDAI, provider)

const main = async () => {
    try {
    const address = await wallet.getAddress()
    // 1. Read on-chain information of DAI contract
    console.log("\n1. Read DAI balance of test wallet")
    const balanceDAI = await contractDAI.balanceOf(address)
    const balanceDAIVitalik = await contractDAI.balanceOf("vitalik.eth")

    console.log(`DAI balance of test wallet: ${ethers.formatEther(balanceDAI)}\n`)
    console.log(`DAI balance of vitalik: ${ethers.formatEther(balanceDAIVitalik)}\n`)

    // 2. Use staticCall to try calling transfer and transfer 1 DAI, with msg.sender as Vitalik, the transaction will succeed
    console.log("\n2. Use staticCall to try calling transfer and transfer 1 DAI, with msg.sender as Vitalik address")
    // Initiate the transaction
    const tx = await contractDAI.transfer.staticCall("vitalik.eth", ethers.parseEther("1"), {from: await provider.resolveName("vitalik.eth")})
    console.log(`Will the transaction succeed?:`, tx)

    // 3. Use staticCall to try calling transfer and transfer 10000 DAI, with msg.sender as the test wallet address, the transaction will fail
    console.log("\n3. Use staticCall to try calling transfer and transfer 1 DAI, with msg.sender as the test wallet address")
    const tx2 = await contractDAI.transfer.staticCall("vitalik.eth", ethers.parseEther("10000"), {from: address})
    console.log(`Will the transaction succeed?:`, tx)

    } catch (e) {
        console.log(e);
      }
}

main()