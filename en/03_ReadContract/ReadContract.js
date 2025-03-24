// Declaration of the rules for a read-only contract:
// Parameters are the contract address `address`, contract `ABI`, Provider variable `provider`
// const contract = new ethers.Contract(`address`, `ABI`, `provider`);

import { ethers } from "ethers";

// Connect to the Ethereum network using the Infura RPC node
const INFURA_MAINNET_URL = 'https://mainnet.infura.io/v3/8b9750710d56460d940aeff47967c4ba';
const provider = new ethers.JsonRpcProvider(INFURA_MAINNET_URL);

// Method 1 of providing ABI input: Copy the entire ABI
// ABI for WETH can be copied from here: https://etherscan.io/token/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2#code
const WETH_ABI = '[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"guy","type":"address"},{"name":"wad","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"wad","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"deposit","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"guy","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Withdrawal","type":"event"}]';
const WETH_address = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' // WETH Contract
const WETH_contract = new ethers.Contract(WETH_address, WETH_ABI, provider)

// Method 2 of providing ABI input: Input the functions that the program needs, separated by commas, ethers will automatically convert them into corresponding ABI
// Human-readable ABI, using ERC20 contract as an example
const ERC20_ABI = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function totalSupply() view returns (uint256)",
    "function balanceOf(address) view returns (uint)",
];
const DAI_address = '0x6B175474E89094C44Da98b954EedeAC495271d0F' // DAI Contract
const DAI_contract = new ethers.Contract(DAI_address, ERC20_ABI, provider)


const main = async () => {
    // 1. Reading on-chain information of the WETH contract (WETH_ABI)
  const name = await WETH_contract.name();
  const symbol = await WETH_contract.symbol();
  const totalSupply = await WETH_contract.totalSupply();

  console.log(`\nReading from ${WETH_address}\n`);
  console.log(`Name: ${name}`);
  console.log(`Symbol: ${symbol}`);
  console.log(`Total Supply: ${ethers.formatEther(totalSupply)}`);

  const balanceAddress = 'vitalik.eth';
  const balance = await WETH_contract.balanceOf(balanceAddress);
  console.log(`Vitalik's Balance: ${ethers.formatEther(balance)}\n`);

  // 2. Reading on-chain information of the DAI contract (ERC20 interface contract)
  const nameDAI = await DAI_contract.name();
  const symbolDAI = await DAI_contract.symbol();
  const totalSupplyDAI = await DAI_contract.totalSupply();

  console.log(`\nReading from ${DAI_address}\n`);
  console.log(`Name: ${nameDAI}`);
  console.log(`Symbol: ${symbolDAI}`);
  console.log(`Total Supply: ${ethers.formatEther(totalSupplyDAI)}`);

  const balanceAddressDAI = "vitalik.eth";
  const balanceDAI = await DAI_contract.balanceOf(balanceAddressDAI);
  console.log(`Vitalik's Balance: ${ethers.formatEther(balanceDAI)}\n`);
};

main()
