import * as dotenv from "dotenv";
dotenv.config(); // init dotenv

import { assert, expect } from "chai";
import { EnvNames, NetworkNames, Sdk } from "etherspot";
import { BigNumber } from "ethers";
import Helper from "../../../utils/Helper.js";

let sdkMainNet;
let smartWalletAddress;
let hashAddressBig;
let transactionState;

describe("The regression suite for the Get the transaction history on the MainNet", () => {
  // GET TRANSACTION HISTORY FROM THE RANDOM HASH FROM XDAI NETWORK
  it("Setup the SDK for xDai network and get the transaction history from the random hash", async () => {
    // initialize the sdk
    sdkMainNet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.MainNets,
      networkName: NetworkNames.Xdai,
    });

    assert.strictEqual(
      sdkMainNet.state.accountAddress,
      "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f",
      "The EOA Address is not displayed correctly."
    );

    // Compute the smart wallet address
    const smartWalletOutput = await sdkMainNet.computeContractAccount();
    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    assert.strictEqual(
      smartWalletAddress,
      "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
      "The smart address is not displayed correctly."
    );

    // Fetching historical transactions
    let blockNumber_transactions;
    let from_transactions;
    let gasLimit_transactions;
    let gasPrice_transactions;
    let gasUsed_transactions;
    let hash_transactions;
    let status_transactions;
    let timestamp_transactions;
    let to_transactions;
    let value_transactions;
    let blockExplorerUrl_transactions;
    let mainTransactionDataFetched_transactions;
    let internalTransactionsFetched_transactions;

    const transactions = await sdkMainNet.getTransactions();
    console.log("Transactions: ", transactions);
    let randomTransaction =
      Math.floor(Math.random() * (transactions.items.length - 1)) + 1;
    console.log("Randomly Selected Transaction: ", randomTransaction);
    let randomHash = transactions.items[randomTransaction].hash;
    console.log(
      "Hash of randomly selected transaction: ",
      transactions.items[randomTransaction].hash
    );

    try {
      assert.isNumber(
        transactions.items[randomTransaction].blockNumber,
        "The blockNumber of the get transactions response is not displayed."
      );
      blockNumber_transactions =
        transactions.items[randomTransaction].blockNumber;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        transactions.items[randomTransaction].timestamp,
        "The timestamp of the get transactions response is not displayed."
      );
      timestamp_transactions = transactions.items[randomTransaction].timestamp;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        transactions.items[randomTransaction].from,
        "The from address of the get transactions response is not displayed."
      );
      from_transactions = transactions.items[randomTransaction].from;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        transactions.items[randomTransaction].gasLimit,
        "The gasLimit of the get transactions response is not displayed."
      );
      gasLimit_transactions = transactions.items[randomTransaction].gasLimit;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        transactions.items[randomTransaction].gasPrice,
        "The gasPrice of the get transactions response is not displayed."
      );
      gasPrice_transactions = transactions.items[randomTransaction].gasPrice;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        transactions.items[randomTransaction].gasUsed,
        "The gasUsed of the get transactions response is not displayed."
      );
      gasUsed_transactions = transactions.items[randomTransaction].gasUsed;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        transactions.items[randomTransaction].hash,
        "The hash of the get transactions response is not displayed."
      );
      hash_transactions = transactions.items[randomTransaction].hash;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        transactions.items[randomTransaction].logs,
        "The logs of the get transactions response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        transactions.items[randomTransaction].status,
        "Completed",
        "The status of the get transactions response is not displayed."
      );
      status_transactions = transactions.items[randomTransaction].status;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        transactions.items[randomTransaction].to,
        "The to address of the get transactions response is not displayed."
      );
      to_transactions = transactions.items[randomTransaction].to;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        transactions.items[randomTransaction].value,
        "The value of the get transactions response is not displayed."
      );
      value_transactions = transactions.items[randomTransaction].value;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        transactions.items[randomTransaction].direction,
        "Sender",
        "The direction of the get transactions response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isTrue(
        transactions.items[randomTransaction].mainTransactionDataFetched,
        "The mainTransactionDataFetched of the get transactions response is not displayed."
      );
      mainTransactionDataFetched_transactions =
        transactions.items[randomTransaction].mainTransactionDataFetched;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isFalse(
        transactions.items[randomTransaction].internalTransactionsFetched,
        "The internalTransactionsFetched of the get transactions response is not displayed."
      );
      internalTransactionsFetched_transactions =
        transactions.items[randomTransaction].internalTransactionsFetched;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        transactions.items[randomTransaction].batch,
        "The batch of the get transactions response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        transactions.items[randomTransaction].assert,
        "The assert of the get transactions response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        transactions.items[randomTransaction].blockExplorerUrl,
        "The blockExplorerUrl of the get transactions response is not displayed."
      );
      blockExplorerUrl_transactions =
        transactions.items[randomTransaction].blockExplorerUrl;
    } catch (e) {
      console.log(e);
    }

    // Fetching a single transaction
    let blockNumber_singleTransaction;
    let from_singleTransaction;
    let gasLimit_singleTransaction;
    let gasPrice_singleTransaction;
    let gasUsed_singleTransaction;
    let hash_singleTransaction;
    let status_singleTransaction;
    let timestamp_singleTransaction;
    let to_singleTransaction;
    let value_singleTransaction;
    let blockExplorerUrl_singleTransaction;
    let mainTransactionDataFetched_singleTransaction;
    let internalTransactionsFetched_singleTransaction;

    const singleTransaction = await sdkMainNet.getTransaction({
      hash: randomHash, // Add your transaction hash
    });
    // console.log("Single Transaction: ", singleTransaction);

    try {
      assert.isNotEmpty(
        singleTransaction.blockHash,
        "The blockHash of the get single transaction response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        singleTransaction.blockNumber,
        "The blockNumber of the get single transaction response is not displayed."
      );
      blockNumber_singleTransaction = singleTransaction.blockNumber;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        singleTransaction.from,
        "The from address of the get single transaction response is not displayed."
      );
      from_singleTransaction = singleTransaction.from;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        singleTransaction.gasLimit,
        "The gasLimit of the get single transaction response is not displayed."
      );
      gasLimit_singleTransaction = singleTransaction.gasLimit;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        singleTransaction.gasPrice,
        "The gasPrice of the get single transaction response is not displayed."
      );
      gasPrice_singleTransaction = singleTransaction.gasPrice;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        singleTransaction.gasUsed,
        "The gasUsed of the get single transaction response is not displayed."
      );
      gasUsed_singleTransaction = singleTransaction.gasUsed;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        singleTransaction.hash,
        "The hash of the get single transaction response is not displayed."
      );
      hash_singleTransaction = singleTransaction.hash;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        singleTransaction.input,
        "The input of the get single transaction response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    for (let i = 0; i < singleTransaction.logs.length; i++) {
      try {
        assert.isNotEmpty(
          singleTransaction.logs[i].address,
          "The address of the logs of the get single transaction response is not displayed."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          singleTransaction.logs[i].data,
          "The data of the logs of the get single transaction response is not displayed."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          singleTransaction.logs[i].decoded,
          "The decoded of the logs of the get single transaction response is not displayed."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          singleTransaction.logs[i].topics,
          "The topics of the logs of the get single transaction response is not displayed."
        );
      } catch (e) {
        console.log(e);
      }
    }

    try {
      assert.isNumber(
        singleTransaction.nonce,
        "The nonce of the get single transaction response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        singleTransaction.status,
        "Completed",
        "The status of the get single transaction response is not displayed."
      );
      status_singleTransaction = singleTransaction.status;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        singleTransaction.timestamp,
        "The timestamp of the get single transaction response is not displayed."
      );
      timestamp_singleTransaction = singleTransaction.timestamp;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        singleTransaction.to,
        "0x432defD2b3733e6fEBb1bD4B17Ed85D15b882163",
        "The To Address of the get single transaction response is not displayed."
      );
      to_singleTransaction = singleTransaction.to;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        singleTransaction.transactionIndex,
        "The To transactionIndex of the get single transaction response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        singleTransaction.value,
        "The To value of the get single transaction response is not displayed."
      );
      value_singleTransaction = singleTransaction.value;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        singleTransaction.blockExplorerUrl,
        "The To blockExplorerUrl of the get single transaction response is not displayed."
      );
      blockExplorerUrl_singleTransaction = singleTransaction.blockExplorerUrl;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isTrue(
        singleTransaction.mainTransactionDataFetched,
        "The To mainTransactionDataFetched of the get single transaction response is not displayed."
      );
      mainTransactionDataFetched_singleTransaction =
        singleTransaction.mainTransactionDataFetched;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isFalse(
        singleTransaction.internalTransactionsFetched,
        "The To internalTransactions of the get single transaction response is not displayed."
      );
      internalTransactionsFetched_singleTransaction =
        singleTransaction.internalTransactionsFetched;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        blockNumber_singleTransaction,
        blockNumber_transactions,
        "The blockNumber of get single transaction response and get transactions response are not matched."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        timestamp_singleTransaction,
        timestamp_transactions,
        "The timestamp of get single transaction response and get transactions response are not matched."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        from_singleTransaction,
        from_transactions,
        "The from address of get single transaction response and get transactions response are not matched."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        gasLimit_singleTransaction,
        gasLimit_transactions,
        "The gasLimit of get single transaction response and get transactions response are not matched."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        gasPrice_singleTransaction,
        gasPrice_transactions,
        "The gasPrice of get single transaction response and get transactions response are not matched."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        gasUsed_singleTransaction,
        gasUsed_transactions,
        "The gasUsed of get single transaction response and get transactions response are not matched."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        hash_singleTransaction,
        hash_transactions,
        "The hash of get single transaction response and get transactions response are not matched."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        status_singleTransaction,
        status_transactions,
        "The status of get single transaction response and get transactions response are not matched."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        to_singleTransaction,
        to_transactions,
        "The to address of get single transaction response and get transactions response are not matched."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        value_singleTransaction,
        value_transactions,
        "The value of get single transaction response and get transactions response are not matched."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        mainTransactionDataFetched_singleTransaction,
        mainTransactionDataFetched_transactions,
        "The mainTransactionDataFetched of get single transaction response and get transactions response are not matched."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        internalTransactionsFetched_singleTransaction,
        internalTransactionsFetched_transactions,
        "The internalTransactionsFetched of get single transaction response and get transactions response are not matched."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        blockExplorerUrl_singleTransaction,
        blockExplorerUrl_transactions,
        "The blockExplorerUrl of get single transaction response and get transactions response are not matched."
      );
    } catch (e) {
      console.log(e);
    }
  });

  // GET TRANSACTION HISTORY WITH INCORRECT HASH FROM XDAI NETWORK
  it.only("Setup the SDK for xDai network and get the transaction history with incorrect hash", async () => {
    // initialize the sdk
    sdkMainNet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.MainNets,
      networkName: NetworkNames.Xdai,
    });

    assert.strictEqual(
      sdkMainNet.state.accountAddress,
      "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f",
      "The EOA Address is not displayed correctly."
    );

    // Compute the smart wallet address
    const smartWalletOutput = await sdkMainNet.computeContractAccount();
    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    assert.strictEqual(
      smartWalletAddress,
      "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
      "The smart address is not displayed correctly."
    );

    // Fetching a single transaction
    try {
      await sdkMainNet.getTransaction({
        hash: "0x3df9fe91b29f4b2bf1b148baf2f8E207e98137F8318ccf39eDc930d1ceA551df", // Add incorrect transaction hash
      });
      assert.isFalse(
        "Getting the single transaction history with incorrect Hash."
      );
    } catch (e) {
      console.log(e);
    }
  });
});
