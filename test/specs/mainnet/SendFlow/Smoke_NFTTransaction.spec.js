import * as dotenv from "dotenv";
dotenv.config();

import { EnvNames, Sdk } from "etherspot";
import abi from "../../../data/NFTabi.json" assert { type: "json" };
import { ethers } from "ethers";
import { assert } from "chai";

// Define NFT details
let contract = new ethers.utils.Interface(abi.abi);
let from = "0x666E17ad27fB620D7519477f3b33d809775d65Fe"; // from_address
let to = "0x49e2a5d77fa210403864f74e6556f17a8fcf70b3"; // to_address
let tokenId = "2357194"; // NFTtokenId that needs to be sent
let encodedData = contract.encodeFunctionData("transferFrom", [
  from,
  to,
  tokenId,
]);

let network = ["arbitrum", "bsc", "xdai", "matic", "optimism"];
let mainNetSdk;

describe("The SDK, when sending a NFT Transaction on the MainNet", () => {
  for (let i = 0; i < network.length; i++) {
    // SEND NFT ON ON RESPECTIVE NETWORK
    it("Perform the send NFT token on " + network[i] + " network", async () => {
      try {
        // Initialize the SDK and define network
        mainNetSdk = new Sdk(process.env.PRIVATE_KEY, {
          env: EnvNames.MainNets,
          networkName: network[i],
        });

        assert.strictEqual(
          mainNetSdk.state.accountAddress,
          "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f",
          "The EOA Address is not calculated correctly."
        );
      } catch (e) {
        console.log(e);
      }

      // Compute the smart wallet address
      try {
        let smartWalletOutput = await mainNetSdk.computeContractAccount();
        let smartWalletAddress = smartWalletOutput.address;

        assert.strictEqual(
          smartWalletAddress,
          "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
          "The smart wallet address is not calculated correctly."
        );
      } catch (e) {
        console.log(e);
      }

      // Adding transaction details to a batch
      let response;
      try {
        response = await mainNetSdk.batchExecuteAccountTransaction({
          to: "0x22c1f6050e56d2876009903609a2cc3fef83b415", // contract_address of the NFT
          data: encodedData,
        });
        console.log("Batch Reponse: ", response);
      } catch (e) {
        console.log(e);
      }

      // Estimating the batch
      let estimationResponse;
      try {
        estimationResponse = await mainNetSdk.estimateGatewayBatch();
        console.log("Gas estimated at:", estimationResponse);
      } catch (e) {
        console.log(e);
      }

      // Submitting the batch
      let submissionResponse;
      try {
        submissionResponse = await mainNetSdk.submitGatewayBatch({
          guarded: false,
        });
        console.log("Status of the batch submition: ", submissionResponse);
      } catch (e) {
        console.log(e);
      }
    });
  }
});
