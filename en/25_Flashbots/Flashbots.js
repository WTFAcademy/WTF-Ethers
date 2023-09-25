import { ethers } from "ethers";
import {
    FlashbotsBundleProvider,
    FlashbotsBundleResolution,
  } from "@flashbots/ethers-provider-bundle";
  
const GWEI = 10n ** 9n;
const CHAIN_ID = 5; // goerli testnet, change to 1 for mainnet

// 1. Normal RPC (non-flashbots rpc)
const ALCHEMY_GOERLI_URL = 'https://eth-goerli.alchemyapi.io/v2/GlaeWuylnNM3uuOo-SAwJxuwTdqHaY5l';
const provider = new ethers.providers.JsonRpcProvider(ALCHEMY_GOERLI_URL);

// 2. Flashbots reputation private key
// !!!Note: This account should not hold funds and is not the flashbots master private key.
const authKey = '0x227dbb8586117d55284e26620bc76534dfbd2394be34cf4a09cb775d593b6f2c'
const authSigner = new ethers.Wallet(authKey, provider)

const main = async () => {

    // 3. Flashbots rpc (goerli testnet) for sending transactions
    const flashbotsProvider = await FlashbotsBundleProvider.create(
        provider,
        authSigner,
        // Remove the next two lines for mainnet Flashbots
        'https://relay-goerli.flashbots.net/', 
        'goerli'
        );
    
    // 4. Create a transaction
    // Transaction: Send 0.001 ETH testnet coins to WTF Academy address
    const privateKey = '0x227dbb8586117d55284e26620bc76534dfbd2394be34cf4a09cb775d593b6f2c'
    const wallet = new ethers.Wallet(privateKey, provider)
    // EIP 1559 transaction
    const transaction0 = {
    chainId: CHAIN_ID,
    type: 2,
    to: "0x25df6DA2f4e5C178DdFF45038378C0b08E0Bce54",
    value: ethers.utils.parseEther("0.001"),
    maxFeePerGas: GWEI * 100n
    }

    // 5. Create transaction Bundle
    const transactionBundle = [
        {
            signer: wallet, // ethers signer
            transaction: transaction0 // ethers populated transaction object
        }
        // Can also include pre-signed transactions from mempool (can be sent by anyone)
        // ,{
        //     signedTransaction: SIGNED_ORACLE_UPDATE_FROM_PENDING_POOL // serialized signed transaction hex
        // }
    ]

    // 6. Simulate the transaction, it should simulate successfully before execution
    // Sign the transactions
    const signedTransactions = await flashbotsProvider.signBundle(transactionBundle)
    // Set the target execution block for the transaction
    const targetBlockNumber = (await provider.getBlockNumber()) + 1
    // Simulate the transaction
    const simulation = await flashbotsProvider.simulate(signedTransactions, targetBlockNumber)
    // Check if the simulation was successful
    if ("error" in simulation) {
        console.log(`Simulation error: ${simulation.error.message}`);
    } else {
        console.log(`Simulation successful`);
        console.log(JSON.stringify(simulation, null, 2))
    }

    // 7. Send the transaction to the chain
    // Due to limited Flashbots nodes on the testnet, it may take several attempts for the transaction to be included in a block. Let's loop 100 blocks here.
    for (let i = 1; i <= 100; i++) {
        let targetBlockNumberNew = targetBlockNumber + i - 1;
        // Send the transaction
        const res = await flashbotsProvider.sendRawBundle(signedTransactions, targetBlockNumberNew);
        if ("error" in res) {
        throw new Error(res.error.message);
        }
        // Check if the transaction is included in the block
        const bundleResolution = await res.wait();
        // Transaction can have three states: Included in block / Failed to include / Nonce too high.
        if (bundleResolution === FlashbotsBundleResolution.BundleIncluded) {
        console.log(`Congratulations, transaction included in block: ${targetBlockNumberNew}`);
        console.log(JSON.stringify(res, null, 2));
        process.exit(0);
        } else if (
        bundleResolution === FlashbotsBundleResolution.BlockPassedWithoutInclusion
        ) {
        console.log(`Please retry, transaction not included in block: ${targetBlockNumberNew}`);
        } else if (
        bundleResolution === FlashbotsBundleResolution.AccountNonceTooHigh
        ) {
        console.log("Nonce too high, please reset");
        process.exit(1);
        }
    }
}

main()