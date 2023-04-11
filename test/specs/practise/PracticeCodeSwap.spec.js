import * as dotenv from "dotenv";
dotenv.config();

import { EnvNames, NetworkNames, Sdk } from "etherspot";
import { BigNumber, ethers } from "ethers";

let sdkMainNet;
let smartWalletAddress;
let transactionDetails;

describe("The SDK, when swap on the MainNet", () => {
  // SWAP ON XDAI NETWORK
  it.only("Setup the SDK for xDai network and perform the swap action", async () => {
    // Initialize the SDK and define network
    sdkMainNet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.MainNets,
      networkName: NetworkNames.Xdai,
    });

    // Compute the smart wallet address
    const smartWalletOutput = await sdkMainNet.computeContractAccount();
    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    // GET EXCHANGE OFFERS
    const offers = await sdkMainNet.getExchangeOffers({
      fromTokenAddress: "0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83",
      toTokenAddress: "0x4ECaBa5870353805a9F068101A40E0f32ed605C6",
      // toTokenAddress: ethers.constants.AddressZero,
      // fromAmount: ethers.utils.parseUnits("0.001", 6),
      fromAmount: BigNumber.from(10000000000),
    });

    console.log("Offers : ", offers);

    transactionDetails = offers[0].transactions;

    for (let i = 0; i < transactionDetails.length; i++) {
      // BATCH EXECUTE ACCOUNT TRANSACTION
      const addTransactionToBatchOutput =
        await sdkMainNet.batchExecuteAccountTransaction(transactionDetails[i]);
    }
    // Estimating the batch
    console.log("Before Gas estimated:::::::::::::");
    const estimationResponse = await sdkMainNet.estimateGatewayBatch();
    console.log("Gas estimated at:", estimationResponse);

    // Submitting the batch
    const submissionResponse = await sdkMainNet.submitGatewayBatch({
      guarded: false,
    });
    console.log("Status of the batch submition: ", submissionResponse);
  });
});
