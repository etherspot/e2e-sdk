import * as dotenv from "dotenv";
dotenv.config(); // init dotenv

import { assert } from "chai";
import { EnvNames, NetworkNames, Sdk } from "etherspot";

describe("The regression suite for the Get the transaction history on the TestNet", () => {
  // GET TRANSACTION HISTORY FROM THE RANDOM HASH FROM XDAI NETWORK
  it("Setup the SDK for xDai network and get the transaction history from the random hash", async () => {
    // initialize the sdk
    let xdaiTestNetSdk;
    try {
      xdaiTestNetSdk = new Sdk(process.env.PRIVATE_KEY, {
        env: EnvNames.TestNets,
        networkName: NetworkNames.Xdai,
      });

      assert.strictEqual(
        xdaiTestNetSdk.state.accountAddress,
        "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f",
        "The EOA Address is not calculated correctly."
      );
    } catch (e) {
      assert.fail("The SDK is not initialled successfully.");
    }

    // Compute the smart wallet address
    try {
      let smartWalletOutput = await xdaiTestNetSdk.computeContractAccount();
      let xdaiSmartWalletAddress = smartWalletOutput.address;

      assert.strictEqual(
        xdaiSmartWalletAddress,
        "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
        "The smart wallet address is not calculated correctly."
      );
    } catch (e) {
      assert.fail("The smart wallet address is not calculated successfully.");
    }

    // Fetching historical transactions
    let transactions;
    let randomTransaction;
    let randomHash;
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

    try {
      transactions = await xdaiTestNetSdk.getTransactions();
      randomTransaction =
        Math.floor(Math.random() * (transactions.items.length - 1)) + 1;
      randomHash = transactions.items[randomTransaction].hash;
      console.log(
        "Hash of randomly selected transaction: ",
        transactions.items[randomTransaction].hash
      );

      try {
        assert.isNumber(
          transactions.items[randomTransaction].blockNumber,
          "The blockNumber value is not number in the get transactions response."
        );
        blockNumber_transactions =
          transactions.items[randomTransaction].blockNumber;
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNumber(
          transactions.items[randomTransaction].timestamp,
          "The timestamp value is not number in the get transactions response."
        );
        timestamp_transactions =
          transactions.items[randomTransaction].timestamp;
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          transactions.items[randomTransaction].from,
          "The from address vlaue is empty in the get transactions response."
        );
        from_transactions = transactions.items[randomTransaction].from;
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNumber(
          transactions.items[randomTransaction].gasLimit,
          "The gasLimit value is not number in the get transactions response."
        );
        gasLimit_transactions = transactions.items[randomTransaction].gasLimit;
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          transactions.items[randomTransaction].gasPrice,
          "The gasPrice value is empty in the get transactions response."
        );
        gasPrice_transactions = transactions.items[randomTransaction].gasPrice;
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNumber(
          transactions.items[randomTransaction].gasUsed,
          "The gasUsed value is not number in the get transactions response."
        );
        gasUsed_transactions = transactions.items[randomTransaction].gasUsed;
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          transactions.items[randomTransaction].hash,
          "The hash value is empty in the get transactions response."
        );
        hash_transactions = transactions.items[randomTransaction].hash;
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          transactions.items[randomTransaction].logs,
          "The logs value is empty in the get transactions response."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.strictEqual(
          transactions.items[randomTransaction].status,
          "Completed",
          "The status value is empty in the get transactions response."
        );
        status_transactions = transactions.items[randomTransaction].status;
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          transactions.items[randomTransaction].to,
          "The to address value is empty in the get transactions response."
        );
        to_transactions = transactions.items[randomTransaction].to;
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          transactions.items[randomTransaction].value,
          "The value's value is empty in the get transactions response."
        );
        value_transactions = transactions.items[randomTransaction].value;
      } catch (e) {
        console.log(e);
      }

      try {
        assert.strictEqual(
          transactions.items[randomTransaction].direction,
          "Sender",
          "The direction value is empty in the get transactions response."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isTrue(
          transactions.items[randomTransaction].mainTransactionDataFetched,
          "The mainTransactionDataFetched value is not true in the get transactions response."
        );
        mainTransactionDataFetched_transactions =
          transactions.items[randomTransaction].mainTransactionDataFetched;
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isFalse(
          transactions.items[randomTransaction].internalTransactionsFetched,
          "The internalTransactionsFetched value is not false in the get transactions response."
        );
        internalTransactionsFetched_transactions =
          transactions.items[randomTransaction].internalTransactionsFetched;
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          transactions.items[randomTransaction].batch,
          "The batch value is empty in the get transactions response."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          transactions.items[randomTransaction].assert,
          "The assert value is empty in the get transactions response."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          transactions.items[randomTransaction].blockExplorerUrl,
          "The blockExplorerUrl value is empty in the get transactions response."
        );
        blockExplorerUrl_transactions =
          transactions.items[randomTransaction].blockExplorerUrl;
      } catch (e) {
        console.log(e);
      }
    } catch (e) {
      assert.fail(
        "An error is displayed while Fetching historical transactions."
      );
    }

    // Fetching a single transaction
    let singleTransaction;
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

    try {
      singleTransaction = await xdaiTestNetSdk.getTransaction({
        hash: randomHash, // Add your transaction hash
      });

      try {
        assert.isNotEmpty(
          singleTransaction.blockHash,
          "The blockHash value is empty in the get single transaction response."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNumber(
          singleTransaction.blockNumber,
          "The blockNumber value is not number in the get single transaction response."
        );
        blockNumber_singleTransaction = singleTransaction.blockNumber;
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          singleTransaction.from,
          "The from address value is empty in the get single transaction response."
        );
        from_singleTransaction = singleTransaction.from;
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNumber(
          singleTransaction.gasLimit,
          "The gasLimit value is not number in the get single transaction response."
        );
        gasLimit_singleTransaction = singleTransaction.gasLimit;
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          singleTransaction.gasPrice,
          "The gasPrice value is empty in the get single transaction response."
        );
        gasPrice_singleTransaction = singleTransaction.gasPrice;
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNumber(
          singleTransaction.gasUsed,
          "The gasUsed value is not number in the get single transaction response."
        );
        gasUsed_singleTransaction = singleTransaction.gasUsed;
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          singleTransaction.hash,
          "The hash value is empty in the get single transaction response."
        );
        hash_singleTransaction = singleTransaction.hash;
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          singleTransaction.input,
          "The input value is empty in the get single transaction response."
        );
      } catch (e) {
        console.log(e);
      }

      for (let i = 0; i < singleTransaction.logs.length; i++) {
        try {
          assert.isNotEmpty(
            singleTransaction.logs[i].address,
            "The address of the logs value is empty in the get single transaction response."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNotEmpty(
            singleTransaction.logs[i].data,
            "The data of the logs value is empty in the get single transaction response."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNotEmpty(
            singleTransaction.logs[i].decoded,
            "The decoded of the logs value is empty in the get single transaction response."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNotEmpty(
            singleTransaction.logs[i].topics,
            "The topics of the logs value is empty in the get single transaction response."
          );
        } catch (e) {
          console.log(e);
        }
      }

      try {
        assert.isNumber(
          singleTransaction.nonce,
          "The nonce value is not number in the get single transaction response."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.strictEqual(
          singleTransaction.status,
          "Completed",
          "The status value is empty in the get single transaction response."
        );
        status_singleTransaction = singleTransaction.status;
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNumber(
          singleTransaction.timestamp,
          "The timestamp value is not number in the get single transaction response."
        );
        timestamp_singleTransaction = singleTransaction.timestamp;
      } catch (e) {
        console.log(e);
      }

      try {
        assert.strictEqual(
          singleTransaction.to,
          "0x432defD2b3733e6fEBb1bD4B17Ed85D15b882163",
          "The To Address value is empty in the get single transaction response."
        );
        to_singleTransaction = singleTransaction.to;
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNumber(
          singleTransaction.transactionIndex,
          "The To transactionIndex value is not number in the get single transaction response."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          singleTransaction.value,
          "The To value value is empty in the get single transaction response."
        );
        value_singleTransaction = singleTransaction.value;
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          singleTransaction.blockExplorerUrl,
          "The To blockExplorerUrl value is empty in the get single transaction response."
        );
        blockExplorerUrl_singleTransaction = singleTransaction.blockExplorerUrl;
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isTrue(
          singleTransaction.mainTransactionDataFetched,
          "The To mainTransactionDataFetched value is not true in the get single transaction response."
        );
        mainTransactionDataFetched_singleTransaction =
          singleTransaction.mainTransactionDataFetched;
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isFalse(
          singleTransaction.internalTransactionsFetched,
          "The To internalTransactions value is not false in the get single transaction response."
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
    } catch (e) {
      assert.fail("An error is displayed while Fetching single transaction.");
    }
  });

  // GET TRANSACTION HISTORY WITH INCORRECT HASH FROM XDAI NETWORK
  it("Setup the SDK for xDai network and get the transaction history with incorrect hash", async () => {
    // initialize the sdk
    let xdaiTestNetSdk;
    try {
      xdaiTestNetSdk = new Sdk(process.env.PRIVATE_KEY, {
        env: EnvNames.TestNets,
        networkName: NetworkNames.Xdai,
      });

      assert.strictEqual(
        xdaiTestNetSdk.state.accountAddress,
        "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f",
        "The EOA Address is not calculated correctly."
      );
    } catch (e) {
      assert.fail("The SDK is not initialled successfully.");
    }

    // Compute the smart wallet address
    try {
      let smartWalletOutput = await xdaiTestNetSdk.computeContractAccount();
      let xdaiSmartWalletAddress = smartWalletOutput.address;

      assert.strictEqual(
        xdaiSmartWalletAddress,
        "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
        "The smart wallet address is not calculated correctly."
      );
    } catch (e) {
      assert.fail("The smart wallet address is not calculated successfully.");
    }

    // Fetching a single transaction
    try {
      let output = await xdaiTestNetSdk.getTransaction({
        hash: "0x3df9fe91b29f4b2bf1b148baf2f9E207e98137F8318ccf39eDc930d1ceA551df", // Incorrect Transaction Hash
      });

      if (output == null) {
        console.log(
          "The null is received while fetching the transaction history with incorrect hash."
        );
      } else {
        assert.fail(
          "Getting the single transaction history with incorrect Hash."
        );
      }
    } catch (e) {
      assert.fail(
        "Getting the single transaction history with incorrect Hash."
      );
    }
  });

  // GET TRANSACTION HISTORY WHEN HASH HEX IS NOT WITH 32 SIZE FROM XDAI NETWORK
  it("Setup the SDK for xDai network and get the transaction history when hash hex is not with 32 size", async () => {
    // initialize the sdk
    let xdaiTestNetSdk;
    try {
      xdaiTestNetSdk = new Sdk(process.env.PRIVATE_KEY, {
        env: EnvNames.TestNets,
        networkName: NetworkNames.Xdai,
      });

      assert.strictEqual(
        xdaiTestNetSdk.state.accountAddress,
        "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f",
        "The EOA Address is not calculated correctly."
      );
    } catch (e) {
      assert.fail("The SDK is not initialled successfully.");
    }

    // Compute the smart wallet address
    try {
      let smartWalletOutput = await xdaiTestNetSdk.computeContractAccount();
      let xdaiSmartWalletAddress = smartWalletOutput.address;

      assert.strictEqual(
        xdaiSmartWalletAddress,
        "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
        "The smart wallet address is not calculated correctly."
      );
    } catch (e) {
      assert.fail("The smart wallet address is not calculated successfully.");
    }

    // Fetching a single transaction
    try {
      try {
        await xdaiTestNetSdk.getTransaction({
          hash: "0x3df9fe91b29f4b2bf1b148baf2f9E207e98137F8z18ccf39eDc930d1ceA551df", // Incorrect Transaction Hash
        });

        assert.fail(
          "The transaction history is fetched with hash which not having 32 size hex."
        );
      } catch (e) {
        if (e.errors[0].constraints.isHex == "hash must be hex with 32 size") {
          console.log(
            "The validation message is displayed when hash not having 32 size hex while fetching the transaction history."
          );
        } else {
          assert.fail(
            "The transaction history is fetched with hash which not having 32 size hex."
          );
        }
      }
    } catch (e) {
      assert.fail(
        "The transaction history is fetched with hash which not having 32 size hex."
      );
    }
  });
});
