const { ethers } = require("ethers");
const provider = new ethers.JsonRpcProvider(
  "https://mainnet.infura.io/v3/8b9750710d56460d940aeff47967c4ba");

const privateKey = "cd82a7d0d6e528322e8c26f9ccbc18767543786d073c48ef38a753f29b1e8f39";
const wallet = new ethers.Wallet(privateKey, provider);

const abiDAI = [
  "function balanceOf(address) public view returns(uint)",
  "function transfer(address, uint) public returns(bool)",
];

const addressDAI = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
const contractDAI = new ethers.Contract(addressDAI, abiDAI, provider);

async function main(
) {
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
