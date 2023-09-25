import { ethers } from "ethers";

// Connect to the Ethereum network using Alchemy's RPC endpoint
// For instructions on setting up Alchemy API, please refer to https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md
const ALCHEMY_MAINNET_URL = 'https://eth-mainnet.g.alchemy.com/v2/oKmOQKbneVkxgHZfibs-iFhIlIAl6HDN';
const provider = new ethers.JsonRpcProvider(ALCHEMY_MAINNET_URL);

// Contract address
const addressUSDT = '0xdac17f958d2ee523a2206206994597c13d831ec7'
// Exchange address
const accountBinance = '0x28C6c06298d514Db089934071355E5743bf21d60'
// Build ABI
const abi = [
  "event Transfer(address indexed from, address indexed to, uint value)",
  "function balanceOf(address) public view returns(uint)",
];
// Build contract object
const contractUSDT = new ethers.Contract(addressUSDT, abi, provider);


(async () => {
  try {
    // 1. Read the balance of USDT in Binance hot wallet
    console.log("\n1. Read the balance of USDT in Binance hot wallet")
    const balanceUSDT = await contractUSDT.balanceOf(accountBinance)
    console.log(`USDT balance: ${ethers.formatUnits(balanceUSDT,6)}\n`)

    // 2. Create a filter to listen for USDT transfers into the exchange
    console.log("\n2. Create a filter to listen for USDT transfers into the exchange")
    let filterBinanceIn = contractUSDT.filters.Transfer(null, accountBinance);
    console.log("Filter details:")
    console.log(filterBinanceIn);
    contractUSDT.on(filterBinanceIn, (res) => {
      console.log('---------Listen for USDT transfers into the exchange--------');
      console.log(
        `${res.args[0]} -> ${res.args[1]} ${ethers.formatUnits(res.args[2],6)}`
      )
    })

    // 3. Create a filter to listen for USDT transfers out of the exchange
    let filterToBinanceOut = contractUSDT.filters.Transfer(accountBinance);
    console.log("\n3. Create a filter to listen for USDT transfers out of the exchange")
    console.log("Filter details:")
    console.log(filterToBinanceOut);
    contractUSDT.on(filterToBinanceOut, (res) => {
      console.log('---------Listen for USDT transfers out of the exchange--------');
      console.log(
        `${res.args[0]} -> ${res.args[1]} ${ethers.formatUnits(res.args[2],6)}`
      )
    }
    );
  } catch (e) {
    console.log(e);
  }
})()