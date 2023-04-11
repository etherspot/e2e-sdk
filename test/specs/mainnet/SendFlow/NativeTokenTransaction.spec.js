import * as dotenv from "dotenv";
dotenv.config(); // init dotenv

import { expect } from "chai";
import { EnvNames, NetworkNames, Sdk } from "etherspot";

let sdkMainNet;
let smartWalletAddress;

describe("The SDK, when sending a native asset on the MainNet", () => {
  // SEND NATIVE TOKEN FOR ARBITRUM
  it("Setup the SDK for Arbitrum network and perform the send native asset action", async () => {
    // initialize the sdk
    sdkMainNet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.MainNets,
      networkName: NetworkNames.Arbitrum,
    });

    expect(sdkMainNet.state.accountAddress).to.equal(
      "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f"
    );

    // Compute the smart wallet address
    const smartWalletOutput = await sdkMainNet.computeContractAccount();
    console.log(smartWalletOutput);

    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    // Adding transaction to a batch
    const addTransactionToBatchOutput =
      await sdkMainNet.batchExecuteAccountTransaction({
        to: "0x0fd7508903376dab743a02743cadfdc2d92fceb8",
        value: "1000000000000",
      });
    console.log("Batch Reponse: ", addTransactionToBatchOutput);

    // Estimating the batch
    const estimationResponse = await sdkMainNet.estimateGatewayBatch();
    console.log("Gas estimated at:", estimationResponse);

    // Submitting the batch
    const submissionResponse = await sdkMainNet.submitGatewayBatch({
      guarded: true,
    });
    console.log("Status of the batch submition: ", submissionResponse);
  });

  // SEND NATIVE TOKEN FOR ARBITRUM NOVA
  it("Setup the SDK for ArbitrumNova network and perform the send native asset action", async () => {
    // initialize the sdk
    sdkMainNet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.MainNets,
      networkName: NetworkNames.ArbitrumNova,
    });

    expect(sdkMainNet.state.accountAddress).to.equal(
      "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f"
    );

    // Compute the smart wallet address
    const smartWalletOutput = await sdkMainNet.computeContractAccount();
    console.log(smartWalletOutput);

    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    // Adding transaction to a batch
    const addTransactionToBatchOutput =
      await sdkMainNet.batchExecuteAccountTransaction({
        to: "0x0fd7508903376dab743a02743cadfdc2d92fceb8",
        value: "1000000000000",
      });
    console.log("Batch Reponse: ", addTransactionToBatchOutput);

    // Estimating the batch
    const estimationResponse = await sdkMainNet.estimateGatewayBatch();
    console.log("Gas estimated at:", estimationResponse);

    // Submitting the batch
    const submissionResponse = await sdkMainNet.submitGatewayBatch({
      guarded: true,
    });
    console.log("Status of the batch submition: ", submissionResponse);
  });

  // SEND NATIVE TOKEN FOR AURORA
  it("Setup the SDK for Aurora network and perform the send native asset action", async () => {
    // initialize the sdk
    sdkMainNet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.MainNets,
      networkName: NetworkNames.Aurora,
    });

    expect(sdkMainNet.state.accountAddress).to.equal(
      "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f"
    );

    // Compute the smart wallet address
    const smartWalletOutput = await sdkMainNet.computeContractAccount();
    console.log(smartWalletOutput);

    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    // Adding transaction to a batch
    const addTransactionToBatchOutput =
      await sdkMainNet.batchExecuteAccountTransaction({
        to: "0x0fd7508903376dab743a02743cadfdc2d92fceb8",
        value: "1000000000000",
      });
    console.log("Batch Reponse: ", addTransactionToBatchOutput);

    // Estimating the batch
    const estimationResponse = await sdkMainNet.estimateGatewayBatch();
    console.log("Gas estimated at:", estimationResponse);

    // Submitting the batch
    const submissionResponse = await sdkMainNet.submitGatewayBatch({
      guarded: true,
    });
    console.log("Status of the batch submition: ", submissionResponse);
  });

  // SEND NATIVE TOKEN FOR AVALANCHE
  it("Setup the SDK for Avalanche network and perform the send native asset action", async () => {
    // initialize the sdk
    sdkMainNet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.MainNets,
      networkName: NetworkNames.Avalanche,
    });

    expect(sdkMainNet.state.accountAddress).to.equal(
      "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f"
    );

    // Compute the smart wallet address
    const smartWalletOutput = await sdkMainNet.computeContractAccount();
    console.log(smartWalletOutput);

    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    // Adding transaction to a batch
    const addTransactionToBatchOutput =
      await sdkMainNet.batchExecuteAccountTransaction({
        to: "0x0fd7508903376dab743a02743cadfdc2d92fceb8",
        value: "1000000000000",
      });
    console.log("Batch Reponse: ", addTransactionToBatchOutput);

    // Estimating the batch
    const estimationResponse = await sdkMainNet.estimateGatewayBatch();
    console.log("Gas estimated at:", estimationResponse);

    // Submitting the batch
    const submissionResponse = await sdkMainNet.submitGatewayBatch({
      guarded: true,
    });
    console.log("Status of the batch submition: ", submissionResponse);
  });

  // SEND NATIVE TOKEN FOR BSC
  it("Setup the SDK for Bsc network and perform the send native asset action", async () => {
    // initialize the sdk
    sdkMainNet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.MainNets,
      networkName: NetworkNames.Bsc,
    });

    expect(sdkMainNet.state.accountAddress).to.equal(
      "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f"
    );

    // Compute the smart wallet address
    const smartWalletOutput = await sdkMainNet.computeContractAccount();
    console.log(smartWalletOutput);

    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    // Adding transaction to a batch
    const addTransactionToBatchOutput =
      await sdkMainNet.batchExecuteAccountTransaction({
        to: "0x0fd7508903376dab743a02743cadfdc2d92fceb8",
        value: "1000000000000",
      });
    console.log("Batch Reponse: ", addTransactionToBatchOutput);

    // Estimating the batch
    const estimationResponse = await sdkMainNet.estimateGatewayBatch();
    console.log("Gas estimated at:", estimationResponse);

    // Submitting the batch
    const submissionResponse = await sdkMainNet.submitGatewayBatch({
      guarded: true,
    });
    console.log("Status of the batch submition: ", submissionResponse);
  });

  // SEND NATIVE TOKEN FOR CELO
  it("Setup the SDK for Celo network and perform the send native asset action", async () => {
    // initialize the sdk
    sdkMainNet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.MainNets,
      networkName: NetworkNames.Celo,
    });

    expect(sdkMainNet.state.accountAddress).to.equal(
      "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f"
    );

    // Compute the smart wallet address
    const smartWalletOutput = await sdkMainNet.computeContractAccount();
    console.log(smartWalletOutput);

    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    // Adding transaction to a batch
    const addTransactionToBatchOutput =
      await sdkMainNet.batchExecuteAccountTransaction({
        to: "0x0fd7508903376dab743a02743cadfdc2d92fceb8",
        value: "1000000000000",
      });
    console.log("Batch Reponse: ", addTransactionToBatchOutput);

    // Estimating the batch
    const estimationResponse = await sdkMainNet.estimateGatewayBatch();
    console.log("Gas estimated at:", estimationResponse);

    // Submitting the batch
    const submissionResponse = await sdkMainNet.submitGatewayBatch({
      guarded: true,
    });
    console.log("Status of the batch submition: ", submissionResponse);
  });

  // SEND NATIVE TOKEN FOR MAINNET
  it("Setup the SDK for Mainnet network and perform the send native asset action", async () => {
    // initialize the sdk
    sdkMainNet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.MainNets,
      networkName: NetworkNames.Mainnet,
    });

    expect(sdkMainNet.state.accountAddress).to.equal(
      "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f"
    );

    // Compute the smart wallet address
    const smartWalletOutput = await sdkMainNet.computeContractAccount();
    console.log(smartWalletOutput);

    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    // Adding transaction to a batch
    const addTransactionToBatchOutput =
      await sdkMainNet.batchExecuteAccountTransaction({
        to: "0x0fd7508903376dab743a02743cadfdc2d92fceb8",
        value: "1000000000000",
      });
    console.log("Batch Reponse: ", addTransactionToBatchOutput);

    // Estimating the batch
    const estimationResponse = await sdkMainNet.estimateGatewayBatch();
    console.log("Gas estimated at:", estimationResponse);

    // Submitting the batch
    const submissionResponse = await sdkMainNet.submitGatewayBatch({
      guarded: true,
    });
    console.log("Status of the batch submition: ", submissionResponse);
  });

  // SEND NATIVE TOKEN FOR FANTOM
  it("Setup the SDK for Fantom network and perform the send native asset action", async () => {
    // initialize the sdk
    sdkMainNet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.MainNets,
      networkName: NetworkNames.Fantom,
    });

    expect(sdkMainNet.state.accountAddress).to.equal(
      "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f"
    );

    // Compute the smart wallet address
    const smartWalletOutput = await sdkMainNet.computeContractAccount();
    console.log(smartWalletOutput);

    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    // Adding transaction to a batch
    const addTransactionToBatchOutput =
      await sdkMainNet.batchExecuteAccountTransaction({
        to: "0x0fd7508903376dab743a02743cadfdc2d92fceb8",
        value: "1000000000000",
      });
    console.log("Batch Reponse: ", addTransactionToBatchOutput);

    // Estimating the batch
    const estimationResponse = await sdkMainNet.estimateGatewayBatch();
    console.log("Gas estimated at:", estimationResponse);

    // Submitting the batch
    const submissionResponse = await sdkMainNet.submitGatewayBatch({
      guarded: true,
    });
    console.log("Status of the batch submition: ", submissionResponse);
  });

  // SEND NATIVE TOKEN FOR FUSE
  it("Setup the SDK for Fuse network and perform the send native asset action", async () => {
    // initialize the sdk
    sdkMainNet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.MainNets,
      networkName: NetworkNames.Fuse,
    });

    expect(sdkMainNet.state.accountAddress).to.equal(
      "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f"
    );

    // Compute the smart wallet address
    const smartWalletOutput = await sdkMainNet.computeContractAccount();
    console.log(smartWalletOutput);

    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    // Adding transaction to a batch
    const addTransactionToBatchOutput =
      await sdkMainNet.batchExecuteAccountTransaction({
        to: "0x0fd7508903376dab743a02743cadfdc2d92fceb8",
        value: "1000000000000",
      });
    console.log("Batch Reponse: ", addTransactionToBatchOutput);

    // Estimating the batch
    const estimationResponse = await sdkMainNet.estimateGatewayBatch();
    console.log("Gas estimated at:", estimationResponse);

    // Submitting the batch
    const submissionResponse = await sdkMainNet.submitGatewayBatch({
      guarded: true,
    });
    console.log("Status of the batch submition: ", submissionResponse);
  });

  // SEND NATIVE TOKEN FOR XDAI
  it.only("Setup the SDK for Xdai network and perform the send native asset action", async () => {
    // initialize the sdk
    sdkMainNet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.MainNets,
      networkName: NetworkNames.Xdai,
    });

    expect(sdkMainNet.state.accountAddress).to.equal(
      "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f"
    );

    // Compute the smart wallet address
    const smartWalletOutput = await sdkMainNet.computeContractAccount();
    console.log(smartWalletOutput);

    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    // Adding transaction to a batch
    const addTransactionToBatchOutput =
      await sdkMainNet.batchExecuteAccountTransaction({
        to: "0x0fd7508903376dab743a02743cadfdc2d92fceb8",
        value: "1000000000000",
      });
    console.log("Batch Reponse: ", addTransactionToBatchOutput);

    // Estimating the batch
    const estimationResponse = await sdkMainNet.estimateGatewayBatch();
    console.log("Gas estimated at:", estimationResponse);

    // Submitting the batch
    const submissionResponse = await sdkMainNet.submitGatewayBatch({
      guarded: false,
    });
    console.log("Status of the batch submition: ", submissionResponse);
  });

  // SEND NATIVE TOKEN FOR MOONBEAM
  it("Setup the SDK for Moonbeam network and perform the send native asset action", async () => {
    // initialize the sdk
    sdkMainNet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.MainNets,
      networkName: NetworkNames.Moonbeam,
    });

    expect(sdkMainNet.state.accountAddress).to.equal(
      "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f"
    );

    // Compute the smart wallet address
    const smartWalletOutput = await sdkMainNet.computeContractAccount();
    console.log(smartWalletOutput);

    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    // Adding transaction to a batch
    const addTransactionToBatchOutput =
      await sdkMainNet.batchExecuteAccountTransaction({
        to: "0x0fd7508903376dab743a02743cadfdc2d92fceb8",
        value: "1000000000000",
      });
    console.log("Batch Reponse: ", addTransactionToBatchOutput);

    // Estimating the batch
    const estimationResponse = await sdkMainNet.estimateGatewayBatch();
    console.log("Gas estimated at:", estimationResponse);

    // Submitting the batch
    const submissionResponse = await sdkMainNet.submitGatewayBatch({
      guarded: true,
    });
    console.log("Status of the batch submition: ", submissionResponse);
  });

  // SEND NATIVE TOKEN FOR MUMBAI
  it("Setup the SDK for Mumbai network and perform the send native asset action", async () => {
    // initialize the sdk
    sdkMainNet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.MainNets,
      networkName: NetworkNames.Mumbai,
    });

    expect(sdkMainNet.state.accountAddress).to.equal(
      "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f"
    );

    // Compute the smart wallet address
    const smartWalletOutput = await sdkMainNet.computeContractAccount();
    console.log(smartWalletOutput);

    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    // Adding transaction to a batch
    const addTransactionToBatchOutput =
      await sdkMainNet.batchExecuteAccountTransaction({
        to: "0x0fd7508903376dab743a02743cadfdc2d92fceb8",
        value: "1000000000000",
      });
    console.log("Batch Reponse: ", addTransactionToBatchOutput);

    // Estimating the batch
    const estimationResponse = await sdkMainNet.estimateGatewayBatch();
    console.log("Gas estimated at:", estimationResponse);

    // Submitting the batch
    const submissionResponse = await sdkMainNet.submitGatewayBatch({
      guarded: true,
    });
    console.log("Status of the batch submition: ", submissionResponse);
  });

  // SEND NATIVE TOKEN FOR NEONDEVNET
  it("Setup the SDK for NeonDevnet network and perform the send native asset action", async () => {
    // initialize the sdk
    sdkMainNet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.MainNets,
      networkName: NetworkNames.NeonDevnet,
    });

    expect(sdkMainNet.state.accountAddress).to.equal(
      "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f"
    );

    // Compute the smart wallet address
    const smartWalletOutput = await sdkMainNet.computeContractAccount();
    console.log(smartWalletOutput);

    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    // Adding transaction to a batch
    const addTransactionToBatchOutput =
      await sdkMainNet.batchExecuteAccountTransaction({
        to: "0x0fd7508903376dab743a02743cadfdc2d92fceb8",
        value: "1000000000000",
      });
    console.log("Batch Reponse: ", addTransactionToBatchOutput);

    // Estimating the batch
    const estimationResponse = await sdkMainNet.estimateGatewayBatch();
    console.log("Gas estimated at:", estimationResponse);

    // Submitting the batch
    const submissionResponse = await sdkMainNet.submitGatewayBatch({
      guarded: true,
    });
    console.log("Status of the batch submition: ", submissionResponse);
  });

  // SEND NATIVE TOKEN FOR OPTIMISM
  it("Setup the SDK for Optimism network and perform the send native asset action", async () => {
    // initialize the sdk
    sdkMainNet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.MainNets,
      networkName: NetworkNames.Optimism,
    });

    expect(sdkMainNet.state.accountAddress).to.equal(
      "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f"
    );

    // Compute the smart wallet address
    const smartWalletOutput = await sdkMainNet.computeContractAccount();
    console.log(smartWalletOutput);

    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    // Adding transaction to a batch
    const addTransactionToBatchOutput =
      await sdkMainNet.batchExecuteAccountTransaction({
        to: "0x0fd7508903376dab743a02743cadfdc2d92fceb8",
        value: "1000000000000",
      });
    console.log("Batch Reponse: ", addTransactionToBatchOutput);

    // Estimating the batch
    const estimationResponse = await sdkMainNet.estimateGatewayBatch();
    console.log("Gas estimated at:", estimationResponse);

    // Submitting the batch
    const submissionResponse = await sdkMainNet.submitGatewayBatch({
      guarded: true,
    });
    console.log("Status of the batch submition: ", submissionResponse);
  });
});
