import * as dotenv from "dotenv";
dotenv.config(); // init dotenv

import { assert } from "chai";
import { EnvNames, NetworkNames, Sdk } from "etherspot";

let arbitrumMainNetSdk;
let arbitrumSmartWalletAddress;
let arbitrumSmartWalletOutput;
let toAddress = "0x71Bec2309cC6BDD5F1D73474688A6154c28Db4B5";
let value = "1000000000000"; // 18 decimal

describe("The SDK, when sending a native token with arbitrum network on the MainNet", () => {
  it("SMOKE: Perform the send native token on the arbitrum network", async () => {
    // initialize the sdk
    try {
      arbitrumMainNetSdk = new Sdk(process.env.PRIVATE_KEY, {
        env: EnvNames.MainNets,
        networkName: NetworkNames.Arbitrum,
      });

      assert.strictEqual(
        arbitrumMainNetSdk.state.accountAddress,
        "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f",
        "The EOA Address is not calculated correctly."
      );
    } catch (e) {
      console.log(e);
      assert.fail("The SDK is not initialled successfully.");
    }

    // Compute the smart wallet address
    try {
      arbitrumSmartWalletOutput =
        await arbitrumMainNetSdk.computeContractAccount();
      arbitrumSmartWalletAddress = arbitrumSmartWalletOutput.address;

      assert.strictEqual(
        arbitrumSmartWalletAddress,
        "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
        "The smart wallet address is not calculated correctly."
      );
    } catch (e) {
      console.log(e);
      assert.fail("The smart wallet address is not calculated successfully.");
    }

    // Adding transaction to a batch
    let addTransactionToBatchOutput;
    try {
      addTransactionToBatchOutput =
        await arbitrumMainNetSdk.batchExecuteAccountTransaction({
          to: toAddress,
          value: value,
        });
    } catch (e) {
      console.log(e);
      assert.fail(
        "The addition of transaction in the batch is not performed successfully."
      );
    }

    try {
      assert.isNotEmpty(
        addTransactionToBatchOutput.requests[0].to,
        "The To Address value is empty in the Batch Response."
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
      estimationResponse = await arbitrumMainNetSdk.estimateGatewayBatch();
    } catch (e) {
      console.log(e);
      assert.fail("The estimation of the batch is not performed successfully.");
    }

    try {
      assert.isNotEmpty(
        estimationResponse.requests[0].to,
        "The To Address value is empty in the Batch Estimation Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        estimationResponse.requests[0].data,
        "The data value is empty in the Batch Estimation Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        estimationResponse.estimation.feeTokenReceiver,
        toAddress,
        "The feeTokenReceiver Address of the Batch Estimation Response is not displayed correctly."
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
      submissionResponse = await arbitrumMainNetSdk.submitGatewayBatch({
        guarded: false,
      });
    } catch (e) {
      console.log(e);
      assert.fail("The submittion of the batch is not performed successfully.");
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
        arbitrumSmartWalletAddress,
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
      assert.isNotEmpty(
        submissionResponse.to[0],
        "The To Address value is empty in the Submit Batch Response."
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
  });

  it("REGRESSION: Setup the SDK for arbitrum network and perform the send native token with invalid to address", async () => {
    // initialize the sdk
    try {
      arbitrumMainNetSdk = new Sdk(process.env.PRIVATE_KEY, {
        env: EnvNames.MainNets,
        networkName: NetworkNames.Arbitrum,
      });

      assert.strictEqual(
        arbitrumMainNetSdk.state.accountAddress,
        "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f",
        "The EOA Address is not calculated correctly."
      );
    } catch (e) {
      console.log(e);
      assert.fail("The SDK is not initialled successfully.");
    }

    // Compute the smart wallet address
    try {
      let smartWalletOutput = await arbitrumMainNetSdk.computeContractAccount();
      let arbitrumSmartWalletAddress = smartWalletOutput.address;

      assert.strictEqual(
        arbitrumSmartWalletAddress,
        "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
        "The smart wallet address is not calculated correctly."
      );
    } catch (e) {
      console.log(e);
      assert.fail("The smart wallet address is not calculated successfully.");
    }

    // Adding transaction to a batch with invalid To Address
    try {
      try {
        await arbitrumMainNetSdk.batchExecuteAccountTransaction({
          to: "0x0fd7508903376dab743a02743cadfdc2d92fceb", // Invalid To Address
          value: "1000000000000",
        });
        assert.fail("The batch execution completed with incorrect To Address.");
      } catch (e) {
        if (e.errors[0].constraints.isAddress == "to must be an address") {
          console.log(
            "The validation for To Address is displayed as expected while batch execution."
          );
        } else {
          console.log(e);
          assert.fail(
            "The expected validation is not displayed when entered the invalid To Address while performing batch execution."
          );
        }
      }
    } catch (e) {
      console.log(e);
      assert.fail(
        "The expected validation is not displayed when entered the invalid To Address while performing batch execution."
      );
    }
  });

  it("REGRESSION: Setup the SDK for arbitrum network and perform the send native token with invalid value", async () => {
    // initialize the sdk
    try {
      arbitrumMainNetSdk = new Sdk(process.env.PRIVATE_KEY, {
        env: EnvNames.MainNets,
        networkName: NetworkNames.Arbitrum,
      });

      assert.strictEqual(
        arbitrumMainNetSdk.state.accountAddress,
        "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f",
        "The EOA Address is not calculated correctly."
      );
    } catch (e) {
      console.log(e);
      assert.fail("The SDK is not initialled successfully.");
    }

    // Compute the smart wallet address
    try {
      let smartWalletOutput = await arbitrumMainNetSdk.computeContractAccount();
      let arbitrumSmartWalletAddress = smartWalletOutput.address;

      assert.strictEqual(
        arbitrumSmartWalletAddress,
        "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
        "The smart wallet address is not calculated correctly."
      );
    } catch (e) {
      console.log(e);
      assert.fail("The smart wallet address is not calculated successfully.");
    }

    // Adding transaction to a batch with invalid Value
    try {
      try {
        await arbitrumMainNetSdk.batchExecuteAccountTransaction({
          to: "0x0fd7508903376dab743a02743cadfdc2d92fceb8",
          value: "0.001", // Invalid Value
        });
        assert.fail("The batch execution colmpleyed with incorrect Value.");
      } catch (e) {
        if (
          e.errors[0].constraints.IsBigNumberish ==
          "value must be big numberish"
        ) {
          console.log(
            "The validation for Value is displayed as expected while the batch execution."
          );
        } else {
          console.log(e);
          assert.fail(
            "The expected validation is not displayed when entered the invalid Value while performing batch execution."
          );
        }
      }
    } catch (e) {
      console.log(e);
      assert.fail(
        "The expected validation is not displayed when entered the invalid Value while performing batch execution."
      );
    }
  });

  it("REGRESSION: Setup the SDK for arbitrum network and perform the send native token with exceeded value.", async () => {
    // initialize the sdk
    try {
      arbitrumMainNetSdk = new Sdk(process.env.PRIVATE_KEY, {
        env: EnvNames.MainNets,
        networkName: NetworkNames.Arbitrum,
      });

      assert.strictEqual(
        arbitrumMainNetSdk.state.accountAddress,
        "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f",
        "The EOA Address is not calculated correctly."
      );
    } catch (e) {
      console.log(e);
      assert.fail("The SDK is not initialled successfully.");
    }

    // Compute the smart wallet address
    try {
      let smartWalletOutput = await arbitrumMainNetSdk.computeContractAccount();
      let arbitrumSmartWalletAddress = smartWalletOutput.address;

      assert.strictEqual(
        arbitrumSmartWalletAddress,
        "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
        "The smart wallet address is not calculated correctly."
      );
    } catch (e) {
      console.log(e);
      assert.fail("The smart wallet address is not calculated successfully.");
    }

    // Adding transaction to a batch with Value as more than the actual Value of the wallet balance
    try {
      await arbitrumMainNetSdk.batchExecuteAccountTransaction({
        to: "0x0fd7508903376dab743a02743cadfdc2d92fceb8",
        value: "100000000000000000000000", // Exceeded Value
      });
    } catch (e) {
      console.log(e);
      assert.fail(
        "The exceeded Value is not required in the wallet balance for the batch execution."
      );
    }

    // estinating the batch
    try {
      try {
        await arbitrumMainNetSdk.estimateGatewayBatch();
      } catch (e) {
        if (e.errors[0].constraints.reverted == "Transaction reverted") {
          console.log(
            "The validation for exceeded Value is displayed as expected while the batch execution."
          );
        } else {
          console.log(e);
          assert.fail(
            "The expected validation is not displayed when entered the exceeded Value while performing batch execution."
          );
        }
      }
    } catch (e) {
      console.log(e);
      assert.fail(
        "The expected validation is not displayed when entered the exceeded Value while performing batch execution."
      );
    }
  });

  it("REGRESSION: Setup the SDK for arbitrum network and perform the send native token on the same address", async () => {
    // initialize the sdk
    try {
      arbitrumMainNetSdk = new Sdk(process.env.PRIVATE_KEY, {
        env: EnvNames.MainNets,
        networkName: NetworkNames.Arbitrum,
      });

      assert.strictEqual(
        arbitrumMainNetSdk.state.accountAddress,
        "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f",
        "The EOA Address is not calculated correctly."
      );
    } catch (e) {
      console.log(e);
      assert.fail("The SDK is not initialled successfully.");
    }

    // Compute the smart wallet address
    try {
      let smartWalletOutput = await arbitrumMainNetSdk.computeContractAccount();
      let arbitrumSmartWalletAddress = smartWalletOutput.address;

      assert.strictEqual(
        arbitrumSmartWalletAddress,
        "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
        "The smart wallet address is not calculated correctly."
      );
    } catch (e) {
      console.log(e);
      assert.fail("The smart wallet address is not calculated successfully.");
    }

    // Adding transaction to a batch on the same address
    try {
      try {
        await arbitrumMainNetSdk.batchExecuteAccountTransaction({
          to: "0x666E17ad27fB620D7519477f3b33d809775d65Fe", // Send Native Token on Same Address
          value: "1000000000000",
        });
        assert.fail(
          "Addition of the transaction to batch on the same address is performed."
        );
      } catch (e) {
        if (
          e.message ==
          "Destination address should not be the same as sender address"
        ) {
          console.log(
            "The validation is displayed while entering the duplicate sender address."
          );
        } else {
          console.log(e);
          assert.fail(
            "The validation is not displayed while entering the duplicate sender address."
          );
        }
      }
    } catch (e) {
      console.log(e);
      assert.fail(
        "The validation is not displayed while entering the duplicate sender address."
      );
    }
  });

  it("REGRESSION: Setup the SDK for arbitrum network and perform the send native token without estimation of the batch", async () => {
    // initialize the sdk
    try {
      arbitrumMainNetSdk = new Sdk(process.env.PRIVATE_KEY, {
        env: EnvNames.MainNets,
        networkName: NetworkNames.Arbitrum,
      });

      assert.strictEqual(
        arbitrumMainNetSdk.state.accountAddress,
        "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f",
        "The EOA Address is not calculated correctly."
      );
    } catch (e) {
      console.log(e);
      assert.fail("The SDK is not initialled successfully.");
    }

    // Compute the smart wallet address
    try {
      let smartWalletOutput = await arbitrumMainNetSdk.computeContractAccount();
      let arbitrumSmartWalletAddress = smartWalletOutput.address;

      assert.strictEqual(
        arbitrumSmartWalletAddress,
        "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
        "The smart wallet address is not calculated correctly."
      );
    } catch (e) {
      console.log(e);
      assert.fail("The smart wallet address is not calculated successfully.");
    }

    // Adding transaction to a batch without estimation of the batch
    try {
      await arbitrumMainNetSdk.batchExecuteAccountTransaction({
        to: "0x0fd7508903376dab743a02743cadfdc2d92fceb8",
        value: "1000000000000",
      });
    } catch (e) {
      console.log(e);
      assert.fail(
        "The addition of transaction in the batch is not performed successfully."
      );
    }

    // Submitting the batch
    try {
      try {
        await arbitrumMainNetSdk.submitGatewayBatch({
          guarded: false,
        });
        assert.fail(
          "Status of the batch is submitted without Estimation of batch."
        );
      } catch (e) {
        if (e.message == "Can not submit not estimated batch") {
          console.log(
            "The validation is displayed when submiting the batch without estimation."
          );
        } else {
          console.log(e);
          assert.fail(
            "The submition of batch is completed without estimation."
          );
        }
      }
    } catch (e) {
      console.log(e);
      assert.fail("The submition of batch is completed without estimation.");
    }
  });
});
