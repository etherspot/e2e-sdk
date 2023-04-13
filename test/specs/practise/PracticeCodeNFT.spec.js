import * as dotenv from "dotenv";
dotenv.config();

import { expect } from "chai";
import { EnvNames, NetworkNames, Sdk } from "etherspot";
import { BigNumber } from "ethers";
import Helper from "../../utils/Helper.js";
import abi from "../../data/NFTabi.json" assert { type: "json" };
import { ethers } from "ethers";

let sdkMainNet;
let smartWalletAddress;
let hashAddressBig;
let transactionState;

describe("The SDK, when sending a NFT Transaction on the MainNet", () => {
  // SEND NFT ON XDAI NETWORK
  it.only("Setup the SDK for xDai network and perform the send NFT Transaction action", async () => {
    // Define NFT details
    const contract = new ethers.utils.Interface(abi.abi);
    const to = "0x666E17ad27fB620D7519477f3b33d809775d65Fe"; // from_address
    const from = "0x49e2a5d77fa210403864f74e6556f17a8fcf70b3"; // to_address
    const tokenId = "2357194"; // NFTtokenId that needs to be sent
    const encodedData = contract.encodeFunctionData("transferFrom", [
      from,
      to,
      tokenId,
    ]);

    // Initialize the SDK and define network
    sdkMainNet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.MainNets,
      networkName: NetworkNames.Xdai,
    });

    // Compute the smart wallet address
    const smartWalletOutput = await sdkMainNet.computeContractAccount();
    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    expect(smartWalletAddress).to.equal(
      "0x666E17ad27fB620D7519477f3b33d809775d65Fe"
    );

    // GET NFT LIST
    const output = await sdkMainNet.getNftList({
      account: "0x22c1f6050e56d2876009903609a2cc3fef83b415",
    });

    console.log("Output: ", output);

    // Adding transaction details to a batch
    const response = await sdkMainNet.batchExecuteAccountTransaction({
      to: "0x22c1f6050e56d2876009903609a2cc3fef83b415", // contract_address of the NFT
      data: encodedData,
    });
    console.log("Batch Reponse: ", response);

    // Estimating the batch
    const estimationResponse = await sdkMainNet.estimateGatewayBatch();
    console.log("Gas estimated at:", estimationResponse);

    // Submitting the batch
    const submissionResponse = await sdkMainNet.submitGatewayBatch({
      guarded: false,
    });
    console.log("Status of the batch submition: ", submissionResponse);
  });
});
