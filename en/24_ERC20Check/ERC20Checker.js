const {ethers} = require("ethers");

const INFURA_MAINNET_URL = 'https://mainnet.infura.io/v3/8b9750710d56460d940aeff47967c4ba';
const provider = new ethers.JsonRpcProvider(INFURA_MAINNET_URL);

// 2. Contract addresses
const addressDAI = '0x6b175474e89094c44da98b954eedeac495271d0f' //mainnet
const addressBAYC = '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d' //mainnet 

// 3. Function to check if an address is an ERC20 contract
async function erc20Checker(address){
    // Get the contract bytecode
    let code = await provider.getCode(address)
    // The bytecode of a non-contract address is "0x"
    if(code != "0x"){
        // Check if the bytecode contains the selectors for the transfer and totalSupply functions
        if(code.includes("a9059cbb") && code.includes("18160ddd")){
            // If yes, it is an ERC20 contract
            return true
        }else{
            // If not, it is not an ERC20 contract
            return false
        }
    }else{
        return null;
    }

}

const main = async () => {
    // Check if DAI contract is an ERC20 contract
  const isDaiErc20 = await erc20Checker(addressDAI)
  console.log(`1. is DAI an ERC20 contract: ${isDaiErc20}`)

    // Check if BAYC contract is an ERC20 contract
   const isBAYCerc20 = await erc20Checker(addressBAYC)
   console.log(`2. Is BAYC an ERC20 contract: ${isBAYCerc20}`)
}

main()
