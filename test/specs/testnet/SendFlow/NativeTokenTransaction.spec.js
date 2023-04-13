import * as dotenv from "dotenv";
dotenv.config(); // init dotenv

import { assert, expect } from "chai";
import { EnvNames, NetworkNames, Sdk } from "etherspot";

let sdkTestNet;
let smartWalletAddress;

describe("The SDK, when sending a native asset on the TestNet", () => {
  // SEND NATIVE TOKEN FOR ARBITRUM
  it("Setup the SDK for Arbitrum network and perform the send native asset action", async () => {
    // initialize the sdk
    sdkTestNet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.TestNets,
      networkName: NetworkNames.Arbitrum,
    });

    assert.strictEqual(
      sdkTestNet.state.accountAddress,
      "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f",
      "The EOA Address is not displayed correctly."
    );

    // Compute the smart wallet address
    const smartWalletOutput = await sdkTestNet.computeContractAccount();
    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    assert.strictEqual(
      smartWalletAddress,
      "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
      "The smart address is not displayed correctly."
    );

    // Adding transaction to a batch
    const addTransactionToBatchOutput =
      await sdkTestNet.batchExecuteAccountTransaction({
        to: "0x0fd7508903376dab743a02743cadfdc2d92fceb8",
        value: "1000000000000",
      });
    console.log("Batch Reponse: ", addTransactionToBatchOutput);

    assert.strictEqual(
      addTransactionToBatchOutput.requests[0].to,
      "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
      "The To Address of the Batch Response is not displayed correctly."
    );

    assert.isNotEmpty(
      addTransactionToBatchOutput.requests[0].data,
      "The value of the data field of the Batch Reponse is not displayed."
    );

    assert.isNull(
      addTransactionToBatchOutput.estimation,
      "It is not expected behaviour of the estimation in the Batch Response."
    );

    // Estimating the batch
    const estimationResponse = await sdkTestNet.estimateGatewayBatch();
    console.log("Gas estimated at:", estimationResponse);

    assert.strictEqual(
      estimationResponse.requests[0].to,
      "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
      "The To Address of the Batch Response is not displayed correctly."
    );

    assert.isNotEmpty(
      estimationResponse.requests[0].data,
      "The value of the data field of the Estimation Response is not displayed."
    );

    assert.strictEqual(
      estimationResponse.estimation.feeTokenReceiver,
      "0xf593D35cA402c097e57813bCC6BCAb4b71A597cC",
      "The feeTokenReceiver Address of the Estimate Batch Response is not displayed correctly."
    );

    assert.isNumber(
      estimationResponse.estimation.estimatedGas,
      "The estimatedGas of the Estimate Batch Response is not displayed."
    );
    let EstimatedGas_Estimate = estimationResponse.estimation.estimatedGas;

    assert.isNotEmpty(
      estimationResponse.estimation.feeAmount,
      "The value of the feeAmount field of the Estimation Response is not displayed."
    );
    let FeeAmount_Estimate = estimationResponse.estimation.feeAmount._hex;

    assert.isNotEmpty(
      estimationResponse.estimation.estimatedGasPrice,
      "The value of the estimatedGasPrice field of the Estimation Response is not displayed."
    );
    let EstimatedGasPrice_Estimate =
      estimationResponse.estimation.estimatedGasPrice._hex;

    assert.isNotEmpty(
      estimationResponse.estimation.signature,
      "The value of the signature field of the Estimation Response is not displayed."
    );

    // Submitting the batch
    const submissionResponse = await sdkTestNet.submitGatewayBatch({
      guarded: false,
    });
    console.log("Status of the batch submition: ", submissionResponse);

    assert.isNull(
      submissionResponse.transaction,
      "It is not expected behaviour of the transaction in the Submit Batch Response."
    );

    assert.isNotEmpty(
      submissionResponse.hash,
      "The value of the hash field of the Submit Batch Response is not displayed."
    );

    assert.strictEqual(
      submissionResponse.state,
      "Queued",
      "The status of the Submit Batch Response is not displayed correctly."
    );

    assert.strictEqual(
      submissionResponse.account,
      "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
      "The account address of the Submit Batch Response is not displayed correctly."
    );

    assert.isNumber(
      submissionResponse.nonce,
      "The nonce number of the Submit Batch Response is not displayed."
    );

    assert.strictEqual(
      submissionResponse.to[0],
      "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
      "The To Address in the Submit Batch Response is not displayed correctly."
    );

    assert.isNotEmpty(
      submissionResponse.data[0],
      "The value of the data field of the Submit Batch Response is not displayed."
    );

    assert.isNotEmpty(
      submissionResponse.senderSignature,
      "The value of the senderSignature field of the Submit Batch Response is not displayed."
    );

    assert.isNumber(
      submissionResponse.estimatedGas,
      "The Estimated Gas number of the Submit Batch Response is not displayed."
    );
    let EstimatedGas_Submit = submissionResponse.estimatedGas;
    assert.strictEqual(
      EstimatedGas_Estimate,
      EstimatedGas_Submit,
      "The Estimated Gas value is not displayed correctly."
    );

    assert.isNotEmpty(
      submissionResponse.estimatedGasPrice._hex,
      "The value of the estimatedGasPrice field of the Submit Batch Response is not displayed."
    );
    let EstimatedGasPrice_Submit = submissionResponse.estimatedGasPrice._hex;
    assert.strictEqual(
      EstimatedGasPrice_Estimate,
      EstimatedGasPrice_Submit,
      "The Estimated Gas Price value is not displayed correctly."
    );

    assert.isNull(
      submissionResponse.feeToken,
      "It is not expected behaviour of the feeToken in the Submit Batch Response."
    );

    assert.isNotEmpty(
      submissionResponse.feeAmount._hex,
      "The value of the feeAmount field of the Submit Batch Response is not displayed."
    );
    let FeeAmount_Submit = submissionResponse.feeAmount._hex;
    assert.strictEqual(
      FeeAmount_Estimate,
      FeeAmount_Submit,
      "The Fee Amount value is not displayed correctly."
    );

    assert.isNotEmpty(
      submissionResponse.feeData,
      "The value of the feeData field of the Submit Batch Response is not displayed."
    );

    assert.isNull(
      submissionResponse.delayedUntil,
      "It is not expected behaviour of the delayedUntil in the Submit Batch Response."
    );
  });

  // SEND NATIVE TOKEN FOR ARBITRUM NOVA
  it.skip("Setup the SDK for ArbitrumNova network and perform the send native asset action", async () => {
    // initialize the sdk
    sdkTestNet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.TestNets,
      networkName: NetworkNames.ArbitrumNova,
    });

    assert.strictEqual(
      sdkTestNet.state.accountAddress,
      "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f",
      "The EOA Address is not displayed correctly."
    );

    // Compute the smart wallet address
    const smartWalletOutput = await sdkTestNet.computeContractAccount();
    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    assert.strictEqual(
      smartWalletAddress,
      "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
      "The smart address is not displayed correctly."
    );

    // Adding transaction to a batch
    const addTransactionToBatchOutput =
      await sdkTestNet.batchExecuteAccountTransaction({
        to: "0x0fd7508903376dab743a02743cadfdc2d92fceb8",
        value: "1000000000000",
      });
    console.log("Batch Reponse: ", addTransactionToBatchOutput);

    assert.strictEqual(
      addTransactionToBatchOutput.requests[0].to,
      "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
      "The To Address of the Batch Response is not displayed correctly."
    );

    assert.isNotEmpty(
      addTransactionToBatchOutput.requests[0].data,
      "The value of the data field of the Batch Reponse is not displayed."
    );

    assert.isNull(
      addTransactionToBatchOutput.estimation,
      "It is not expected behaviour of the estimation in the Batch Response."
    );

    // Estimating the batch
    const estimationResponse = await sdkTestNet.estimateGatewayBatch();
    console.log("Gas estimated at:", estimationResponse);

    assert.strictEqual(
      estimationResponse.requests[0].to,
      "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
      "The To Address of the Batch Response is not displayed correctly."
    );

    assert.isNotEmpty(
      estimationResponse.requests[0].data,
      "The value of the data field of the Estimation Response is not displayed."
    );

    assert.strictEqual(
      estimationResponse.estimation.feeTokenReceiver,
      "0xf593D35cA402c097e57813bCC6BCAb4b71A597cC",
      "The feeTokenReceiver Address of the Estimate Batch Response is not displayed correctly."
    );

    assert.isNumber(
      estimationResponse.estimation.estimatedGas,
      "The estimatedGas of the Estimate Batch Response is not displayed."
    );
    let EstimatedGas_Estimate = estimationResponse.estimation.estimatedGas;

    assert.isNotEmpty(
      estimationResponse.estimation.feeAmount,
      "The value of the feeAmount field of the Estimation Response is not displayed."
    );
    let FeeAmount_Estimate = estimationResponse.estimation.feeAmount._hex;

    assert.isNotEmpty(
      estimationResponse.estimation.estimatedGasPrice,
      "The value of the estimatedGasPrice field of the Estimation Response is not displayed."
    );
    let EstimatedGasPrice_Estimate =
      estimationResponse.estimation.estimatedGasPrice._hex;

    assert.isNotEmpty(
      estimationResponse.estimation.signature,
      "The value of the signature field of the Estimation Response is not displayed."
    );

    // Submitting the batch
    const submissionResponse = await sdkTestNet.submitGatewayBatch({
      guarded: false,
    });
    console.log("Status of the batch submition: ", submissionResponse);

    assert.isNull(
      submissionResponse.transaction,
      "It is not expected behaviour of the transaction in the Submit Batch Response."
    );

    assert.isNotEmpty(
      submissionResponse.hash,
      "The value of the hash field of the Submit Batch Response is not displayed."
    );

    assert.strictEqual(
      submissionResponse.state,
      "Queued",
      "The status of the Submit Batch Response is not displayed correctly."
    );

    assert.strictEqual(
      submissionResponse.account,
      "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
      "The account address of the Submit Batch Response is not displayed correctly."
    );

    assert.isNumber(
      submissionResponse.nonce,
      "The nonce number of the Submit Batch Response is not displayed."
    );

    assert.strictEqual(
      submissionResponse.to[0],
      "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
      "The To Address in the Submit Batch Response is not displayed correctly."
    );

    assert.isNotEmpty(
      submissionResponse.data[0],
      "The value of the data field of the Submit Batch Response is not displayed."
    );

    assert.isNotEmpty(
      submissionResponse.senderSignature,
      "The value of the senderSignature field of the Submit Batch Response is not displayed."
    );

    assert.isNumber(
      submissionResponse.estimatedGas,
      "The Estimated Gas number of the Submit Batch Response is not displayed."
    );
    let EstimatedGas_Submit = submissionResponse.estimatedGas;
    assert.strictEqual(
      EstimatedGas_Estimate,
      EstimatedGas_Submit,
      "The Estimated Gas value is not displayed correctly."
    );

    assert.isNotEmpty(
      submissionResponse.estimatedGasPrice._hex,
      "The value of the estimatedGasPrice field of the Submit Batch Response is not displayed."
    );
    let EstimatedGasPrice_Submit = submissionResponse.estimatedGasPrice._hex;
    assert.strictEqual(
      EstimatedGasPrice_Estimate,
      EstimatedGasPrice_Submit,
      "The Estimated Gas Price value is not displayed correctly."
    );

    assert.isNull(
      submissionResponse.feeToken,
      "It is not expected behaviour of the feeToken in the Submit Batch Response."
    );

    assert.isNotEmpty(
      submissionResponse.feeAmount._hex,
      "The value of the feeAmount field of the Submit Batch Response is not displayed."
    );
    let FeeAmount_Submit = submissionResponse.feeAmount._hex;
    assert.strictEqual(
      FeeAmount_Estimate,
      FeeAmount_Submit,
      "The Fee Amount value is not displayed correctly."
    );

    assert.isNotEmpty(
      submissionResponse.feeData,
      "The value of the feeData field of the Submit Batch Response is not displayed."
    );

    assert.isNull(
      submissionResponse.delayedUntil,
      "It is not expected behaviour of the delayedUntil in the Submit Batch Response."
    );
  });

  // SEND NATIVE TOKEN FOR AURORA
  it.skip("Setup the SDK for Aurora network and perform the send native asset action", async () => {
    // initialize the sdk
    sdkTestNet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.TestNets,
      networkName: NetworkNames.Aurora,
    });

    assert.strictEqual(
      sdkTestNet.state.accountAddress,
      "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f",
      "The EOA Address is not displayed correctly."
    );

    // Compute the smart wallet address
    const smartWalletOutput = await sdkTestNet.computeContractAccount();
    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    assert.strictEqual(
      smartWalletAddress,
      "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
      "The smart address is not displayed correctly."
    );

    // Adding transaction to a batch
    const addTransactionToBatchOutput =
      await sdkTestNet.batchExecuteAccountTransaction({
        to: "0x0fd7508903376dab743a02743cadfdc2d92fceb8",
        value: "1000000000000",
      });
    console.log("Batch Reponse: ", addTransactionToBatchOutput);

    assert.strictEqual(
      addTransactionToBatchOutput.requests[0].to,
      "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
      "The To Address of the Batch Response is not displayed correctly."
    );

    assert.isNotEmpty(
      addTransactionToBatchOutput.requests[0].data,
      "The value of the data field of the Batch Reponse is not displayed."
    );

    assert.isNull(
      addTransactionToBatchOutput.estimation,
      "It is not expected behaviour of the estimation in the Batch Response."
    );

    // Estimating the batch
    const estimationResponse = await sdkTestNet.estimateGatewayBatch();
    console.log("Gas estimated at:", estimationResponse);

    assert.strictEqual(
      estimationResponse.requests[0].to,
      "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
      "The To Address of the Batch Response is not displayed correctly."
    );

    assert.isNotEmpty(
      estimationResponse.requests[0].data,
      "The value of the data field of the Estimation Response is not displayed."
    );

    assert.strictEqual(
      estimationResponse.estimation.feeTokenReceiver,
      "0xf593D35cA402c097e57813bCC6BCAb4b71A597cC",
      "The feeTokenReceiver Address of the Estimate Batch Response is not displayed correctly."
    );

    assert.isNumber(
      estimationResponse.estimation.estimatedGas,
      "The estimatedGas of the Estimate Batch Response is not displayed."
    );
    let EstimatedGas_Estimate = estimationResponse.estimation.estimatedGas;

    assert.isNotEmpty(
      estimationResponse.estimation.feeAmount,
      "The value of the feeAmount field of the Estimation Response is not displayed."
    );
    let FeeAmount_Estimate = estimationResponse.estimation.feeAmount._hex;

    assert.isNotEmpty(
      estimationResponse.estimation.estimatedGasPrice,
      "The value of the estimatedGasPrice field of the Estimation Response is not displayed."
    );
    let EstimatedGasPrice_Estimate =
      estimationResponse.estimation.estimatedGasPrice._hex;

    assert.isNotEmpty(
      estimationResponse.estimation.signature,
      "The value of the signature field of the Estimation Response is not displayed."
    );

    // Submitting the batch
    const submissionResponse = await sdkTestNet.submitGatewayBatch({
      guarded: false,
    });
    console.log("Status of the batch submition: ", submissionResponse);

    assert.isNull(
      submissionResponse.transaction,
      "It is not expected behaviour of the transaction in the Submit Batch Response."
    );

    assert.isNotEmpty(
      submissionResponse.hash,
      "The value of the hash field of the Submit Batch Response is not displayed."
    );

    assert.strictEqual(
      submissionResponse.state,
      "Queued",
      "The status of the Submit Batch Response is not displayed correctly."
    );

    assert.strictEqual(
      submissionResponse.account,
      "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
      "The account address of the Submit Batch Response is not displayed correctly."
    );

    assert.isNumber(
      submissionResponse.nonce,
      "The nonce number of the Submit Batch Response is not displayed."
    );

    assert.strictEqual(
      submissionResponse.to[0],
      "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
      "The To Address in the Submit Batch Response is not displayed correctly."
    );

    assert.isNotEmpty(
      submissionResponse.data[0],
      "The value of the data field of the Submit Batch Response is not displayed."
    );

    assert.isNotEmpty(
      submissionResponse.senderSignature,
      "The value of the senderSignature field of the Submit Batch Response is not displayed."
    );

    assert.isNumber(
      submissionResponse.estimatedGas,
      "The Estimated Gas number of the Submit Batch Response is not displayed."
    );
    let EstimatedGas_Submit = submissionResponse.estimatedGas;
    assert.strictEqual(
      EstimatedGas_Estimate,
      EstimatedGas_Submit,
      "The Estimated Gas value is not displayed correctly."
    );

    assert.isNotEmpty(
      submissionResponse.estimatedGasPrice._hex,
      "The value of the estimatedGasPrice field of the Submit Batch Response is not displayed."
    );
    let EstimatedGasPrice_Submit = submissionResponse.estimatedGasPrice._hex;
    assert.strictEqual(
      EstimatedGasPrice_Estimate,
      EstimatedGasPrice_Submit,
      "The Estimated Gas Price value is not displayed correctly."
    );

    assert.isNull(
      submissionResponse.feeToken,
      "It is not expected behaviour of the feeToken in the Submit Batch Response."
    );

    assert.isNotEmpty(
      submissionResponse.feeAmount._hex,
      "The value of the feeAmount field of the Submit Batch Response is not displayed."
    );
    let FeeAmount_Submit = submissionResponse.feeAmount._hex;
    assert.strictEqual(
      FeeAmount_Estimate,
      FeeAmount_Submit,
      "The Fee Amount value is not displayed correctly."
    );

    assert.isNotEmpty(
      submissionResponse.feeData,
      "The value of the feeData field of the Submit Batch Response is not displayed."
    );

    assert.isNull(
      submissionResponse.delayedUntil,
      "It is not expected behaviour of the delayedUntil in the Submit Batch Response."
    );
  });

  // SEND NATIVE TOKEN FOR AVALANCHE
  it.skip("Setup the SDK for Avalanche network and perform the send native asset action", async () => {
    // initialize the sdk
    sdkTestNet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.TestNets,
      networkName: NetworkNames.Avalanche,
    });

    assert.strictEqual(
      sdkTestNet.state.accountAddress,
      "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f",
      "The EOA Address is not displayed correctly."
    );

    // Compute the smart wallet address
    const smartWalletOutput = await sdkTestNet.computeContractAccount();
    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    assert.strictEqual(
      smartWalletAddress,
      "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
      "The smart address is not displayed correctly."
    );

    // Adding transaction to a batch
    const addTransactionToBatchOutput =
      await sdkTestNet.batchExecuteAccountTransaction({
        to: "0x0fd7508903376dab743a02743cadfdc2d92fceb8",
        value: "1000000000000",
      });
    console.log("Batch Reponse: ", addTransactionToBatchOutput);

    assert.strictEqual(
      addTransactionToBatchOutput.requests[0].to,
      "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
      "The To Address of the Batch Response is not displayed correctly."
    );

    assert.isNotEmpty(
      addTransactionToBatchOutput.requests[0].data,
      "The value of the data field of the Batch Reponse is not displayed."
    );

    assert.isNull(
      addTransactionToBatchOutput.estimation,
      "It is not expected behaviour of the estimation in the Batch Response."
    );

    // Estimating the batch
    const estimationResponse = await sdkTestNet.estimateGatewayBatch();
    console.log("Gas estimated at:", estimationResponse);

    assert.strictEqual(
      estimationResponse.requests[0].to,
      "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
      "The To Address of the Batch Response is not displayed correctly."
    );

    assert.isNotEmpty(
      estimationResponse.requests[0].data,
      "The value of the data field of the Estimation Response is not displayed."
    );

    assert.strictEqual(
      estimationResponse.estimation.feeTokenReceiver,
      "0xf593D35cA402c097e57813bCC6BCAb4b71A597cC",
      "The feeTokenReceiver Address of the Estimate Batch Response is not displayed correctly."
    );

    assert.isNumber(
      estimationResponse.estimation.estimatedGas,
      "The estimatedGas of the Estimate Batch Response is not displayed."
    );
    let EstimatedGas_Estimate = estimationResponse.estimation.estimatedGas;

    assert.isNotEmpty(
      estimationResponse.estimation.feeAmount,
      "The value of the feeAmount field of the Estimation Response is not displayed."
    );
    let FeeAmount_Estimate = estimationResponse.estimation.feeAmount._hex;

    assert.isNotEmpty(
      estimationResponse.estimation.estimatedGasPrice,
      "The value of the estimatedGasPrice field of the Estimation Response is not displayed."
    );
    let EstimatedGasPrice_Estimate =
      estimationResponse.estimation.estimatedGasPrice._hex;

    assert.isNotEmpty(
      estimationResponse.estimation.signature,
      "The value of the signature field of the Estimation Response is not displayed."
    );

    // Submitting the batch
    const submissionResponse = await sdkTestNet.submitGatewayBatch({
      guarded: false,
    });
    console.log("Status of the batch submition: ", submissionResponse);

    assert.isNull(
      submissionResponse.transaction,
      "It is not expected behaviour of the transaction in the Submit Batch Response."
    );

    assert.isNotEmpty(
      submissionResponse.hash,
      "The value of the hash field of the Submit Batch Response is not displayed."
    );

    assert.strictEqual(
      submissionResponse.state,
      "Queued",
      "The status of the Submit Batch Response is not displayed correctly."
    );

    assert.strictEqual(
      submissionResponse.account,
      "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
      "The account address of the Submit Batch Response is not displayed correctly."
    );

    assert.isNumber(
      submissionResponse.nonce,
      "The nonce number of the Submit Batch Response is not displayed."
    );

    assert.strictEqual(
      submissionResponse.to[0],
      "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
      "The To Address in the Submit Batch Response is not displayed correctly."
    );

    assert.isNotEmpty(
      submissionResponse.data[0],
      "The value of the data field of the Submit Batch Response is not displayed."
    );

    assert.isNotEmpty(
      submissionResponse.senderSignature,
      "The value of the senderSignature field of the Submit Batch Response is not displayed."
    );

    assert.isNumber(
      submissionResponse.estimatedGas,
      "The Estimated Gas number of the Submit Batch Response is not displayed."
    );
    let EstimatedGas_Submit = submissionResponse.estimatedGas;
    assert.strictEqual(
      EstimatedGas_Estimate,
      EstimatedGas_Submit,
      "The Estimated Gas value is not displayed correctly."
    );

    assert.isNotEmpty(
      submissionResponse.estimatedGasPrice._hex,
      "The value of the estimatedGasPrice field of the Submit Batch Response is not displayed."
    );
    let EstimatedGasPrice_Submit = submissionResponse.estimatedGasPrice._hex;
    assert.strictEqual(
      EstimatedGasPrice_Estimate,
      EstimatedGasPrice_Submit,
      "The Estimated Gas Price value is not displayed correctly."
    );

    assert.isNull(
      submissionResponse.feeToken,
      "It is not expected behaviour of the feeToken in the Submit Batch Response."
    );

    assert.isNotEmpty(
      submissionResponse.feeAmount._hex,
      "The value of the feeAmount field of the Submit Batch Response is not displayed."
    );
    let FeeAmount_Submit = submissionResponse.feeAmount._hex;
    assert.strictEqual(
      FeeAmount_Estimate,
      FeeAmount_Submit,
      "The Fee Amount value is not displayed correctly."
    );

    assert.isNotEmpty(
      submissionResponse.feeData,
      "The value of the feeData field of the Submit Batch Response is not displayed."
    );

    assert.isNull(
      submissionResponse.delayedUntil,
      "It is not expected behaviour of the delayedUntil in the Submit Batch Response."
    );
  });

  // SEND NATIVE TOKEN FOR BSC
  it("Setup the SDK for Bsc network and perform the send native asset action", async () => {
    // initialize the sdk
    sdkTestNet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.TestNets,
      networkName: NetworkNames.Bsc,
    });

    assert.strictEqual(
      sdkTestNet.state.accountAddress,
      "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f",
      "The EOA Address is not displayed correctly."
    );

    // Compute the smart wallet address
    const smartWalletOutput = await sdkTestNet.computeContractAccount();
    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    assert.strictEqual(
      smartWalletAddress,
      "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
      "The smart address is not displayed correctly."
    );

    // Adding transaction to a batch
    const addTransactionToBatchOutput =
      await sdkTestNet.batchExecuteAccountTransaction({
        to: "0x0fd7508903376dab743a02743cadfdc2d92fceb8",
        value: "1000000000000",
      });
    console.log("Batch Reponse: ", addTransactionToBatchOutput);

    assert.strictEqual(
      addTransactionToBatchOutput.requests[0].to,
      "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
      "The To Address of the Batch Response is not displayed correctly."
    );

    assert.isNotEmpty(
      addTransactionToBatchOutput.requests[0].data,
      "The value of the data field of the Batch Reponse is not displayed."
    );

    assert.isNull(
      addTransactionToBatchOutput.estimation,
      "It is not expected behaviour of the estimation in the Batch Response."
    );

    // Estimating the batch
    const estimationResponse = await sdkTestNet.estimateGatewayBatch();
    console.log("Gas estimated at:", estimationResponse);

    assert.strictEqual(
      estimationResponse.requests[0].to,
      "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
      "The To Address of the Batch Response is not displayed correctly."
    );

    assert.isNotEmpty(
      estimationResponse.requests[0].data,
      "The value of the data field of the Estimation Response is not displayed."
    );

    assert.strictEqual(
      estimationResponse.estimation.feeTokenReceiver,
      "0xf593D35cA402c097e57813bCC6BCAb4b71A597cC",
      "The feeTokenReceiver Address of the Estimate Batch Response is not displayed correctly."
    );

    assert.isNumber(
      estimationResponse.estimation.estimatedGas,
      "The estimatedGas of the Estimate Batch Response is not displayed."
    );
    let EstimatedGas_Estimate = estimationResponse.estimation.estimatedGas;

    assert.isNotEmpty(
      estimationResponse.estimation.feeAmount,
      "The value of the feeAmount field of the Estimation Response is not displayed."
    );
    let FeeAmount_Estimate = estimationResponse.estimation.feeAmount._hex;

    assert.isNotEmpty(
      estimationResponse.estimation.estimatedGasPrice,
      "The value of the estimatedGasPrice field of the Estimation Response is not displayed."
    );
    let EstimatedGasPrice_Estimate =
      estimationResponse.estimation.estimatedGasPrice._hex;

    assert.isNotEmpty(
      estimationResponse.estimation.signature,
      "The value of the signature field of the Estimation Response is not displayed."
    );

    // Submitting the batch
    const submissionResponse = await sdkTestNet.submitGatewayBatch({
      guarded: false,
    });
    console.log("Status of the batch submition: ", submissionResponse);

    assert.isNull(
      submissionResponse.transaction,
      "It is not expected behaviour of the transaction in the Submit Batch Response."
    );

    assert.isNotEmpty(
      submissionResponse.hash,
      "The value of the hash field of the Submit Batch Response is not displayed."
    );

    assert.strictEqual(
      submissionResponse.state,
      "Queued",
      "The status of the Submit Batch Response is not displayed correctly."
    );

    assert.strictEqual(
      submissionResponse.account,
      "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
      "The account address of the Submit Batch Response is not displayed correctly."
    );

    assert.isNumber(
      submissionResponse.nonce,
      "The nonce number of the Submit Batch Response is not displayed."
    );

    assert.strictEqual(
      submissionResponse.to[0],
      "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
      "The To Address in the Submit Batch Response is not displayed correctly."
    );

    assert.isNotEmpty(
      submissionResponse.data[0],
      "The value of the data field of the Submit Batch Response is not displayed."
    );

    assert.isNotEmpty(
      submissionResponse.senderSignature,
      "The value of the senderSignature field of the Submit Batch Response is not displayed."
    );

    assert.isNumber(
      submissionResponse.estimatedGas,
      "The Estimated Gas number of the Submit Batch Response is not displayed."
    );
    let EstimatedGas_Submit = submissionResponse.estimatedGas;
    assert.strictEqual(
      EstimatedGas_Estimate,
      EstimatedGas_Submit,
      "The Estimated Gas value is not displayed correctly."
    );

    assert.isNotEmpty(
      submissionResponse.estimatedGasPrice._hex,
      "The value of the estimatedGasPrice field of the Submit Batch Response is not displayed."
    );
    let EstimatedGasPrice_Submit = submissionResponse.estimatedGasPrice._hex;
    assert.strictEqual(
      EstimatedGasPrice_Estimate,
      EstimatedGasPrice_Submit,
      "The Estimated Gas Price value is not displayed correctly."
    );

    assert.isNull(
      submissionResponse.feeToken,
      "It is not expected behaviour of the feeToken in the Submit Batch Response."
    );

    assert.isNotEmpty(
      submissionResponse.feeAmount._hex,
      "The value of the feeAmount field of the Submit Batch Response is not displayed."
    );
    let FeeAmount_Submit = submissionResponse.feeAmount._hex;
    assert.strictEqual(
      FeeAmount_Estimate,
      FeeAmount_Submit,
      "The Fee Amount value is not displayed correctly."
    );

    assert.isNotEmpty(
      submissionResponse.feeData,
      "The value of the feeData field of the Submit Batch Response is not displayed."
    );

    assert.isNull(
      submissionResponse.delayedUntil,
      "It is not expected behaviour of the delayedUntil in the Submit Batch Response."
    );
  });

  // SEND NATIVE TOKEN FOR CELO
  it.skip("Setup the SDK for Celo network and perform the send native asset action", async () => {
    // initialize the sdk
    sdkTestNet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.TestNets,
      networkName: NetworkNames.Celo,
    });

    assert.strictEqual(
      sdkTestNet.state.accountAddress,
      "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f",
      "The EOA Address is not displayed correctly."
    );

    // Compute the smart wallet address
    const smartWalletOutput = await sdkTestNet.computeContractAccount();
    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    assert.strictEqual(
      smartWalletAddress,
      "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
      "The smart address is not displayed correctly."
    );

    // Adding transaction to a batch
    const addTransactionToBatchOutput =
      await sdkTestNet.batchExecuteAccountTransaction({
        to: "0x0fd7508903376dab743a02743cadfdc2d92fceb8",
        value: "1000000000000",
      });
    console.log("Batch Reponse: ", addTransactionToBatchOutput);

    assert.strictEqual(
      addTransactionToBatchOutput.requests[0].to,
      "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
      "The To Address of the Batch Response is not displayed correctly."
    );

    assert.isNotEmpty(
      addTransactionToBatchOutput.requests[0].data,
      "The value of the data field of the Batch Reponse is not displayed."
    );

    assert.isNull(
      addTransactionToBatchOutput.estimation,
      "It is not expected behaviour of the estimation in the Batch Response."
    );

    // Estimating the batch
    const estimationResponse = await sdkTestNet.estimateGatewayBatch();
    console.log("Gas estimated at:", estimationResponse);

    assert.strictEqual(
      estimationResponse.requests[0].to,
      "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
      "The To Address of the Batch Response is not displayed correctly."
    );

    assert.isNotEmpty(
      estimationResponse.requests[0].data,
      "The value of the data field of the Estimation Response is not displayed."
    );

    assert.strictEqual(
      estimationResponse.estimation.feeTokenReceiver,
      "0xf593D35cA402c097e57813bCC6BCAb4b71A597cC",
      "The feeTokenReceiver Address of the Estimate Batch Response is not displayed correctly."
    );

    assert.isNumber(
      estimationResponse.estimation.estimatedGas,
      "The estimatedGas of the Estimate Batch Response is not displayed."
    );
    let EstimatedGas_Estimate = estimationResponse.estimation.estimatedGas;

    assert.isNotEmpty(
      estimationResponse.estimation.feeAmount,
      "The value of the feeAmount field of the Estimation Response is not displayed."
    );
    let FeeAmount_Estimate = estimationResponse.estimation.feeAmount._hex;

    assert.isNotEmpty(
      estimationResponse.estimation.estimatedGasPrice,
      "The value of the estimatedGasPrice field of the Estimation Response is not displayed."
    );
    let EstimatedGasPrice_Estimate =
      estimationResponse.estimation.estimatedGasPrice._hex;

    assert.isNotEmpty(
      estimationResponse.estimation.signature,
      "The value of the signature field of the Estimation Response is not displayed."
    );

    // Submitting the batch
    const submissionResponse = await sdkTestNet.submitGatewayBatch({
      guarded: false,
    });
    console.log("Status of the batch submition: ", submissionResponse);

    assert.isNull(
      submissionResponse.transaction,
      "It is not expected behaviour of the transaction in the Submit Batch Response."
    );

    assert.isNotEmpty(
      submissionResponse.hash,
      "The value of the hash field of the Submit Batch Response is not displayed."
    );

    assert.strictEqual(
      submissionResponse.state,
      "Queued",
      "The status of the Submit Batch Response is not displayed correctly."
    );

    assert.strictEqual(
      submissionResponse.account,
      "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
      "The account address of the Submit Batch Response is not displayed correctly."
    );

    assert.isNumber(
      submissionResponse.nonce,
      "The nonce number of the Submit Batch Response is not displayed."
    );

    assert.strictEqual(
      submissionResponse.to[0],
      "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
      "The To Address in the Submit Batch Response is not displayed correctly."
    );

    assert.isNotEmpty(
      submissionResponse.data[0],
      "The value of the data field of the Submit Batch Response is not displayed."
    );

    assert.isNotEmpty(
      submissionResponse.senderSignature,
      "The value of the senderSignature field of the Submit Batch Response is not displayed."
    );

    assert.isNumber(
      submissionResponse.estimatedGas,
      "The Estimated Gas number of the Submit Batch Response is not displayed."
    );
    let EstimatedGas_Submit = submissionResponse.estimatedGas;
    assert.strictEqual(
      EstimatedGas_Estimate,
      EstimatedGas_Submit,
      "The Estimated Gas value is not displayed correctly."
    );

    assert.isNotEmpty(
      submissionResponse.estimatedGasPrice._hex,
      "The value of the estimatedGasPrice field of the Submit Batch Response is not displayed."
    );
    let EstimatedGasPrice_Submit = submissionResponse.estimatedGasPrice._hex;
    assert.strictEqual(
      EstimatedGasPrice_Estimate,
      EstimatedGasPrice_Submit,
      "The Estimated Gas Price value is not displayed correctly."
    );

    assert.isNull(
      submissionResponse.feeToken,
      "It is not expected behaviour of the feeToken in the Submit Batch Response."
    );

    assert.isNotEmpty(
      submissionResponse.feeAmount._hex,
      "The value of the feeAmount field of the Submit Batch Response is not displayed."
    );
    let FeeAmount_Submit = submissionResponse.feeAmount._hex;
    assert.strictEqual(
      FeeAmount_Estimate,
      FeeAmount_Submit,
      "The Fee Amount value is not displayed correctly."
    );

    assert.isNotEmpty(
      submissionResponse.feeData,
      "The value of the feeData field of the Submit Batch Response is not displayed."
    );

    assert.isNull(
      submissionResponse.delayedUntil,
      "It is not expected behaviour of the delayedUntil in the Submit Batch Response."
    );
  });

  // SEND NATIVE TOKEN FOR TestNET
  it("Setup the SDK for Testnet network and perform the send native asset action", async () => {
    // initialize the sdk
    sdkTestNet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.TestNets,
      networkName: NetworkNames.Testnet,
    });

    assert.strictEqual(
      sdkTestNet.state.accountAddress,
      "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f",
      "The EOA Address is not displayed correctly."
    );

    // Compute the smart wallet address
    const smartWalletOutput = await sdkTestNet.computeContractAccount();
    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    assert.strictEqual(
      smartWalletAddress,
      "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
      "The smart address is not displayed correctly."
    );

    // Adding transaction to a batch
    const addTransactionToBatchOutput =
      await sdkTestNet.batchExecuteAccountTransaction({
        to: "0x0fd7508903376dab743a02743cadfdc2d92fceb8",
        value: "1000000000000",
      });
    console.log("Batch Reponse: ", addTransactionToBatchOutput);

    assert.strictEqual(
      addTransactionToBatchOutput.requests[0].to,
      "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
      "The To Address of the Batch Response is not displayed correctly."
    );

    assert.isNotEmpty(
      addTransactionToBatchOutput.requests[0].data,
      "The value of the data field of the Batch Reponse is not displayed."
    );

    assert.isNull(
      addTransactionToBatchOutput.estimation,
      "It is not expected behaviour of the estimation in the Batch Response."
    );

    // Estimating the batch
    const estimationResponse = await sdkTestNet.estimateGatewayBatch();
    console.log("Gas estimated at:", estimationResponse);

    assert.strictEqual(
      estimationResponse.requests[0].to,
      "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
      "The To Address of the Batch Response is not displayed correctly."
    );

    assert.isNotEmpty(
      estimationResponse.requests[0].data,
      "The value of the data field of the Estimation Response is not displayed."
    );

    assert.strictEqual(
      estimationResponse.estimation.feeTokenReceiver,
      "0xf593D35cA402c097e57813bCC6BCAb4b71A597cC",
      "The feeTokenReceiver Address of the Estimate Batch Response is not displayed correctly."
    );

    assert.isNumber(
      estimationResponse.estimation.estimatedGas,
      "The estimatedGas of the Estimate Batch Response is not displayed."
    );
    let EstimatedGas_Estimate = estimationResponse.estimation.estimatedGas;

    assert.isNotEmpty(
      estimationResponse.estimation.feeAmount,
      "The value of the feeAmount field of the Estimation Response is not displayed."
    );
    let FeeAmount_Estimate = estimationResponse.estimation.feeAmount._hex;

    assert.isNotEmpty(
      estimationResponse.estimation.estimatedGasPrice,
      "The value of the estimatedGasPrice field of the Estimation Response is not displayed."
    );
    let EstimatedGasPrice_Estimate =
      estimationResponse.estimation.estimatedGasPrice._hex;

    assert.isNotEmpty(
      estimationResponse.estimation.signature,
      "The value of the signature field of the Estimation Response is not displayed."
    );

    // Submitting the batch
    const submissionResponse = await sdkTestNet.submitGatewayBatch({
      guarded: false,
    });
    console.log("Status of the batch submition: ", submissionResponse);

    assert.isNull(
      submissionResponse.transaction,
      "It is not expected behaviour of the transaction in the Submit Batch Response."
    );

    assert.isNotEmpty(
      submissionResponse.hash,
      "The value of the hash field of the Submit Batch Response is not displayed."
    );

    assert.strictEqual(
      submissionResponse.state,
      "Queued",
      "The status of the Submit Batch Response is not displayed correctly."
    );

    assert.strictEqual(
      submissionResponse.account,
      "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
      "The account address of the Submit Batch Response is not displayed correctly."
    );

    assert.isNumber(
      submissionResponse.nonce,
      "The nonce number of the Submit Batch Response is not displayed."
    );

    assert.strictEqual(
      submissionResponse.to[0],
      "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
      "The To Address in the Submit Batch Response is not displayed correctly."
    );

    assert.isNotEmpty(
      submissionResponse.data[0],
      "The value of the data field of the Submit Batch Response is not displayed."
    );

    assert.isNotEmpty(
      submissionResponse.senderSignature,
      "The value of the senderSignature field of the Submit Batch Response is not displayed."
    );

    assert.isNumber(
      submissionResponse.estimatedGas,
      "The Estimated Gas number of the Submit Batch Response is not displayed."
    );
    let EstimatedGas_Submit = submissionResponse.estimatedGas;
    assert.strictEqual(
      EstimatedGas_Estimate,
      EstimatedGas_Submit,
      "The Estimated Gas value is not displayed correctly."
    );

    assert.isNotEmpty(
      submissionResponse.estimatedGasPrice._hex,
      "The value of the estimatedGasPrice field of the Submit Batch Response is not displayed."
    );
    let EstimatedGasPrice_Submit = submissionResponse.estimatedGasPrice._hex;
    assert.strictEqual(
      EstimatedGasPrice_Estimate,
      EstimatedGasPrice_Submit,
      "The Estimated Gas Price value is not displayed correctly."
    );

    assert.isNull(
      submissionResponse.feeToken,
      "It is not expected behaviour of the feeToken in the Submit Batch Response."
    );

    assert.isNotEmpty(
      submissionResponse.feeAmount._hex,
      "The value of the feeAmount field of the Submit Batch Response is not displayed."
    );
    let FeeAmount_Submit = submissionResponse.feeAmount._hex;
    assert.strictEqual(
      FeeAmount_Estimate,
      FeeAmount_Submit,
      "The Fee Amount value is not displayed correctly."
    );

    assert.isNotEmpty(
      submissionResponse.feeData,
      "The value of the feeData field of the Submit Batch Response is not displayed."
    );

    assert.isNull(
      submissionResponse.delayedUntil,
      "It is not expected behaviour of the delayedUntil in the Submit Batch Response."
    );
  });

  // SEND NATIVE TOKEN FOR FANTOM
  it.skip("Setup the SDK for Fantom network and perform the send native asset action", async () => {
    // initialize the sdk
    sdkTestNet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.TestNets,
      networkName: NetworkNames.Fantom,
    });

    assert.strictEqual(
      sdkTestNet.state.accountAddress,
      "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f",
      "The EOA Address is not displayed correctly."
    );

    // Compute the smart wallet address
    const smartWalletOutput = await sdkTestNet.computeContractAccount();
    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    assert.strictEqual(
      smartWalletAddress,
      "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
      "The smart address is not displayed correctly."
    );

    // Adding transaction to a batch
    const addTransactionToBatchOutput =
      await sdkTestNet.batchExecuteAccountTransaction({
        to: "0x0fd7508903376dab743a02743cadfdc2d92fceb8",
        value: "1000000000000",
      });
    console.log("Batch Reponse: ", addTransactionToBatchOutput);

    assert.strictEqual(
      addTransactionToBatchOutput.requests[0].to,
      "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
      "The To Address of the Batch Response is not displayed correctly."
    );

    assert.isNotEmpty(
      addTransactionToBatchOutput.requests[0].data,
      "The value of the data field of the Batch Reponse is not displayed."
    );

    assert.isNull(
      addTransactionToBatchOutput.estimation,
      "It is not expected behaviour of the estimation in the Batch Response."
    );

    // Estimating the batch
    const estimationResponse = await sdkTestNet.estimateGatewayBatch();
    console.log("Gas estimated at:", estimationResponse);

    assert.strictEqual(
      estimationResponse.requests[0].to,
      "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
      "The To Address of the Batch Response is not displayed correctly."
    );

    assert.isNotEmpty(
      estimationResponse.requests[0].data,
      "The value of the data field of the Estimation Response is not displayed."
    );

    assert.strictEqual(
      estimationResponse.estimation.feeTokenReceiver,
      "0xf593D35cA402c097e57813bCC6BCAb4b71A597cC",
      "The feeTokenReceiver Address of the Estimate Batch Response is not displayed correctly."
    );

    assert.isNumber(
      estimationResponse.estimation.estimatedGas,
      "The estimatedGas of the Estimate Batch Response is not displayed."
    );
    let EstimatedGas_Estimate = estimationResponse.estimation.estimatedGas;

    assert.isNotEmpty(
      estimationResponse.estimation.feeAmount,
      "The value of the feeAmount field of the Estimation Response is not displayed."
    );
    let FeeAmount_Estimate = estimationResponse.estimation.feeAmount._hex;

    assert.isNotEmpty(
      estimationResponse.estimation.estimatedGasPrice,
      "The value of the estimatedGasPrice field of the Estimation Response is not displayed."
    );
    let EstimatedGasPrice_Estimate =
      estimationResponse.estimation.estimatedGasPrice._hex;

    assert.isNotEmpty(
      estimationResponse.estimation.signature,
      "The value of the signature field of the Estimation Response is not displayed."
    );

    // Submitting the batch
    const submissionResponse = await sdkTestNet.submitGatewayBatch({
      guarded: false,
    });
    console.log("Status of the batch submition: ", submissionResponse);

    assert.isNull(
      submissionResponse.transaction,
      "It is not expected behaviour of the transaction in the Submit Batch Response."
    );

    assert.isNotEmpty(
      submissionResponse.hash,
      "The value of the hash field of the Submit Batch Response is not displayed."
    );

    assert.strictEqual(
      submissionResponse.state,
      "Queued",
      "The status of the Submit Batch Response is not displayed correctly."
    );

    assert.strictEqual(
      submissionResponse.account,
      "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
      "The account address of the Submit Batch Response is not displayed correctly."
    );

    assert.isNumber(
      submissionResponse.nonce,
      "The nonce number of the Submit Batch Response is not displayed."
    );

    assert.strictEqual(
      submissionResponse.to[0],
      "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
      "The To Address in the Submit Batch Response is not displayed correctly."
    );

    assert.isNotEmpty(
      submissionResponse.data[0],
      "The value of the data field of the Submit Batch Response is not displayed."
    );

    assert.isNotEmpty(
      submissionResponse.senderSignature,
      "The value of the senderSignature field of the Submit Batch Response is not displayed."
    );

    assert.isNumber(
      submissionResponse.estimatedGas,
      "The Estimated Gas number of the Submit Batch Response is not displayed."
    );
    let EstimatedGas_Submit = submissionResponse.estimatedGas;
    assert.strictEqual(
      EstimatedGas_Estimate,
      EstimatedGas_Submit,
      "The Estimated Gas value is not displayed correctly."
    );

    assert.isNotEmpty(
      submissionResponse.estimatedGasPrice._hex,
      "The value of the estimatedGasPrice field of the Submit Batch Response is not displayed."
    );
    let EstimatedGasPrice_Submit = submissionResponse.estimatedGasPrice._hex;
    assert.strictEqual(
      EstimatedGasPrice_Estimate,
      EstimatedGasPrice_Submit,
      "The Estimated Gas Price value is not displayed correctly."
    );

    assert.isNull(
      submissionResponse.feeToken,
      "It is not expected behaviour of the feeToken in the Submit Batch Response."
    );

    assert.isNotEmpty(
      submissionResponse.feeAmount._hex,
      "The value of the feeAmount field of the Submit Batch Response is not displayed."
    );
    let FeeAmount_Submit = submissionResponse.feeAmount._hex;
    assert.strictEqual(
      FeeAmount_Estimate,
      FeeAmount_Submit,
      "The Fee Amount value is not displayed correctly."
    );

    assert.isNotEmpty(
      submissionResponse.feeData,
      "The value of the feeData field of the Submit Batch Response is not displayed."
    );

    assert.isNull(
      submissionResponse.delayedUntil,
      "It is not expected behaviour of the delayedUntil in the Submit Batch Response."
    );
  });

  // SEND NATIVE TOKEN FOR FUSE
  it.skip("Setup the SDK for Fuse network and perform the send native asset action", async () => {
    // initialize the sdk
    sdkTestNet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.TestNets,
      networkName: NetworkNames.Fuse,
    });

    assert.strictEqual(
      sdkTestNet.state.accountAddress,
      "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f",
      "The EOA Address is not displayed correctly."
    );

    // Compute the smart wallet address
    const smartWalletOutput = await sdkTestNet.computeContractAccount();
    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    assert.strictEqual(
      smartWalletAddress,
      "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
      "The smart address is not displayed correctly."
    );

    // Adding transaction to a batch
    const addTransactionToBatchOutput =
      await sdkTestNet.batchExecuteAccountTransaction({
        to: "0x0fd7508903376dab743a02743cadfdc2d92fceb8",
        value: "1000000000000",
      });
    console.log("Batch Reponse: ", addTransactionToBatchOutput);

    assert.strictEqual(
      addTransactionToBatchOutput.requests[0].to,
      "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
      "The To Address of the Batch Response is not displayed correctly."
    );

    assert.isNotEmpty(
      addTransactionToBatchOutput.requests[0].data,
      "The value of the data field of the Batch Reponse is not displayed."
    );

    assert.isNull(
      addTransactionToBatchOutput.estimation,
      "It is not expected behaviour of the estimation in the Batch Response."
    );

    // Estimating the batch
    const estimationResponse = await sdkTestNet.estimateGatewayBatch();
    console.log("Gas estimated at:", estimationResponse);

    assert.strictEqual(
      estimationResponse.requests[0].to,
      "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
      "The To Address of the Batch Response is not displayed correctly."
    );

    assert.isNotEmpty(
      estimationResponse.requests[0].data,
      "The value of the data field of the Estimation Response is not displayed."
    );

    assert.strictEqual(
      estimationResponse.estimation.feeTokenReceiver,
      "0xf593D35cA402c097e57813bCC6BCAb4b71A597cC",
      "The feeTokenReceiver Address of the Estimate Batch Response is not displayed correctly."
    );

    assert.isNumber(
      estimationResponse.estimation.estimatedGas,
      "The estimatedGas of the Estimate Batch Response is not displayed."
    );
    let EstimatedGas_Estimate = estimationResponse.estimation.estimatedGas;

    assert.isNotEmpty(
      estimationResponse.estimation.feeAmount,
      "The value of the feeAmount field of the Estimation Response is not displayed."
    );
    let FeeAmount_Estimate = estimationResponse.estimation.feeAmount._hex;

    assert.isNotEmpty(
      estimationResponse.estimation.estimatedGasPrice,
      "The value of the estimatedGasPrice field of the Estimation Response is not displayed."
    );
    let EstimatedGasPrice_Estimate =
      estimationResponse.estimation.estimatedGasPrice._hex;

    assert.isNotEmpty(
      estimationResponse.estimation.signature,
      "The value of the signature field of the Estimation Response is not displayed."
    );

    // Submitting the batch
    const submissionResponse = await sdkTestNet.submitGatewayBatch({
      guarded: false,
    });
    console.log("Status of the batch submition: ", submissionResponse);

    assert.isNull(
      submissionResponse.transaction,
      "It is not expected behaviour of the transaction in the Submit Batch Response."
    );

    assert.isNotEmpty(
      submissionResponse.hash,
      "The value of the hash field of the Submit Batch Response is not displayed."
    );

    assert.strictEqual(
      submissionResponse.state,
      "Queued",
      "The status of the Submit Batch Response is not displayed correctly."
    );

    assert.strictEqual(
      submissionResponse.account,
      "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
      "The account address of the Submit Batch Response is not displayed correctly."
    );

    assert.isNumber(
      submissionResponse.nonce,
      "The nonce number of the Submit Batch Response is not displayed."
    );

    assert.strictEqual(
      submissionResponse.to[0],
      "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
      "The To Address in the Submit Batch Response is not displayed correctly."
    );

    assert.isNotEmpty(
      submissionResponse.data[0],
      "The value of the data field of the Submit Batch Response is not displayed."
    );

    assert.isNotEmpty(
      submissionResponse.senderSignature,
      "The value of the senderSignature field of the Submit Batch Response is not displayed."
    );

    assert.isNumber(
      submissionResponse.estimatedGas,
      "The Estimated Gas number of the Submit Batch Response is not displayed."
    );
    let EstimatedGas_Submit = submissionResponse.estimatedGas;
    assert.strictEqual(
      EstimatedGas_Estimate,
      EstimatedGas_Submit,
      "The Estimated Gas value is not displayed correctly."
    );

    assert.isNotEmpty(
      submissionResponse.estimatedGasPrice._hex,
      "The value of the estimatedGasPrice field of the Submit Batch Response is not displayed."
    );
    let EstimatedGasPrice_Submit = submissionResponse.estimatedGasPrice._hex;
    assert.strictEqual(
      EstimatedGasPrice_Estimate,
      EstimatedGasPrice_Submit,
      "The Estimated Gas Price value is not displayed correctly."
    );

    assert.isNull(
      submissionResponse.feeToken,
      "It is not expected behaviour of the feeToken in the Submit Batch Response."
    );

    assert.isNotEmpty(
      submissionResponse.feeAmount._hex,
      "The value of the feeAmount field of the Submit Batch Response is not displayed."
    );
    let FeeAmount_Submit = submissionResponse.feeAmount._hex;
    assert.strictEqual(
      FeeAmount_Estimate,
      FeeAmount_Submit,
      "The Fee Amount value is not displayed correctly."
    );

    assert.isNotEmpty(
      submissionResponse.feeData,
      "The value of the feeData field of the Submit Batch Response is not displayed."
    );

    assert.isNull(
      submissionResponse.delayedUntil,
      "It is not expected behaviour of the delayedUntil in the Submit Batch Response."
    );
  });

  // SEND NATIVE TOKEN FOR XDAI
  it.only("Setup the SDK for Xdai network and perform the send native asset action", async () => {
    // initialize the sdk
    sdkTestNet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.TestNets,
      networkName: NetworkNames.Xdai,
    });

    assert.strictEqual(
      sdkTestNet.state.accountAddress,
      "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f",
      "The EOA Address is not displayed correctly."
    );

    // Compute the smart wallet address
    const smartWalletOutput = await sdkTestNet.computeContractAccount();
    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    assert.strictEqual(
      smartWalletAddress,
      "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
      "The smart address is not displayed correctly."
    );

    // Adding transaction to a batch
    const addTransactionToBatchOutput =
      await sdkTestNet.batchExecuteAccountTransaction({
        to: "0x0fd7508903376dab743a02743cadfdc2d92fceb8",
        value: "1000000000000",
      });
    console.log("Batch Reponse: ", addTransactionToBatchOutput);

    assert.strictEqual(
      addTransactionToBatchOutput.requests[0].to,
      "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
      "The To Address of the Batch Response is not displayed correctly."
    );

    assert.isNotEmpty(
      addTransactionToBatchOutput.requests[0].data,
      "The value of the data field of the Batch Reponse is not displayed."
    );

    assert.isNull(
      addTransactionToBatchOutput.estimation,
      "It is not expected behaviour of the estimation in the Batch Response."
    );

    // Estimating the batch
    const estimationResponse = await sdkTestNet.estimateGatewayBatch();
    console.log("Gas estimated at:", estimationResponse);

    assert.strictEqual(
      estimationResponse.requests[0].to,
      "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
      "The To Address of the Batch Response is not displayed correctly."
    );

    assert.isNotEmpty(
      estimationResponse.requests[0].data,
      "The value of the data field of the Estimation Response is not displayed."
    );

    assert.strictEqual(
      estimationResponse.estimation.feeTokenReceiver,
      "0xf593D35cA402c097e57813bCC6BCAb4b71A597cC",
      "The feeTokenReceiver Address of the Estimate Batch Response is not displayed correctly."
    );

    assert.isNumber(
      estimationResponse.estimation.estimatedGas,
      "The estimatedGas of the Estimate Batch Response is not displayed."
    );
    let EstimatedGas_Estimate = estimationResponse.estimation.estimatedGas;

    assert.isNotEmpty(
      estimationResponse.estimation.feeAmount,
      "The value of the feeAmount field of the Estimation Response is not displayed."
    );
    let FeeAmount_Estimate = estimationResponse.estimation.feeAmount._hex;

    assert.isNotEmpty(
      estimationResponse.estimation.estimatedGasPrice,
      "The value of the estimatedGasPrice field of the Estimation Response is not displayed."
    );
    let EstimatedGasPrice_Estimate =
      estimationResponse.estimation.estimatedGasPrice._hex;

    assert.isNotEmpty(
      estimationResponse.estimation.signature,
      "The value of the signature field of the Estimation Response is not displayed."
    );

    // Submitting the batch
    const submissionResponse = await sdkTestNet.submitGatewayBatch({
      guarded: false,
    });
    console.log("Status of the batch submition: ", submissionResponse);

    assert.isNull(
      submissionResponse.transaction,
      "It is not expected behaviour of the transaction in the Submit Batch Response."
    );

    assert.isNotEmpty(
      submissionResponse.hash,
      "The value of the hash field of the Submit Batch Response is not displayed."
    );

    assert.strictEqual(
      submissionResponse.state,
      "Queued",
      "The status of the Submit Batch Response is not displayed correctly."
    );

    assert.strictEqual(
      submissionResponse.account,
      "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
      "The account address of the Submit Batch Response is not displayed correctly."
    );

    assert.isNumber(
      submissionResponse.nonce,
      "The nonce number of the Submit Batch Response is not displayed."
    );

    assert.strictEqual(
      submissionResponse.to[0],
      "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
      "The To Address in the Submit Batch Response is not displayed correctly."
    );

    assert.isNotEmpty(
      submissionResponse.data[0],
      "The value of the data field of the Submit Batch Response is not displayed."
    );

    assert.isNotEmpty(
      submissionResponse.senderSignature,
      "The value of the senderSignature field of the Submit Batch Response is not displayed."
    );

    assert.isNumber(
      submissionResponse.estimatedGas,
      "The Estimated Gas number of the Submit Batch Response is not displayed."
    );
    let EstimatedGas_Submit = submissionResponse.estimatedGas;
    assert.strictEqual(
      EstimatedGas_Estimate,
      EstimatedGas_Submit,
      "The Estimated Gas value is not displayed correctly."
    );

    assert.isNotEmpty(
      submissionResponse.estimatedGasPrice._hex,
      "The value of the estimatedGasPrice field of the Submit Batch Response is not displayed."
    );
    let EstimatedGasPrice_Submit = submissionResponse.estimatedGasPrice._hex;
    assert.strictEqual(
      EstimatedGasPrice_Estimate,
      EstimatedGasPrice_Submit,
      "The Estimated Gas Price value is not displayed correctly."
    );

    assert.isNull(
      submissionResponse.feeToken,
      "It is not expected behaviour of the feeToken in the Submit Batch Response."
    );

    assert.isNotEmpty(
      submissionResponse.feeAmount._hex,
      "The value of the feeAmount field of the Submit Batch Response is not displayed."
    );
    let FeeAmount_Submit = submissionResponse.feeAmount._hex;
    assert.strictEqual(
      FeeAmount_Estimate,
      FeeAmount_Submit,
      "The Fee Amount value is not displayed correctly."
    );

    assert.isNotEmpty(
      submissionResponse.feeData,
      "The value of the feeData field of the Submit Batch Response is not displayed."
    );

    assert.isNull(
      submissionResponse.delayedUntil,
      "It is not expected behaviour of the delayedUntil in the Submit Batch Response."
    );
  });

  // SEND NATIVE TOKEN FOR MOONBEAM
  it.skip("Setup the SDK for Moonbeam network and perform the send native asset action", async () => {
    // initialize the sdk
    sdkTestNet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.TestNets,
      networkName: NetworkNames.Moonbeam,
    });

    assert.strictEqual(
      sdkTestNet.state.accountAddress,
      "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f",
      "The EOA Address is not displayed correctly."
    );

    // Compute the smart wallet address
    const smartWalletOutput = await sdkTestNet.computeContractAccount();
    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    assert.strictEqual(
      smartWalletAddress,
      "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
      "The smart address is not displayed correctly."
    );

    // Adding transaction to a batch
    const addTransactionToBatchOutput =
      await sdkTestNet.batchExecuteAccountTransaction({
        to: "0x0fd7508903376dab743a02743cadfdc2d92fceb8",
        value: "1000000000000",
      });
    console.log("Batch Reponse: ", addTransactionToBatchOutput);

    assert.strictEqual(
      addTransactionToBatchOutput.requests[0].to,
      "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
      "The To Address of the Batch Response is not displayed correctly."
    );

    assert.isNotEmpty(
      addTransactionToBatchOutput.requests[0].data,
      "The value of the data field of the Batch Reponse is not displayed."
    );

    assert.isNull(
      addTransactionToBatchOutput.estimation,
      "It is not expected behaviour of the estimation in the Batch Response."
    );

    // Estimating the batch
    const estimationResponse = await sdkTestNet.estimateGatewayBatch();
    console.log("Gas estimated at:", estimationResponse);

    assert.strictEqual(
      estimationResponse.requests[0].to,
      "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
      "The To Address of the Batch Response is not displayed correctly."
    );

    assert.isNotEmpty(
      estimationResponse.requests[0].data,
      "The value of the data field of the Estimation Response is not displayed."
    );

    assert.strictEqual(
      estimationResponse.estimation.feeTokenReceiver,
      "0xf593D35cA402c097e57813bCC6BCAb4b71A597cC",
      "The feeTokenReceiver Address of the Estimate Batch Response is not displayed correctly."
    );

    assert.isNumber(
      estimationResponse.estimation.estimatedGas,
      "The estimatedGas of the Estimate Batch Response is not displayed."
    );
    let EstimatedGas_Estimate = estimationResponse.estimation.estimatedGas;

    assert.isNotEmpty(
      estimationResponse.estimation.feeAmount,
      "The value of the feeAmount field of the Estimation Response is not displayed."
    );
    let FeeAmount_Estimate = estimationResponse.estimation.feeAmount._hex;

    assert.isNotEmpty(
      estimationResponse.estimation.estimatedGasPrice,
      "The value of the estimatedGasPrice field of the Estimation Response is not displayed."
    );
    let EstimatedGasPrice_Estimate =
      estimationResponse.estimation.estimatedGasPrice._hex;

    assert.isNotEmpty(
      estimationResponse.estimation.signature,
      "The value of the signature field of the Estimation Response is not displayed."
    );

    // Submitting the batch
    const submissionResponse = await sdkTestNet.submitGatewayBatch({
      guarded: false,
    });
    console.log("Status of the batch submition: ", submissionResponse);

    assert.isNull(
      submissionResponse.transaction,
      "It is not expected behaviour of the transaction in the Submit Batch Response."
    );

    assert.isNotEmpty(
      submissionResponse.hash,
      "The value of the hash field of the Submit Batch Response is not displayed."
    );

    assert.strictEqual(
      submissionResponse.state,
      "Queued",
      "The status of the Submit Batch Response is not displayed correctly."
    );

    assert.strictEqual(
      submissionResponse.account,
      "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
      "The account address of the Submit Batch Response is not displayed correctly."
    );

    assert.isNumber(
      submissionResponse.nonce,
      "The nonce number of the Submit Batch Response is not displayed."
    );

    assert.strictEqual(
      submissionResponse.to[0],
      "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
      "The To Address in the Submit Batch Response is not displayed correctly."
    );

    assert.isNotEmpty(
      submissionResponse.data[0],
      "The value of the data field of the Submit Batch Response is not displayed."
    );

    assert.isNotEmpty(
      submissionResponse.senderSignature,
      "The value of the senderSignature field of the Submit Batch Response is not displayed."
    );

    assert.isNumber(
      submissionResponse.estimatedGas,
      "The Estimated Gas number of the Submit Batch Response is not displayed."
    );
    let EstimatedGas_Submit = submissionResponse.estimatedGas;
    assert.strictEqual(
      EstimatedGas_Estimate,
      EstimatedGas_Submit,
      "The Estimated Gas value is not displayed correctly."
    );

    assert.isNotEmpty(
      submissionResponse.estimatedGasPrice._hex,
      "The value of the estimatedGasPrice field of the Submit Batch Response is not displayed."
    );
    let EstimatedGasPrice_Submit = submissionResponse.estimatedGasPrice._hex;
    assert.strictEqual(
      EstimatedGasPrice_Estimate,
      EstimatedGasPrice_Submit,
      "The Estimated Gas Price value is not displayed correctly."
    );

    assert.isNull(
      submissionResponse.feeToken,
      "It is not expected behaviour of the feeToken in the Submit Batch Response."
    );

    assert.isNotEmpty(
      submissionResponse.feeAmount._hex,
      "The value of the feeAmount field of the Submit Batch Response is not displayed."
    );
    let FeeAmount_Submit = submissionResponse.feeAmount._hex;
    assert.strictEqual(
      FeeAmount_Estimate,
      FeeAmount_Submit,
      "The Fee Amount value is not displayed correctly."
    );

    assert.isNotEmpty(
      submissionResponse.feeData,
      "The value of the feeData field of the Submit Batch Response is not displayed."
    );

    assert.isNull(
      submissionResponse.delayedUntil,
      "It is not expected behaviour of the delayedUntil in the Submit Batch Response."
    );
  });

  // SEND NATIVE TOKEN FOR MUMBAI
  it("Setup the SDK for Mumbai network and perform the send native asset action", async () => {
    // initialize the sdk
    sdkTestNet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.TestNets,
      networkName: NetworkNames.Mumbai,
    });

    assert.strictEqual(
      sdkTestNet.state.accountAddress,
      "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f",
      "The EOA Address is not displayed correctly."
    );

    // Compute the smart wallet address
    const smartWalletOutput = await sdkTestNet.computeContractAccount();
    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    assert.strictEqual(
      smartWalletAddress,
      "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
      "The smart address is not displayed correctly."
    );

    // Adding transaction to a batch
    const addTransactionToBatchOutput =
      await sdkTestNet.batchExecuteAccountTransaction({
        to: "0x0fd7508903376dab743a02743cadfdc2d92fceb8",
        value: "1000000000000",
      });
    console.log("Batch Reponse: ", addTransactionToBatchOutput);

    assert.strictEqual(
      addTransactionToBatchOutput.requests[0].to,
      "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
      "The To Address of the Batch Response is not displayed correctly."
    );

    assert.isNotEmpty(
      addTransactionToBatchOutput.requests[0].data,
      "The value of the data field of the Batch Reponse is not displayed."
    );

    assert.isNull(
      addTransactionToBatchOutput.estimation,
      "It is not expected behaviour of the estimation in the Batch Response."
    );

    // Estimating the batch
    const estimationResponse = await sdkTestNet.estimateGatewayBatch();
    console.log("Gas estimated at:", estimationResponse);

    assert.strictEqual(
      estimationResponse.requests[0].to,
      "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
      "The To Address of the Batch Response is not displayed correctly."
    );

    assert.isNotEmpty(
      estimationResponse.requests[0].data,
      "The value of the data field of the Estimation Response is not displayed."
    );

    assert.strictEqual(
      estimationResponse.estimation.feeTokenReceiver,
      "0xf593D35cA402c097e57813bCC6BCAb4b71A597cC",
      "The feeTokenReceiver Address of the Estimate Batch Response is not displayed correctly."
    );

    assert.isNumber(
      estimationResponse.estimation.estimatedGas,
      "The estimatedGas of the Estimate Batch Response is not displayed."
    );
    let EstimatedGas_Estimate = estimationResponse.estimation.estimatedGas;

    assert.isNotEmpty(
      estimationResponse.estimation.feeAmount,
      "The value of the feeAmount field of the Estimation Response is not displayed."
    );
    let FeeAmount_Estimate = estimationResponse.estimation.feeAmount._hex;

    assert.isNotEmpty(
      estimationResponse.estimation.estimatedGasPrice,
      "The value of the estimatedGasPrice field of the Estimation Response is not displayed."
    );
    let EstimatedGasPrice_Estimate =
      estimationResponse.estimation.estimatedGasPrice._hex;

    assert.isNotEmpty(
      estimationResponse.estimation.signature,
      "The value of the signature field of the Estimation Response is not displayed."
    );

    // Submitting the batch
    const submissionResponse = await sdkTestNet.submitGatewayBatch({
      guarded: false,
    });
    console.log("Status of the batch submition: ", submissionResponse);

    assert.isNull(
      submissionResponse.transaction,
      "It is not expected behaviour of the transaction in the Submit Batch Response."
    );

    assert.isNotEmpty(
      submissionResponse.hash,
      "The value of the hash field of the Submit Batch Response is not displayed."
    );

    assert.strictEqual(
      submissionResponse.state,
      "Queued",
      "The status of the Submit Batch Response is not displayed correctly."
    );

    assert.strictEqual(
      submissionResponse.account,
      "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
      "The account address of the Submit Batch Response is not displayed correctly."
    );

    assert.isNumber(
      submissionResponse.nonce,
      "The nonce number of the Submit Batch Response is not displayed."
    );

    assert.strictEqual(
      submissionResponse.to[0],
      "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
      "The To Address in the Submit Batch Response is not displayed correctly."
    );

    assert.isNotEmpty(
      submissionResponse.data[0],
      "The value of the data field of the Submit Batch Response is not displayed."
    );

    assert.isNotEmpty(
      submissionResponse.senderSignature,
      "The value of the senderSignature field of the Submit Batch Response is not displayed."
    );

    assert.isNumber(
      submissionResponse.estimatedGas,
      "The Estimated Gas number of the Submit Batch Response is not displayed."
    );
    let EstimatedGas_Submit = submissionResponse.estimatedGas;
    assert.strictEqual(
      EstimatedGas_Estimate,
      EstimatedGas_Submit,
      "The Estimated Gas value is not displayed correctly."
    );

    assert.isNotEmpty(
      submissionResponse.estimatedGasPrice._hex,
      "The value of the estimatedGasPrice field of the Submit Batch Response is not displayed."
    );
    let EstimatedGasPrice_Submit = submissionResponse.estimatedGasPrice._hex;
    assert.strictEqual(
      EstimatedGasPrice_Estimate,
      EstimatedGasPrice_Submit,
      "The Estimated Gas Price value is not displayed correctly."
    );

    assert.isNull(
      submissionResponse.feeToken,
      "It is not expected behaviour of the feeToken in the Submit Batch Response."
    );

    assert.isNotEmpty(
      submissionResponse.feeAmount._hex,
      "The value of the feeAmount field of the Submit Batch Response is not displayed."
    );
    let FeeAmount_Submit = submissionResponse.feeAmount._hex;
    assert.strictEqual(
      FeeAmount_Estimate,
      FeeAmount_Submit,
      "The Fee Amount value is not displayed correctly."
    );

    assert.isNotEmpty(
      submissionResponse.feeData,
      "The value of the feeData field of the Submit Batch Response is not displayed."
    );

    assert.isNull(
      submissionResponse.delayedUntil,
      "It is not expected behaviour of the delayedUntil in the Submit Batch Response."
    );
  });

  // SEND NATIVE TOKEN FOR NEONDEVNET
  it.skip("Setup the SDK for NeonDevnet network and perform the send native asset action", async () => {
    // initialize the sdk
    sdkTestNet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.TestNets,
      networkName: NetworkNames.NeonDevnet,
    });

    assert.strictEqual(
      sdkTestNet.state.accountAddress,
      "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f",
      "The EOA Address is not displayed correctly."
    );

    // Compute the smart wallet address
    const smartWalletOutput = await sdkTestNet.computeContractAccount();
    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    assert.strictEqual(
      smartWalletAddress,
      "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
      "The smart address is not displayed correctly."
    );

    // Adding transaction to a batch
    const addTransactionToBatchOutput =
      await sdkTestNet.batchExecuteAccountTransaction({
        to: "0x0fd7508903376dab743a02743cadfdc2d92fceb8",
        value: "1000000000000",
      });
    console.log("Batch Reponse: ", addTransactionToBatchOutput);

    assert.strictEqual(
      addTransactionToBatchOutput.requests[0].to,
      "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
      "The To Address of the Batch Response is not displayed correctly."
    );

    assert.isNotEmpty(
      addTransactionToBatchOutput.requests[0].data,
      "The value of the data field of the Batch Reponse is not displayed."
    );

    assert.isNull(
      addTransactionToBatchOutput.estimation,
      "It is not expected behaviour of the estimation in the Batch Response."
    );

    // Estimating the batch
    const estimationResponse = await sdkTestNet.estimateGatewayBatch();
    console.log("Gas estimated at:", estimationResponse);

    assert.strictEqual(
      estimationResponse.requests[0].to,
      "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
      "The To Address of the Batch Response is not displayed correctly."
    );

    assert.isNotEmpty(
      estimationResponse.requests[0].data,
      "The value of the data field of the Estimation Response is not displayed."
    );

    assert.strictEqual(
      estimationResponse.estimation.feeTokenReceiver,
      "0xf593D35cA402c097e57813bCC6BCAb4b71A597cC",
      "The feeTokenReceiver Address of the Estimate Batch Response is not displayed correctly."
    );

    assert.isNumber(
      estimationResponse.estimation.estimatedGas,
      "The estimatedGas of the Estimate Batch Response is not displayed."
    );
    let EstimatedGas_Estimate = estimationResponse.estimation.estimatedGas;

    assert.isNotEmpty(
      estimationResponse.estimation.feeAmount,
      "The value of the feeAmount field of the Estimation Response is not displayed."
    );
    let FeeAmount_Estimate = estimationResponse.estimation.feeAmount._hex;

    assert.isNotEmpty(
      estimationResponse.estimation.estimatedGasPrice,
      "The value of the estimatedGasPrice field of the Estimation Response is not displayed."
    );
    let EstimatedGasPrice_Estimate =
      estimationResponse.estimation.estimatedGasPrice._hex;

    assert.isNotEmpty(
      estimationResponse.estimation.signature,
      "The value of the signature field of the Estimation Response is not displayed."
    );

    // Submitting the batch
    const submissionResponse = await sdkTestNet.submitGatewayBatch({
      guarded: false,
    });
    console.log("Status of the batch submition: ", submissionResponse);

    assert.isNull(
      submissionResponse.transaction,
      "It is not expected behaviour of the transaction in the Submit Batch Response."
    );

    assert.isNotEmpty(
      submissionResponse.hash,
      "The value of the hash field of the Submit Batch Response is not displayed."
    );

    assert.strictEqual(
      submissionResponse.state,
      "Queued",
      "The status of the Submit Batch Response is not displayed correctly."
    );

    assert.strictEqual(
      submissionResponse.account,
      "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
      "The account address of the Submit Batch Response is not displayed correctly."
    );

    assert.isNumber(
      submissionResponse.nonce,
      "The nonce number of the Submit Batch Response is not displayed."
    );

    assert.strictEqual(
      submissionResponse.to[0],
      "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
      "The To Address in the Submit Batch Response is not displayed correctly."
    );

    assert.isNotEmpty(
      submissionResponse.data[0],
      "The value of the data field of the Submit Batch Response is not displayed."
    );

    assert.isNotEmpty(
      submissionResponse.senderSignature,
      "The value of the senderSignature field of the Submit Batch Response is not displayed."
    );

    assert.isNumber(
      submissionResponse.estimatedGas,
      "The Estimated Gas number of the Submit Batch Response is not displayed."
    );
    let EstimatedGas_Submit = submissionResponse.estimatedGas;
    assert.strictEqual(
      EstimatedGas_Estimate,
      EstimatedGas_Submit,
      "The Estimated Gas value is not displayed correctly."
    );

    assert.isNotEmpty(
      submissionResponse.estimatedGasPrice._hex,
      "The value of the estimatedGasPrice field of the Submit Batch Response is not displayed."
    );
    let EstimatedGasPrice_Submit = submissionResponse.estimatedGasPrice._hex;
    assert.strictEqual(
      EstimatedGasPrice_Estimate,
      EstimatedGasPrice_Submit,
      "The Estimated Gas Price value is not displayed correctly."
    );

    assert.isNull(
      submissionResponse.feeToken,
      "It is not expected behaviour of the feeToken in the Submit Batch Response."
    );

    assert.isNotEmpty(
      submissionResponse.feeAmount._hex,
      "The value of the feeAmount field of the Submit Batch Response is not displayed."
    );
    let FeeAmount_Submit = submissionResponse.feeAmount._hex;
    assert.strictEqual(
      FeeAmount_Estimate,
      FeeAmount_Submit,
      "The Fee Amount value is not displayed correctly."
    );

    assert.isNotEmpty(
      submissionResponse.feeData,
      "The value of the feeData field of the Submit Batch Response is not displayed."
    );

    assert.isNull(
      submissionResponse.delayedUntil,
      "It is not expected behaviour of the delayedUntil in the Submit Batch Response."
    );
  });

  // SEND NATIVE TOKEN FOR OPTIMISM
  it("Setup the SDK for Optimism network and perform the send native asset action", async () => {
    // initialize the sdk
    sdkTestNet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.TestNets,
      networkName: NetworkNames.Optimism,
    });

    assert.strictEqual(
      sdkTestNet.state.accountAddress,
      "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f",
      "The EOA Address is not displayed correctly."
    );

    // Compute the smart wallet address
    const smartWalletOutput = await sdkTestNet.computeContractAccount();
    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    assert.strictEqual(
      smartWalletAddress,
      "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
      "The smart address is not displayed correctly."
    );

    // Adding transaction to a batch
    const addTransactionToBatchOutput =
      await sdkTestNet.batchExecuteAccountTransaction({
        to: "0x0fd7508903376dab743a02743cadfdc2d92fceb8",
        value: "1000000000000",
      });
    console.log("Batch Reponse: ", addTransactionToBatchOutput);

    assert.strictEqual(
      addTransactionToBatchOutput.requests[0].to,
      "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
      "The To Address of the Batch Response is not displayed correctly."
    );

    assert.isNotEmpty(
      addTransactionToBatchOutput.requests[0].data,
      "The value of the data field of the Batch Reponse is not displayed."
    );

    assert.isNull(
      addTransactionToBatchOutput.estimation,
      "It is not expected behaviour of the estimation in the Batch Response."
    );

    // Estimating the batch
    const estimationResponse = await sdkTestNet.estimateGatewayBatch();
    console.log("Gas estimated at:", estimationResponse);

    assert.strictEqual(
      estimationResponse.requests[0].to,
      "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
      "The To Address of the Batch Response is not displayed correctly."
    );

    assert.isNotEmpty(
      estimationResponse.requests[0].data,
      "The value of the data field of the Estimation Response is not displayed."
    );

    assert.strictEqual(
      estimationResponse.estimation.feeTokenReceiver,
      "0xf593D35cA402c097e57813bCC6BCAb4b71A597cC",
      "The feeTokenReceiver Address of the Estimate Batch Response is not displayed correctly."
    );

    assert.isNumber(
      estimationResponse.estimation.estimatedGas,
      "The estimatedGas of the Estimate Batch Response is not displayed."
    );
    let EstimatedGas_Estimate = estimationResponse.estimation.estimatedGas;

    assert.isNotEmpty(
      estimationResponse.estimation.feeAmount,
      "The value of the feeAmount field of the Estimation Response is not displayed."
    );
    let FeeAmount_Estimate = estimationResponse.estimation.feeAmount._hex;

    assert.isNotEmpty(
      estimationResponse.estimation.estimatedGasPrice,
      "The value of the estimatedGasPrice field of the Estimation Response is not displayed."
    );
    let EstimatedGasPrice_Estimate =
      estimationResponse.estimation.estimatedGasPrice._hex;

    assert.isNotEmpty(
      estimationResponse.estimation.signature,
      "The value of the signature field of the Estimation Response is not displayed."
    );

    // Submitting the batch
    const submissionResponse = await sdkTestNet.submitGatewayBatch({
      guarded: false,
    });
    console.log("Status of the batch submition: ", submissionResponse);

    assert.isNull(
      submissionResponse.transaction,
      "It is not expected behaviour of the transaction in the Submit Batch Response."
    );

    assert.isNotEmpty(
      submissionResponse.hash,
      "The value of the hash field of the Submit Batch Response is not displayed."
    );

    assert.strictEqual(
      submissionResponse.state,
      "Queued",
      "The status of the Submit Batch Response is not displayed correctly."
    );

    assert.strictEqual(
      submissionResponse.account,
      "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
      "The account address of the Submit Batch Response is not displayed correctly."
    );

    assert.isNumber(
      submissionResponse.nonce,
      "The nonce number of the Submit Batch Response is not displayed."
    );

    assert.strictEqual(
      submissionResponse.to[0],
      "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
      "The To Address in the Submit Batch Response is not displayed correctly."
    );

    assert.isNotEmpty(
      submissionResponse.data[0],
      "The value of the data field of the Submit Batch Response is not displayed."
    );

    assert.isNotEmpty(
      submissionResponse.senderSignature,
      "The value of the senderSignature field of the Submit Batch Response is not displayed."
    );

    assert.isNumber(
      submissionResponse.estimatedGas,
      "The Estimated Gas number of the Submit Batch Response is not displayed."
    );
    let EstimatedGas_Submit = submissionResponse.estimatedGas;
    assert.strictEqual(
      EstimatedGas_Estimate,
      EstimatedGas_Submit,
      "The Estimated Gas value is not displayed correctly."
    );

    assert.isNotEmpty(
      submissionResponse.estimatedGasPrice._hex,
      "The value of the estimatedGasPrice field of the Submit Batch Response is not displayed."
    );
    let EstimatedGasPrice_Submit = submissionResponse.estimatedGasPrice._hex;
    assert.strictEqual(
      EstimatedGasPrice_Estimate,
      EstimatedGasPrice_Submit,
      "The Estimated Gas Price value is not displayed correctly."
    );

    assert.isNull(
      submissionResponse.feeToken,
      "It is not expected behaviour of the feeToken in the Submit Batch Response."
    );

    assert.isNotEmpty(
      submissionResponse.feeAmount._hex,
      "The value of the feeAmount field of the Submit Batch Response is not displayed."
    );
    let FeeAmount_Submit = submissionResponse.feeAmount._hex;
    assert.strictEqual(
      FeeAmount_Estimate,
      FeeAmount_Submit,
      "The Fee Amount value is not displayed correctly."
    );

    assert.isNotEmpty(
      submissionResponse.feeData,
      "The value of the feeData field of the Submit Batch Response is not displayed."
    );

    assert.isNull(
      submissionResponse.delayedUntil,
      "It is not expected behaviour of the delayedUntil in the Submit Batch Response."
    );
  });
});
