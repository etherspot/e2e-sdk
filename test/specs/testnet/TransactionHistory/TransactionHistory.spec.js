import * as dotenv from "dotenv";
dotenv.config(); // init dotenv

import { expect } from "chai";
import { EnvNames, NetworkNames, Sdk } from "etherspot";
import { BigNumber } from "ethers";
import Helper from "../../utils/Helper.js";

let sdkTestNet;
let smartWalletAddress;
let hashAddressBig;
let transactionState;

describe("Get the transaction history on the TestNet", () => {
  // GET TRANSACTION HISTORY FROM ARBITRUM NETWORK
  it("Setup the SDK for Arbitrum network and perform the send native asset action", async () => {
    // initialize the sdk
    sdkTestNet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.TestNets,
      networkName: NetworkNames.Arbitrum,
    });

    expect(sdkTestNet.state.accountAddress).to.equal(
      "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f"
    );

    // Compute the smart wallet address
    const smartWalletOutput = await sdkTestNet.computeContractAccount();
    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    // Adding transaction to a batch
    const addTransactionToBatchOutput =
      await sdkTestNet.batchExecuteAccountTransaction({
        to: "0x0fd7508903376dab743a02743cadfdc2d92fceb8",
        value: "1000000000000",
      });
    console.log("Batch Reponse: ", addTransactionToBatchOutput);

    // Estimating the batch
    const estimationResponse = await sdkTestNet.estimateGatewayBatch();
    console.log("Gas estimated at:", estimationResponse);

    // Submitting the batch
    const submissionResponse = await sdkTestNet.submitGatewayBatch({
      guarded: false,
    });
    console.log("Status of the batch submition: ", submissionResponse);
    hashAddressBig = BigNumber.from(submissionResponse.hash)._hex;
    console.log("BIG HASH ADDRESS: ", hashAddressBig);

    // get the submitted batch and wait till the status become sent
    do {
      const output = await sdkTestNet.getGatewaySubmittedBatch({
        hash: hashAddressBig,
      });
      transactionState = output.state;

      Helper.wait(2000);
    } while (!(transactionState == "Sent"));

    // get submmited batch with sent status
    const output = await sdkTestNet.getGatewaySubmittedBatch({
      hash: hashAddressBig,
    });
    console.log("Gateway Submitted Batch after sending: ", output);
    console.log(
      "Transaction State of Fetched Batch after sending: ",
      output.transaction.state
    );
    console.log(
      "Transaction Hash of Fetched Batch after sending: ",
      output.transaction.hash
    );

    // Fetching a single transaction
    const singleTransaction = await sdkTestNet.getTransaction({
      hash: output.transaction.hash, // Add your transaction hash
    });
    console.log("Single Transaction: ", singleTransaction);
    console.log(
      "Single Transaction Hash of the blockchain: ",
      singleTransaction.hash
    );
    console.log(
      "Single Transaction Status of the blockchain: ",
      singleTransaction.status
    );

    expect(singleTransaction.status).to.equal("Completed");

    // Fetching historical transactions
    const transactions = await sdkTestNet.getTransactions();
    //console.log("Transactions: ", transactions);
    console.log(
      "Respective Transaction Hash from the transactions list of the blockchain: ",
      transactions.items[0].hash
    );
    console.log(
      "Respective Transaction Status from the transactions list of the blockchain: ",
      transactions.items[0].status
    );

    expect(transactions.items[0].status).to.equal("Completed");

    // VALIDATE THE TRANSACTION HASH OF THE SINGLE TRANSACTION AND FROM THE TRANSACTION LIST
    expect(output.transaction.hash).to.equal(singleTransaction.hash); // validate hash of sent batch and single transaction is displayed same
    expect(output.transaction.hash).to.equal(transactions.items[0].hash); // validate hash of sent batch and from transaction list is displayed same
    expect(singleTransaction.hash).to.equal(transactions.items[0].hash); // validate hash of single transaction and from transaction list is displayed same
  });

  // GET TRANSACTION HISTORY FROM ARBITRUMNOVA NETWORK
  it.skip("Setup the SDK for ArbitrumNova network and get the transaction history", async () => {
    // initialize the sdk
    sdkTestNet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.TestNets,
      networkName: NetworkNames.ArbitrumNova,
    });

    expect(sdkTestNet.state.accountAddress).to.equal(
      "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f"
    );

    // Compute the smart wallet address
    const smartWalletOutput = await sdkTestNet.computeContractAccount();
    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    // Adding transaction to a batch
    const addTransactionToBatchOutput =
      await sdkTestNet.batchExecuteAccountTransaction({
        to: "0x0fd7508903376dab743a02743cadfdc2d92fceb8",
        value: "1000000000000",
      });
    console.log("Batch Reponse: ", addTransactionToBatchOutput);

    // Estimating the batch
    const estimationResponse = await sdkTestNet.estimateGatewayBatch();
    console.log("Gas estimated at:", estimationResponse);

    // Submitting the batch
    const submissionResponse = await sdkTestNet.submitGatewayBatch({
      guarded: false,
    });
    console.log("Status of the batch submition: ", submissionResponse);
    hashAddressBig = BigNumber.from(submissionResponse.hash)._hex;
    console.log("BIG HASH ADDRESS: ", hashAddressBig);

    // get the submitted batch and wait till the status become sent
    do {
      const output = await sdkTestNet.getGatewaySubmittedBatch({
        hash: hashAddressBig,
      });
      transactionState = output.state;

      Helper.wait(2000);
    } while (!(transactionState == "Sent"));

    // get submmited batch with sent status
    const output = await sdkTestNet.getGatewaySubmittedBatch({
      hash: hashAddressBig,
    });
    console.log("Gateway Submitted Batch after sending: ", output);
    console.log(
      "Transaction State of Fetched Batch after sending: ",
      output.transaction.state
    );
    console.log(
      "Transaction Hash of Fetched Batch after sending: ",
      output.transaction.hash
    );

    // Fetching a single transaction
    const singleTransaction = await sdkTestNet.getTransaction({
      hash: output.transaction.hash, // Add your transaction hash
    });
    console.log("Single Transaction: ", singleTransaction);
    console.log(
      "Single Transaction Hash of the blockchain: ",
      singleTransaction.hash
    );
    console.log(
      "Single Transaction Status of the blockchain: ",
      singleTransaction.status
    );

    expect(singleTransaction.status).to.equal("Completed");

    // Fetching historical transactions
    const transactions = await sdkTestNet.getTransactions();
    //console.log("Transactions: ", transactions);
    console.log(
      "Respective Transaction Hash from the transactions list of the blockchain: ",
      transactions.items[0].hash
    );
    console.log(
      "Respective Transaction Status from the transactions list of the blockchain: ",
      transactions.items[0].status
    );

    expect(transactions.items[0].status).to.equal("Completed");

    // VALIDATE THE TRANSACTION HASH OF THE SINGLE TRANSACTION AND FROM THE TRANSACTION LIST
    expect(output.transaction.hash).to.equal(singleTransaction.hash); // validate hash of sent batch and single transaction is displayed same
    expect(output.transaction.hash).to.equal(transactions.items[0].hash); // validate hash of sent batch and from transaction list is displayed same
    expect(singleTransaction.hash).to.equal(transactions.items[0].hash); // validate hash of single transaction and from transaction list is displayed same
  });

  // GET TRANSACTION HISTORY FROM AURORA NETWORK
  it.skip("Setup the SDK for Aurora network and get the transaction history", async () => {
    // initialize the sdk
    sdkTestNet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.TestNets,
      networkName: NetworkNames.Aurora,
    });

    expect(sdkTestNet.state.accountAddress).to.equal(
      "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f"
    );

    // Compute the smart wallet address
    const smartWalletOutput = await sdkTestNet.computeContractAccount();
    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    // Adding transaction to a batch
    const addTransactionToBatchOutput =
      await sdkTestNet.batchExecuteAccountTransaction({
        to: "0x0fd7508903376dab743a02743cadfdc2d92fceb8",
        value: "1000000000000",
      });
    console.log("Batch Reponse: ", addTransactionToBatchOutput);

    // Estimating the batch
    const estimationResponse = await sdkTestNet.estimateGatewayBatch();
    console.log("Gas estimated at:", estimationResponse);

    // Submitting the batch
    const submissionResponse = await sdkTestNet.submitGatewayBatch({
      guarded: false,
    });
    console.log("Status of the batch submition: ", submissionResponse);
    hashAddressBig = BigNumber.from(submissionResponse.hash)._hex;
    console.log("BIG HASH ADDRESS: ", hashAddressBig);

    // get the submitted batch and wait till the status become sent
    do {
      const output = await sdkTestNet.getGatewaySubmittedBatch({
        hash: hashAddressBig,
      });
      transactionState = output.state;

      Helper.wait(2000);
    } while (!(transactionState == "Sent"));

    // get submmited batch with sent status
    const output = await sdkTestNet.getGatewaySubmittedBatch({
      hash: hashAddressBig,
    });
    console.log("Gateway Submitted Batch after sending: ", output);
    console.log(
      "Transaction State of Fetched Batch after sending: ",
      output.transaction.state
    );
    console.log(
      "Transaction Hash of Fetched Batch after sending: ",
      output.transaction.hash
    );

    // Fetching a single transaction
    const singleTransaction = await sdkTestNet.getTransaction({
      hash: output.transaction.hash, // Add your transaction hash
    });
    console.log("Single Transaction: ", singleTransaction);
    console.log(
      "Single Transaction Hash of the blockchain: ",
      singleTransaction.hash
    );
    console.log(
      "Single Transaction Status of the blockchain: ",
      singleTransaction.status
    );

    expect(singleTransaction.status).to.equal("Completed");

    // Fetching historical transactions
    const transactions = await sdkTestNet.getTransactions();
    //console.log("Transactions: ", transactions);
    console.log(
      "Respective Transaction Hash from the transactions list of the blockchain: ",
      transactions.items[0].hash
    );
    console.log(
      "Respective Transaction Status from the transactions list of the blockchain: ",
      transactions.items[0].status
    );

    expect(transactions.items[0].status).to.equal("Completed");

    // VALIDATE THE TRANSACTION HASH OF THE SINGLE TRANSACTION AND FROM THE TRANSACTION LIST
    expect(output.transaction.hash).to.equal(singleTransaction.hash); // validate hash of sent batch and single transaction is displayed same
    expect(output.transaction.hash).to.equal(transactions.items[0].hash); // validate hash of sent batch and from transaction list is displayed same
    expect(singleTransaction.hash).to.equal(transactions.items[0].hash); // validate hash of single transaction and from transaction list is displayed same
  });

  // GET TRANSACTION HISTORY FROM AVALANCHE NETWORK
  it.skip("Setup the SDK for Avalanche network and get the transaction history", async () => {
    // initialize the sdk
    sdkTestNet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.TestNets,
      networkName: NetworkNames.Avalanche,
    });

    expect(sdkTestNet.state.accountAddress).to.equal(
      "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f"
    );

    // Compute the smart wallet address
    const smartWalletOutput = await sdkTestNet.computeContractAccount();
    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    // Adding transaction to a batch
    const addTransactionToBatchOutput =
      await sdkTestNet.batchExecuteAccountTransaction({
        to: "0x0fd7508903376dab743a02743cadfdc2d92fceb8",
        value: "1000000000000",
      });
    console.log("Batch Reponse: ", addTransactionToBatchOutput);

    // Estimating the batch
    const estimationResponse = await sdkTestNet.estimateGatewayBatch();
    console.log("Gas estimated at:", estimationResponse);

    // Submitting the batch
    const submissionResponse = await sdkTestNet.submitGatewayBatch({
      guarded: false,
    });
    console.log("Status of the batch submition: ", submissionResponse);
    hashAddressBig = BigNumber.from(submissionResponse.hash)._hex;
    console.log("BIG HASH ADDRESS: ", hashAddressBig);

    // get the submitted batch and wait till the status become sent
    do {
      const output = await sdkTestNet.getGatewaySubmittedBatch({
        hash: hashAddressBig,
      });
      transactionState = output.state;

      Helper.wait(2000);
    } while (!(transactionState == "Sent"));

    // get submmited batch with sent status
    const output = await sdkTestNet.getGatewaySubmittedBatch({
      hash: hashAddressBig,
    });
    console.log("Gateway Submitted Batch after sending: ", output);
    console.log(
      "Transaction State of Fetched Batch after sending: ",
      output.transaction.state
    );
    console.log(
      "Transaction Hash of Fetched Batch after sending: ",
      output.transaction.hash
    );

    // Fetching a single transaction
    const singleTransaction = await sdkTestNet.getTransaction({
      hash: output.transaction.hash, // Add your transaction hash
    });
    console.log("Single Transaction: ", singleTransaction);
    console.log(
      "Single Transaction Hash of the blockchain: ",
      singleTransaction.hash
    );
    console.log(
      "Single Transaction Status of the blockchain: ",
      singleTransaction.status
    );

    expect(singleTransaction.status).to.equal("Completed");

    // Fetching historical transactions
    const transactions = await sdkTestNet.getTransactions();
    //console.log("Transactions: ", transactions);
    console.log(
      "Respective Transaction Hash from the transactions list of the blockchain: ",
      transactions.items[0].hash
    );
    console.log(
      "Respective Transaction Status from the transactions list of the blockchain: ",
      transactions.items[0].status
    );

    expect(transactions.items[0].status).to.equal("Completed");

    // VALIDATE THE TRANSACTION HASH OF THE SINGLE TRANSACTION AND FROM THE TRANSACTION LIST
    expect(output.transaction.hash).to.equal(singleTransaction.hash); // validate hash of sent batch and single transaction is displayed same
    expect(output.transaction.hash).to.equal(transactions.items[0].hash); // validate hash of sent batch and from transaction list is displayed same
    expect(singleTransaction.hash).to.equal(transactions.items[0].hash); // validate hash of single transaction and from transaction list is displayed same
  });

  // GET TRANSACTION HISTORY FROM BSC NETWORK
  it("Setup the SDK for Bsc network and get the transaction history", async () => {
    // initialize the sdk
    sdkTestNet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.TestNets,
      networkName: NetworkNames.Bsc,
    });

    expect(sdkTestNet.state.accountAddress).to.equal(
      "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f"
    );

    // Compute the smart wallet address
    const smartWalletOutput = await sdkTestNet.computeContractAccount();
    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    // Adding transaction to a batch
    const addTransactionToBatchOutput =
      await sdkTestNet.batchExecuteAccountTransaction({
        to: "0x0fd7508903376dab743a02743cadfdc2d92fceb8",
        value: "1000000000000",
      });
    console.log("Batch Reponse: ", addTransactionToBatchOutput);

    // Estimating the batch
    const estimationResponse = await sdkTestNet.estimateGatewayBatch();
    console.log("Gas estimated at:", estimationResponse);

    // Submitting the batch
    const submissionResponse = await sdkTestNet.submitGatewayBatch({
      guarded: false,
    });
    console.log("Status of the batch submition: ", submissionResponse);
    hashAddressBig = BigNumber.from(submissionResponse.hash)._hex;
    console.log("BIG HASH ADDRESS: ", hashAddressBig);

    // get the submitted batch and wait till the status become sent
    do {
      const output = await sdkTestNet.getGatewaySubmittedBatch({
        hash: hashAddressBig,
      });
      transactionState = output.state;

      Helper.wait(2000);
    } while (!(transactionState == "Sent"));

    // get submmited batch with sent status
    const output = await sdkTestNet.getGatewaySubmittedBatch({
      hash: hashAddressBig,
    });
    console.log("Gateway Submitted Batch after sending: ", output);
    console.log(
      "Transaction State of Fetched Batch after sending: ",
      output.transaction.state
    );
    console.log(
      "Transaction Hash of Fetched Batch after sending: ",
      output.transaction.hash
    );

    // Fetching a single transaction
    const singleTransaction = await sdkTestNet.getTransaction({
      hash: output.transaction.hash, // Add your transaction hash
    });
    console.log("Single Transaction: ", singleTransaction);
    console.log(
      "Single Transaction Hash of the blockchain: ",
      singleTransaction.hash
    );
    console.log(
      "Single Transaction Status of the blockchain: ",
      singleTransaction.status
    );

    expect(singleTransaction.status).to.equal("Completed");

    // Fetching historical transactions
    const transactions = await sdkTestNet.getTransactions();
    //console.log("Transactions: ", transactions);
    console.log(
      "Respective Transaction Hash from the transactions list of the blockchain: ",
      transactions.items[0].hash
    );
    console.log(
      "Respective Transaction Status from the transactions list of the blockchain: ",
      transactions.items[0].status
    );

    expect(transactions.items[0].status).to.equal("Completed");

    // VALIDATE THE TRANSACTION HASH OF THE SINGLE TRANSACTION AND FROM THE TRANSACTION LIST
    expect(output.transaction.hash).to.equal(singleTransaction.hash); // validate hash of sent batch and single transaction is displayed same
    expect(output.transaction.hash).to.equal(transactions.items[0].hash); // validate hash of sent batch and from transaction list is displayed same
    expect(singleTransaction.hash).to.equal(transactions.items[0].hash); // validate hash of single transaction and from transaction list is displayed same
  });

  // GET TRANSACTION HISTORY FROM CELO NETWORK
  it.skip("Setup the SDK for Celo network and get the transaction history", async () => {
    // initialize the sdk
    sdkTestNet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.TestNets,
      networkName: NetworkNames.Celo,
    });

    expect(sdkTestNet.state.accountAddress).to.equal(
      "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f"
    );

    // Compute the smart wallet address
    const smartWalletOutput = await sdkTestNet.computeContractAccount();
    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    // Adding transaction to a batch
    const addTransactionToBatchOutput =
      await sdkTestNet.batchExecuteAccountTransaction({
        to: "0x0fd7508903376dab743a02743cadfdc2d92fceb8",
        value: "1000000000000",
      });
    console.log("Batch Reponse: ", addTransactionToBatchOutput);

    // Estimating the batch
    const estimationResponse = await sdkTestNet.estimateGatewayBatch();
    console.log("Gas estimated at:", estimationResponse);

    // Submitting the batch
    const submissionResponse = await sdkTestNet.submitGatewayBatch({
      guarded: false,
    });
    console.log("Status of the batch submition: ", submissionResponse);
    hashAddressBig = BigNumber.from(submissionResponse.hash)._hex;
    console.log("BIG HASH ADDRESS: ", hashAddressBig);

    // get the submitted batch and wait till the status become sent
    do {
      const output = await sdkTestNet.getGatewaySubmittedBatch({
        hash: hashAddressBig,
      });
      transactionState = output.state;

      Helper.wait(2000);
    } while (!(transactionState == "Sent"));

    // get submmited batch with sent status
    const output = await sdkTestNet.getGatewaySubmittedBatch({
      hash: hashAddressBig,
    });
    console.log("Gateway Submitted Batch after sending: ", output);
    console.log(
      "Transaction State of Fetched Batch after sending: ",
      output.transaction.state
    );
    console.log(
      "Transaction Hash of Fetched Batch after sending: ",
      output.transaction.hash
    );

    // Fetching a single transaction
    const singleTransaction = await sdkTestNet.getTransaction({
      hash: output.transaction.hash, // Add your transaction hash
    });
    console.log("Single Transaction: ", singleTransaction);
    console.log(
      "Single Transaction Hash of the blockchain: ",
      singleTransaction.hash
    );
    console.log(
      "Single Transaction Status of the blockchain: ",
      singleTransaction.status
    );

    expect(singleTransaction.status).to.equal("Completed");

    // Fetching historical transactions
    const transactions = await sdkTestNet.getTransactions();
    //console.log("Transactions: ", transactions);
    console.log(
      "Respective Transaction Hash from the transactions list of the blockchain: ",
      transactions.items[0].hash
    );
    console.log(
      "Respective Transaction Status from the transactions list of the blockchain: ",
      transactions.items[0].status
    );

    expect(transactions.items[0].status).to.equal("Completed");

    // VALIDATE THE TRANSACTION HASH OF THE SINGLE TRANSACTION AND FROM THE TRANSACTION LIST
    expect(output.transaction.hash).to.equal(singleTransaction.hash); // validate hash of sent batch and single transaction is displayed same
    expect(output.transaction.hash).to.equal(transactions.items[0].hash); // validate hash of sent batch and from transaction list is displayed same
    expect(singleTransaction.hash).to.equal(transactions.items[0].hash); // validate hash of single transaction and from transaction list is displayed same
  });

  // GET TRANSACTION HISTORY FROM MAINNET NETWORK
  it("Setup the SDK for Mainnet network and get the transaction history", async () => {
    // initialize the sdk
    sdkTestNet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.TestNets,
      networkName: NetworkNames.Mainnet,
    });

    expect(sdkTestNet.state.accountAddress).to.equal(
      "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f"
    );

    // Compute the smart wallet address
    const smartWalletOutput = await sdkTestNet.computeContractAccount();
    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    // Adding transaction to a batch
    const addTransactionToBatchOutput =
      await sdkTestNet.batchExecuteAccountTransaction({
        to: "0x0fd7508903376dab743a02743cadfdc2d92fceb8",
        value: "1000000000000",
      });
    console.log("Batch Reponse: ", addTransactionToBatchOutput);

    // Estimating the batch
    const estimationResponse = await sdkTestNet.estimateGatewayBatch();
    console.log("Gas estimated at:", estimationResponse);

    // Submitting the batch
    const submissionResponse = await sdkTestNet.submitGatewayBatch({
      guarded: false,
    });
    console.log("Status of the batch submition: ", submissionResponse);
    hashAddressBig = BigNumber.from(submissionResponse.hash)._hex;
    console.log("BIG HASH ADDRESS: ", hashAddressBig);

    // get the submitted batch and wait till the status become sent
    do {
      const output = await sdkTestNet.getGatewaySubmittedBatch({
        hash: hashAddressBig,
      });
      transactionState = output.state;

      Helper.wait(2000);
    } while (!(transactionState == "Sent"));

    // get submmited batch with sent status
    const output = await sdkTestNet.getGatewaySubmittedBatch({
      hash: hashAddressBig,
    });
    console.log("Gateway Submitted Batch after sending: ", output);
    console.log(
      "Transaction State of Fetched Batch after sending: ",
      output.transaction.state
    );
    console.log(
      "Transaction Hash of Fetched Batch after sending: ",
      output.transaction.hash
    );

    // Fetching a single transaction
    const singleTransaction = await sdkTestNet.getTransaction({
      hash: output.transaction.hash, // Add your transaction hash
    });
    console.log("Single Transaction: ", singleTransaction);
    console.log(
      "Single Transaction Hash of the blockchain: ",
      singleTransaction.hash
    );
    console.log(
      "Single Transaction Status of the blockchain: ",
      singleTransaction.status
    );

    expect(singleTransaction.status).to.equal("Completed");

    // Fetching historical transactions
    const transactions = await sdkTestNet.getTransactions();
    //console.log("Transactions: ", transactions);
    console.log(
      "Respective Transaction Hash from the transactions list of the blockchain: ",
      transactions.items[0].hash
    );
    console.log(
      "Respective Transaction Status from the transactions list of the blockchain: ",
      transactions.items[0].status
    );

    expect(transactions.items[0].status).to.equal("Completed");

    // VALIDATE THE TRANSACTION HASH OF THE SINGLE TRANSACTION AND FROM THE TRANSACTION LIST
    expect(output.transaction.hash).to.equal(singleTransaction.hash); // validate hash of sent batch and single transaction is displayed same
    expect(output.transaction.hash).to.equal(transactions.items[0].hash); // validate hash of sent batch and from transaction list is displayed same
    expect(singleTransaction.hash).to.equal(transactions.items[0].hash); // validate hash of single transaction and from transaction list is displayed same
  });

  // GET TRANSACTION HISTORY FROM FANTOM NETWORK
  it.skip("Setup the SDK for Fantom network and get the transaction history", async () => {
    // initialize the sdk
    sdkTestNet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.TestNets,
      networkName: NetworkNames.Fantom,
    });

    expect(sdkTestNet.state.accountAddress).to.equal(
      "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f"
    );

    // Compute the smart wallet address
    const smartWalletOutput = await sdkTestNet.computeContractAccount();
    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    // Adding transaction to a batch
    const addTransactionToBatchOutput =
      await sdkTestNet.batchExecuteAccountTransaction({
        to: "0x0fd7508903376dab743a02743cadfdc2d92fceb8",
        value: "1000000000000",
      });
    console.log("Batch Reponse: ", addTransactionToBatchOutput);

    // Estimating the batch
    const estimationResponse = await sdkTestNet.estimateGatewayBatch();
    console.log("Gas estimated at:", estimationResponse);

    // Submitting the batch
    const submissionResponse = await sdkTestNet.submitGatewayBatch({
      guarded: false,
    });
    console.log("Status of the batch submition: ", submissionResponse);
    hashAddressBig = BigNumber.from(submissionResponse.hash)._hex;
    console.log("BIG HASH ADDRESS: ", hashAddressBig);

    // get the submitted batch and wait till the status become sent
    do {
      const output = await sdkTestNet.getGatewaySubmittedBatch({
        hash: hashAddressBig,
      });
      transactionState = output.state;

      Helper.wait(2000);
    } while (!(transactionState == "Sent"));

    // get submmited batch with sent status
    const output = await sdkTestNet.getGatewaySubmittedBatch({
      hash: hashAddressBig,
    });
    console.log("Gateway Submitted Batch after sending: ", output);
    console.log(
      "Transaction State of Fetched Batch after sending: ",
      output.transaction.state
    );
    console.log(
      "Transaction Hash of Fetched Batch after sending: ",
      output.transaction.hash
    );

    // Fetching a single transaction
    const singleTransaction = await sdkTestNet.getTransaction({
      hash: output.transaction.hash, // Add your transaction hash
    });
    console.log("Single Transaction: ", singleTransaction);
    console.log(
      "Single Transaction Hash of the blockchain: ",
      singleTransaction.hash
    );
    console.log(
      "Single Transaction Status of the blockchain: ",
      singleTransaction.status
    );

    expect(singleTransaction.status).to.equal("Completed");

    // Fetching historical transactions
    const transactions = await sdkTestNet.getTransactions();
    //console.log("Transactions: ", transactions);
    console.log(
      "Respective Transaction Hash from the transactions list of the blockchain: ",
      transactions.items[0].hash
    );
    console.log(
      "Respective Transaction Status from the transactions list of the blockchain: ",
      transactions.items[0].status
    );

    expect(transactions.items[0].status).to.equal("Completed");

    // VALIDATE THE TRANSACTION HASH OF THE SINGLE TRANSACTION AND FROM THE TRANSACTION LIST
    expect(output.transaction.hash).to.equal(singleTransaction.hash); // validate hash of sent batch and single transaction is displayed same
    expect(output.transaction.hash).to.equal(transactions.items[0].hash); // validate hash of sent batch and from transaction list is displayed same
    expect(singleTransaction.hash).to.equal(transactions.items[0].hash); // validate hash of single transaction and from transaction list is displayed same
  });

  // GET TRANSACTION HISTORY FROM FUSE NETWORK
  it.skip("Setup the SDK for Fuse network and get the transaction history", async () => {
    // initialize the sdk
    sdkTestNet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.TestNets,
      networkName: NetworkNames.Fuse,
    });

    expect(sdkTestNet.state.accountAddress).to.equal(
      "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f"
    );

    // Compute the smart wallet address
    const smartWalletOutput = await sdkTestNet.computeContractAccount();
    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    // Adding transaction to a batch
    const addTransactionToBatchOutput =
      await sdkTestNet.batchExecuteAccountTransaction({
        to: "0x0fd7508903376dab743a02743cadfdc2d92fceb8",
        value: "1000000000000",
      });
    console.log("Batch Reponse: ", addTransactionToBatchOutput);

    // Estimating the batch
    const estimationResponse = await sdkTestNet.estimateGatewayBatch();
    console.log("Gas estimated at:", estimationResponse);

    // Submitting the batch
    const submissionResponse = await sdkTestNet.submitGatewayBatch({
      guarded: false,
    });
    console.log("Status of the batch submition: ", submissionResponse);
    hashAddressBig = BigNumber.from(submissionResponse.hash)._hex;
    console.log("BIG HASH ADDRESS: ", hashAddressBig);

    // get the submitted batch and wait till the status become sent
    do {
      const output = await sdkTestNet.getGatewaySubmittedBatch({
        hash: hashAddressBig,
      });
      transactionState = output.state;

      Helper.wait(2000);
    } while (!(transactionState == "Sent"));

    // get submmited batch with sent status
    const output = await sdkTestNet.getGatewaySubmittedBatch({
      hash: hashAddressBig,
    });
    console.log("Gateway Submitted Batch after sending: ", output);
    console.log(
      "Transaction State of Fetched Batch after sending: ",
      output.transaction.state
    );
    console.log(
      "Transaction Hash of Fetched Batch after sending: ",
      output.transaction.hash
    );

    // Fetching a single transaction
    const singleTransaction = await sdkTestNet.getTransaction({
      hash: output.transaction.hash, // Add your transaction hash
    });
    console.log("Single Transaction: ", singleTransaction);
    console.log(
      "Single Transaction Hash of the blockchain: ",
      singleTransaction.hash
    );
    console.log(
      "Single Transaction Status of the blockchain: ",
      singleTransaction.status
    );

    expect(singleTransaction.status).to.equal("Completed");

    // Fetching historical transactions
    const transactions = await sdkTestNet.getTransactions();
    //console.log("Transactions: ", transactions);
    console.log(
      "Respective Transaction Hash from the transactions list of the blockchain: ",
      transactions.items[0].hash
    );
    console.log(
      "Respective Transaction Status from the transactions list of the blockchain: ",
      transactions.items[0].status
    );

    expect(transactions.items[0].status).to.equal("Completed");

    // VALIDATE THE TRANSACTION HASH OF THE SINGLE TRANSACTION AND FROM THE TRANSACTION LIST
    expect(output.transaction.hash).to.equal(singleTransaction.hash); // validate hash of sent batch and single transaction is displayed same
    expect(output.transaction.hash).to.equal(transactions.items[0].hash); // validate hash of sent batch and from transaction list is displayed same
    expect(singleTransaction.hash).to.equal(transactions.items[0].hash); // validate hash of single transaction and from transaction list is displayed same
  });

  // GET TRANSACTION HISTORY FROM XDAI NETWORK
  it.only("Setup the SDK for xDai network and get the transaction history", async () => {
    // initialize the sdk
    sdkTestNet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.TestNets,
      networkName: NetworkNames.Xdai,
    });

    expect(sdkTestNet.state.accountAddress).to.equal(
      "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f"
    );

    // Compute the smart wallet address
    const smartWalletOutput = await sdkTestNet.computeContractAccount();
    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    // Adding transaction to a batch
    const addTransactionToBatchOutput =
      await sdkTestNet.batchExecuteAccountTransaction({
        to: "0x0fd7508903376dab743a02743cadfdc2d92fceb8",
        value: "1000000000000",
      });
    console.log("Batch Reponse: ", addTransactionToBatchOutput);

    // Estimating the batch
    const estimationResponse = await sdkTestNet.estimateGatewayBatch();
    console.log("Gas estimated at:", estimationResponse);

    // Submitting the batch
    const submissionResponse = await sdkTestNet.submitGatewayBatch({
      guarded: false,
    });
    console.log("Status of the batch submition: ", submissionResponse);
    hashAddressBig = BigNumber.from(submissionResponse.hash)._hex;
    console.log("BIG HASH ADDRESS: ", hashAddressBig);

    // get the submitted batch and wait till the status become sent
    do {
      const output = await sdkTestNet.getGatewaySubmittedBatch({
        hash: hashAddressBig,
      });
      transactionState = output.state;

      Helper.wait(2000);
    } while (!(transactionState == "Sent"));

    // get submmited batch with sent status
    const output = await sdkTestNet.getGatewaySubmittedBatch({
      hash: hashAddressBig,
    });
    console.log("Gateway Submitted Batch after sending: ", output);
    console.log(
      "Transaction State of Fetched Batch after sending: ",
      output.transaction.state
    );
    console.log(
      "Transaction Hash of Fetched Batch after sending: ",
      output.transaction.hash
    );

    // Fetching a single transaction
    const singleTransaction = await sdkTestNet.getTransaction({
      hash: output.transaction.hash, // Add your transaction hash
    });
    console.log("Single Transaction: ", singleTransaction);
    console.log(
      "Single Transaction Hash of the blockchain: ",
      singleTransaction.hash
    );
    console.log(
      "Single Transaction Status of the blockchain: ",
      singleTransaction.status
    );

    expect(singleTransaction.status).to.equal("Completed");

    // Fetching historical transactions
    const transactions = await sdkTestNet.getTransactions();
    //console.log("Transactions: ", transactions);
    console.log(
      "Respective Transaction Hash from the transactions list of the blockchain: ",
      transactions.items[0].hash
    );
    console.log(
      "Respective Transaction Status from the transactions list of the blockchain: ",
      transactions.items[0].status
    );

    expect(transactions.items[0].status).to.equal("Completed");

    // VALIDATE THE TRANSACTION HASH OF THE SINGLE TRANSACTION AND FROM THE TRANSACTION LIST
    expect(output.transaction.hash).to.equal(singleTransaction.hash); // validate hash of sent batch and single transaction is displayed same
    expect(output.transaction.hash).to.equal(transactions.items[0].hash); // validate hash of sent batch and from transaction list is displayed same
    expect(singleTransaction.hash).to.equal(transactions.items[0].hash); // validate hash of single transaction and from transaction list is displayed same
  });

  // GET TRANSACTION HISTORY FROM MOONBEAM NETWORK
  it.skip("Setup the SDK for Moonbeam network and get the transaction history", async () => {
    // initialize the sdk
    sdkTestNet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.TestNets,
      networkName: NetworkNames.Moonbeam,
    });

    expect(sdkTestNet.state.accountAddress).to.equal(
      "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f"
    );

    // Compute the smart wallet address
    const smartWalletOutput = await sdkTestNet.computeContractAccount();
    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    // Adding transaction to a batch
    const addTransactionToBatchOutput =
      await sdkTestNet.batchExecuteAccountTransaction({
        to: "0x0fd7508903376dab743a02743cadfdc2d92fceb8",
        value: "1000000000000",
      });
    console.log("Batch Reponse: ", addTransactionToBatchOutput);

    // Estimating the batch
    const estimationResponse = await sdkTestNet.estimateGatewayBatch();
    console.log("Gas estimated at:", estimationResponse);

    // Submitting the batch
    const submissionResponse = await sdkTestNet.submitGatewayBatch({
      guarded: false,
    });
    console.log("Status of the batch submition: ", submissionResponse);
    hashAddressBig = BigNumber.from(submissionResponse.hash)._hex;
    console.log("BIG HASH ADDRESS: ", hashAddressBig);

    // get the submitted batch and wait till the status become sent
    do {
      const output = await sdkTestNet.getGatewaySubmittedBatch({
        hash: hashAddressBig,
      });
      transactionState = output.state;

      Helper.wait(2000);
    } while (!(transactionState == "Sent"));

    // get submmited batch with sent status
    const output = await sdkTestNet.getGatewaySubmittedBatch({
      hash: hashAddressBig,
    });
    console.log("Gateway Submitted Batch after sending: ", output);
    console.log(
      "Transaction State of Fetched Batch after sending: ",
      output.transaction.state
    );
    console.log(
      "Transaction Hash of Fetched Batch after sending: ",
      output.transaction.hash
    );

    // Fetching a single transaction
    const singleTransaction = await sdkTestNet.getTransaction({
      hash: output.transaction.hash, // Add your transaction hash
    });
    console.log("Single Transaction: ", singleTransaction);
    console.log(
      "Single Transaction Hash of the blockchain: ",
      singleTransaction.hash
    );
    console.log(
      "Single Transaction Status of the blockchain: ",
      singleTransaction.status
    );

    expect(singleTransaction.status).to.equal("Completed");

    // Fetching historical transactions
    const transactions = await sdkTestNet.getTransactions();
    //console.log("Transactions: ", transactions);
    console.log(
      "Respective Transaction Hash from the transactions list of the blockchain: ",
      transactions.items[0].hash
    );
    console.log(
      "Respective Transaction Status from the transactions list of the blockchain: ",
      transactions.items[0].status
    );

    expect(transactions.items[0].status).to.equal("Completed");

    // VALIDATE THE TRANSACTION HASH OF THE SINGLE TRANSACTION AND FROM THE TRANSACTION LIST
    expect(output.transaction.hash).to.equal(singleTransaction.hash); // validate hash of sent batch and single transaction is displayed same
    expect(output.transaction.hash).to.equal(transactions.items[0].hash); // validate hash of sent batch and from transaction list is displayed same
    expect(singleTransaction.hash).to.equal(transactions.items[0].hash); // validate hash of single transaction and from transaction list is displayed same
  });

  // GET TRANSACTION HISTORY FROM MUMBAI NETWORK
  it("Setup the SDK for Mumbai network and get the transaction history", async () => {
    // initialize the sdk
    sdkTestNet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.TestNets,
      networkName: NetworkNames.Mumbai,
    });

    expect(sdkTestNet.state.accountAddress).to.equal(
      "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f"
    );

    // Compute the smart wallet address
    const smartWalletOutput = await sdkTestNet.computeContractAccount();
    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    // Adding transaction to a batch
    const addTransactionToBatchOutput =
      await sdkTestNet.batchExecuteAccountTransaction({
        to: "0x0fd7508903376dab743a02743cadfdc2d92fceb8",
        value: "1000000000000",
      });
    console.log("Batch Reponse: ", addTransactionToBatchOutput);

    // Estimating the batch
    const estimationResponse = await sdkTestNet.estimateGatewayBatch();
    console.log("Gas estimated at:", estimationResponse);

    // Submitting the batch
    const submissionResponse = await sdkTestNet.submitGatewayBatch({
      guarded: false,
    });
    console.log("Status of the batch submition: ", submissionResponse);
    hashAddressBig = BigNumber.from(submissionResponse.hash)._hex;
    console.log("BIG HASH ADDRESS: ", hashAddressBig);

    // get the submitted batch and wait till the status become sent
    do {
      const output = await sdkTestNet.getGatewaySubmittedBatch({
        hash: hashAddressBig,
      });
      transactionState = output.state;

      Helper.wait(2000);
    } while (!(transactionState == "Sent"));

    // get submmited batch with sent status
    const output = await sdkTestNet.getGatewaySubmittedBatch({
      hash: hashAddressBig,
    });
    console.log("Gateway Submitted Batch after sending: ", output);
    console.log(
      "Transaction State of Fetched Batch after sending: ",
      output.transaction.state
    );
    console.log(
      "Transaction Hash of Fetched Batch after sending: ",
      output.transaction.hash
    );

    // Fetching a single transaction
    const singleTransaction = await sdkTestNet.getTransaction({
      hash: output.transaction.hash, // Add your transaction hash
    });
    console.log("Single Transaction: ", singleTransaction);
    console.log(
      "Single Transaction Hash of the blockchain: ",
      singleTransaction.hash
    );
    console.log(
      "Single Transaction Status of the blockchain: ",
      singleTransaction.status
    );

    expect(singleTransaction.status).to.equal("Completed");

    // Fetching historical transactions
    const transactions = await sdkTestNet.getTransactions();
    //console.log("Transactions: ", transactions);
    console.log(
      "Respective Transaction Hash from the transactions list of the blockchain: ",
      transactions.items[0].hash
    );
    console.log(
      "Respective Transaction Status from the transactions list of the blockchain: ",
      transactions.items[0].status
    );

    expect(transactions.items[0].status).to.equal("Completed");

    // VALIDATE THE TRANSACTION HASH OF THE SINGLE TRANSACTION AND FROM THE TRANSACTION LIST
    expect(output.transaction.hash).to.equal(singleTransaction.hash); // validate hash of sent batch and single transaction is displayed same
    expect(output.transaction.hash).to.equal(transactions.items[0].hash); // validate hash of sent batch and from transaction list is displayed same
    expect(singleTransaction.hash).to.equal(transactions.items[0].hash); // validate hash of single transaction and from transaction list is displayed same
  });

  // GET TRANSACTION HISTORY FROM NEONDEVNET NETWORK
  it.skip("Setup the SDK for NeonDevnet network and get the transaction history", async () => {
    // initialize the sdk
    sdkTestNet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.TestNets,
      networkName: NetworkNames.NeonDevnet,
    });

    expect(sdkTestNet.state.accountAddress).to.equal(
      "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f"
    );

    // Compute the smart wallet address
    const smartWalletOutput = await sdkTestNet.computeContractAccount();
    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    // Adding transaction to a batch
    const addTransactionToBatchOutput =
      await sdkTestNet.batchExecuteAccountTransaction({
        to: "0x0fd7508903376dab743a02743cadfdc2d92fceb8",
        value: "1000000000000",
      });
    console.log("Batch Reponse: ", addTransactionToBatchOutput);

    // Estimating the batch
    const estimationResponse = await sdkTestNet.estimateGatewayBatch();
    console.log("Gas estimated at:", estimationResponse);

    // Submitting the batch
    const submissionResponse = await sdkTestNet.submitGatewayBatch({
      guarded: false,
    });
    console.log("Status of the batch submition: ", submissionResponse);
    hashAddressBig = BigNumber.from(submissionResponse.hash)._hex;
    console.log("BIG HASH ADDRESS: ", hashAddressBig);

    // get the submitted batch and wait till the status become sent
    do {
      const output = await sdkTestNet.getGatewaySubmittedBatch({
        hash: hashAddressBig,
      });
      transactionState = output.state;

      Helper.wait(2000);
    } while (!(transactionState == "Sent"));

    // get submmited batch with sent status
    const output = await sdkTestNet.getGatewaySubmittedBatch({
      hash: hashAddressBig,
    });
    console.log("Gateway Submitted Batch after sending: ", output);
    console.log(
      "Transaction State of Fetched Batch after sending: ",
      output.transaction.state
    );
    console.log(
      "Transaction Hash of Fetched Batch after sending: ",
      output.transaction.hash
    );

    // Fetching a single transaction
    const singleTransaction = await sdkTestNet.getTransaction({
      hash: output.transaction.hash, // Add your transaction hash
    });
    console.log("Single Transaction: ", singleTransaction);
    console.log(
      "Single Transaction Hash of the blockchain: ",
      singleTransaction.hash
    );
    console.log(
      "Single Transaction Status of the blockchain: ",
      singleTransaction.status
    );

    expect(singleTransaction.status).to.equal("Completed");

    // Fetching historical transactions
    const transactions = await sdkTestNet.getTransactions();
    //console.log("Transactions: ", transactions);
    console.log(
      "Respective Transaction Hash from the transactions list of the blockchain: ",
      transactions.items[0].hash
    );
    console.log(
      "Respective Transaction Status from the transactions list of the blockchain: ",
      transactions.items[0].status
    );

    expect(transactions.items[0].status).to.equal("Completed");

    // VALIDATE THE TRANSACTION HASH OF THE SINGLE TRANSACTION AND FROM THE TRANSACTION LIST
    expect(output.transaction.hash).to.equal(singleTransaction.hash); // validate hash of sent batch and single transaction is displayed same
    expect(output.transaction.hash).to.equal(transactions.items[0].hash); // validate hash of sent batch and from transaction list is displayed same
    expect(singleTransaction.hash).to.equal(transactions.items[0].hash); // validate hash of single transaction and from transaction list is displayed same
  });

  // GET TRANSACTION HISTORY FROM OPTIMISM NETWORK
  it("Setup the SDK for Optimism network and get the transaction history", async () => {
    // initialize the sdk
    sdkTestNet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.TestNets,
      networkName: NetworkNames.Optimism,
    });

    expect(sdkTestNet.state.accountAddress).to.equal(
      "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f"
    );

    // Compute the smart wallet address
    const smartWalletOutput = await sdkTestNet.computeContractAccount();
    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    // Adding transaction to a batch
    const addTransactionToBatchOutput =
      await sdkTestNet.batchExecuteAccountTransaction({
        to: "0x0fd7508903376dab743a02743cadfdc2d92fceb8",
        value: "1000000000000",
      });
    console.log("Batch Reponse: ", addTransactionToBatchOutput);

    // Estimating the batch
    const estimationResponse = await sdkTestNet.estimateGatewayBatch();
    console.log("Gas estimated at:", estimationResponse);

    // Submitting the batch
    const submissionResponse = await sdkTestNet.submitGatewayBatch({
      guarded: false,
    });
    console.log("Status of the batch submition: ", submissionResponse);
    hashAddressBig = BigNumber.from(submissionResponse.hash)._hex;
    console.log("BIG HASH ADDRESS: ", hashAddressBig);

    // get the submitted batch and wait till the status become sent
    do {
      const output = await sdkTestNet.getGatewaySubmittedBatch({
        hash: hashAddressBig,
      });
      transactionState = output.state;

      Helper.wait(2000);
    } while (!(transactionState == "Sent"));

    // get submmited batch with sent status
    const output = await sdkTestNet.getGatewaySubmittedBatch({
      hash: hashAddressBig,
    });
    console.log("Gateway Submitted Batch after sending: ", output);
    console.log(
      "Transaction State of Fetched Batch after sending: ",
      output.transaction.state
    );
    console.log(
      "Transaction Hash of Fetched Batch after sending: ",
      output.transaction.hash
    );

    // Fetching a single transaction
    const singleTransaction = await sdkTestNet.getTransaction({
      hash: output.transaction.hash, // Add your transaction hash
    });
    console.log("Single Transaction: ", singleTransaction);
    console.log(
      "Single Transaction Hash of the blockchain: ",
      singleTransaction.hash
    );
    console.log(
      "Single Transaction Status of the blockchain: ",
      singleTransaction.status
    );

    expect(singleTransaction.status).to.equal("Completed");

    // Fetching historical transactions
    const transactions = await sdkTestNet.getTransactions();
    //console.log("Transactions: ", transactions);
    console.log(
      "Respective Transaction Hash from the transactions list of the blockchain: ",
      transactions.items[0].hash
    );
    console.log(
      "Respective Transaction Status from the transactions list of the blockchain: ",
      transactions.items[0].status
    );

    expect(transactions.items[0].status).to.equal("Completed");

    // VALIDATE THE TRANSACTION HASH OF THE SINGLE TRANSACTION AND FROM THE TRANSACTION LIST
    expect(output.transaction.hash).to.equal(singleTransaction.hash); // validate hash of sent batch and single transaction is displayed same
    expect(output.transaction.hash).to.equal(transactions.items[0].hash); // validate hash of sent batch and from transaction list is displayed same
    expect(singleTransaction.hash).to.equal(transactions.items[0].hash); // validate hash of single transaction and from transaction list is displayed same
  });
});
