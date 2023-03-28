import * as dotenv from "dotenv";
dotenv.config(); // init dotenv

import { expect } from "chai";
import { EnvNames, NetworkNames, Sdk } from "etherspot";

let sdkTestnet;
let smartWalletAddress;

describe("The SDK, when sending a native asset on the TestNet", () => {
  // SEND NATIVE TOKEN FOR ARBITRUM
  it("Setup the SDK for Arbitrum network and perform the send native asset action", async () => {
    // initialize the sdk
    sdkTestnet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.TestNets,
      networkName: NetworkNames.Arbitrum,
    });

    expect(sdkTestnet.state.accountAddress).to.equal(
      "0xd55Ccf51D4F478231Fdb34C1F3EC675FC4318851"
    );

    // Compute the smart wallet address
    const smartWalletOutput = await sdkTestnet.computeContractAccount();
    console.log(smartWalletOutput);

    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    // Adding transaction to a batch
    const addTransactionToBatchOutput =
      await sdkTestnet.batchExecuteAccountTransaction({
        to: "0x0fd7508903376dab743a02743cadfdc2d92fceb8",
        value: "1000000000000",
      });
    console.log("Batch Reponse: ", addTransactionToBatchOutput);

    // Estimating the batch
    const estimationResponse = await sdkTestnet.estimateGatewayBatch();
    console.log("Gas estimated at:", estimationResponse);

    // Submitting the batch
    const submissionResponse = await sdkTestnet.submitGatewayBatch({
      guarded: true,
    });
    console.log("Status of the batch submition: ", submissionResponse);
  });

  // SEND NATIVE TOKEN FOR ARBITRUM NOVA
  it("Setup the SDK for ArbitrumNova network and perform the send native asset action", async () => {
    // initialize the sdk
    sdkTestnet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.TestNets,
      networkName: NetworkNames.ArbitrumNova,
    });

    expect(sdkTestnet.state.accountAddress).to.equal(
      "0xd55Ccf51D4F478231Fdb34C1F3EC675FC4318851"
    );

    // Compute the smart wallet address
    const smartWalletOutput = await sdkTestnet.computeContractAccount();
    console.log(smartWalletOutput);

    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    // Adding transaction to a batch
    const addTransactionToBatchOutput =
      await sdkTestnet.batchExecuteAccountTransaction({
        to: "0x0fd7508903376dab743a02743cadfdc2d92fceb8",
        value: "1000000000000",
      });
    console.log("Batch Reponse: ", addTransactionToBatchOutput);

    // Estimating the batch
    const estimationResponse = await sdkTestnet.estimateGatewayBatch();
    console.log("Gas estimated at:", estimationResponse);

    // Submitting the batch
    const submissionResponse = await sdkTestnet.submitGatewayBatch({
      guarded: true,
    });
    console.log("Status of the batch submition: ", submissionResponse);
  });

  // SEND NATIVE TOKEN FOR AURORA
  it("Setup the SDK for Aurora network and perform the send native asset action", async () => {
    // initialize the sdk
    sdkTestnet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.TestNets,
      networkName: NetworkNames.Aurora,
    });

    expect(sdkTestnet.state.accountAddress).to.equal(
      "0xd55Ccf51D4F478231Fdb34C1F3EC675FC4318851"
    );

    // Compute the smart wallet address
    const smartWalletOutput = await sdkTestnet.computeContractAccount();
    console.log(smartWalletOutput);

    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    // Adding transaction to a batch
    const addTransactionToBatchOutput =
      await sdkTestnet.batchExecuteAccountTransaction({
        to: "0x0fd7508903376dab743a02743cadfdc2d92fceb8",
        value: "1000000000000",
      });
    console.log("Batch Reponse: ", addTransactionToBatchOutput);

    // Estimating the batch
    const estimationResponse = await sdkTestnet.estimateGatewayBatch();
    console.log("Gas estimated at:", estimationResponse);

    // Submitting the batch
    const submissionResponse = await sdkTestnet.submitGatewayBatch({
      guarded: true,
    });
    console.log("Status of the batch submition: ", submissionResponse);
  });

  // SEND NATIVE TOKEN FOR AVALANCHE
  it("Setup the SDK for Avalanche network and perform the send native asset action", async () => {
    // initialize the sdk
    sdkTestnet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.TestNets,
      networkName: NetworkNames.Avalanche,
    });

    expect(sdkTestnet.state.accountAddress).to.equal(
      "0xd55Ccf51D4F478231Fdb34C1F3EC675FC4318851"
    );

    // Compute the smart wallet address
    const smartWalletOutput = await sdkTestnet.computeContractAccount();
    console.log(smartWalletOutput);

    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    // Adding transaction to a batch
    const addTransactionToBatchOutput =
      await sdkTestnet.batchExecuteAccountTransaction({
        to: "0x0fd7508903376dab743a02743cadfdc2d92fceb8",
        value: "1000000000000",
      });
    console.log("Batch Reponse: ", addTransactionToBatchOutput);

    // Estimating the batch
    const estimationResponse = await sdkTestnet.estimateGatewayBatch();
    console.log("Gas estimated at:", estimationResponse);

    // Submitting the batch
    const submissionResponse = await sdkTestnet.submitGatewayBatch({
      guarded: true,
    });
    console.log("Status of the batch submition: ", submissionResponse);
  });

  // SEND NATIVE TOKEN FOR BSC
  it("Setup the SDK for Bsc network and perform the send native asset action", async () => {
    // initialize the sdk
    sdkTestnet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.TestNets,
      networkName: NetworkNames.Bsc,
    });

    expect(sdkTestnet.state.accountAddress).to.equal(
      "0xd55Ccf51D4F478231Fdb34C1F3EC675FC4318851"
    );

    // Compute the smart wallet address
    const smartWalletOutput = await sdkTestnet.computeContractAccount();
    console.log(smartWalletOutput);

    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    // Adding transaction to a batch
    const addTransactionToBatchOutput =
      await sdkTestnet.batchExecuteAccountTransaction({
        to: "0x0fd7508903376dab743a02743cadfdc2d92fceb8",
        value: "1000000000000",
      });
    console.log("Batch Reponse: ", addTransactionToBatchOutput);

    // Estimating the batch
    const estimationResponse = await sdkTestnet.estimateGatewayBatch();
    console.log("Gas estimated at:", estimationResponse);

    // Submitting the batch
    const submissionResponse = await sdkTestnet.submitGatewayBatch({
      guarded: true,
    });
    console.log("Status of the batch submition: ", submissionResponse);
  });

  // SEND NATIVE TOKEN FOR CELO
  it("Setup the SDK for Celo network and perform the send native asset action", async () => {
    // initialize the sdk
    sdkTestnet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.TestNets,
      networkName: NetworkNames.Celo,
    });

    expect(sdkTestnet.state.accountAddress).to.equal(
      "0xd55Ccf51D4F478231Fdb34C1F3EC675FC4318851"
    );

    // Compute the smart wallet address
    const smartWalletOutput = await sdkTestnet.computeContractAccount();
    console.log(smartWalletOutput);

    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    // Adding transaction to a batch
    const addTransactionToBatchOutput =
      await sdkTestnet.batchExecuteAccountTransaction({
        to: "0x0fd7508903376dab743a02743cadfdc2d92fceb8",
        value: "1000000000000",
      });
    console.log("Batch Reponse: ", addTransactionToBatchOutput);

    // Estimating the batch
    const estimationResponse = await sdkTestnet.estimateGatewayBatch();
    console.log("Gas estimated at:", estimationResponse);

    // Submitting the batch
    const submissionResponse = await sdkTestnet.submitGatewayBatch({
      guarded: true,
    });
    console.log("Status of the batch submition: ", submissionResponse);
  });

  // SEND NATIVE TOKEN FOR TestNET
  it("Setup the SDK for Testnet network and perform the send native asset action", async () => {
    // initialize the sdk
    sdkTestnet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.TestNets,
      networkName: NetworkNames.Testnet,
    });

    expect(sdkTestnet.state.accountAddress).to.equal(
      "0xd55Ccf51D4F478231Fdb34C1F3EC675FC4318851"
    );

    // Compute the smart wallet address
    const smartWalletOutput = await sdkTestnet.computeContractAccount();
    console.log(smartWalletOutput);

    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    // Adding transaction to a batch
    const addTransactionToBatchOutput =
      await sdkTestnet.batchExecuteAccountTransaction({
        to: "0x0fd7508903376dab743a02743cadfdc2d92fceb8",
        value: "1000000000000",
      });
    console.log("Batch Reponse: ", addTransactionToBatchOutput);

    // Estimating the batch
    const estimationResponse = await sdkTestnet.estimateGatewayBatch();
    console.log("Gas estimated at:", estimationResponse);

    // Submitting the batch
    const submissionResponse = await sdkTestnet.submitGatewayBatch({
      guarded: true,
    });
    console.log("Status of the batch submition: ", submissionResponse);
  });

  // SEND NATIVE TOKEN FOR FANTOM
  it("Setup the SDK for Fantom network and perform the send native asset action", async () => {
    // initialize the sdk
    sdkTestnet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.TestNets,
      networkName: NetworkNames.Fantom,
    });

    expect(sdkTestnet.state.accountAddress).to.equal(
      "0xd55Ccf51D4F478231Fdb34C1F3EC675FC4318851"
    );

    // Compute the smart wallet address
    const smartWalletOutput = await sdkTestnet.computeContractAccount();
    console.log(smartWalletOutput);

    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    // Adding transaction to a batch
    const addTransactionToBatchOutput =
      await sdkTestnet.batchExecuteAccountTransaction({
        to: "0x0fd7508903376dab743a02743cadfdc2d92fceb8",
        value: "1000000000000",
      });
    console.log("Batch Reponse: ", addTransactionToBatchOutput);

    // Estimating the batch
    const estimationResponse = await sdkTestnet.estimateGatewayBatch();
    console.log("Gas estimated at:", estimationResponse);

    // Submitting the batch
    const submissionResponse = await sdkTestnet.submitGatewayBatch({
      guarded: true,
    });
    console.log("Status of the batch submition: ", submissionResponse);
  });

  // SEND NATIVE TOKEN FOR FUSE
  it("Setup the SDK for Fuse network and perform the send native asset action", async () => {
    // initialize the sdk
    sdkTestnet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.TestNets,
      networkName: NetworkNames.Fuse,
    });

    expect(sdkTestnet.state.accountAddress).to.equal(
      "0xd55Ccf51D4F478231Fdb34C1F3EC675FC4318851"
    );

    // Compute the smart wallet address
    const smartWalletOutput = await sdkTestnet.computeContractAccount();
    console.log(smartWalletOutput);

    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    // Adding transaction to a batch
    const addTransactionToBatchOutput =
      await sdkTestnet.batchExecuteAccountTransaction({
        to: "0x0fd7508903376dab743a02743cadfdc2d92fceb8",
        value: "1000000000000",
      });
    console.log("Batch Reponse: ", addTransactionToBatchOutput);

    // Estimating the batch
    const estimationResponse = await sdkTestnet.estimateGatewayBatch();
    console.log("Gas estimated at:", estimationResponse);

    // Submitting the batch
    const submissionResponse = await sdkTestnet.submitGatewayBatch({
      guarded: true,
    });
    console.log("Status of the batch submition: ", submissionResponse);
  });

  // SEND NATIVE TOKEN FOR XDAI
  it("Setup the SDK for Xdai network and perform the send native asset action", async () => {
    // initialize the sdk
    sdkTestnet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.TestNets,
      networkName: NetworkNames.Xdai,
    });

    expect(sdkTestnet.state.accountAddress).to.equal(
      "0xd55Ccf51D4F478231Fdb34C1F3EC675FC4318851"
    );

    // Compute the smart wallet address
    const smartWalletOutput = await sdkTestnet.computeContractAccount();
    console.log(smartWalletOutput);

    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    // Adding transaction to a batch
    const addTransactionToBatchOutput =
      await sdkTestnet.batchExecuteAccountTransaction({
        to: "0x0fd7508903376dab743a02743cadfdc2d92fceb8",
        value: "1000000000000",
      });
    console.log("Batch Reponse: ", addTransactionToBatchOutput);

    // Estimating the batch
    const estimationResponse = await sdkTestnet.estimateGatewayBatch();
    console.log("Gas estimated at:", estimationResponse);

    // Submitting the batch
    const submissionResponse = await sdkTestnet.submitGatewayBatch({
      guarded: true,
    });
    console.log("Status of the batch submition: ", submissionResponse);
  });

  // SEND NATIVE TOKEN FOR MOONBEAM
  it("Setup the SDK for Moonbeam network and perform the send native asset action", async () => {
    // initialize the sdk
    sdkTestnet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.TestNets,
      networkName: NetworkNames.Moonbeam,
    });

    expect(sdkTestnet.state.accountAddress).to.equal(
      "0xd55Ccf51D4F478231Fdb34C1F3EC675FC4318851"
    );

    // Compute the smart wallet address
    const smartWalletOutput = await sdkTestnet.computeContractAccount();
    console.log(smartWalletOutput);

    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    // Adding transaction to a batch
    const addTransactionToBatchOutput =
      await sdkTestnet.batchExecuteAccountTransaction({
        to: "0x0fd7508903376dab743a02743cadfdc2d92fceb8",
        value: "1000000000000",
      });
    console.log("Batch Reponse: ", addTransactionToBatchOutput);

    // Estimating the batch
    const estimationResponse = await sdkTestnet.estimateGatewayBatch();
    console.log("Gas estimated at:", estimationResponse);

    // Submitting the batch
    const submissionResponse = await sdkTestnet.submitGatewayBatch({
      guarded: true,
    });
    console.log("Status of the batch submition: ", submissionResponse);
  });

  // SEND NATIVE TOKEN FOR MUMBAI
  it.only("Setup the SDK for Mumbai network and perform the send native asset action", async () => {
    // initialize the sdk
    sdkTestnet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.TestNets,
      networkName: NetworkNames.Mumbai,
    });

    expect(sdkTestnet.state.accountAddress).to.equal(
      "0xd55Ccf51D4F478231Fdb34C1F3EC675FC4318851"
    );

    // Compute the smart wallet address
    const smartWalletOutput = await sdkTestnet.computeContractAccount();
    console.log(smartWalletOutput);

    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    // Adding transaction to a batch
    const addTransactionToBatchOutput =
      await sdkTestnet.batchExecuteAccountTransaction({
        to: "0x0fd7508903376dab743a02743cadfdc2d92fceb8",
        value: "1000000000000",
      });
    console.log("Batch Reponse: ", addTransactionToBatchOutput);

    // Estimating the batch
    const estimationResponse = await sdkTestnet.estimateGatewayBatch();
    console.log("Gas estimated at:", estimationResponse);

    // Submitting the batch
    const submissionResponse = await sdkTestnet.submitGatewayBatch({
      guarded: true,
    });
    console.log("Status of the batch submition: ", submissionResponse);
  });

  // SEND NATIVE TOKEN FOR NEONDEVNET
  it("Setup the SDK for NeonDevnet network and perform the send native asset action", async () => {
    // initialize the sdk
    sdkTestnet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.TestNets,
      networkName: NetworkNames.NeonDevnet,
    });

    expect(sdkTestnet.state.accountAddress).to.equal(
      "0xd55Ccf51D4F478231Fdb34C1F3EC675FC4318851"
    );

    // Compute the smart wallet address
    const smartWalletOutput = await sdkTestnet.computeContractAccount();
    console.log(smartWalletOutput);

    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    // Adding transaction to a batch
    const addTransactionToBatchOutput =
      await sdkTestnet.batchExecuteAccountTransaction({
        to: "0x0fd7508903376dab743a02743cadfdc2d92fceb8",
        value: "1000000000000",
      });
    console.log("Batch Reponse: ", addTransactionToBatchOutput);

    // Estimating the batch
    const estimationResponse = await sdkTestnet.estimateGatewayBatch();
    console.log("Gas estimated at:", estimationResponse);

    // Submitting the batch
    const submissionResponse = await sdkTestnet.submitGatewayBatch({
      guarded: true,
    });
    console.log("Status of the batch submition: ", submissionResponse);
  });

  // SEND NATIVE TOKEN FOR OPTIMISM
  it("Setup the SDK for Optimism network and perform the send native asset action", async () => {
    // initialize the sdk
    sdkTestnet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.TestNets,
      networkName: NetworkNames.Optimism,
    });

    expect(sdkTestnet.state.accountAddress).to.equal(
      "0xd55Ccf51D4F478231Fdb34C1F3EC675FC4318851"
    );

    // Compute the smart wallet address
    const smartWalletOutput = await sdkTestnet.computeContractAccount();
    console.log(smartWalletOutput);

    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    // Adding transaction to a batch
    const addTransactionToBatchOutput =
      await sdkTestnet.batchExecuteAccountTransaction({
        to: "0x0fd7508903376dab743a02743cadfdc2d92fceb8",
        value: "1000000000000",
      });
    console.log("Batch Reponse: ", addTransactionToBatchOutput);

    // Estimating the batch
    const estimationResponse = await sdkTestnet.estimateGatewayBatch();
    console.log("Gas estimated at:", estimationResponse);

    // Submitting the batch
    const submissionResponse = await sdkTestnet.submitGatewayBatch({
      guarded: true,
    });
    console.log("Status of the batch submition: ", submissionResponse);
  });
});
