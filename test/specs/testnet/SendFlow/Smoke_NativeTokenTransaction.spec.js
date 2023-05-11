import * as dotenv from "dotenv";
dotenv.config(); // init dotenv

import { assert } from "chai";
import { EnvNames, Sdk } from "etherspot";

let network = ["arbitrum", "bsc", "xdai", "mumbai", "optimism"];
let testNetSdk;

describe("The SDK, when sending a native asset on the TestNet", () => {
  for (let i = 0; i < network.length; i++) {
    // SEND NATIVE TOKEN ON RESPECTIVE NETWORK
    it(
      "Perform the send native token on " + network[i] + " network",
      async () => {
        // initialize the sdk
        try {
          testNetSdk = new Sdk(process.env.PRIVATE_KEY, {
            env: EnvNames.TestNets,
            networkName: network[i],
          });

          assert.strictEqual(
            testNetSdk.state.accountAddress,
            "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f",
            "The EOA Address is not calculated correctly."
          );
        } catch (e) {
          assert.fail("The SDK is not initialled successfully.");
        }

        // Compute the smart wallet address
        try {
          let smartWalletOutput = await testNetSdk.computeContractAccount();
          let smartWalletAddress = smartWalletOutput.address;

          assert.strictEqual(
            smartWalletAddress,
            "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
            "The smart wallet address is not calculated correctly."
          );
        } catch (e) {
          assert.fail(
            "The smart wallet address is not calculated successfully."
          );
        }

        // Adding transaction to a batch
        let addTransactionToBatchOutput;
        try {
          addTransactionToBatchOutput =
            await testNetSdk.batchExecuteAccountTransaction({
              to: "0x0fd7508903376dab743a02743cadfdc2d92fceb8",
              value: "1000000000000",
            });
        } catch (e) {
          assert.fail(
            "The addition of transaction in the batch is not performed successfully."
          );
        }

        try {
          assert.strictEqual(
            addTransactionToBatchOutput.requests[0].to,
            "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
            "The To Address of the Batch Response is not displayed correctly."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNotEmpty(
            addTransactionToBatchOutput.requests[0].data,
            "The data value is empty in the Batch Reponse."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNull(
            addTransactionToBatchOutput.estimation,
            "The estimation value is not null in the Batch Response."
          );
        } catch (e) {
          console.log(e);
        }

        // Estimating the batch
        let estimationResponse;
        let EstimatedGas_Estimate;
        let FeeAmount_Estimate;
        let EstimatedGasPrice_Estimate;

        try {
          estimationResponse = await testNetSdk.estimateGatewayBatch();
        } catch (e) {
          assert.fail(
            "The estimation of the batch is not performed successfully."
          );
        }

        try {
          assert.strictEqual(
            estimationResponse.requests[0].to,
            "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
            "The To Address of the Batch Response is not displayed correctly."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNotEmpty(
            estimationResponse.requests[0].data,
            "The data value is empty in the Estimation Response."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.strictEqual(
            estimationResponse.estimation.feeTokenReceiver,
            "0xf593D35cA402c097e57813bCC6BCAb4b71A597cC",
            "The feeTokenReceiver Address of the Estimate Batch Response is not displayed correctly."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNumber(
            estimationResponse.estimation.estimatedGas,
            "The estimatedGas value is not number in the Estimate Batch Response."
          );
          EstimatedGas_Estimate = estimationResponse.estimation.estimatedGas;
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNotEmpty(
            estimationResponse.estimation.feeAmount,
            "The feeAmount value is empty in the Estimation Response."
          );
          FeeAmount_Estimate = estimationResponse.estimation.feeAmount._hex;
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNotEmpty(
            estimationResponse.estimation.estimatedGasPrice,
            "The estimatedGasPrice value is empty in the Estimation Response."
          );
          EstimatedGasPrice_Estimate =
            estimationResponse.estimation.estimatedGasPrice._hex;
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNotEmpty(
            estimationResponse.estimation.signature,
            "The signature value is empty in the Estimation Response."
          );
        } catch (e) {
          console.log(e);
        }

        // Submitting the batch
        let submissionResponse;
        let EstimatedGas_Submit;
        let FeeAmount_Submit;
        let EstimatedGasPrice_Submit;

        try {
          submissionResponse = await testNetSdk.submitGatewayBatch({
            guarded: false,
          });
        } catch (e) {
          assert.fail(
            "The submittion of the batch is not performed successfully."
          );
        }

        try {
          assert.isNull(
            submissionResponse.transaction,
            "The transaction value is not null in the Submit Batch Response."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNotEmpty(
            submissionResponse.hash,
            "The hash value is empty in the Submit Batch Response."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.strictEqual(
            submissionResponse.state,
            "Queued",
            "The status of the Submit Batch Response is not displayed correctly."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.strictEqual(
            submissionResponse.account,
            "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
            "The account address of the Submit Batch Response is not displayed correctly."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNumber(
            submissionResponse.nonce,
            "The nonce value is not number in the Submit Batch Response."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.strictEqual(
            submissionResponse.to[0],
            "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
            "The To Address in the Submit Batch Response is not displayed correctly."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNotEmpty(
            submissionResponse.data[0],
            "The data value is empty in the Submit Batch Response."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNotEmpty(
            submissionResponse.senderSignature,
            "The senderSignature value is empty in the Submit Batch Response."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNumber(
            submissionResponse.estimatedGas,
            "The Estimated Gas value is not number in the Submit Batch Response."
          );
          EstimatedGas_Submit = submissionResponse.estimatedGas;
        } catch (e) {
          console.log(e);
        }

        try {
          assert.strictEqual(
            EstimatedGas_Estimate,
            EstimatedGas_Submit,
            "The Estimated Gas value is not displayed correctly."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNotEmpty(
            submissionResponse.estimatedGasPrice._hex,
            "The estimatedGasPrice value is empty in the Submit Batch Response."
          );
          EstimatedGasPrice_Submit = submissionResponse.estimatedGasPrice._hex;
        } catch (e) {
          console.log(e);
        }

        try {
          assert.strictEqual(
            EstimatedGasPrice_Estimate,
            EstimatedGasPrice_Submit,
            "The Estimated Gas Price value is not displayed correctly."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNull(
            submissionResponse.feeToken,
            "The feeToken value is not null in the Submit Batch Response."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNotEmpty(
            submissionResponse.feeAmount._hex,
            "The feeAmount value is empty in the Submit Batch Response."
          );
          FeeAmount_Submit = submissionResponse.feeAmount._hex;
        } catch (e) {
          console.log(e);
        }

        try {
          assert.strictEqual(
            FeeAmount_Estimate,
            FeeAmount_Submit,
            "The Fee Amount value is not displayed correctly."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNotEmpty(
            submissionResponse.feeData,
            "The feeData value is empty in the Submit Batch Response."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNull(
            submissionResponse.delayedUntil,
            "The delayedUntil value is not null in the Submit Batch Response."
          );
        } catch (e) {
          console.log(e);
        }
      }
    );
  }
});
