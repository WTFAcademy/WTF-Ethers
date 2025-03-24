// 导入ethers包
import { ethers } from "ethers";
// playcode免费版不能安装ethers，用这条命令，需要从网络上import包（把上面这行注释掉）
// import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.2.3/ethers.js";

// 利用ethers默认的Provider连接以太坊网络
// const provider = new ethers.getDefaultProvider();
// 注意：如果当前的URL无法使用，需要主动去NFURA或者ALCHEMY官网注册并获得URl
const ALCHEMY_MAINNET_URL = "https://eth-mainnet.g.alchemy.com/v2/oKmOQKbneVkxgHZfibs-iFhIlIAl6HDN";
const provider = new ethers.JsonRpcProvider(ALCHEMY_MAINNET_URL);

const main = async () => {
  // 查询vitalik的ETH余额
  const balance = await provider.getBalance(`vitalik.eth`); //0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045
  // 将余额输出在console
  console.log(`ETH Balance of vitalik: ${ethers.formatEther(balance)} ETH`);
};
main();
