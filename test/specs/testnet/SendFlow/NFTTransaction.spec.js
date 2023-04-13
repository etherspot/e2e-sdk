import * as dotenv from "dotenv";
dotenv.config();

import { EnvNames, NetworkNames, Sdk } from "etherspot";
import abi from "../../../data/NFTabi.json" assert { type: "json" };
import { ethers } from "ethers";

let sdkTestNet;
let smartWalletAddress;

// Define NFT details
const contract = new ethers.utils.Interface(abi.abi);
const from = "0x666E17ad27fB620D7519477f3b33d809775d65Fe"; // from_address
const to = "0x49e2a5d77fa210403864f74e6556f17a8fcf70b3"; // to_address
const tokenId = "2357194"; // NFTtokenId that needs to be sent
const encodedData = contract.encodeFunctionData("transferFrom", [
  from,
  to,
  tokenId,
]);

describe("The SDK, when sending a NFT Transaction on the MainNet", () => {
  // SEND NFT ON ARBITRUM NETWORK
  it("Setup the SDK for Arbitrum network and perform the send NFT Transaction action", async () => {
    // Initialize the SDK and define network
    sdkTestNet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.TestNets,
      networkName: NetworkNames.Arbitrum,
    });

    // Compute the smart wallet address
    const smartWalletOutput = await sdkMainNet.computeContractAccount();
    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    expect(smartWalletAddress).to.equal(
      "0x666E17ad27fB620D7519477f3b33d809775d65Fe"
    );

    // Adding transaction details to a batch
    const response = await sdkTestNet.batchExecuteAccountTransaction({
      to: "0x22c1f6050e56d2876009903609a2cc3fef83b415", // contract_address of the NFT
      data: encodedData,
    });
    console.log("Batch Reponse: ", response);

    // Estimating the batch
    const estimationResponse = await sdkTestNet.estimateGatewayBatch();
    console.log("Gas estimated at:", estimationResponse);

    // Submitting the batch
    const submissionResponse = await sdkTestNet.submitGatewayBatch({
      guarded: false,
    });
    console.log("Status of the batch submition: ", submissionResponse);
  });

  // SEND NFT ON ARBITRUMNOVA NETWORK
  it("Setup the SDK for ArbitrumNova network and perform the send NFT Transaction action", async () => {
    // Initialize the SDK and define network
    sdkTestNet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.TestNets,
      networkName: NetworkNames.ArbitrumNova,
    });

    // Compute the smart wallet address
    const smartWalletOutput = await sdkMainNet.computeContractAccount();
    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    expect(smartWalletAddress).to.equal(
      "0x666E17ad27fB620D7519477f3b33d809775d65Fe"
    );

    // Adding transaction details to a batch
    const response = await sdkTestNet.batchExecuteAccountTransaction({
      to: "0x22c1f6050e56d2876009903609a2cc3fef83b415", // contract_address of the NFT
      data: encodedData,
    });
    console.log("Batch Reponse: ", response);

    // Estimating the batch
    const estimationResponse = await sdkTestNet.estimateGatewayBatch();
    console.log("Gas estimated at:", estimationResponse);

    // Submitting the batch
    const submissionResponse = await sdkTestNet.submitGatewayBatch({
      guarded: false,
    });
    console.log("Status of the batch submition: ", submissionResponse);
  });

  // SEND NFT ON AURORA NETWORK
  it("Setup the SDK for Aurora network and perform the send NFT Transaction action", async () => {
    // Initialize the SDK and define network
    sdkTestNet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.TestNets,
      networkName: NetworkNames.Aurora,
    });

    // Compute the smart wallet address
    const smartWalletOutput = await sdkMainNet.computeContractAccount();
    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    expect(smartWalletAddress).to.equal(
      "0x666E17ad27fB620D7519477f3b33d809775d65Fe"
    );

    // Adding transaction details to a batch
    const response = await sdkTestNet.batchExecuteAccountTransaction({
      to: "0x22c1f6050e56d2876009903609a2cc3fef83b415", // contract_address of the NFT
      data: encodedData,
    });
    console.log("Batch Reponse: ", response);

    // Estimating the batch
    const estimationResponse = await sdkTestNet.estimateGatewayBatch();
    console.log("Gas estimated at:", estimationResponse);

    // Submitting the batch
    const submissionResponse = await sdkTestNet.submitGatewayBatch({
      guarded: false,
    });
    console.log("Status of the batch submition: ", submissionResponse);
  });

  // SEND NFT ON AVALANCHE NETWORK
  it("Setup the SDK for Avalanche network and perform the send NFT Transaction action", async () => {
    // Initialize the SDK and define network
    sdkTestNet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.TestNets,
      networkName: NetworkNames.Avalanche,
    });

    // Compute the smart wallet address
    const smartWalletOutput = await sdkMainNet.computeContractAccount();
    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    expect(smartWalletAddress).to.equal(
      "0x666E17ad27fB620D7519477f3b33d809775d65Fe"
    );

    // Adding transaction details to a batch
    const response = await sdkTestNet.batchExecuteAccountTransaction({
      to: "0x22c1f6050e56d2876009903609a2cc3fef83b415", // contract_address of the NFT
      data: encodedData,
    });
    console.log("Batch Reponse: ", response);

    // Estimating the batch
    const estimationResponse = await sdkTestNet.estimateGatewayBatch();
    console.log("Gas estimated at:", estimationResponse);

    // Submitting the batch
    const submissionResponse = await sdkTestNet.submitGatewayBatch({
      guarded: false,
    });
    console.log("Status of the batch submition: ", submissionResponse);
  });

  // SEND NFT ON BSC NETWORK
  it("Setup the SDK for Bsc network and perform the send NFT Transaction action", async () => {
    // Initialize the SDK and define network
    sdkTestNet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.TestNets,
      networkName: NetworkNames.Bsc,
    });

    // Compute the smart wallet address
    const smartWalletOutput = await sdkMainNet.computeContractAccount();
    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    expect(smartWalletAddress).to.equal(
      "0x666E17ad27fB620D7519477f3b33d809775d65Fe"
    );

    // Adding transaction details to a batch
    const response = await sdkTestNet.batchExecuteAccountTransaction({
      to: "0x22c1f6050e56d2876009903609a2cc3fef83b415", // contract_address of the NFT
      data: encodedData,
    });
    console.log("Batch Reponse: ", response);

    // Estimating the batch
    const estimationResponse = await sdkTestNet.estimateGatewayBatch();
    console.log("Gas estimated at:", estimationResponse);

    // Submitting the batch
    const submissionResponse = await sdkTestNet.submitGatewayBatch({
      guarded: false,
    });
    console.log("Status of the batch submition: ", submissionResponse);
  });

  // SEND NFT ON CELO NETWORK
  it("Setup the SDK for Celo network and perform the send NFT Transaction action", async () => {
    // Initialize the SDK and define network
    sdkTestNet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.TestNets,
      networkName: NetworkNames.Celo,
    });

    // Compute the smart wallet address
    const smartWalletOutput = await sdkMainNet.computeContractAccount();
    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    expect(smartWalletAddress).to.equal(
      "0x666E17ad27fB620D7519477f3b33d809775d65Fe"
    );

    // Adding transaction details to a batch
    const response = await sdkTestNet.batchExecuteAccountTransaction({
      to: "0x22c1f6050e56d2876009903609a2cc3fef83b415", // contract_address of the NFT
      data: encodedData,
    });
    console.log("Batch Reponse: ", response);

    // Estimating the batch
    const estimationResponse = await sdkTestNet.estimateGatewayBatch();
    console.log("Gas estimated at:", estimationResponse);

    // Submitting the batch
    const submissionResponse = await sdkTestNet.submitGatewayBatch({
      guarded: false,
    });
    console.log("Status of the batch submition: ", submissionResponse);
  });

  // SEND NFT ON MAINNET NETWORK
  it("Setup the SDK for Mainnet network and perform the send NFT Transaction action", async () => {
    // Initialize the SDK and define network
    sdkTestNet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.TestNets,
      networkName: NetworkNames.Mainnet,
    });

    // Compute the smart wallet address
    const smartWalletOutput = await sdkMainNet.computeContractAccount();
    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    expect(smartWalletAddress).to.equal(
      "0x666E17ad27fB620D7519477f3b33d809775d65Fe"
    );

    // Adding transaction details to a batch
    const response = await sdkTestNet.batchExecuteAccountTransaction({
      to: "0x22c1f6050e56d2876009903609a2cc3fef83b415", // contract_address of the NFT
      data: encodedData,
    });
    console.log("Batch Reponse: ", response);

    // Estimating the batch
    const estimationResponse = await sdkTestNet.estimateGatewayBatch();
    console.log("Gas estimated at:", estimationResponse);

    // Submitting the batch
    const submissionResponse = await sdkTestNet.submitGatewayBatch({
      guarded: false,
    });
    console.log("Status of the batch submition: ", submissionResponse);
  });

  // SEND NFT ON FANTOM NETWORK
  it("Setup the SDK for Fantom network and perform the send NFT Transaction action", async () => {
    // Initialize the SDK and define network
    sdkTestNet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.TestNets,
      networkName: NetworkNames.Fantom,
    });

    // Compute the smart wallet address
    const smartWalletOutput = await sdkMainNet.computeContractAccount();
    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    expect(smartWalletAddress).to.equal(
      "0x666E17ad27fB620D7519477f3b33d809775d65Fe"
    );

    // Adding transaction details to a batch
    const response = await sdkTestNet.batchExecuteAccountTransaction({
      to: "0x22c1f6050e56d2876009903609a2cc3fef83b415", // contract_address of the NFT
      data: encodedData,
    });
    console.log("Batch Reponse: ", response);

    // Estimating the batch
    const estimationResponse = await sdkTestNet.estimateGatewayBatch();
    console.log("Gas estimated at:", estimationResponse);

    // Submitting the batch
    const submissionResponse = await sdkTestNet.submitGatewayBatch({
      guarded: false,
    });
    console.log("Status of the batch submition: ", submissionResponse);
  });

  // SEND NFT ON FUSE NETWORK
  it("Setup the SDK for Fuse network and perform the send NFT Transaction action", async () => {
    // Initialize the SDK and define network
    sdkTestNet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.TestNets,
      networkName: NetworkNames.Fuse,
    });

    // Compute the smart wallet address
    const smartWalletOutput = await sdkMainNet.computeContractAccount();
    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    expect(smartWalletAddress).to.equal(
      "0x666E17ad27fB620D7519477f3b33d809775d65Fe"
    );

    // Adding transaction details to a batch
    const response = await sdkTestNet.batchExecuteAccountTransaction({
      to: "0x22c1f6050e56d2876009903609a2cc3fef83b415", // contract_address of the NFT
      data: encodedData,
    });
    console.log("Batch Reponse: ", response);

    // Estimating the batch
    const estimationResponse = await sdkTestNet.estimateGatewayBatch();
    console.log("Gas estimated at:", estimationResponse);

    // Submitting the batch
    const submissionResponse = await sdkTestNet.submitGatewayBatch({
      guarded: false,
    });
    console.log("Status of the batch submition: ", submissionResponse);
  });

  // SEND NFT ON XDAI NETWORK
  it.only("Setup the SDK for xDai network and perform the send NFT Transaction action", async () => {
    // Initialize the SDK and define network
    sdkTestNet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.TestNets,
      networkName: NetworkNames.Xdai,
    });

    // Compute the smart wallet address
    const smartWalletOutput = await sdkMainNet.computeContractAccount();
    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    expect(smartWalletAddress).to.equal(
      "0x666E17ad27fB620D7519477f3b33d809775d65Fe"
    );

    // Adding transaction details to a batch
    const response = await sdkTestNet.batchExecuteAccountTransaction({
      to: "0x22c1f6050e56d2876009903609a2cc3fef83b415", // contract_address of the NFT
      data: encodedData,
    });
    console.log("Batch Reponse: ", response);

    // Estimating the batch
    const estimationResponse = await sdkTestNet.estimateGatewayBatch();
    console.log("Gas estimated at:", estimationResponse);

    // Submitting the batch
    const submissionResponse = await sdkTestNet.submitGatewayBatch({
      guarded: false,
    });
    console.log("Status of the batch submition: ", submissionResponse);
  });

  // SEND NFT ON MOONBEAM NETWORK
  it("Setup the SDK for Moonbeam network and perform the send NFT Transaction action", async () => {
    // Initialize the SDK and define network
    sdkTestNet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.TestNets,
      networkName: NetworkNames.Moonbeam,
    });

    // Compute the smart wallet address
    const smartWalletOutput = await sdkMainNet.computeContractAccount();
    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    expect(smartWalletAddress).to.equal(
      "0x666E17ad27fB620D7519477f3b33d809775d65Fe"
    );

    // Adding transaction details to a batch
    const response = await sdkTestNet.batchExecuteAccountTransaction({
      to: "0x22c1f6050e56d2876009903609a2cc3fef83b415", // contract_address of the NFT
      data: encodedData,
    });
    console.log("Batch Reponse: ", response);

    // Estimating the batch
    const estimationResponse = await sdkTestNet.estimateGatewayBatch();
    console.log("Gas estimated at:", estimationResponse);

    // Submitting the batch
    const submissionResponse = await sdkTestNet.submitGatewayBatch({
      guarded: false,
    });
    console.log("Status of the batch submition: ", submissionResponse);
  });

  // SEND NFT ON MUMBAI NETWORK
  it("Setup the SDK for Mumbai network and perform the send NFT Transaction action", async () => {
    // Initialize the SDK and define network
    sdkTestNet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.TestNets,
      networkName: NetworkNames.Mumbai,
    });

    // Compute the smart wallet address
    const smartWalletOutput = await sdkMainNet.computeContractAccount();
    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    expect(smartWalletAddress).to.equal(
      "0x666E17ad27fB620D7519477f3b33d809775d65Fe"
    );

    // Adding transaction details to a batch
    const response = await sdkTestNet.batchExecuteAccountTransaction({
      to: "0x22c1f6050e56d2876009903609a2cc3fef83b415", // contract_address of the NFT
      data: encodedData,
    });
    console.log("Batch Reponse: ", response);

    // Estimating the batch
    const estimationResponse = await sdkTestNet.estimateGatewayBatch();
    console.log("Gas estimated at:", estimationResponse);

    // Submitting the batch
    const submissionResponse = await sdkTestNet.submitGatewayBatch({
      guarded: false,
    });
    console.log("Status of the batch submition: ", submissionResponse);
  });

  // SEND NFT ON NEONDEVNET NETWORK
  it("Setup the SDK for NeonDevnet network and perform the send NFT Transaction action", async () => {
    // Initialize the SDK and define network
    sdkTestNet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.TestNets,
      networkName: NetworkNames.NeonDevnet,
    });

    // Compute the smart wallet address
    const smartWalletOutput = await sdkMainNet.computeContractAccount();
    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    expect(smartWalletAddress).to.equal(
      "0x666E17ad27fB620D7519477f3b33d809775d65Fe"
    );

    // Adding transaction details to a batch
    const response = await sdkTestNet.batchExecuteAccountTransaction({
      to: "0x22c1f6050e56d2876009903609a2cc3fef83b415", // contract_address of the NFT
      data: encodedData,
    });
    console.log("Batch Reponse: ", response);

    // Estimating the batch
    const estimationResponse = await sdkTestNet.estimateGatewayBatch();
    console.log("Gas estimated at:", estimationResponse);

    // Submitting the batch
    const submissionResponse = await sdkTestNet.submitGatewayBatch({
      guarded: false,
    });
    console.log("Status of the batch submition: ", submissionResponse);
  });

  // SEND NFT ON OPTIMISM NETWORK
  it("Setup the SDK for Optimism network and perform the send NFT Transaction action", async () => {
    // Initialize the SDK and define network
    sdkTestNet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.TestNets,
      networkName: NetworkNames.Optimism,
    });

    // Compute the smart wallet address
    const smartWalletOutput = await sdkMainNet.computeContractAccount();
    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    expect(smartWalletAddress).to.equal(
      "0x666E17ad27fB620D7519477f3b33d809775d65Fe"
    );

    // Adding transaction details to a batch
    const response = await sdkTestNet.batchExecuteAccountTransaction({
      to: "0x22c1f6050e56d2876009903609a2cc3fef83b415", // contract_address of the NFT
      data: encodedData,
    });
    console.log("Batch Reponse: ", response);

    // Estimating the batch
    const estimationResponse = await sdkTestNet.estimateGatewayBatch();
    console.log("Gas estimated at:", estimationResponse);

    // Submitting the batch
    const submissionResponse = await sdkTestNet.submitGatewayBatch({
      guarded: false,
    });
    console.log("Status of the batch submition: ", submissionResponse);
  });
});
