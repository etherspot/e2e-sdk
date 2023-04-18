import * as dotenv from "dotenv";
dotenv.config(); // init dotenv

import { assert, expect } from "chai";
import { EnvNames, NetworkNames, Sdk } from "etherspot";
import { BigNumber } from "ethers";
import Helper from "../../../utils/Helper.js";

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
    // console.log("Batch Reponse: ", addTransactionToBatchOutput);

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
        "The value of the data field of the Batch Reponse is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNull(
        addTransactionToBatchOutput.estimation,
        "It is not expected behaviour of the estimation in the Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    // Estimating the batch
    let EstimatedGas_Estimate;
    let FeeAmount_Estimate;
    let EstimatedGasPrice_Estimate;

    const estimationResponse = await sdkTestNet.estimateGatewayBatch();
    // console.log("Gas estimated at:", estimationResponse);

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
        "The value of the data field of the Estimation Response is not displayed."
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
        "The estimatedGas of the Estimate Batch Response is not displayed."
      );
      EstimatedGas_Estimate = estimationResponse.estimation.estimatedGas;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        estimationResponse.estimation.feeAmount,
        "The value of the feeAmount field of the Estimation Response is not displayed."
      );
      FeeAmount_Estimate = estimationResponse.estimation.feeAmount._hex;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        estimationResponse.estimation.estimatedGasPrice,
        "The value of the estimatedGasPrice field of the Estimation Response is not displayed."
      );
      EstimatedGasPrice_Estimate =
        estimationResponse.estimation.estimatedGasPrice._hex;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        estimationResponse.estimation.signature,
        "The value of the signature field of the Estimation Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    // Submitting the batch
    let EstimatedGas_Submit;
    let FeeAmount_Submit;
    let EstimatedGasPrice_Submit;

    const submissionResponse = await sdkTestNet.submitGatewayBatch({
      guarded: false,
    });
    // console.log("Status of the batch submition: ", submissionResponse);
    hashAddressBig = BigNumber.from(submissionResponse.hash)._hex;
    console.log("BIG HASH ADDRESS: ", hashAddressBig);

    try {
      assert.isNull(
        submissionResponse.transaction,
        "It is not expected behaviour of the transaction in the Get Submitted Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.hash,
        "The value of the hash field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        submissionResponse.state,
        "Queued",
        "The status of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        submissionResponse.account,
        "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
        "The account address of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        submissionResponse.nonce,
        "The nonce number of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        submissionResponse.to[0],
        "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
        "The To Address in the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.data[0],
        "The value of the data field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.senderSignature,
        "The value of the senderSignature field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        submissionResponse.estimatedGas,
        "The Estimated Gas number of the Get Submitted Batch Response is not displayed."
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
        "The value of the estimatedGasPrice field of the Get Submitted Batch Response is not displayed."
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
        "It is not expected behaviour of the feeToken in the Get Submitted Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.feeAmount._hex,
        "The value of the feeAmount field of the Get Submitted Batch Response is not displayed."
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
        "The value of the feeData field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNull(
        submissionResponse.delayedUntil,
        "It is not expected behaviour of the delayedUntil in the Get Submitted Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    // get the submitted batch and wait till the status become sent
    do {
      const output = await sdkTestNet.getGatewaySubmittedBatch({
        hash: hashAddressBig,
      });
      transactionState = output.state;

      Helper.wait(2000);
    } while (!(transactionState == "Sent"));

    // get submmited batch with sent status
    let EstimatedGas_Submitted;
    let FeeAmount_Submitted;
    let EstimatedGasPrice_Submitted;

    const output = await sdkTestNet.getGatewaySubmittedBatch({
      hash: hashAddressBig,
    });
    // console.log("Gateway Submitted Batch after sending: ", output);

    try {
      assert.isNotEmpty(
        output.transaction.hash,
        "The Hash of the transaction of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.transaction.state,
        "Sent",
        "The state of the transaction of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.transaction.sender,
        "The sender address of the transaction of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.transaction.gasPrice,
        "The gasPrice of the transaction of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        output.transaction.gasUsed,
        "The gasUsed of the transaction of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.transaction.totalCost,
        "The totalCost of the transaction of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.logs[0].address,
        "The address of the logs of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.logs[0].data,
        "The data of the logs of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.logs[0].topics,
        "The topics of the logs of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.hash,
        "The value of the hash field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.state,
        "Sent",
        "The status of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.account,
        "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
        "The account address of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        output.nonce,
        "The nonce number of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.to[0],
        "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
        "The To Address in the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.data[0],
        "The value of the data field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.senderSignature,
        "The value of the senderSignature field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        output.estimatedGas,
        "The Estimated Gas number of the Get Submitted Batch Response is not displayed."
      );
      EstimatedGas_Submitted = output.estimatedGas;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        EstimatedGas_Estimate,
        EstimatedGas_Submitted,
        "The Estimated Gas value is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.estimatedGasPrice._hex,
        "The value of the estimatedGasPrice field of the Get Submitted Batch Response is not displayed."
      );
      EstimatedGasPrice_Submitted = output.estimatedGasPrice._hex;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        EstimatedGasPrice_Estimate,
        EstimatedGasPrice_Submitted,
        "The Estimated Gas Price value is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNull(
        output.feeToken,
        "It is not expected behaviour of the feeToken in the Get Submitted Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.feeAmount._hex,
        "The value of the feeAmount field of the Get Submitted Batch Response is not displayed."
      );

      FeeAmount_Submitted = output.feeAmount._hex;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        FeeAmount_Estimate,
        FeeAmount_Submitted,
        "The Fee Amount value is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.feeData,
        "The value of the feeData field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNull(
        output.delayedUntil,
        "It is not expected behaviour of the delayedUntil in the Get Submitted Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.events[0].contract,
        "PersonalAccountRegistry",
        "The contract of the events is not displayed in the Get Submitted Batch Response"
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.events[0].event,
        "AccountTransactionExecuted",
        "The event of the events is not displayed in the Get Submitted Batch Response"
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.events[0].args,
        "The args of the events is not displayed in the Get Submitted Batch Response"
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.events[1].contract,
        "PersonalAccountRegistry",
        "The contract of the events is not displayed in the Get Submitted Batch Response"
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.events[1].event,
        "AccountCallRefunded",
        "The event of the events is not displayed in the Get Submitted Batch Response"
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.events[1].args,
        "The args of the events is not displayed in the Get Submitted Batch Response"
      );
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

    const singleTransaction = await sdkTestNet.getTransaction({
      hash: output.transaction.hash, // Add your transaction hash
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

    const transactions = await sdkTestNet.getTransactions();
    // console.log("Transactions: ", transactions);

    for (let x = 0; x < transactions.items.length; x++) {
      blockNumber_transactions = transactions.items[x].blockNumber;

      if (blockNumber_singleTransaction == blockNumber_transactions) {
        try {
          assert.isNumber(
            transactions.items[x].blockNumber,
            "The blockNumber of the get transactions response is not displayed."
          );
          blockNumber_transactions = transactions.items[x].blockNumber;
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
          assert.isNumber(
            transactions.items[x].timestamp,
            "The timestamp of the get transactions response is not displayed."
          );
          timestamp_transactions = transactions.items[x].timestamp;
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
          assert.isNotEmpty(
            transactions.items[x].from,
            "The from address of the get transactions response is not displayed."
          );
          from_transactions = transactions.items[x].from;
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
          assert.isNumber(
            transactions.items[x].gasLimit,
            "The gasLimit of the get transactions response is not displayed."
          );
          gasLimit_transactions = transactions.items[x].gasLimit;
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
          assert.isNotEmpty(
            transactions.items[x].gasPrice,
            "The gasPrice of the get transactions response is not displayed."
          );
          gasPrice_transactions = transactions.items[x].gasPrice;
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
          assert.isNumber(
            transactions.items[x].gasUsed,
            "The gasUsed of the get transactions response is not displayed."
          );
          gasUsed_transactions = transactions.items[x].gasUsed;
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
          assert.isNotEmpty(
            transactions.items[x].hash,
            "The hash of the get transactions response is not displayed."
          );
          hash_transactions = transactions.items[x].hash;
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
          assert.isNotEmpty(
            transactions.items[x].logs,
            "The logs of the get transactions response is not displayed."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.strictEqual(
            transactions.items[x].status,
            "Completed",
            "The status of the get transactions response is not displayed."
          );
          status_transactions = transactions.items[x].status;
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
          assert.isNotEmpty(
            transactions.items[x].to,
            "The to address of the get transactions response is not displayed."
          );
          to_transactions = transactions.items[x].to;
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
          assert.isNotEmpty(
            transactions.items[x].value,
            "The value of the get transactions response is not displayed."
          );
          value_transactions = transactions.items[x].value;
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
            transactions.items[x].direction,
            "Sender",
            "The direction of the get transactions response is not displayed."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isTrue(
            transactions.items[x].mainTransactionDataFetched,
            "The mainTransactionDataFetched of the get transactions response is not displayed."
          );
          mainTransactionDataFetched_transactions =
            transactions.items[x].mainTransactionDataFetched;
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
          assert.isFalse(
            transactions.items[x].internalTransactionsFetched,
            "The internalTransactionsFetched of the get transactions response is not displayed."
          );
          internalTransactionsFetched_transactions =
            transactions.items[x].internalTransactionsFetched;
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
          assert.isNotEmpty(
            transactions.items[x].batch,
            "The batch of the get transactions response is not displayed."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNotEmpty(
            transactions.items[x].assert,
            "The assert of the get transactions response is not displayed."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNotEmpty(
            transactions.items[x].blockExplorerUrl,
            "The blockExplorerUrl of the get transactions response is not displayed."
          );
          blockExplorerUrl_transactions =
            transactions.items[x].blockExplorerUrl;
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

        // validate hash of submitted batch and single transaction is displayed same
        try {
          assert.strictEqual(
            output.transaction.hash,
            singleTransaction.hash,
            "The hash of the get single transaction response and get submitted Batch response are not matched."
          );
        } catch (e) {
          console.log(e);
        }

        // validate hash of submitted batch and from transactions list is displayed same
        try {
          assert.strictEqual(
            output.transaction.hash,
            transactions.items[x].hash,
            "The hash of the get transactions response and get submitted Batch response are not matched."
          );
        } catch (e) {
          console.log(e);
        }
        break;
      }
    }
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
    // console.log("Batch Reponse: ", addTransactionToBatchOutput);

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
        "The value of the data field of the Batch Reponse is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNull(
        addTransactionToBatchOutput.estimation,
        "It is not expected behaviour of the estimation in the Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    // Estimating the batch
    let EstimatedGas_Estimate;
    let FeeAmount_Estimate;
    let EstimatedGasPrice_Estimate;

    const estimationResponse = await sdkTestNet.estimateGatewayBatch();
    // console.log("Gas estimated at:", estimationResponse);

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
        "The value of the data field of the Estimation Response is not displayed."
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
        "The estimatedGas of the Estimate Batch Response is not displayed."
      );
      EstimatedGas_Estimate = estimationResponse.estimation.estimatedGas;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        estimationResponse.estimation.feeAmount,
        "The value of the feeAmount field of the Estimation Response is not displayed."
      );
      FeeAmount_Estimate = estimationResponse.estimation.feeAmount._hex;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        estimationResponse.estimation.estimatedGasPrice,
        "The value of the estimatedGasPrice field of the Estimation Response is not displayed."
      );
      EstimatedGasPrice_Estimate =
        estimationResponse.estimation.estimatedGasPrice._hex;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        estimationResponse.estimation.signature,
        "The value of the signature field of the Estimation Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    // Submitting the batch
    let EstimatedGas_Submit;
    let FeeAmount_Submit;
    let EstimatedGasPrice_Submit;

    const submissionResponse = await sdkTestNet.submitGatewayBatch({
      guarded: false,
    });
    // console.log("Status of the batch submition: ", submissionResponse);
    hashAddressBig = BigNumber.from(submissionResponse.hash)._hex;
    console.log("BIG HASH ADDRESS: ", hashAddressBig);

    try {
      assert.isNull(
        submissionResponse.transaction,
        "It is not expected behaviour of the transaction in the Get Submitted Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.hash,
        "The value of the hash field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        submissionResponse.state,
        "Queued",
        "The status of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        submissionResponse.account,
        "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
        "The account address of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        submissionResponse.nonce,
        "The nonce number of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        submissionResponse.to[0],
        "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
        "The To Address in the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.data[0],
        "The value of the data field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.senderSignature,
        "The value of the senderSignature field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        submissionResponse.estimatedGas,
        "The Estimated Gas number of the Get Submitted Batch Response is not displayed."
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
        "The value of the estimatedGasPrice field of the Get Submitted Batch Response is not displayed."
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
        "It is not expected behaviour of the feeToken in the Get Submitted Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.feeAmount._hex,
        "The value of the feeAmount field of the Get Submitted Batch Response is not displayed."
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
        "The value of the feeData field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNull(
        submissionResponse.delayedUntil,
        "It is not expected behaviour of the delayedUntil in the Get Submitted Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    // get the submitted batch and wait till the status become sent
    do {
      const output = await sdkTestNet.getGatewaySubmittedBatch({
        hash: hashAddressBig,
      });
      transactionState = output.state;

      Helper.wait(2000);
    } while (!(transactionState == "Sent"));

    // get submmited batch with sent status
    let EstimatedGas_Submitted;
    let FeeAmount_Submitted;
    let EstimatedGasPrice_Submitted;

    const output = await sdkTestNet.getGatewaySubmittedBatch({
      hash: hashAddressBig,
    });
    // console.log("Gateway Submitted Batch after sending: ", output);

    try {
      assert.isNotEmpty(
        output.transaction.hash,
        "The Hash of the transaction of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.transaction.state,
        "Sent",
        "The state of the transaction of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.transaction.sender,
        "The sender address of the transaction of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.transaction.gasPrice,
        "The gasPrice of the transaction of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        output.transaction.gasUsed,
        "The gasUsed of the transaction of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.transaction.totalCost,
        "The totalCost of the transaction of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.logs[0].address,
        "The address of the logs of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.logs[0].data,
        "The data of the logs of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.logs[0].topics,
        "The topics of the logs of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.hash,
        "The value of the hash field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.state,
        "Sent",
        "The status of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.account,
        "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
        "The account address of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        output.nonce,
        "The nonce number of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.to[0],
        "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
        "The To Address in the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.data[0],
        "The value of the data field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.senderSignature,
        "The value of the senderSignature field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        output.estimatedGas,
        "The Estimated Gas number of the Get Submitted Batch Response is not displayed."
      );
      EstimatedGas_Submitted = output.estimatedGas;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        EstimatedGas_Estimate,
        EstimatedGas_Submitted,
        "The Estimated Gas value is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.estimatedGasPrice._hex,
        "The value of the estimatedGasPrice field of the Get Submitted Batch Response is not displayed."
      );
      EstimatedGasPrice_Submitted = output.estimatedGasPrice._hex;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        EstimatedGasPrice_Estimate,
        EstimatedGasPrice_Submitted,
        "The Estimated Gas Price value is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNull(
        output.feeToken,
        "It is not expected behaviour of the feeToken in the Get Submitted Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.feeAmount._hex,
        "The value of the feeAmount field of the Get Submitted Batch Response is not displayed."
      );

      FeeAmount_Submitted = output.feeAmount._hex;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        FeeAmount_Estimate,
        FeeAmount_Submitted,
        "The Fee Amount value is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.feeData,
        "The value of the feeData field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNull(
        output.delayedUntil,
        "It is not expected behaviour of the delayedUntil in the Get Submitted Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.events[0].contract,
        "PersonalAccountRegistry",
        "The contract of the events is not displayed in the Get Submitted Batch Response"
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.events[0].event,
        "AccountTransactionExecuted",
        "The event of the events is not displayed in the Get Submitted Batch Response"
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.events[0].args,
        "The args of the events is not displayed in the Get Submitted Batch Response"
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.events[1].contract,
        "PersonalAccountRegistry",
        "The contract of the events is not displayed in the Get Submitted Batch Response"
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.events[1].event,
        "AccountCallRefunded",
        "The event of the events is not displayed in the Get Submitted Batch Response"
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.events[1].args,
        "The args of the events is not displayed in the Get Submitted Batch Response"
      );
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

    const singleTransaction = await sdkTestNet.getTransaction({
      hash: output.transaction.hash, // Add your transaction hash
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

    const transactions = await sdkTestNet.getTransactions();
    // console.log("Transactions: ", transactions);

    for (let x = 0; x < transactions.items.length; x++) {
      blockNumber_transactions = transactions.items[x].blockNumber;

      if (blockNumber_singleTransaction == blockNumber_transactions) {
        try {
          assert.isNumber(
            transactions.items[x].blockNumber,
            "The blockNumber of the get transactions response is not displayed."
          );
          blockNumber_transactions = transactions.items[x].blockNumber;
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
          assert.isNumber(
            transactions.items[x].timestamp,
            "The timestamp of the get transactions response is not displayed."
          );
          timestamp_transactions = transactions.items[x].timestamp;
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
          assert.isNotEmpty(
            transactions.items[x].from,
            "The from address of the get transactions response is not displayed."
          );
          from_transactions = transactions.items[x].from;
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
          assert.isNumber(
            transactions.items[x].gasLimit,
            "The gasLimit of the get transactions response is not displayed."
          );
          gasLimit_transactions = transactions.items[x].gasLimit;
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
          assert.isNotEmpty(
            transactions.items[x].gasPrice,
            "The gasPrice of the get transactions response is not displayed."
          );
          gasPrice_transactions = transactions.items[x].gasPrice;
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
          assert.isNumber(
            transactions.items[x].gasUsed,
            "The gasUsed of the get transactions response is not displayed."
          );
          gasUsed_transactions = transactions.items[x].gasUsed;
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
          assert.isNotEmpty(
            transactions.items[x].hash,
            "The hash of the get transactions response is not displayed."
          );
          hash_transactions = transactions.items[x].hash;
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
          assert.isNotEmpty(
            transactions.items[x].logs,
            "The logs of the get transactions response is not displayed."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.strictEqual(
            transactions.items[x].status,
            "Completed",
            "The status of the get transactions response is not displayed."
          );
          status_transactions = transactions.items[x].status;
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
          assert.isNotEmpty(
            transactions.items[x].to,
            "The to address of the get transactions response is not displayed."
          );
          to_transactions = transactions.items[x].to;
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
          assert.isNotEmpty(
            transactions.items[x].value,
            "The value of the get transactions response is not displayed."
          );
          value_transactions = transactions.items[x].value;
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
            transactions.items[x].direction,
            "Sender",
            "The direction of the get transactions response is not displayed."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isTrue(
            transactions.items[x].mainTransactionDataFetched,
            "The mainTransactionDataFetched of the get transactions response is not displayed."
          );
          mainTransactionDataFetched_transactions =
            transactions.items[x].mainTransactionDataFetched;
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
          assert.isFalse(
            transactions.items[x].internalTransactionsFetched,
            "The internalTransactionsFetched of the get transactions response is not displayed."
          );
          internalTransactionsFetched_transactions =
            transactions.items[x].internalTransactionsFetched;
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
          assert.isNotEmpty(
            transactions.items[x].batch,
            "The batch of the get transactions response is not displayed."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNotEmpty(
            transactions.items[x].assert,
            "The assert of the get transactions response is not displayed."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNotEmpty(
            transactions.items[x].blockExplorerUrl,
            "The blockExplorerUrl of the get transactions response is not displayed."
          );
          blockExplorerUrl_transactions =
            transactions.items[x].blockExplorerUrl;
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

        // validate hash of submitted batch and single transaction is displayed same
        try {
          assert.strictEqual(
            output.transaction.hash,
            singleTransaction.hash,
            "The hash of the get single transaction response and get submitted Batch response are not matched."
          );
        } catch (e) {
          console.log(e);
        }

        // validate hash of submitted batch and from transactions list is displayed same
        try {
          assert.strictEqual(
            output.transaction.hash,
            transactions.items[x].hash,
            "The hash of the get transactions response and get submitted Batch response are not matched."
          );
        } catch (e) {
          console.log(e);
        }
        break;
      }
    }
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
    // console.log("Batch Reponse: ", addTransactionToBatchOutput);

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
        "The value of the data field of the Batch Reponse is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNull(
        addTransactionToBatchOutput.estimation,
        "It is not expected behaviour of the estimation in the Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    // Estimating the batch
    let EstimatedGas_Estimate;
    let FeeAmount_Estimate;
    let EstimatedGasPrice_Estimate;

    const estimationResponse = await sdkTestNet.estimateGatewayBatch();
    // console.log("Gas estimated at:", estimationResponse);

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
        "The value of the data field of the Estimation Response is not displayed."
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
        "The estimatedGas of the Estimate Batch Response is not displayed."
      );
      EstimatedGas_Estimate = estimationResponse.estimation.estimatedGas;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        estimationResponse.estimation.feeAmount,
        "The value of the feeAmount field of the Estimation Response is not displayed."
      );
      FeeAmount_Estimate = estimationResponse.estimation.feeAmount._hex;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        estimationResponse.estimation.estimatedGasPrice,
        "The value of the estimatedGasPrice field of the Estimation Response is not displayed."
      );
      EstimatedGasPrice_Estimate =
        estimationResponse.estimation.estimatedGasPrice._hex;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        estimationResponse.estimation.signature,
        "The value of the signature field of the Estimation Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    // Submitting the batch
    let EstimatedGas_Submit;
    let FeeAmount_Submit;
    let EstimatedGasPrice_Submit;

    const submissionResponse = await sdkTestNet.submitGatewayBatch({
      guarded: false,
    });
    // console.log("Status of the batch submition: ", submissionResponse);
    hashAddressBig = BigNumber.from(submissionResponse.hash)._hex;
    console.log("BIG HASH ADDRESS: ", hashAddressBig);

    try {
      assert.isNull(
        submissionResponse.transaction,
        "It is not expected behaviour of the transaction in the Get Submitted Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.hash,
        "The value of the hash field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        submissionResponse.state,
        "Queued",
        "The status of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        submissionResponse.account,
        "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
        "The account address of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        submissionResponse.nonce,
        "The nonce number of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        submissionResponse.to[0],
        "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
        "The To Address in the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.data[0],
        "The value of the data field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.senderSignature,
        "The value of the senderSignature field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        submissionResponse.estimatedGas,
        "The Estimated Gas number of the Get Submitted Batch Response is not displayed."
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
        "The value of the estimatedGasPrice field of the Get Submitted Batch Response is not displayed."
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
        "It is not expected behaviour of the feeToken in the Get Submitted Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.feeAmount._hex,
        "The value of the feeAmount field of the Get Submitted Batch Response is not displayed."
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
        "The value of the feeData field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNull(
        submissionResponse.delayedUntil,
        "It is not expected behaviour of the delayedUntil in the Get Submitted Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    // get the submitted batch and wait till the status become sent
    do {
      const output = await sdkTestNet.getGatewaySubmittedBatch({
        hash: hashAddressBig,
      });
      transactionState = output.state;

      Helper.wait(2000);
    } while (!(transactionState == "Sent"));

    // get submmited batch with sent status
    let EstimatedGas_Submitted;
    let FeeAmount_Submitted;
    let EstimatedGasPrice_Submitted;

    const output = await sdkTestNet.getGatewaySubmittedBatch({
      hash: hashAddressBig,
    });
    // console.log("Gateway Submitted Batch after sending: ", output);

    try {
      assert.isNotEmpty(
        output.transaction.hash,
        "The Hash of the transaction of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.transaction.state,
        "Sent",
        "The state of the transaction of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.transaction.sender,
        "The sender address of the transaction of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.transaction.gasPrice,
        "The gasPrice of the transaction of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        output.transaction.gasUsed,
        "The gasUsed of the transaction of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.transaction.totalCost,
        "The totalCost of the transaction of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.logs[0].address,
        "The address of the logs of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.logs[0].data,
        "The data of the logs of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.logs[0].topics,
        "The topics of the logs of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.hash,
        "The value of the hash field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.state,
        "Sent",
        "The status of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.account,
        "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
        "The account address of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        output.nonce,
        "The nonce number of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.to[0],
        "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
        "The To Address in the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.data[0],
        "The value of the data field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.senderSignature,
        "The value of the senderSignature field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        output.estimatedGas,
        "The Estimated Gas number of the Get Submitted Batch Response is not displayed."
      );
      EstimatedGas_Submitted = output.estimatedGas;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        EstimatedGas_Estimate,
        EstimatedGas_Submitted,
        "The Estimated Gas value is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.estimatedGasPrice._hex,
        "The value of the estimatedGasPrice field of the Get Submitted Batch Response is not displayed."
      );
      EstimatedGasPrice_Submitted = output.estimatedGasPrice._hex;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        EstimatedGasPrice_Estimate,
        EstimatedGasPrice_Submitted,
        "The Estimated Gas Price value is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNull(
        output.feeToken,
        "It is not expected behaviour of the feeToken in the Get Submitted Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.feeAmount._hex,
        "The value of the feeAmount field of the Get Submitted Batch Response is not displayed."
      );

      FeeAmount_Submitted = output.feeAmount._hex;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        FeeAmount_Estimate,
        FeeAmount_Submitted,
        "The Fee Amount value is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.feeData,
        "The value of the feeData field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNull(
        output.delayedUntil,
        "It is not expected behaviour of the delayedUntil in the Get Submitted Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.events[0].contract,
        "PersonalAccountRegistry",
        "The contract of the events is not displayed in the Get Submitted Batch Response"
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.events[0].event,
        "AccountTransactionExecuted",
        "The event of the events is not displayed in the Get Submitted Batch Response"
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.events[0].args,
        "The args of the events is not displayed in the Get Submitted Batch Response"
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.events[1].contract,
        "PersonalAccountRegistry",
        "The contract of the events is not displayed in the Get Submitted Batch Response"
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.events[1].event,
        "AccountCallRefunded",
        "The event of the events is not displayed in the Get Submitted Batch Response"
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.events[1].args,
        "The args of the events is not displayed in the Get Submitted Batch Response"
      );
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

    const singleTransaction = await sdkTestNet.getTransaction({
      hash: output.transaction.hash, // Add your transaction hash
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

    const transactions = await sdkTestNet.getTransactions();
    // console.log("Transactions: ", transactions);

    for (let x = 0; x < transactions.items.length; x++) {
      blockNumber_transactions = transactions.items[x].blockNumber;

      if (blockNumber_singleTransaction == blockNumber_transactions) {
        try {
          assert.isNumber(
            transactions.items[x].blockNumber,
            "The blockNumber of the get transactions response is not displayed."
          );
          blockNumber_transactions = transactions.items[x].blockNumber;
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
          assert.isNumber(
            transactions.items[x].timestamp,
            "The timestamp of the get transactions response is not displayed."
          );
          timestamp_transactions = transactions.items[x].timestamp;
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
          assert.isNotEmpty(
            transactions.items[x].from,
            "The from address of the get transactions response is not displayed."
          );
          from_transactions = transactions.items[x].from;
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
          assert.isNumber(
            transactions.items[x].gasLimit,
            "The gasLimit of the get transactions response is not displayed."
          );
          gasLimit_transactions = transactions.items[x].gasLimit;
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
          assert.isNotEmpty(
            transactions.items[x].gasPrice,
            "The gasPrice of the get transactions response is not displayed."
          );
          gasPrice_transactions = transactions.items[x].gasPrice;
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
          assert.isNumber(
            transactions.items[x].gasUsed,
            "The gasUsed of the get transactions response is not displayed."
          );
          gasUsed_transactions = transactions.items[x].gasUsed;
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
          assert.isNotEmpty(
            transactions.items[x].hash,
            "The hash of the get transactions response is not displayed."
          );
          hash_transactions = transactions.items[x].hash;
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
          assert.isNotEmpty(
            transactions.items[x].logs,
            "The logs of the get transactions response is not displayed."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.strictEqual(
            transactions.items[x].status,
            "Completed",
            "The status of the get transactions response is not displayed."
          );
          status_transactions = transactions.items[x].status;
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
          assert.isNotEmpty(
            transactions.items[x].to,
            "The to address of the get transactions response is not displayed."
          );
          to_transactions = transactions.items[x].to;
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
          assert.isNotEmpty(
            transactions.items[x].value,
            "The value of the get transactions response is not displayed."
          );
          value_transactions = transactions.items[x].value;
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
            transactions.items[x].direction,
            "Sender",
            "The direction of the get transactions response is not displayed."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isTrue(
            transactions.items[x].mainTransactionDataFetched,
            "The mainTransactionDataFetched of the get transactions response is not displayed."
          );
          mainTransactionDataFetched_transactions =
            transactions.items[x].mainTransactionDataFetched;
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
          assert.isFalse(
            transactions.items[x].internalTransactionsFetched,
            "The internalTransactionsFetched of the get transactions response is not displayed."
          );
          internalTransactionsFetched_transactions =
            transactions.items[x].internalTransactionsFetched;
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
          assert.isNotEmpty(
            transactions.items[x].batch,
            "The batch of the get transactions response is not displayed."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNotEmpty(
            transactions.items[x].assert,
            "The assert of the get transactions response is not displayed."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNotEmpty(
            transactions.items[x].blockExplorerUrl,
            "The blockExplorerUrl of the get transactions response is not displayed."
          );
          blockExplorerUrl_transactions =
            transactions.items[x].blockExplorerUrl;
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

        // validate hash of submitted batch and single transaction is displayed same
        try {
          assert.strictEqual(
            output.transaction.hash,
            singleTransaction.hash,
            "The hash of the get single transaction response and get submitted Batch response are not matched."
          );
        } catch (e) {
          console.log(e);
        }

        // validate hash of submitted batch and from transactions list is displayed same
        try {
          assert.strictEqual(
            output.transaction.hash,
            transactions.items[x].hash,
            "The hash of the get transactions response and get submitted Batch response are not matched."
          );
        } catch (e) {
          console.log(e);
        }
        break;
      }
    }
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
    // console.log("Batch Reponse: ", addTransactionToBatchOutput);

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
        "The value of the data field of the Batch Reponse is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNull(
        addTransactionToBatchOutput.estimation,
        "It is not expected behaviour of the estimation in the Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    // Estimating the batch
    let EstimatedGas_Estimate;
    let FeeAmount_Estimate;
    let EstimatedGasPrice_Estimate;

    const estimationResponse = await sdkTestNet.estimateGatewayBatch();
    // console.log("Gas estimated at:", estimationResponse);

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
        "The value of the data field of the Estimation Response is not displayed."
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
        "The estimatedGas of the Estimate Batch Response is not displayed."
      );
      EstimatedGas_Estimate = estimationResponse.estimation.estimatedGas;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        estimationResponse.estimation.feeAmount,
        "The value of the feeAmount field of the Estimation Response is not displayed."
      );
      FeeAmount_Estimate = estimationResponse.estimation.feeAmount._hex;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        estimationResponse.estimation.estimatedGasPrice,
        "The value of the estimatedGasPrice field of the Estimation Response is not displayed."
      );
      EstimatedGasPrice_Estimate =
        estimationResponse.estimation.estimatedGasPrice._hex;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        estimationResponse.estimation.signature,
        "The value of the signature field of the Estimation Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    // Submitting the batch
    let EstimatedGas_Submit;
    let FeeAmount_Submit;
    let EstimatedGasPrice_Submit;

    const submissionResponse = await sdkTestNet.submitGatewayBatch({
      guarded: false,
    });
    // console.log("Status of the batch submition: ", submissionResponse);
    hashAddressBig = BigNumber.from(submissionResponse.hash)._hex;
    console.log("BIG HASH ADDRESS: ", hashAddressBig);

    try {
      assert.isNull(
        submissionResponse.transaction,
        "It is not expected behaviour of the transaction in the Get Submitted Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.hash,
        "The value of the hash field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        submissionResponse.state,
        "Queued",
        "The status of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        submissionResponse.account,
        "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
        "The account address of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        submissionResponse.nonce,
        "The nonce number of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        submissionResponse.to[0],
        "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
        "The To Address in the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.data[0],
        "The value of the data field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.senderSignature,
        "The value of the senderSignature field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        submissionResponse.estimatedGas,
        "The Estimated Gas number of the Get Submitted Batch Response is not displayed."
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
        "The value of the estimatedGasPrice field of the Get Submitted Batch Response is not displayed."
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
        "It is not expected behaviour of the feeToken in the Get Submitted Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.feeAmount._hex,
        "The value of the feeAmount field of the Get Submitted Batch Response is not displayed."
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
        "The value of the feeData field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNull(
        submissionResponse.delayedUntil,
        "It is not expected behaviour of the delayedUntil in the Get Submitted Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    // get the submitted batch and wait till the status become sent
    do {
      const output = await sdkTestNet.getGatewaySubmittedBatch({
        hash: hashAddressBig,
      });
      transactionState = output.state;

      Helper.wait(2000);
    } while (!(transactionState == "Sent"));

    // get submmited batch with sent status
    let EstimatedGas_Submitted;
    let FeeAmount_Submitted;
    let EstimatedGasPrice_Submitted;

    const output = await sdkTestNet.getGatewaySubmittedBatch({
      hash: hashAddressBig,
    });
    // console.log("Gateway Submitted Batch after sending: ", output);

    try {
      assert.isNotEmpty(
        output.transaction.hash,
        "The Hash of the transaction of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.transaction.state,
        "Sent",
        "The state of the transaction of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.transaction.sender,
        "The sender address of the transaction of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.transaction.gasPrice,
        "The gasPrice of the transaction of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        output.transaction.gasUsed,
        "The gasUsed of the transaction of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.transaction.totalCost,
        "The totalCost of the transaction of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.logs[0].address,
        "The address of the logs of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.logs[0].data,
        "The data of the logs of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.logs[0].topics,
        "The topics of the logs of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.hash,
        "The value of the hash field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.state,
        "Sent",
        "The status of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.account,
        "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
        "The account address of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        output.nonce,
        "The nonce number of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.to[0],
        "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
        "The To Address in the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.data[0],
        "The value of the data field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.senderSignature,
        "The value of the senderSignature field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        output.estimatedGas,
        "The Estimated Gas number of the Get Submitted Batch Response is not displayed."
      );
      EstimatedGas_Submitted = output.estimatedGas;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        EstimatedGas_Estimate,
        EstimatedGas_Submitted,
        "The Estimated Gas value is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.estimatedGasPrice._hex,
        "The value of the estimatedGasPrice field of the Get Submitted Batch Response is not displayed."
      );
      EstimatedGasPrice_Submitted = output.estimatedGasPrice._hex;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        EstimatedGasPrice_Estimate,
        EstimatedGasPrice_Submitted,
        "The Estimated Gas Price value is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNull(
        output.feeToken,
        "It is not expected behaviour of the feeToken in the Get Submitted Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.feeAmount._hex,
        "The value of the feeAmount field of the Get Submitted Batch Response is not displayed."
      );

      FeeAmount_Submitted = output.feeAmount._hex;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        FeeAmount_Estimate,
        FeeAmount_Submitted,
        "The Fee Amount value is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.feeData,
        "The value of the feeData field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNull(
        output.delayedUntil,
        "It is not expected behaviour of the delayedUntil in the Get Submitted Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.events[0].contract,
        "PersonalAccountRegistry",
        "The contract of the events is not displayed in the Get Submitted Batch Response"
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.events[0].event,
        "AccountTransactionExecuted",
        "The event of the events is not displayed in the Get Submitted Batch Response"
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.events[0].args,
        "The args of the events is not displayed in the Get Submitted Batch Response"
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.events[1].contract,
        "PersonalAccountRegistry",
        "The contract of the events is not displayed in the Get Submitted Batch Response"
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.events[1].event,
        "AccountCallRefunded",
        "The event of the events is not displayed in the Get Submitted Batch Response"
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.events[1].args,
        "The args of the events is not displayed in the Get Submitted Batch Response"
      );
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

    const singleTransaction = await sdkTestNet.getTransaction({
      hash: output.transaction.hash, // Add your transaction hash
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

    const transactions = await sdkTestNet.getTransactions();
    // console.log("Transactions: ", transactions);

    for (let x = 0; x < transactions.items.length; x++) {
      blockNumber_transactions = transactions.items[x].blockNumber;

      if (blockNumber_singleTransaction == blockNumber_transactions) {
        try {
          assert.isNumber(
            transactions.items[x].blockNumber,
            "The blockNumber of the get transactions response is not displayed."
          );
          blockNumber_transactions = transactions.items[x].blockNumber;
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
          assert.isNumber(
            transactions.items[x].timestamp,
            "The timestamp of the get transactions response is not displayed."
          );
          timestamp_transactions = transactions.items[x].timestamp;
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
          assert.isNotEmpty(
            transactions.items[x].from,
            "The from address of the get transactions response is not displayed."
          );
          from_transactions = transactions.items[x].from;
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
          assert.isNumber(
            transactions.items[x].gasLimit,
            "The gasLimit of the get transactions response is not displayed."
          );
          gasLimit_transactions = transactions.items[x].gasLimit;
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
          assert.isNotEmpty(
            transactions.items[x].gasPrice,
            "The gasPrice of the get transactions response is not displayed."
          );
          gasPrice_transactions = transactions.items[x].gasPrice;
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
          assert.isNumber(
            transactions.items[x].gasUsed,
            "The gasUsed of the get transactions response is not displayed."
          );
          gasUsed_transactions = transactions.items[x].gasUsed;
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
          assert.isNotEmpty(
            transactions.items[x].hash,
            "The hash of the get transactions response is not displayed."
          );
          hash_transactions = transactions.items[x].hash;
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
          assert.isNotEmpty(
            transactions.items[x].logs,
            "The logs of the get transactions response is not displayed."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.strictEqual(
            transactions.items[x].status,
            "Completed",
            "The status of the get transactions response is not displayed."
          );
          status_transactions = transactions.items[x].status;
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
          assert.isNotEmpty(
            transactions.items[x].to,
            "The to address of the get transactions response is not displayed."
          );
          to_transactions = transactions.items[x].to;
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
          assert.isNotEmpty(
            transactions.items[x].value,
            "The value of the get transactions response is not displayed."
          );
          value_transactions = transactions.items[x].value;
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
            transactions.items[x].direction,
            "Sender",
            "The direction of the get transactions response is not displayed."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isTrue(
            transactions.items[x].mainTransactionDataFetched,
            "The mainTransactionDataFetched of the get transactions response is not displayed."
          );
          mainTransactionDataFetched_transactions =
            transactions.items[x].mainTransactionDataFetched;
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
          assert.isFalse(
            transactions.items[x].internalTransactionsFetched,
            "The internalTransactionsFetched of the get transactions response is not displayed."
          );
          internalTransactionsFetched_transactions =
            transactions.items[x].internalTransactionsFetched;
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
          assert.isNotEmpty(
            transactions.items[x].batch,
            "The batch of the get transactions response is not displayed."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNotEmpty(
            transactions.items[x].assert,
            "The assert of the get transactions response is not displayed."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNotEmpty(
            transactions.items[x].blockExplorerUrl,
            "The blockExplorerUrl of the get transactions response is not displayed."
          );
          blockExplorerUrl_transactions =
            transactions.items[x].blockExplorerUrl;
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

        // validate hash of submitted batch and single transaction is displayed same
        try {
          assert.strictEqual(
            output.transaction.hash,
            singleTransaction.hash,
            "The hash of the get single transaction response and get submitted Batch response are not matched."
          );
        } catch (e) {
          console.log(e);
        }

        // validate hash of submitted batch and from transactions list is displayed same
        try {
          assert.strictEqual(
            output.transaction.hash,
            transactions.items[x].hash,
            "The hash of the get transactions response and get submitted Batch response are not matched."
          );
        } catch (e) {
          console.log(e);
        }
        break;
      }
    }
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
    // console.log("Batch Reponse: ", addTransactionToBatchOutput);

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
        "The value of the data field of the Batch Reponse is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNull(
        addTransactionToBatchOutput.estimation,
        "It is not expected behaviour of the estimation in the Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    // Estimating the batch
    let EstimatedGas_Estimate;
    let FeeAmount_Estimate;
    let EstimatedGasPrice_Estimate;

    const estimationResponse = await sdkTestNet.estimateGatewayBatch();
    // console.log("Gas estimated at:", estimationResponse);

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
        "The value of the data field of the Estimation Response is not displayed."
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
        "The estimatedGas of the Estimate Batch Response is not displayed."
      );
      EstimatedGas_Estimate = estimationResponse.estimation.estimatedGas;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        estimationResponse.estimation.feeAmount,
        "The value of the feeAmount field of the Estimation Response is not displayed."
      );
      FeeAmount_Estimate = estimationResponse.estimation.feeAmount._hex;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        estimationResponse.estimation.estimatedGasPrice,
        "The value of the estimatedGasPrice field of the Estimation Response is not displayed."
      );
      EstimatedGasPrice_Estimate =
        estimationResponse.estimation.estimatedGasPrice._hex;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        estimationResponse.estimation.signature,
        "The value of the signature field of the Estimation Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    // Submitting the batch
    let EstimatedGas_Submit;
    let FeeAmount_Submit;
    let EstimatedGasPrice_Submit;

    const submissionResponse = await sdkTestNet.submitGatewayBatch({
      guarded: false,
    });
    // console.log("Status of the batch submition: ", submissionResponse);
    hashAddressBig = BigNumber.from(submissionResponse.hash)._hex;
    console.log("BIG HASH ADDRESS: ", hashAddressBig);

    try {
      assert.isNull(
        submissionResponse.transaction,
        "It is not expected behaviour of the transaction in the Get Submitted Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.hash,
        "The value of the hash field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        submissionResponse.state,
        "Queued",
        "The status of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        submissionResponse.account,
        "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
        "The account address of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        submissionResponse.nonce,
        "The nonce number of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        submissionResponse.to[0],
        "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
        "The To Address in the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.data[0],
        "The value of the data field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.senderSignature,
        "The value of the senderSignature field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        submissionResponse.estimatedGas,
        "The Estimated Gas number of the Get Submitted Batch Response is not displayed."
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
        "The value of the estimatedGasPrice field of the Get Submitted Batch Response is not displayed."
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
        "It is not expected behaviour of the feeToken in the Get Submitted Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.feeAmount._hex,
        "The value of the feeAmount field of the Get Submitted Batch Response is not displayed."
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
        "The value of the feeData field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNull(
        submissionResponse.delayedUntil,
        "It is not expected behaviour of the delayedUntil in the Get Submitted Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    // get the submitted batch and wait till the status become sent
    do {
      const output = await sdkTestNet.getGatewaySubmittedBatch({
        hash: hashAddressBig,
      });
      transactionState = output.state;

      Helper.wait(2000);
    } while (!(transactionState == "Sent"));

    // get submmited batch with sent status
    let EstimatedGas_Submitted;
    let FeeAmount_Submitted;
    let EstimatedGasPrice_Submitted;

    const output = await sdkTestNet.getGatewaySubmittedBatch({
      hash: hashAddressBig,
    });
    // console.log("Gateway Submitted Batch after sending: ", output);

    try {
      assert.isNotEmpty(
        output.transaction.hash,
        "The Hash of the transaction of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.transaction.state,
        "Sent",
        "The state of the transaction of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.transaction.sender,
        "The sender address of the transaction of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.transaction.gasPrice,
        "The gasPrice of the transaction of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        output.transaction.gasUsed,
        "The gasUsed of the transaction of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.transaction.totalCost,
        "The totalCost of the transaction of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.logs[0].address,
        "The address of the logs of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.logs[0].data,
        "The data of the logs of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.logs[0].topics,
        "The topics of the logs of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.hash,
        "The value of the hash field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.state,
        "Sent",
        "The status of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.account,
        "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
        "The account address of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        output.nonce,
        "The nonce number of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.to[0],
        "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
        "The To Address in the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.data[0],
        "The value of the data field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.senderSignature,
        "The value of the senderSignature field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        output.estimatedGas,
        "The Estimated Gas number of the Get Submitted Batch Response is not displayed."
      );
      EstimatedGas_Submitted = output.estimatedGas;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        EstimatedGas_Estimate,
        EstimatedGas_Submitted,
        "The Estimated Gas value is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.estimatedGasPrice._hex,
        "The value of the estimatedGasPrice field of the Get Submitted Batch Response is not displayed."
      );
      EstimatedGasPrice_Submitted = output.estimatedGasPrice._hex;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        EstimatedGasPrice_Estimate,
        EstimatedGasPrice_Submitted,
        "The Estimated Gas Price value is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNull(
        output.feeToken,
        "It is not expected behaviour of the feeToken in the Get Submitted Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.feeAmount._hex,
        "The value of the feeAmount field of the Get Submitted Batch Response is not displayed."
      );

      FeeAmount_Submitted = output.feeAmount._hex;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        FeeAmount_Estimate,
        FeeAmount_Submitted,
        "The Fee Amount value is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.feeData,
        "The value of the feeData field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNull(
        output.delayedUntil,
        "It is not expected behaviour of the delayedUntil in the Get Submitted Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.events[0].contract,
        "PersonalAccountRegistry",
        "The contract of the events is not displayed in the Get Submitted Batch Response"
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.events[0].event,
        "AccountTransactionExecuted",
        "The event of the events is not displayed in the Get Submitted Batch Response"
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.events[0].args,
        "The args of the events is not displayed in the Get Submitted Batch Response"
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.events[1].contract,
        "PersonalAccountRegistry",
        "The contract of the events is not displayed in the Get Submitted Batch Response"
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.events[1].event,
        "AccountCallRefunded",
        "The event of the events is not displayed in the Get Submitted Batch Response"
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.events[1].args,
        "The args of the events is not displayed in the Get Submitted Batch Response"
      );
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

    const singleTransaction = await sdkTestNet.getTransaction({
      hash: output.transaction.hash, // Add your transaction hash
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

    const transactions = await sdkTestNet.getTransactions();
    // console.log("Transactions: ", transactions);

    for (let x = 0; x < transactions.items.length; x++) {
      blockNumber_transactions = transactions.items[x].blockNumber;

      if (blockNumber_singleTransaction == blockNumber_transactions) {
        try {
          assert.isNumber(
            transactions.items[x].blockNumber,
            "The blockNumber of the get transactions response is not displayed."
          );
          blockNumber_transactions = transactions.items[x].blockNumber;
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
          assert.isNumber(
            transactions.items[x].timestamp,
            "The timestamp of the get transactions response is not displayed."
          );
          timestamp_transactions = transactions.items[x].timestamp;
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
          assert.isNotEmpty(
            transactions.items[x].from,
            "The from address of the get transactions response is not displayed."
          );
          from_transactions = transactions.items[x].from;
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
          assert.isNumber(
            transactions.items[x].gasLimit,
            "The gasLimit of the get transactions response is not displayed."
          );
          gasLimit_transactions = transactions.items[x].gasLimit;
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
          assert.isNotEmpty(
            transactions.items[x].gasPrice,
            "The gasPrice of the get transactions response is not displayed."
          );
          gasPrice_transactions = transactions.items[x].gasPrice;
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
          assert.isNumber(
            transactions.items[x].gasUsed,
            "The gasUsed of the get transactions response is not displayed."
          );
          gasUsed_transactions = transactions.items[x].gasUsed;
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
          assert.isNotEmpty(
            transactions.items[x].hash,
            "The hash of the get transactions response is not displayed."
          );
          hash_transactions = transactions.items[x].hash;
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
          assert.isNotEmpty(
            transactions.items[x].logs,
            "The logs of the get transactions response is not displayed."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.strictEqual(
            transactions.items[x].status,
            "Completed",
            "The status of the get transactions response is not displayed."
          );
          status_transactions = transactions.items[x].status;
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
          assert.isNotEmpty(
            transactions.items[x].to,
            "The to address of the get transactions response is not displayed."
          );
          to_transactions = transactions.items[x].to;
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
          assert.isNotEmpty(
            transactions.items[x].value,
            "The value of the get transactions response is not displayed."
          );
          value_transactions = transactions.items[x].value;
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
            transactions.items[x].direction,
            "Sender",
            "The direction of the get transactions response is not displayed."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isTrue(
            transactions.items[x].mainTransactionDataFetched,
            "The mainTransactionDataFetched of the get transactions response is not displayed."
          );
          mainTransactionDataFetched_transactions =
            transactions.items[x].mainTransactionDataFetched;
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
          assert.isFalse(
            transactions.items[x].internalTransactionsFetched,
            "The internalTransactionsFetched of the get transactions response is not displayed."
          );
          internalTransactionsFetched_transactions =
            transactions.items[x].internalTransactionsFetched;
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
          assert.isNotEmpty(
            transactions.items[x].batch,
            "The batch of the get transactions response is not displayed."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNotEmpty(
            transactions.items[x].assert,
            "The assert of the get transactions response is not displayed."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNotEmpty(
            transactions.items[x].blockExplorerUrl,
            "The blockExplorerUrl of the get transactions response is not displayed."
          );
          blockExplorerUrl_transactions =
            transactions.items[x].blockExplorerUrl;
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

        // validate hash of submitted batch and single transaction is displayed same
        try {
          assert.strictEqual(
            output.transaction.hash,
            singleTransaction.hash,
            "The hash of the get single transaction response and get submitted Batch response are not matched."
          );
        } catch (e) {
          console.log(e);
        }

        // validate hash of submitted batch and from transactions list is displayed same
        try {
          assert.strictEqual(
            output.transaction.hash,
            transactions.items[x].hash,
            "The hash of the get transactions response and get submitted Batch response are not matched."
          );
        } catch (e) {
          console.log(e);
        }
        break;
      }
    }
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
    // console.log("Batch Reponse: ", addTransactionToBatchOutput);

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
        "The value of the data field of the Batch Reponse is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNull(
        addTransactionToBatchOutput.estimation,
        "It is not expected behaviour of the estimation in the Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    // Estimating the batch
    let EstimatedGas_Estimate;
    let FeeAmount_Estimate;
    let EstimatedGasPrice_Estimate;

    const estimationResponse = await sdkTestNet.estimateGatewayBatch();
    // console.log("Gas estimated at:", estimationResponse);

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
        "The value of the data field of the Estimation Response is not displayed."
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
        "The estimatedGas of the Estimate Batch Response is not displayed."
      );
      EstimatedGas_Estimate = estimationResponse.estimation.estimatedGas;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        estimationResponse.estimation.feeAmount,
        "The value of the feeAmount field of the Estimation Response is not displayed."
      );
      FeeAmount_Estimate = estimationResponse.estimation.feeAmount._hex;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        estimationResponse.estimation.estimatedGasPrice,
        "The value of the estimatedGasPrice field of the Estimation Response is not displayed."
      );
      EstimatedGasPrice_Estimate =
        estimationResponse.estimation.estimatedGasPrice._hex;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        estimationResponse.estimation.signature,
        "The value of the signature field of the Estimation Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    // Submitting the batch
    let EstimatedGas_Submit;
    let FeeAmount_Submit;
    let EstimatedGasPrice_Submit;

    const submissionResponse = await sdkTestNet.submitGatewayBatch({
      guarded: false,
    });
    // console.log("Status of the batch submition: ", submissionResponse);
    hashAddressBig = BigNumber.from(submissionResponse.hash)._hex;
    console.log("BIG HASH ADDRESS: ", hashAddressBig);

    try {
      assert.isNull(
        submissionResponse.transaction,
        "It is not expected behaviour of the transaction in the Get Submitted Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.hash,
        "The value of the hash field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        submissionResponse.state,
        "Queued",
        "The status of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        submissionResponse.account,
        "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
        "The account address of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        submissionResponse.nonce,
        "The nonce number of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        submissionResponse.to[0],
        "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
        "The To Address in the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.data[0],
        "The value of the data field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.senderSignature,
        "The value of the senderSignature field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        submissionResponse.estimatedGas,
        "The Estimated Gas number of the Get Submitted Batch Response is not displayed."
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
        "The value of the estimatedGasPrice field of the Get Submitted Batch Response is not displayed."
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
        "It is not expected behaviour of the feeToken in the Get Submitted Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.feeAmount._hex,
        "The value of the feeAmount field of the Get Submitted Batch Response is not displayed."
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
        "The value of the feeData field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNull(
        submissionResponse.delayedUntil,
        "It is not expected behaviour of the delayedUntil in the Get Submitted Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    // get the submitted batch and wait till the status become sent
    do {
      const output = await sdkTestNet.getGatewaySubmittedBatch({
        hash: hashAddressBig,
      });
      transactionState = output.state;

      Helper.wait(2000);
    } while (!(transactionState == "Sent"));

    // get submmited batch with sent status
    let EstimatedGas_Submitted;
    let FeeAmount_Submitted;
    let EstimatedGasPrice_Submitted;

    const output = await sdkTestNet.getGatewaySubmittedBatch({
      hash: hashAddressBig,
    });
    // console.log("Gateway Submitted Batch after sending: ", output);

    try {
      assert.isNotEmpty(
        output.transaction.hash,
        "The Hash of the transaction of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.transaction.state,
        "Sent",
        "The state of the transaction of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.transaction.sender,
        "The sender address of the transaction of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.transaction.gasPrice,
        "The gasPrice of the transaction of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        output.transaction.gasUsed,
        "The gasUsed of the transaction of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.transaction.totalCost,
        "The totalCost of the transaction of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.logs[0].address,
        "The address of the logs of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.logs[0].data,
        "The data of the logs of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.logs[0].topics,
        "The topics of the logs of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.hash,
        "The value of the hash field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.state,
        "Sent",
        "The status of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.account,
        "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
        "The account address of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        output.nonce,
        "The nonce number of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.to[0],
        "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
        "The To Address in the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.data[0],
        "The value of the data field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.senderSignature,
        "The value of the senderSignature field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        output.estimatedGas,
        "The Estimated Gas number of the Get Submitted Batch Response is not displayed."
      );
      EstimatedGas_Submitted = output.estimatedGas;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        EstimatedGas_Estimate,
        EstimatedGas_Submitted,
        "The Estimated Gas value is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.estimatedGasPrice._hex,
        "The value of the estimatedGasPrice field of the Get Submitted Batch Response is not displayed."
      );
      EstimatedGasPrice_Submitted = output.estimatedGasPrice._hex;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        EstimatedGasPrice_Estimate,
        EstimatedGasPrice_Submitted,
        "The Estimated Gas Price value is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNull(
        output.feeToken,
        "It is not expected behaviour of the feeToken in the Get Submitted Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.feeAmount._hex,
        "The value of the feeAmount field of the Get Submitted Batch Response is not displayed."
      );

      FeeAmount_Submitted = output.feeAmount._hex;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        FeeAmount_Estimate,
        FeeAmount_Submitted,
        "The Fee Amount value is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.feeData,
        "The value of the feeData field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNull(
        output.delayedUntil,
        "It is not expected behaviour of the delayedUntil in the Get Submitted Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.events[0].contract,
        "PersonalAccountRegistry",
        "The contract of the events is not displayed in the Get Submitted Batch Response"
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.events[0].event,
        "AccountTransactionExecuted",
        "The event of the events is not displayed in the Get Submitted Batch Response"
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.events[0].args,
        "The args of the events is not displayed in the Get Submitted Batch Response"
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.events[1].contract,
        "PersonalAccountRegistry",
        "The contract of the events is not displayed in the Get Submitted Batch Response"
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.events[1].event,
        "AccountCallRefunded",
        "The event of the events is not displayed in the Get Submitted Batch Response"
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.events[1].args,
        "The args of the events is not displayed in the Get Submitted Batch Response"
      );
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

    const singleTransaction = await sdkTestNet.getTransaction({
      hash: output.transaction.hash, // Add your transaction hash
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

    const transactions = await sdkTestNet.getTransactions();
    // console.log("Transactions: ", transactions);

    for (let x = 0; x < transactions.items.length; x++) {
      blockNumber_transactions = transactions.items[x].blockNumber;

      if (blockNumber_singleTransaction == blockNumber_transactions) {
        try {
          assert.isNumber(
            transactions.items[x].blockNumber,
            "The blockNumber of the get transactions response is not displayed."
          );
          blockNumber_transactions = transactions.items[x].blockNumber;
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
          assert.isNumber(
            transactions.items[x].timestamp,
            "The timestamp of the get transactions response is not displayed."
          );
          timestamp_transactions = transactions.items[x].timestamp;
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
          assert.isNotEmpty(
            transactions.items[x].from,
            "The from address of the get transactions response is not displayed."
          );
          from_transactions = transactions.items[x].from;
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
          assert.isNumber(
            transactions.items[x].gasLimit,
            "The gasLimit of the get transactions response is not displayed."
          );
          gasLimit_transactions = transactions.items[x].gasLimit;
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
          assert.isNotEmpty(
            transactions.items[x].gasPrice,
            "The gasPrice of the get transactions response is not displayed."
          );
          gasPrice_transactions = transactions.items[x].gasPrice;
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
          assert.isNumber(
            transactions.items[x].gasUsed,
            "The gasUsed of the get transactions response is not displayed."
          );
          gasUsed_transactions = transactions.items[x].gasUsed;
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
          assert.isNotEmpty(
            transactions.items[x].hash,
            "The hash of the get transactions response is not displayed."
          );
          hash_transactions = transactions.items[x].hash;
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
          assert.isNotEmpty(
            transactions.items[x].logs,
            "The logs of the get transactions response is not displayed."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.strictEqual(
            transactions.items[x].status,
            "Completed",
            "The status of the get transactions response is not displayed."
          );
          status_transactions = transactions.items[x].status;
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
          assert.isNotEmpty(
            transactions.items[x].to,
            "The to address of the get transactions response is not displayed."
          );
          to_transactions = transactions.items[x].to;
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
          assert.isNotEmpty(
            transactions.items[x].value,
            "The value of the get transactions response is not displayed."
          );
          value_transactions = transactions.items[x].value;
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
            transactions.items[x].direction,
            "Sender",
            "The direction of the get transactions response is not displayed."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isTrue(
            transactions.items[x].mainTransactionDataFetched,
            "The mainTransactionDataFetched of the get transactions response is not displayed."
          );
          mainTransactionDataFetched_transactions =
            transactions.items[x].mainTransactionDataFetched;
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
          assert.isFalse(
            transactions.items[x].internalTransactionsFetched,
            "The internalTransactionsFetched of the get transactions response is not displayed."
          );
          internalTransactionsFetched_transactions =
            transactions.items[x].internalTransactionsFetched;
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
          assert.isNotEmpty(
            transactions.items[x].batch,
            "The batch of the get transactions response is not displayed."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNotEmpty(
            transactions.items[x].assert,
            "The assert of the get transactions response is not displayed."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNotEmpty(
            transactions.items[x].blockExplorerUrl,
            "The blockExplorerUrl of the get transactions response is not displayed."
          );
          blockExplorerUrl_transactions =
            transactions.items[x].blockExplorerUrl;
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

        // validate hash of submitted batch and single transaction is displayed same
        try {
          assert.strictEqual(
            output.transaction.hash,
            singleTransaction.hash,
            "The hash of the get single transaction response and get submitted Batch response are not matched."
          );
        } catch (e) {
          console.log(e);
        }

        // validate hash of submitted batch and from transactions list is displayed same
        try {
          assert.strictEqual(
            output.transaction.hash,
            transactions.items[x].hash,
            "The hash of the get transactions response and get submitted Batch response are not matched."
          );
        } catch (e) {
          console.log(e);
        }
        break;
      }
    }
  });

  // GET TRANSACTION HISTORY FROM TestNET NETWORK
  it("Setup the SDK for Testnet network and get the transaction history", async () => {
    // initialize the sdk
    sdkTestNet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.TestNets,
      networkName: NetworkNames.Testnet,
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
    // console.log("Batch Reponse: ", addTransactionToBatchOutput);

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
        "The value of the data field of the Batch Reponse is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNull(
        addTransactionToBatchOutput.estimation,
        "It is not expected behaviour of the estimation in the Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    // Estimating the batch
    let EstimatedGas_Estimate;
    let FeeAmount_Estimate;
    let EstimatedGasPrice_Estimate;

    const estimationResponse = await sdkTestNet.estimateGatewayBatch();
    // console.log("Gas estimated at:", estimationResponse);

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
        "The value of the data field of the Estimation Response is not displayed."
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
        "The estimatedGas of the Estimate Batch Response is not displayed."
      );
      EstimatedGas_Estimate = estimationResponse.estimation.estimatedGas;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        estimationResponse.estimation.feeAmount,
        "The value of the feeAmount field of the Estimation Response is not displayed."
      );
      FeeAmount_Estimate = estimationResponse.estimation.feeAmount._hex;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        estimationResponse.estimation.estimatedGasPrice,
        "The value of the estimatedGasPrice field of the Estimation Response is not displayed."
      );
      EstimatedGasPrice_Estimate =
        estimationResponse.estimation.estimatedGasPrice._hex;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        estimationResponse.estimation.signature,
        "The value of the signature field of the Estimation Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    // Submitting the batch
    let EstimatedGas_Submit;
    let FeeAmount_Submit;
    let EstimatedGasPrice_Submit;

    const submissionResponse = await sdkTestNet.submitGatewayBatch({
      guarded: false,
    });
    // console.log("Status of the batch submition: ", submissionResponse);
    hashAddressBig = BigNumber.from(submissionResponse.hash)._hex;
    console.log("BIG HASH ADDRESS: ", hashAddressBig);

    try {
      assert.isNull(
        submissionResponse.transaction,
        "It is not expected behaviour of the transaction in the Get Submitted Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.hash,
        "The value of the hash field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        submissionResponse.state,
        "Queued",
        "The status of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        submissionResponse.account,
        "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
        "The account address of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        submissionResponse.nonce,
        "The nonce number of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        submissionResponse.to[0],
        "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
        "The To Address in the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.data[0],
        "The value of the data field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.senderSignature,
        "The value of the senderSignature field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        submissionResponse.estimatedGas,
        "The Estimated Gas number of the Get Submitted Batch Response is not displayed."
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
        "The value of the estimatedGasPrice field of the Get Submitted Batch Response is not displayed."
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
        "It is not expected behaviour of the feeToken in the Get Submitted Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.feeAmount._hex,
        "The value of the feeAmount field of the Get Submitted Batch Response is not displayed."
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
        "The value of the feeData field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNull(
        submissionResponse.delayedUntil,
        "It is not expected behaviour of the delayedUntil in the Get Submitted Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    // get the submitted batch and wait till the status become sent
    do {
      const output = await sdkTestNet.getGatewaySubmittedBatch({
        hash: hashAddressBig,
      });
      transactionState = output.state;

      Helper.wait(2000);
    } while (!(transactionState == "Sent"));

    // get submmited batch with sent status
    let EstimatedGas_Submitted;
    let FeeAmount_Submitted;
    let EstimatedGasPrice_Submitted;

    const output = await sdkTestNet.getGatewaySubmittedBatch({
      hash: hashAddressBig,
    });
    // console.log("Gateway Submitted Batch after sending: ", output);

    try {
      assert.isNotEmpty(
        output.transaction.hash,
        "The Hash of the transaction of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.transaction.state,
        "Sent",
        "The state of the transaction of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.transaction.sender,
        "The sender address of the transaction of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.transaction.gasPrice,
        "The gasPrice of the transaction of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        output.transaction.gasUsed,
        "The gasUsed of the transaction of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.transaction.totalCost,
        "The totalCost of the transaction of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.logs[0].address,
        "The address of the logs of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.logs[0].data,
        "The data of the logs of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.logs[0].topics,
        "The topics of the logs of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.hash,
        "The value of the hash field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.state,
        "Sent",
        "The status of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.account,
        "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
        "The account address of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        output.nonce,
        "The nonce number of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.to[0],
        "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
        "The To Address in the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.data[0],
        "The value of the data field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.senderSignature,
        "The value of the senderSignature field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        output.estimatedGas,
        "The Estimated Gas number of the Get Submitted Batch Response is not displayed."
      );
      EstimatedGas_Submitted = output.estimatedGas;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        EstimatedGas_Estimate,
        EstimatedGas_Submitted,
        "The Estimated Gas value is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.estimatedGasPrice._hex,
        "The value of the estimatedGasPrice field of the Get Submitted Batch Response is not displayed."
      );
      EstimatedGasPrice_Submitted = output.estimatedGasPrice._hex;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        EstimatedGasPrice_Estimate,
        EstimatedGasPrice_Submitted,
        "The Estimated Gas Price value is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNull(
        output.feeToken,
        "It is not expected behaviour of the feeToken in the Get Submitted Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.feeAmount._hex,
        "The value of the feeAmount field of the Get Submitted Batch Response is not displayed."
      );

      FeeAmount_Submitted = output.feeAmount._hex;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        FeeAmount_Estimate,
        FeeAmount_Submitted,
        "The Fee Amount value is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.feeData,
        "The value of the feeData field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNull(
        output.delayedUntil,
        "It is not expected behaviour of the delayedUntil in the Get Submitted Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.events[0].contract,
        "PersonalAccountRegistry",
        "The contract of the events is not displayed in the Get Submitted Batch Response"
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.events[0].event,
        "AccountTransactionExecuted",
        "The event of the events is not displayed in the Get Submitted Batch Response"
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.events[0].args,
        "The args of the events is not displayed in the Get Submitted Batch Response"
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.events[1].contract,
        "PersonalAccountRegistry",
        "The contract of the events is not displayed in the Get Submitted Batch Response"
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.events[1].event,
        "AccountCallRefunded",
        "The event of the events is not displayed in the Get Submitted Batch Response"
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.events[1].args,
        "The args of the events is not displayed in the Get Submitted Batch Response"
      );
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

    const singleTransaction = await sdkTestNet.getTransaction({
      hash: output.transaction.hash, // Add your transaction hash
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

    const transactions = await sdkTestNet.getTransactions();
    // console.log("Transactions: ", transactions);

    for (let x = 0; x < transactions.items.length; x++) {
      blockNumber_transactions = transactions.items[x].blockNumber;

      if (blockNumber_singleTransaction == blockNumber_transactions) {
        try {
          assert.isNumber(
            transactions.items[x].blockNumber,
            "The blockNumber of the get transactions response is not displayed."
          );
          blockNumber_transactions = transactions.items[x].blockNumber;
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
          assert.isNumber(
            transactions.items[x].timestamp,
            "The timestamp of the get transactions response is not displayed."
          );
          timestamp_transactions = transactions.items[x].timestamp;
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
          assert.isNotEmpty(
            transactions.items[x].from,
            "The from address of the get transactions response is not displayed."
          );
          from_transactions = transactions.items[x].from;
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
          assert.isNumber(
            transactions.items[x].gasLimit,
            "The gasLimit of the get transactions response is not displayed."
          );
          gasLimit_transactions = transactions.items[x].gasLimit;
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
          assert.isNotEmpty(
            transactions.items[x].gasPrice,
            "The gasPrice of the get transactions response is not displayed."
          );
          gasPrice_transactions = transactions.items[x].gasPrice;
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
          assert.isNumber(
            transactions.items[x].gasUsed,
            "The gasUsed of the get transactions response is not displayed."
          );
          gasUsed_transactions = transactions.items[x].gasUsed;
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
          assert.isNotEmpty(
            transactions.items[x].hash,
            "The hash of the get transactions response is not displayed."
          );
          hash_transactions = transactions.items[x].hash;
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
          assert.isNotEmpty(
            transactions.items[x].logs,
            "The logs of the get transactions response is not displayed."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.strictEqual(
            transactions.items[x].status,
            "Completed",
            "The status of the get transactions response is not displayed."
          );
          status_transactions = transactions.items[x].status;
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
          assert.isNotEmpty(
            transactions.items[x].to,
            "The to address of the get transactions response is not displayed."
          );
          to_transactions = transactions.items[x].to;
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
          assert.isNotEmpty(
            transactions.items[x].value,
            "The value of the get transactions response is not displayed."
          );
          value_transactions = transactions.items[x].value;
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
            transactions.items[x].direction,
            "Sender",
            "The direction of the get transactions response is not displayed."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isTrue(
            transactions.items[x].mainTransactionDataFetched,
            "The mainTransactionDataFetched of the get transactions response is not displayed."
          );
          mainTransactionDataFetched_transactions =
            transactions.items[x].mainTransactionDataFetched;
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
          assert.isFalse(
            transactions.items[x].internalTransactionsFetched,
            "The internalTransactionsFetched of the get transactions response is not displayed."
          );
          internalTransactionsFetched_transactions =
            transactions.items[x].internalTransactionsFetched;
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
          assert.isNotEmpty(
            transactions.items[x].batch,
            "The batch of the get transactions response is not displayed."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNotEmpty(
            transactions.items[x].assert,
            "The assert of the get transactions response is not displayed."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNotEmpty(
            transactions.items[x].blockExplorerUrl,
            "The blockExplorerUrl of the get transactions response is not displayed."
          );
          blockExplorerUrl_transactions =
            transactions.items[x].blockExplorerUrl;
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

        // validate hash of submitted batch and single transaction is displayed same
        try {
          assert.strictEqual(
            output.transaction.hash,
            singleTransaction.hash,
            "The hash of the get single transaction response and get submitted Batch response are not matched."
          );
        } catch (e) {
          console.log(e);
        }

        // validate hash of submitted batch and from transactions list is displayed same
        try {
          assert.strictEqual(
            output.transaction.hash,
            transactions.items[x].hash,
            "The hash of the get transactions response and get submitted Batch response are not matched."
          );
        } catch (e) {
          console.log(e);
        }
        break;
      }
    }
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
    // console.log("Batch Reponse: ", addTransactionToBatchOutput);

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
        "The value of the data field of the Batch Reponse is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNull(
        addTransactionToBatchOutput.estimation,
        "It is not expected behaviour of the estimation in the Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    // Estimating the batch
    let EstimatedGas_Estimate;
    let FeeAmount_Estimate;
    let EstimatedGasPrice_Estimate;

    const estimationResponse = await sdkTestNet.estimateGatewayBatch();
    // console.log("Gas estimated at:", estimationResponse);

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
        "The value of the data field of the Estimation Response is not displayed."
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
        "The estimatedGas of the Estimate Batch Response is not displayed."
      );
      EstimatedGas_Estimate = estimationResponse.estimation.estimatedGas;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        estimationResponse.estimation.feeAmount,
        "The value of the feeAmount field of the Estimation Response is not displayed."
      );
      FeeAmount_Estimate = estimationResponse.estimation.feeAmount._hex;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        estimationResponse.estimation.estimatedGasPrice,
        "The value of the estimatedGasPrice field of the Estimation Response is not displayed."
      );
      EstimatedGasPrice_Estimate =
        estimationResponse.estimation.estimatedGasPrice._hex;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        estimationResponse.estimation.signature,
        "The value of the signature field of the Estimation Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    // Submitting the batch
    let EstimatedGas_Submit;
    let FeeAmount_Submit;
    let EstimatedGasPrice_Submit;

    const submissionResponse = await sdkTestNet.submitGatewayBatch({
      guarded: false,
    });
    // console.log("Status of the batch submition: ", submissionResponse);
    hashAddressBig = BigNumber.from(submissionResponse.hash)._hex;
    console.log("BIG HASH ADDRESS: ", hashAddressBig);

    try {
      assert.isNull(
        submissionResponse.transaction,
        "It is not expected behaviour of the transaction in the Get Submitted Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.hash,
        "The value of the hash field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        submissionResponse.state,
        "Queued",
        "The status of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        submissionResponse.account,
        "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
        "The account address of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        submissionResponse.nonce,
        "The nonce number of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        submissionResponse.to[0],
        "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
        "The To Address in the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.data[0],
        "The value of the data field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.senderSignature,
        "The value of the senderSignature field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        submissionResponse.estimatedGas,
        "The Estimated Gas number of the Get Submitted Batch Response is not displayed."
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
        "The value of the estimatedGasPrice field of the Get Submitted Batch Response is not displayed."
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
        "It is not expected behaviour of the feeToken in the Get Submitted Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.feeAmount._hex,
        "The value of the feeAmount field of the Get Submitted Batch Response is not displayed."
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
        "The value of the feeData field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNull(
        submissionResponse.delayedUntil,
        "It is not expected behaviour of the delayedUntil in the Get Submitted Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    // get the submitted batch and wait till the status become sent
    do {
      const output = await sdkTestNet.getGatewaySubmittedBatch({
        hash: hashAddressBig,
      });
      transactionState = output.state;

      Helper.wait(2000);
    } while (!(transactionState == "Sent"));

    // get submmited batch with sent status
    let EstimatedGas_Submitted;
    let FeeAmount_Submitted;
    let EstimatedGasPrice_Submitted;

    const output = await sdkTestNet.getGatewaySubmittedBatch({
      hash: hashAddressBig,
    });
    // console.log("Gateway Submitted Batch after sending: ", output);

    try {
      assert.isNotEmpty(
        output.transaction.hash,
        "The Hash of the transaction of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.transaction.state,
        "Sent",
        "The state of the transaction of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.transaction.sender,
        "The sender address of the transaction of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.transaction.gasPrice,
        "The gasPrice of the transaction of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        output.transaction.gasUsed,
        "The gasUsed of the transaction of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.transaction.totalCost,
        "The totalCost of the transaction of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.logs[0].address,
        "The address of the logs of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.logs[0].data,
        "The data of the logs of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.logs[0].topics,
        "The topics of the logs of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.hash,
        "The value of the hash field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.state,
        "Sent",
        "The status of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.account,
        "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
        "The account address of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        output.nonce,
        "The nonce number of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.to[0],
        "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
        "The To Address in the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.data[0],
        "The value of the data field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.senderSignature,
        "The value of the senderSignature field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        output.estimatedGas,
        "The Estimated Gas number of the Get Submitted Batch Response is not displayed."
      );
      EstimatedGas_Submitted = output.estimatedGas;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        EstimatedGas_Estimate,
        EstimatedGas_Submitted,
        "The Estimated Gas value is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.estimatedGasPrice._hex,
        "The value of the estimatedGasPrice field of the Get Submitted Batch Response is not displayed."
      );
      EstimatedGasPrice_Submitted = output.estimatedGasPrice._hex;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        EstimatedGasPrice_Estimate,
        EstimatedGasPrice_Submitted,
        "The Estimated Gas Price value is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNull(
        output.feeToken,
        "It is not expected behaviour of the feeToken in the Get Submitted Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.feeAmount._hex,
        "The value of the feeAmount field of the Get Submitted Batch Response is not displayed."
      );

      FeeAmount_Submitted = output.feeAmount._hex;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        FeeAmount_Estimate,
        FeeAmount_Submitted,
        "The Fee Amount value is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.feeData,
        "The value of the feeData field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNull(
        output.delayedUntil,
        "It is not expected behaviour of the delayedUntil in the Get Submitted Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.events[0].contract,
        "PersonalAccountRegistry",
        "The contract of the events is not displayed in the Get Submitted Batch Response"
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.events[0].event,
        "AccountTransactionExecuted",
        "The event of the events is not displayed in the Get Submitted Batch Response"
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.events[0].args,
        "The args of the events is not displayed in the Get Submitted Batch Response"
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.events[1].contract,
        "PersonalAccountRegistry",
        "The contract of the events is not displayed in the Get Submitted Batch Response"
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.events[1].event,
        "AccountCallRefunded",
        "The event of the events is not displayed in the Get Submitted Batch Response"
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.events[1].args,
        "The args of the events is not displayed in the Get Submitted Batch Response"
      );
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

    const singleTransaction = await sdkTestNet.getTransaction({
      hash: output.transaction.hash, // Add your transaction hash
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

    const transactions = await sdkTestNet.getTransactions();
    // console.log("Transactions: ", transactions);

    for (let x = 0; x < transactions.items.length; x++) {
      blockNumber_transactions = transactions.items[x].blockNumber;

      if (blockNumber_singleTransaction == blockNumber_transactions) {
        try {
          assert.isNumber(
            transactions.items[x].blockNumber,
            "The blockNumber of the get transactions response is not displayed."
          );
          blockNumber_transactions = transactions.items[x].blockNumber;
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
          assert.isNumber(
            transactions.items[x].timestamp,
            "The timestamp of the get transactions response is not displayed."
          );
          timestamp_transactions = transactions.items[x].timestamp;
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
          assert.isNotEmpty(
            transactions.items[x].from,
            "The from address of the get transactions response is not displayed."
          );
          from_transactions = transactions.items[x].from;
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
          assert.isNumber(
            transactions.items[x].gasLimit,
            "The gasLimit of the get transactions response is not displayed."
          );
          gasLimit_transactions = transactions.items[x].gasLimit;
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
          assert.isNotEmpty(
            transactions.items[x].gasPrice,
            "The gasPrice of the get transactions response is not displayed."
          );
          gasPrice_transactions = transactions.items[x].gasPrice;
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
          assert.isNumber(
            transactions.items[x].gasUsed,
            "The gasUsed of the get transactions response is not displayed."
          );
          gasUsed_transactions = transactions.items[x].gasUsed;
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
          assert.isNotEmpty(
            transactions.items[x].hash,
            "The hash of the get transactions response is not displayed."
          );
          hash_transactions = transactions.items[x].hash;
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
          assert.isNotEmpty(
            transactions.items[x].logs,
            "The logs of the get transactions response is not displayed."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.strictEqual(
            transactions.items[x].status,
            "Completed",
            "The status of the get transactions response is not displayed."
          );
          status_transactions = transactions.items[x].status;
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
          assert.isNotEmpty(
            transactions.items[x].to,
            "The to address of the get transactions response is not displayed."
          );
          to_transactions = transactions.items[x].to;
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
          assert.isNotEmpty(
            transactions.items[x].value,
            "The value of the get transactions response is not displayed."
          );
          value_transactions = transactions.items[x].value;
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
            transactions.items[x].direction,
            "Sender",
            "The direction of the get transactions response is not displayed."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isTrue(
            transactions.items[x].mainTransactionDataFetched,
            "The mainTransactionDataFetched of the get transactions response is not displayed."
          );
          mainTransactionDataFetched_transactions =
            transactions.items[x].mainTransactionDataFetched;
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
          assert.isFalse(
            transactions.items[x].internalTransactionsFetched,
            "The internalTransactionsFetched of the get transactions response is not displayed."
          );
          internalTransactionsFetched_transactions =
            transactions.items[x].internalTransactionsFetched;
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
          assert.isNotEmpty(
            transactions.items[x].batch,
            "The batch of the get transactions response is not displayed."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNotEmpty(
            transactions.items[x].assert,
            "The assert of the get transactions response is not displayed."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNotEmpty(
            transactions.items[x].blockExplorerUrl,
            "The blockExplorerUrl of the get transactions response is not displayed."
          );
          blockExplorerUrl_transactions =
            transactions.items[x].blockExplorerUrl;
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

        // validate hash of submitted batch and single transaction is displayed same
        try {
          assert.strictEqual(
            output.transaction.hash,
            singleTransaction.hash,
            "The hash of the get single transaction response and get submitted Batch response are not matched."
          );
        } catch (e) {
          console.log(e);
        }

        // validate hash of submitted batch and from transactions list is displayed same
        try {
          assert.strictEqual(
            output.transaction.hash,
            transactions.items[x].hash,
            "The hash of the get transactions response and get submitted Batch response are not matched."
          );
        } catch (e) {
          console.log(e);
        }
        break;
      }
    }
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
    // console.log("Batch Reponse: ", addTransactionToBatchOutput);

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
        "The value of the data field of the Batch Reponse is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNull(
        addTransactionToBatchOutput.estimation,
        "It is not expected behaviour of the estimation in the Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    // Estimating the batch
    let EstimatedGas_Estimate;
    let FeeAmount_Estimate;
    let EstimatedGasPrice_Estimate;

    const estimationResponse = await sdkTestNet.estimateGatewayBatch();
    // console.log("Gas estimated at:", estimationResponse);

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
        "The value of the data field of the Estimation Response is not displayed."
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
        "The estimatedGas of the Estimate Batch Response is not displayed."
      );
      EstimatedGas_Estimate = estimationResponse.estimation.estimatedGas;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        estimationResponse.estimation.feeAmount,
        "The value of the feeAmount field of the Estimation Response is not displayed."
      );
      FeeAmount_Estimate = estimationResponse.estimation.feeAmount._hex;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        estimationResponse.estimation.estimatedGasPrice,
        "The value of the estimatedGasPrice field of the Estimation Response is not displayed."
      );
      EstimatedGasPrice_Estimate =
        estimationResponse.estimation.estimatedGasPrice._hex;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        estimationResponse.estimation.signature,
        "The value of the signature field of the Estimation Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    // Submitting the batch
    let EstimatedGas_Submit;
    let FeeAmount_Submit;
    let EstimatedGasPrice_Submit;

    const submissionResponse = await sdkTestNet.submitGatewayBatch({
      guarded: false,
    });
    // console.log("Status of the batch submition: ", submissionResponse);
    hashAddressBig = BigNumber.from(submissionResponse.hash)._hex;
    console.log("BIG HASH ADDRESS: ", hashAddressBig);

    try {
      assert.isNull(
        submissionResponse.transaction,
        "It is not expected behaviour of the transaction in the Get Submitted Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.hash,
        "The value of the hash field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        submissionResponse.state,
        "Queued",
        "The status of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        submissionResponse.account,
        "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
        "The account address of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        submissionResponse.nonce,
        "The nonce number of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        submissionResponse.to[0],
        "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
        "The To Address in the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.data[0],
        "The value of the data field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.senderSignature,
        "The value of the senderSignature field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        submissionResponse.estimatedGas,
        "The Estimated Gas number of the Get Submitted Batch Response is not displayed."
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
        "The value of the estimatedGasPrice field of the Get Submitted Batch Response is not displayed."
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
        "It is not expected behaviour of the feeToken in the Get Submitted Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.feeAmount._hex,
        "The value of the feeAmount field of the Get Submitted Batch Response is not displayed."
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
        "The value of the feeData field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNull(
        submissionResponse.delayedUntil,
        "It is not expected behaviour of the delayedUntil in the Get Submitted Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    // get the submitted batch and wait till the status become sent
    do {
      const output = await sdkTestNet.getGatewaySubmittedBatch({
        hash: hashAddressBig,
      });
      transactionState = output.state;

      Helper.wait(2000);
    } while (!(transactionState == "Sent"));

    // get submmited batch with sent status
    let EstimatedGas_Submitted;
    let FeeAmount_Submitted;
    let EstimatedGasPrice_Submitted;

    const output = await sdkTestNet.getGatewaySubmittedBatch({
      hash: hashAddressBig,
    });
    // console.log("Gateway Submitted Batch after sending: ", output);

    try {
      assert.isNotEmpty(
        output.transaction.hash,
        "The Hash of the transaction of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.transaction.state,
        "Sent",
        "The state of the transaction of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.transaction.sender,
        "The sender address of the transaction of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.transaction.gasPrice,
        "The gasPrice of the transaction of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        output.transaction.gasUsed,
        "The gasUsed of the transaction of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.transaction.totalCost,
        "The totalCost of the transaction of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.logs[0].address,
        "The address of the logs of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.logs[0].data,
        "The data of the logs of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.logs[0].topics,
        "The topics of the logs of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.hash,
        "The value of the hash field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.state,
        "Sent",
        "The status of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.account,
        "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
        "The account address of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        output.nonce,
        "The nonce number of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.to[0],
        "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
        "The To Address in the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.data[0],
        "The value of the data field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.senderSignature,
        "The value of the senderSignature field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        output.estimatedGas,
        "The Estimated Gas number of the Get Submitted Batch Response is not displayed."
      );
      EstimatedGas_Submitted = output.estimatedGas;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        EstimatedGas_Estimate,
        EstimatedGas_Submitted,
        "The Estimated Gas value is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.estimatedGasPrice._hex,
        "The value of the estimatedGasPrice field of the Get Submitted Batch Response is not displayed."
      );
      EstimatedGasPrice_Submitted = output.estimatedGasPrice._hex;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        EstimatedGasPrice_Estimate,
        EstimatedGasPrice_Submitted,
        "The Estimated Gas Price value is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNull(
        output.feeToken,
        "It is not expected behaviour of the feeToken in the Get Submitted Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.feeAmount._hex,
        "The value of the feeAmount field of the Get Submitted Batch Response is not displayed."
      );

      FeeAmount_Submitted = output.feeAmount._hex;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        FeeAmount_Estimate,
        FeeAmount_Submitted,
        "The Fee Amount value is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.feeData,
        "The value of the feeData field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNull(
        output.delayedUntil,
        "It is not expected behaviour of the delayedUntil in the Get Submitted Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.events[0].contract,
        "PersonalAccountRegistry",
        "The contract of the events is not displayed in the Get Submitted Batch Response"
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.events[0].event,
        "AccountTransactionExecuted",
        "The event of the events is not displayed in the Get Submitted Batch Response"
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.events[0].args,
        "The args of the events is not displayed in the Get Submitted Batch Response"
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.events[1].contract,
        "PersonalAccountRegistry",
        "The contract of the events is not displayed in the Get Submitted Batch Response"
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.events[1].event,
        "AccountCallRefunded",
        "The event of the events is not displayed in the Get Submitted Batch Response"
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.events[1].args,
        "The args of the events is not displayed in the Get Submitted Batch Response"
      );
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

    const singleTransaction = await sdkTestNet.getTransaction({
      hash: output.transaction.hash, // Add your transaction hash
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

    const transactions = await sdkTestNet.getTransactions();
    // console.log("Transactions: ", transactions);

    for (let x = 0; x < transactions.items.length; x++) {
      blockNumber_transactions = transactions.items[x].blockNumber;

      if (blockNumber_singleTransaction == blockNumber_transactions) {
        try {
          assert.isNumber(
            transactions.items[x].blockNumber,
            "The blockNumber of the get transactions response is not displayed."
          );
          blockNumber_transactions = transactions.items[x].blockNumber;
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
          assert.isNumber(
            transactions.items[x].timestamp,
            "The timestamp of the get transactions response is not displayed."
          );
          timestamp_transactions = transactions.items[x].timestamp;
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
          assert.isNotEmpty(
            transactions.items[x].from,
            "The from address of the get transactions response is not displayed."
          );
          from_transactions = transactions.items[x].from;
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
          assert.isNumber(
            transactions.items[x].gasLimit,
            "The gasLimit of the get transactions response is not displayed."
          );
          gasLimit_transactions = transactions.items[x].gasLimit;
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
          assert.isNotEmpty(
            transactions.items[x].gasPrice,
            "The gasPrice of the get transactions response is not displayed."
          );
          gasPrice_transactions = transactions.items[x].gasPrice;
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
          assert.isNumber(
            transactions.items[x].gasUsed,
            "The gasUsed of the get transactions response is not displayed."
          );
          gasUsed_transactions = transactions.items[x].gasUsed;
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
          assert.isNotEmpty(
            transactions.items[x].hash,
            "The hash of the get transactions response is not displayed."
          );
          hash_transactions = transactions.items[x].hash;
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
          assert.isNotEmpty(
            transactions.items[x].logs,
            "The logs of the get transactions response is not displayed."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.strictEqual(
            transactions.items[x].status,
            "Completed",
            "The status of the get transactions response is not displayed."
          );
          status_transactions = transactions.items[x].status;
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
          assert.isNotEmpty(
            transactions.items[x].to,
            "The to address of the get transactions response is not displayed."
          );
          to_transactions = transactions.items[x].to;
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
          assert.isNotEmpty(
            transactions.items[x].value,
            "The value of the get transactions response is not displayed."
          );
          value_transactions = transactions.items[x].value;
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
            transactions.items[x].direction,
            "Sender",
            "The direction of the get transactions response is not displayed."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isTrue(
            transactions.items[x].mainTransactionDataFetched,
            "The mainTransactionDataFetched of the get transactions response is not displayed."
          );
          mainTransactionDataFetched_transactions =
            transactions.items[x].mainTransactionDataFetched;
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
          assert.isFalse(
            transactions.items[x].internalTransactionsFetched,
            "The internalTransactionsFetched of the get transactions response is not displayed."
          );
          internalTransactionsFetched_transactions =
            transactions.items[x].internalTransactionsFetched;
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
          assert.isNotEmpty(
            transactions.items[x].batch,
            "The batch of the get transactions response is not displayed."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNotEmpty(
            transactions.items[x].assert,
            "The assert of the get transactions response is not displayed."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNotEmpty(
            transactions.items[x].blockExplorerUrl,
            "The blockExplorerUrl of the get transactions response is not displayed."
          );
          blockExplorerUrl_transactions =
            transactions.items[x].blockExplorerUrl;
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

        // validate hash of submitted batch and single transaction is displayed same
        try {
          assert.strictEqual(
            output.transaction.hash,
            singleTransaction.hash,
            "The hash of the get single transaction response and get submitted Batch response are not matched."
          );
        } catch (e) {
          console.log(e);
        }

        // validate hash of submitted batch and from transactions list is displayed same
        try {
          assert.strictEqual(
            output.transaction.hash,
            transactions.items[x].hash,
            "The hash of the get transactions response and get submitted Batch response are not matched."
          );
        } catch (e) {
          console.log(e);
        }
        break;
      }
    }
  });

  // GET TRANSACTION HISTORY FROM XDAI NETWORK
  it.only("Setup the SDK for xDai network and get the transaction history", async () => {
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
    // console.log("Batch Reponse: ", addTransactionToBatchOutput);

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
        "The value of the data field of the Batch Reponse is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNull(
        addTransactionToBatchOutput.estimation,
        "It is not expected behaviour of the estimation in the Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    // Estimating the batch
    let EstimatedGas_Estimate;
    let FeeAmount_Estimate;
    let EstimatedGasPrice_Estimate;

    const estimationResponse = await sdkTestNet.estimateGatewayBatch();
    // console.log("Gas estimated at:", estimationResponse);

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
        "The value of the data field of the Estimation Response is not displayed."
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
        "The estimatedGas of the Estimate Batch Response is not displayed."
      );
      EstimatedGas_Estimate = estimationResponse.estimation.estimatedGas;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        estimationResponse.estimation.feeAmount,
        "The value of the feeAmount field of the Estimation Response is not displayed."
      );
      FeeAmount_Estimate = estimationResponse.estimation.feeAmount._hex;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        estimationResponse.estimation.estimatedGasPrice,
        "The value of the estimatedGasPrice field of the Estimation Response is not displayed."
      );
      EstimatedGasPrice_Estimate =
        estimationResponse.estimation.estimatedGasPrice._hex;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        estimationResponse.estimation.signature,
        "The value of the signature field of the Estimation Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    // Submitting the batch
    let EstimatedGas_Submit;
    let FeeAmount_Submit;
    let EstimatedGasPrice_Submit;

    const submissionResponse = await sdkTestNet.submitGatewayBatch({
      guarded: false,
    });
    // console.log("Status of the batch submition: ", submissionResponse);
    hashAddressBig = BigNumber.from(submissionResponse.hash)._hex;
    console.log("BIG HASH ADDRESS: ", hashAddressBig);

    try {
      assert.isNull(
        submissionResponse.transaction,
        "It is not expected behaviour of the transaction in the Get Submitted Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.hash,
        "The value of the hash field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        submissionResponse.state,
        "Queued",
        "The status of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        submissionResponse.account,
        "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
        "The account address of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        submissionResponse.nonce,
        "The nonce number of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        submissionResponse.to[0],
        "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
        "The To Address in the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.data[0],
        "The value of the data field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.senderSignature,
        "The value of the senderSignature field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        submissionResponse.estimatedGas,
        "The Estimated Gas number of the Get Submitted Batch Response is not displayed."
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
        "The value of the estimatedGasPrice field of the Get Submitted Batch Response is not displayed."
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
        "It is not expected behaviour of the feeToken in the Get Submitted Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.feeAmount._hex,
        "The value of the feeAmount field of the Get Submitted Batch Response is not displayed."
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
        "The value of the feeData field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNull(
        submissionResponse.delayedUntil,
        "It is not expected behaviour of the delayedUntil in the Get Submitted Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    // get the submitted batch and wait till the status become sent
    do {
      const output = await sdkTestNet.getGatewaySubmittedBatch({
        hash: hashAddressBig,
      });
      transactionState = output.state;

      Helper.wait(2000);
    } while (!(transactionState == "Sent"));

    // get submmited batch with sent status
    let EstimatedGas_Submitted;
    let FeeAmount_Submitted;
    let EstimatedGasPrice_Submitted;

    const output = await sdkTestNet.getGatewaySubmittedBatch({
      hash: hashAddressBig,
    });
    // console.log("Gateway Submitted Batch after sending: ", output);

    try {
      assert.isNotEmpty(
        output.transaction.hash,
        "The Hash of the transaction of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.transaction.state,
        "Sent",
        "The state of the transaction of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.transaction.sender,
        "The sender address of the transaction of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.transaction.gasPrice,
        "The gasPrice of the transaction of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        output.transaction.gasUsed,
        "The gasUsed of the transaction of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.transaction.totalCost,
        "The totalCost of the transaction of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.logs[0].address,
        "The address of the logs of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.logs[0].data,
        "The data of the logs of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.logs[0].topics,
        "The topics of the logs of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.hash,
        "The value of the hash field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.state,
        "Sent",
        "The status of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.account,
        "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
        "The account address of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        output.nonce,
        "The nonce number of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.to[0],
        "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
        "The To Address in the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.data[0],
        "The value of the data field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.senderSignature,
        "The value of the senderSignature field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        output.estimatedGas,
        "The Estimated Gas number of the Get Submitted Batch Response is not displayed."
      );
      EstimatedGas_Submitted = output.estimatedGas;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        EstimatedGas_Estimate,
        EstimatedGas_Submitted,
        "The Estimated Gas value is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.estimatedGasPrice._hex,
        "The value of the estimatedGasPrice field of the Get Submitted Batch Response is not displayed."
      );
      EstimatedGasPrice_Submitted = output.estimatedGasPrice._hex;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        EstimatedGasPrice_Estimate,
        EstimatedGasPrice_Submitted,
        "The Estimated Gas Price value is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNull(
        output.feeToken,
        "It is not expected behaviour of the feeToken in the Get Submitted Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.feeAmount._hex,
        "The value of the feeAmount field of the Get Submitted Batch Response is not displayed."
      );

      FeeAmount_Submitted = output.feeAmount._hex;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        FeeAmount_Estimate,
        FeeAmount_Submitted,
        "The Fee Amount value is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.feeData,
        "The value of the feeData field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNull(
        output.delayedUntil,
        "It is not expected behaviour of the delayedUntil in the Get Submitted Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.events[0].contract,
        "PersonalAccountRegistry",
        "The contract of the events is not displayed in the Get Submitted Batch Response"
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.events[0].event,
        "AccountTransactionExecuted",
        "The event of the events is not displayed in the Get Submitted Batch Response"
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.events[0].args,
        "The args of the events is not displayed in the Get Submitted Batch Response"
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.events[1].contract,
        "PersonalAccountRegistry",
        "The contract of the events is not displayed in the Get Submitted Batch Response"
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.events[1].event,
        "AccountCallRefunded",
        "The event of the events is not displayed in the Get Submitted Batch Response"
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.events[1].args,
        "The args of the events is not displayed in the Get Submitted Batch Response"
      );
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

    const singleTransaction = await sdkTestNet.getTransaction({
      hash: output.transaction.hash, // Add your transaction hash
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

    const transactions = await sdkTestNet.getTransactions();
    // console.log("Transactions: ", transactions);

    for (let x = 0; x < transactions.items.length; x++) {
      blockNumber_transactions = transactions.items[x].blockNumber;

      if (blockNumber_singleTransaction == blockNumber_transactions) {
        try {
          assert.isNumber(
            transactions.items[x].blockNumber,
            "The blockNumber of the get transactions response is not displayed."
          );
          blockNumber_transactions = transactions.items[x].blockNumber;
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
          assert.isNumber(
            transactions.items[x].timestamp,
            "The timestamp of the get transactions response is not displayed."
          );
          timestamp_transactions = transactions.items[x].timestamp;
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
          assert.isNotEmpty(
            transactions.items[x].from,
            "The from address of the get transactions response is not displayed."
          );
          from_transactions = transactions.items[x].from;
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
          assert.isNumber(
            transactions.items[x].gasLimit,
            "The gasLimit of the get transactions response is not displayed."
          );
          gasLimit_transactions = transactions.items[x].gasLimit;
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
          assert.isNotEmpty(
            transactions.items[x].gasPrice,
            "The gasPrice of the get transactions response is not displayed."
          );
          gasPrice_transactions = transactions.items[x].gasPrice;
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
          assert.isNumber(
            transactions.items[x].gasUsed,
            "The gasUsed of the get transactions response is not displayed."
          );
          gasUsed_transactions = transactions.items[x].gasUsed;
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
          assert.isNotEmpty(
            transactions.items[x].hash,
            "The hash of the get transactions response is not displayed."
          );
          hash_transactions = transactions.items[x].hash;
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
          assert.isNotEmpty(
            transactions.items[x].logs,
            "The logs of the get transactions response is not displayed."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.strictEqual(
            transactions.items[x].status,
            "Completed",
            "The status of the get transactions response is not displayed."
          );
          status_transactions = transactions.items[x].status;
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
          assert.isNotEmpty(
            transactions.items[x].to,
            "The to address of the get transactions response is not displayed."
          );
          to_transactions = transactions.items[x].to;
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
          assert.isNotEmpty(
            transactions.items[x].value,
            "The value of the get transactions response is not displayed."
          );
          value_transactions = transactions.items[x].value;
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
            transactions.items[x].direction,
            "Sender",
            "The direction of the get transactions response is not displayed."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isTrue(
            transactions.items[x].mainTransactionDataFetched,
            "The mainTransactionDataFetched of the get transactions response is not displayed."
          );
          mainTransactionDataFetched_transactions =
            transactions.items[x].mainTransactionDataFetched;
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
          assert.isFalse(
            transactions.items[x].internalTransactionsFetched,
            "The internalTransactionsFetched of the get transactions response is not displayed."
          );
          internalTransactionsFetched_transactions =
            transactions.items[x].internalTransactionsFetched;
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
          assert.isNotEmpty(
            transactions.items[x].batch,
            "The batch of the get transactions response is not displayed."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNotEmpty(
            transactions.items[x].assert,
            "The assert of the get transactions response is not displayed."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNotEmpty(
            transactions.items[x].blockExplorerUrl,
            "The blockExplorerUrl of the get transactions response is not displayed."
          );
          blockExplorerUrl_transactions =
            transactions.items[x].blockExplorerUrl;
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

        // validate hash of submitted batch and single transaction is displayed same
        try {
          assert.strictEqual(
            output.transaction.hash,
            singleTransaction.hash,
            "The hash of the get single transaction response and get submitted Batch response are not matched."
          );
        } catch (e) {
          console.log(e);
        }

        // validate hash of submitted batch and from transactions list is displayed same
        try {
          assert.strictEqual(
            output.transaction.hash,
            transactions.items[x].hash,
            "The hash of the get transactions response and get submitted Batch response are not matched."
          );
        } catch (e) {
          console.log(e);
        }
        break;
      }
    }
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
    // console.log("Batch Reponse: ", addTransactionToBatchOutput);

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
        "The value of the data field of the Batch Reponse is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNull(
        addTransactionToBatchOutput.estimation,
        "It is not expected behaviour of the estimation in the Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    // Estimating the batch
    let EstimatedGas_Estimate;
    let FeeAmount_Estimate;
    let EstimatedGasPrice_Estimate;

    const estimationResponse = await sdkTestNet.estimateGatewayBatch();
    // console.log("Gas estimated at:", estimationResponse);

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
        "The value of the data field of the Estimation Response is not displayed."
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
        "The estimatedGas of the Estimate Batch Response is not displayed."
      );
      EstimatedGas_Estimate = estimationResponse.estimation.estimatedGas;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        estimationResponse.estimation.feeAmount,
        "The value of the feeAmount field of the Estimation Response is not displayed."
      );
      FeeAmount_Estimate = estimationResponse.estimation.feeAmount._hex;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        estimationResponse.estimation.estimatedGasPrice,
        "The value of the estimatedGasPrice field of the Estimation Response is not displayed."
      );
      EstimatedGasPrice_Estimate =
        estimationResponse.estimation.estimatedGasPrice._hex;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        estimationResponse.estimation.signature,
        "The value of the signature field of the Estimation Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    // Submitting the batch
    let EstimatedGas_Submit;
    let FeeAmount_Submit;
    let EstimatedGasPrice_Submit;

    const submissionResponse = await sdkTestNet.submitGatewayBatch({
      guarded: false,
    });
    // console.log("Status of the batch submition: ", submissionResponse);
    hashAddressBig = BigNumber.from(submissionResponse.hash)._hex;
    console.log("BIG HASH ADDRESS: ", hashAddressBig);

    try {
      assert.isNull(
        submissionResponse.transaction,
        "It is not expected behaviour of the transaction in the Get Submitted Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.hash,
        "The value of the hash field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        submissionResponse.state,
        "Queued",
        "The status of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        submissionResponse.account,
        "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
        "The account address of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        submissionResponse.nonce,
        "The nonce number of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        submissionResponse.to[0],
        "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
        "The To Address in the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.data[0],
        "The value of the data field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.senderSignature,
        "The value of the senderSignature field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        submissionResponse.estimatedGas,
        "The Estimated Gas number of the Get Submitted Batch Response is not displayed."
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
        "The value of the estimatedGasPrice field of the Get Submitted Batch Response is not displayed."
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
        "It is not expected behaviour of the feeToken in the Get Submitted Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.feeAmount._hex,
        "The value of the feeAmount field of the Get Submitted Batch Response is not displayed."
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
        "The value of the feeData field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNull(
        submissionResponse.delayedUntil,
        "It is not expected behaviour of the delayedUntil in the Get Submitted Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    // get the submitted batch and wait till the status become sent
    do {
      const output = await sdkTestNet.getGatewaySubmittedBatch({
        hash: hashAddressBig,
      });
      transactionState = output.state;

      Helper.wait(2000);
    } while (!(transactionState == "Sent"));

    // get submmited batch with sent status
    let EstimatedGas_Submitted;
    let FeeAmount_Submitted;
    let EstimatedGasPrice_Submitted;

    const output = await sdkTestNet.getGatewaySubmittedBatch({
      hash: hashAddressBig,
    });
    // console.log("Gateway Submitted Batch after sending: ", output);

    try {
      assert.isNotEmpty(
        output.transaction.hash,
        "The Hash of the transaction of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.transaction.state,
        "Sent",
        "The state of the transaction of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.transaction.sender,
        "The sender address of the transaction of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.transaction.gasPrice,
        "The gasPrice of the transaction of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        output.transaction.gasUsed,
        "The gasUsed of the transaction of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.transaction.totalCost,
        "The totalCost of the transaction of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.logs[0].address,
        "The address of the logs of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.logs[0].data,
        "The data of the logs of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.logs[0].topics,
        "The topics of the logs of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.hash,
        "The value of the hash field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.state,
        "Sent",
        "The status of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.account,
        "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
        "The account address of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        output.nonce,
        "The nonce number of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.to[0],
        "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
        "The To Address in the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.data[0],
        "The value of the data field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.senderSignature,
        "The value of the senderSignature field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        output.estimatedGas,
        "The Estimated Gas number of the Get Submitted Batch Response is not displayed."
      );
      EstimatedGas_Submitted = output.estimatedGas;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        EstimatedGas_Estimate,
        EstimatedGas_Submitted,
        "The Estimated Gas value is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.estimatedGasPrice._hex,
        "The value of the estimatedGasPrice field of the Get Submitted Batch Response is not displayed."
      );
      EstimatedGasPrice_Submitted = output.estimatedGasPrice._hex;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        EstimatedGasPrice_Estimate,
        EstimatedGasPrice_Submitted,
        "The Estimated Gas Price value is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNull(
        output.feeToken,
        "It is not expected behaviour of the feeToken in the Get Submitted Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.feeAmount._hex,
        "The value of the feeAmount field of the Get Submitted Batch Response is not displayed."
      );

      FeeAmount_Submitted = output.feeAmount._hex;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        FeeAmount_Estimate,
        FeeAmount_Submitted,
        "The Fee Amount value is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.feeData,
        "The value of the feeData field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNull(
        output.delayedUntil,
        "It is not expected behaviour of the delayedUntil in the Get Submitted Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.events[0].contract,
        "PersonalAccountRegistry",
        "The contract of the events is not displayed in the Get Submitted Batch Response"
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.events[0].event,
        "AccountTransactionExecuted",
        "The event of the events is not displayed in the Get Submitted Batch Response"
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.events[0].args,
        "The args of the events is not displayed in the Get Submitted Batch Response"
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.events[1].contract,
        "PersonalAccountRegistry",
        "The contract of the events is not displayed in the Get Submitted Batch Response"
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.events[1].event,
        "AccountCallRefunded",
        "The event of the events is not displayed in the Get Submitted Batch Response"
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.events[1].args,
        "The args of the events is not displayed in the Get Submitted Batch Response"
      );
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

    const singleTransaction = await sdkTestNet.getTransaction({
      hash: output.transaction.hash, // Add your transaction hash
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

    const transactions = await sdkTestNet.getTransactions();
    // console.log("Transactions: ", transactions);

    for (let x = 0; x < transactions.items.length; x++) {
      blockNumber_transactions = transactions.items[x].blockNumber;

      if (blockNumber_singleTransaction == blockNumber_transactions) {
        try {
          assert.isNumber(
            transactions.items[x].blockNumber,
            "The blockNumber of the get transactions response is not displayed."
          );
          blockNumber_transactions = transactions.items[x].blockNumber;
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
          assert.isNumber(
            transactions.items[x].timestamp,
            "The timestamp of the get transactions response is not displayed."
          );
          timestamp_transactions = transactions.items[x].timestamp;
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
          assert.isNotEmpty(
            transactions.items[x].from,
            "The from address of the get transactions response is not displayed."
          );
          from_transactions = transactions.items[x].from;
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
          assert.isNumber(
            transactions.items[x].gasLimit,
            "The gasLimit of the get transactions response is not displayed."
          );
          gasLimit_transactions = transactions.items[x].gasLimit;
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
          assert.isNotEmpty(
            transactions.items[x].gasPrice,
            "The gasPrice of the get transactions response is not displayed."
          );
          gasPrice_transactions = transactions.items[x].gasPrice;
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
          assert.isNumber(
            transactions.items[x].gasUsed,
            "The gasUsed of the get transactions response is not displayed."
          );
          gasUsed_transactions = transactions.items[x].gasUsed;
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
          assert.isNotEmpty(
            transactions.items[x].hash,
            "The hash of the get transactions response is not displayed."
          );
          hash_transactions = transactions.items[x].hash;
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
          assert.isNotEmpty(
            transactions.items[x].logs,
            "The logs of the get transactions response is not displayed."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.strictEqual(
            transactions.items[x].status,
            "Completed",
            "The status of the get transactions response is not displayed."
          );
          status_transactions = transactions.items[x].status;
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
          assert.isNotEmpty(
            transactions.items[x].to,
            "The to address of the get transactions response is not displayed."
          );
          to_transactions = transactions.items[x].to;
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
          assert.isNotEmpty(
            transactions.items[x].value,
            "The value of the get transactions response is not displayed."
          );
          value_transactions = transactions.items[x].value;
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
            transactions.items[x].direction,
            "Sender",
            "The direction of the get transactions response is not displayed."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isTrue(
            transactions.items[x].mainTransactionDataFetched,
            "The mainTransactionDataFetched of the get transactions response is not displayed."
          );
          mainTransactionDataFetched_transactions =
            transactions.items[x].mainTransactionDataFetched;
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
          assert.isFalse(
            transactions.items[x].internalTransactionsFetched,
            "The internalTransactionsFetched of the get transactions response is not displayed."
          );
          internalTransactionsFetched_transactions =
            transactions.items[x].internalTransactionsFetched;
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
          assert.isNotEmpty(
            transactions.items[x].batch,
            "The batch of the get transactions response is not displayed."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNotEmpty(
            transactions.items[x].assert,
            "The assert of the get transactions response is not displayed."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNotEmpty(
            transactions.items[x].blockExplorerUrl,
            "The blockExplorerUrl of the get transactions response is not displayed."
          );
          blockExplorerUrl_transactions =
            transactions.items[x].blockExplorerUrl;
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

        // validate hash of submitted batch and single transaction is displayed same
        try {
          assert.strictEqual(
            output.transaction.hash,
            singleTransaction.hash,
            "The hash of the get single transaction response and get submitted Batch response are not matched."
          );
        } catch (e) {
          console.log(e);
        }

        // validate hash of submitted batch and from transactions list is displayed same
        try {
          assert.strictEqual(
            output.transaction.hash,
            transactions.items[x].hash,
            "The hash of the get transactions response and get submitted Batch response are not matched."
          );
        } catch (e) {
          console.log(e);
        }
        break;
      }
    }
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
    // console.log("Batch Reponse: ", addTransactionToBatchOutput);

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
        "The value of the data field of the Batch Reponse is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNull(
        addTransactionToBatchOutput.estimation,
        "It is not expected behaviour of the estimation in the Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    // Estimating the batch
    let EstimatedGas_Estimate;
    let FeeAmount_Estimate;
    let EstimatedGasPrice_Estimate;

    const estimationResponse = await sdkTestNet.estimateGatewayBatch();
    // console.log("Gas estimated at:", estimationResponse);

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
        "The value of the data field of the Estimation Response is not displayed."
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
        "The estimatedGas of the Estimate Batch Response is not displayed."
      );
      EstimatedGas_Estimate = estimationResponse.estimation.estimatedGas;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        estimationResponse.estimation.feeAmount,
        "The value of the feeAmount field of the Estimation Response is not displayed."
      );
      FeeAmount_Estimate = estimationResponse.estimation.feeAmount._hex;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        estimationResponse.estimation.estimatedGasPrice,
        "The value of the estimatedGasPrice field of the Estimation Response is not displayed."
      );
      EstimatedGasPrice_Estimate =
        estimationResponse.estimation.estimatedGasPrice._hex;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        estimationResponse.estimation.signature,
        "The value of the signature field of the Estimation Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    // Submitting the batch
    let EstimatedGas_Submit;
    let FeeAmount_Submit;
    let EstimatedGasPrice_Submit;

    const submissionResponse = await sdkTestNet.submitGatewayBatch({
      guarded: false,
    });
    // console.log("Status of the batch submition: ", submissionResponse);
    hashAddressBig = BigNumber.from(submissionResponse.hash)._hex;
    console.log("BIG HASH ADDRESS: ", hashAddressBig);

    try {
      assert.isNull(
        submissionResponse.transaction,
        "It is not expected behaviour of the transaction in the Get Submitted Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.hash,
        "The value of the hash field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        submissionResponse.state,
        "Queued",
        "The status of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        submissionResponse.account,
        "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
        "The account address of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        submissionResponse.nonce,
        "The nonce number of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        submissionResponse.to[0],
        "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
        "The To Address in the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.data[0],
        "The value of the data field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.senderSignature,
        "The value of the senderSignature field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        submissionResponse.estimatedGas,
        "The Estimated Gas number of the Get Submitted Batch Response is not displayed."
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
        "The value of the estimatedGasPrice field of the Get Submitted Batch Response is not displayed."
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
        "It is not expected behaviour of the feeToken in the Get Submitted Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.feeAmount._hex,
        "The value of the feeAmount field of the Get Submitted Batch Response is not displayed."
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
        "The value of the feeData field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNull(
        submissionResponse.delayedUntil,
        "It is not expected behaviour of the delayedUntil in the Get Submitted Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    // get the submitted batch and wait till the status become sent
    do {
      const output = await sdkTestNet.getGatewaySubmittedBatch({
        hash: hashAddressBig,
      });
      transactionState = output.state;

      Helper.wait(2000);
    } while (!(transactionState == "Sent"));

    // get submmited batch with sent status
    let EstimatedGas_Submitted;
    let FeeAmount_Submitted;
    let EstimatedGasPrice_Submitted;

    const output = await sdkTestNet.getGatewaySubmittedBatch({
      hash: hashAddressBig,
    });
    // console.log("Gateway Submitted Batch after sending: ", output);

    try {
      assert.isNotEmpty(
        output.transaction.hash,
        "The Hash of the transaction of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.transaction.state,
        "Sent",
        "The state of the transaction of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.transaction.sender,
        "The sender address of the transaction of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.transaction.gasPrice,
        "The gasPrice of the transaction of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        output.transaction.gasUsed,
        "The gasUsed of the transaction of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.transaction.totalCost,
        "The totalCost of the transaction of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.logs[0].address,
        "The address of the logs of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.logs[0].data,
        "The data of the logs of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.logs[0].topics,
        "The topics of the logs of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.hash,
        "The value of the hash field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.state,
        "Sent",
        "The status of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.account,
        "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
        "The account address of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        output.nonce,
        "The nonce number of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.to[0],
        "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
        "The To Address in the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.data[0],
        "The value of the data field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.senderSignature,
        "The value of the senderSignature field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        output.estimatedGas,
        "The Estimated Gas number of the Get Submitted Batch Response is not displayed."
      );
      EstimatedGas_Submitted = output.estimatedGas;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        EstimatedGas_Estimate,
        EstimatedGas_Submitted,
        "The Estimated Gas value is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.estimatedGasPrice._hex,
        "The value of the estimatedGasPrice field of the Get Submitted Batch Response is not displayed."
      );
      EstimatedGasPrice_Submitted = output.estimatedGasPrice._hex;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        EstimatedGasPrice_Estimate,
        EstimatedGasPrice_Submitted,
        "The Estimated Gas Price value is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNull(
        output.feeToken,
        "It is not expected behaviour of the feeToken in the Get Submitted Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.feeAmount._hex,
        "The value of the feeAmount field of the Get Submitted Batch Response is not displayed."
      );

      FeeAmount_Submitted = output.feeAmount._hex;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        FeeAmount_Estimate,
        FeeAmount_Submitted,
        "The Fee Amount value is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.feeData,
        "The value of the feeData field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNull(
        output.delayedUntil,
        "It is not expected behaviour of the delayedUntil in the Get Submitted Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.events[0].contract,
        "PersonalAccountRegistry",
        "The contract of the events is not displayed in the Get Submitted Batch Response"
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.events[0].event,
        "AccountTransactionExecuted",
        "The event of the events is not displayed in the Get Submitted Batch Response"
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.events[0].args,
        "The args of the events is not displayed in the Get Submitted Batch Response"
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.events[1].contract,
        "PersonalAccountRegistry",
        "The contract of the events is not displayed in the Get Submitted Batch Response"
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.events[1].event,
        "AccountCallRefunded",
        "The event of the events is not displayed in the Get Submitted Batch Response"
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.events[1].args,
        "The args of the events is not displayed in the Get Submitted Batch Response"
      );
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

    const singleTransaction = await sdkTestNet.getTransaction({
      hash: output.transaction.hash, // Add your transaction hash
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

    const transactions = await sdkTestNet.getTransactions();
    // console.log("Transactions: ", transactions);

    for (let x = 0; x < transactions.items.length; x++) {
      blockNumber_transactions = transactions.items[x].blockNumber;

      if (blockNumber_singleTransaction == blockNumber_transactions) {
        try {
          assert.isNumber(
            transactions.items[x].blockNumber,
            "The blockNumber of the get transactions response is not displayed."
          );
          blockNumber_transactions = transactions.items[x].blockNumber;
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
          assert.isNumber(
            transactions.items[x].timestamp,
            "The timestamp of the get transactions response is not displayed."
          );
          timestamp_transactions = transactions.items[x].timestamp;
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
          assert.isNotEmpty(
            transactions.items[x].from,
            "The from address of the get transactions response is not displayed."
          );
          from_transactions = transactions.items[x].from;
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
          assert.isNumber(
            transactions.items[x].gasLimit,
            "The gasLimit of the get transactions response is not displayed."
          );
          gasLimit_transactions = transactions.items[x].gasLimit;
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
          assert.isNotEmpty(
            transactions.items[x].gasPrice,
            "The gasPrice of the get transactions response is not displayed."
          );
          gasPrice_transactions = transactions.items[x].gasPrice;
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
          assert.isNumber(
            transactions.items[x].gasUsed,
            "The gasUsed of the get transactions response is not displayed."
          );
          gasUsed_transactions = transactions.items[x].gasUsed;
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
          assert.isNotEmpty(
            transactions.items[x].hash,
            "The hash of the get transactions response is not displayed."
          );
          hash_transactions = transactions.items[x].hash;
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
          assert.isNotEmpty(
            transactions.items[x].logs,
            "The logs of the get transactions response is not displayed."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.strictEqual(
            transactions.items[x].status,
            "Completed",
            "The status of the get transactions response is not displayed."
          );
          status_transactions = transactions.items[x].status;
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
          assert.isNotEmpty(
            transactions.items[x].to,
            "The to address of the get transactions response is not displayed."
          );
          to_transactions = transactions.items[x].to;
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
          assert.isNotEmpty(
            transactions.items[x].value,
            "The value of the get transactions response is not displayed."
          );
          value_transactions = transactions.items[x].value;
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
            transactions.items[x].direction,
            "Sender",
            "The direction of the get transactions response is not displayed."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isTrue(
            transactions.items[x].mainTransactionDataFetched,
            "The mainTransactionDataFetched of the get transactions response is not displayed."
          );
          mainTransactionDataFetched_transactions =
            transactions.items[x].mainTransactionDataFetched;
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
          assert.isFalse(
            transactions.items[x].internalTransactionsFetched,
            "The internalTransactionsFetched of the get transactions response is not displayed."
          );
          internalTransactionsFetched_transactions =
            transactions.items[x].internalTransactionsFetched;
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
          assert.isNotEmpty(
            transactions.items[x].batch,
            "The batch of the get transactions response is not displayed."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNotEmpty(
            transactions.items[x].assert,
            "The assert of the get transactions response is not displayed."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNotEmpty(
            transactions.items[x].blockExplorerUrl,
            "The blockExplorerUrl of the get transactions response is not displayed."
          );
          blockExplorerUrl_transactions =
            transactions.items[x].blockExplorerUrl;
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

        // validate hash of submitted batch and single transaction is displayed same
        try {
          assert.strictEqual(
            output.transaction.hash,
            singleTransaction.hash,
            "The hash of the get single transaction response and get submitted Batch response are not matched."
          );
        } catch (e) {
          console.log(e);
        }

        // validate hash of submitted batch and from transactions list is displayed same
        try {
          assert.strictEqual(
            output.transaction.hash,
            transactions.items[x].hash,
            "The hash of the get transactions response and get submitted Batch response are not matched."
          );
        } catch (e) {
          console.log(e);
        }
        break;
      }
    }
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
    // console.log("Batch Reponse: ", addTransactionToBatchOutput);

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
        "The value of the data field of the Batch Reponse is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNull(
        addTransactionToBatchOutput.estimation,
        "It is not expected behaviour of the estimation in the Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    // Estimating the batch
    let EstimatedGas_Estimate;
    let FeeAmount_Estimate;
    let EstimatedGasPrice_Estimate;

    const estimationResponse = await sdkTestNet.estimateGatewayBatch();
    // console.log("Gas estimated at:", estimationResponse);

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
        "The value of the data field of the Estimation Response is not displayed."
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
        "The estimatedGas of the Estimate Batch Response is not displayed."
      );
      EstimatedGas_Estimate = estimationResponse.estimation.estimatedGas;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        estimationResponse.estimation.feeAmount,
        "The value of the feeAmount field of the Estimation Response is not displayed."
      );
      FeeAmount_Estimate = estimationResponse.estimation.feeAmount._hex;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        estimationResponse.estimation.estimatedGasPrice,
        "The value of the estimatedGasPrice field of the Estimation Response is not displayed."
      );
      EstimatedGasPrice_Estimate =
        estimationResponse.estimation.estimatedGasPrice._hex;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        estimationResponse.estimation.signature,
        "The value of the signature field of the Estimation Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    // Submitting the batch
    let EstimatedGas_Submit;
    let FeeAmount_Submit;
    let EstimatedGasPrice_Submit;

    const submissionResponse = await sdkTestNet.submitGatewayBatch({
      guarded: false,
    });
    // console.log("Status of the batch submition: ", submissionResponse);
    hashAddressBig = BigNumber.from(submissionResponse.hash)._hex;
    console.log("BIG HASH ADDRESS: ", hashAddressBig);

    try {
      assert.isNull(
        submissionResponse.transaction,
        "It is not expected behaviour of the transaction in the Get Submitted Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.hash,
        "The value of the hash field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        submissionResponse.state,
        "Queued",
        "The status of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        submissionResponse.account,
        "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
        "The account address of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        submissionResponse.nonce,
        "The nonce number of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        submissionResponse.to[0],
        "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
        "The To Address in the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.data[0],
        "The value of the data field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.senderSignature,
        "The value of the senderSignature field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        submissionResponse.estimatedGas,
        "The Estimated Gas number of the Get Submitted Batch Response is not displayed."
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
        "The value of the estimatedGasPrice field of the Get Submitted Batch Response is not displayed."
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
        "It is not expected behaviour of the feeToken in the Get Submitted Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.feeAmount._hex,
        "The value of the feeAmount field of the Get Submitted Batch Response is not displayed."
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
        "The value of the feeData field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNull(
        submissionResponse.delayedUntil,
        "It is not expected behaviour of the delayedUntil in the Get Submitted Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    // get the submitted batch and wait till the status become sent
    do {
      const output = await sdkTestNet.getGatewaySubmittedBatch({
        hash: hashAddressBig,
      });
      transactionState = output.state;

      Helper.wait(2000);
    } while (!(transactionState == "Sent"));

    // get submmited batch with sent status
    let EstimatedGas_Submitted;
    let FeeAmount_Submitted;
    let EstimatedGasPrice_Submitted;

    const output = await sdkTestNet.getGatewaySubmittedBatch({
      hash: hashAddressBig,
    });
    // console.log("Gateway Submitted Batch after sending: ", output);

    try {
      assert.isNotEmpty(
        output.transaction.hash,
        "The Hash of the transaction of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.transaction.state,
        "Sent",
        "The state of the transaction of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.transaction.sender,
        "The sender address of the transaction of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.transaction.gasPrice,
        "The gasPrice of the transaction of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        output.transaction.gasUsed,
        "The gasUsed of the transaction of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.transaction.totalCost,
        "The totalCost of the transaction of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.logs[0].address,
        "The address of the logs of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.logs[0].data,
        "The data of the logs of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.logs[0].topics,
        "The topics of the logs of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.hash,
        "The value of the hash field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.state,
        "Sent",
        "The status of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.account,
        "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
        "The account address of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        output.nonce,
        "The nonce number of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.to[0],
        "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
        "The To Address in the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.data[0],
        "The value of the data field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.senderSignature,
        "The value of the senderSignature field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        output.estimatedGas,
        "The Estimated Gas number of the Get Submitted Batch Response is not displayed."
      );
      EstimatedGas_Submitted = output.estimatedGas;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        EstimatedGas_Estimate,
        EstimatedGas_Submitted,
        "The Estimated Gas value is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.estimatedGasPrice._hex,
        "The value of the estimatedGasPrice field of the Get Submitted Batch Response is not displayed."
      );
      EstimatedGasPrice_Submitted = output.estimatedGasPrice._hex;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        EstimatedGasPrice_Estimate,
        EstimatedGasPrice_Submitted,
        "The Estimated Gas Price value is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNull(
        output.feeToken,
        "It is not expected behaviour of the feeToken in the Get Submitted Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.feeAmount._hex,
        "The value of the feeAmount field of the Get Submitted Batch Response is not displayed."
      );

      FeeAmount_Submitted = output.feeAmount._hex;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        FeeAmount_Estimate,
        FeeAmount_Submitted,
        "The Fee Amount value is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.feeData,
        "The value of the feeData field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNull(
        output.delayedUntil,
        "It is not expected behaviour of the delayedUntil in the Get Submitted Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.events[0].contract,
        "PersonalAccountRegistry",
        "The contract of the events is not displayed in the Get Submitted Batch Response"
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.events[0].event,
        "AccountTransactionExecuted",
        "The event of the events is not displayed in the Get Submitted Batch Response"
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.events[0].args,
        "The args of the events is not displayed in the Get Submitted Batch Response"
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.events[1].contract,
        "PersonalAccountRegistry",
        "The contract of the events is not displayed in the Get Submitted Batch Response"
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.events[1].event,
        "AccountCallRefunded",
        "The event of the events is not displayed in the Get Submitted Batch Response"
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.events[1].args,
        "The args of the events is not displayed in the Get Submitted Batch Response"
      );
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

    const singleTransaction = await sdkTestNet.getTransaction({
      hash: output.transaction.hash, // Add your transaction hash
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

    const transactions = await sdkTestNet.getTransactions();
    // console.log("Transactions: ", transactions);

    for (let x = 0; x < transactions.items.length; x++) {
      blockNumber_transactions = transactions.items[x].blockNumber;

      if (blockNumber_singleTransaction == blockNumber_transactions) {
        try {
          assert.isNumber(
            transactions.items[x].blockNumber,
            "The blockNumber of the get transactions response is not displayed."
          );
          blockNumber_transactions = transactions.items[x].blockNumber;
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
          assert.isNumber(
            transactions.items[x].timestamp,
            "The timestamp of the get transactions response is not displayed."
          );
          timestamp_transactions = transactions.items[x].timestamp;
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
          assert.isNotEmpty(
            transactions.items[x].from,
            "The from address of the get transactions response is not displayed."
          );
          from_transactions = transactions.items[x].from;
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
          assert.isNumber(
            transactions.items[x].gasLimit,
            "The gasLimit of the get transactions response is not displayed."
          );
          gasLimit_transactions = transactions.items[x].gasLimit;
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
          assert.isNotEmpty(
            transactions.items[x].gasPrice,
            "The gasPrice of the get transactions response is not displayed."
          );
          gasPrice_transactions = transactions.items[x].gasPrice;
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
          assert.isNumber(
            transactions.items[x].gasUsed,
            "The gasUsed of the get transactions response is not displayed."
          );
          gasUsed_transactions = transactions.items[x].gasUsed;
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
          assert.isNotEmpty(
            transactions.items[x].hash,
            "The hash of the get transactions response is not displayed."
          );
          hash_transactions = transactions.items[x].hash;
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
          assert.isNotEmpty(
            transactions.items[x].logs,
            "The logs of the get transactions response is not displayed."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.strictEqual(
            transactions.items[x].status,
            "Completed",
            "The status of the get transactions response is not displayed."
          );
          status_transactions = transactions.items[x].status;
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
          assert.isNotEmpty(
            transactions.items[x].to,
            "The to address of the get transactions response is not displayed."
          );
          to_transactions = transactions.items[x].to;
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
          assert.isNotEmpty(
            transactions.items[x].value,
            "The value of the get transactions response is not displayed."
          );
          value_transactions = transactions.items[x].value;
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
            transactions.items[x].direction,
            "Sender",
            "The direction of the get transactions response is not displayed."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isTrue(
            transactions.items[x].mainTransactionDataFetched,
            "The mainTransactionDataFetched of the get transactions response is not displayed."
          );
          mainTransactionDataFetched_transactions =
            transactions.items[x].mainTransactionDataFetched;
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
          assert.isFalse(
            transactions.items[x].internalTransactionsFetched,
            "The internalTransactionsFetched of the get transactions response is not displayed."
          );
          internalTransactionsFetched_transactions =
            transactions.items[x].internalTransactionsFetched;
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
          assert.isNotEmpty(
            transactions.items[x].batch,
            "The batch of the get transactions response is not displayed."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNotEmpty(
            transactions.items[x].assert,
            "The assert of the get transactions response is not displayed."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNotEmpty(
            transactions.items[x].blockExplorerUrl,
            "The blockExplorerUrl of the get transactions response is not displayed."
          );
          blockExplorerUrl_transactions =
            transactions.items[x].blockExplorerUrl;
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

        // validate hash of submitted batch and single transaction is displayed same
        try {
          assert.strictEqual(
            output.transaction.hash,
            singleTransaction.hash,
            "The hash of the get single transaction response and get submitted Batch response are not matched."
          );
        } catch (e) {
          console.log(e);
        }

        // validate hash of submitted batch and from transactions list is displayed same
        try {
          assert.strictEqual(
            output.transaction.hash,
            transactions.items[x].hash,
            "The hash of the get transactions response and get submitted Batch response are not matched."
          );
        } catch (e) {
          console.log(e);
        }
        break;
      }
    }
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
    // console.log("Batch Reponse: ", addTransactionToBatchOutput);

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
        "The value of the data field of the Batch Reponse is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNull(
        addTransactionToBatchOutput.estimation,
        "It is not expected behaviour of the estimation in the Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    // Estimating the batch
    let EstimatedGas_Estimate;
    let FeeAmount_Estimate;
    let EstimatedGasPrice_Estimate;

    const estimationResponse = await sdkTestNet.estimateGatewayBatch();
    // console.log("Gas estimated at:", estimationResponse);

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
        "The value of the data field of the Estimation Response is not displayed."
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
        "The estimatedGas of the Estimate Batch Response is not displayed."
      );
      EstimatedGas_Estimate = estimationResponse.estimation.estimatedGas;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        estimationResponse.estimation.feeAmount,
        "The value of the feeAmount field of the Estimation Response is not displayed."
      );
      FeeAmount_Estimate = estimationResponse.estimation.feeAmount._hex;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        estimationResponse.estimation.estimatedGasPrice,
        "The value of the estimatedGasPrice field of the Estimation Response is not displayed."
      );
      EstimatedGasPrice_Estimate =
        estimationResponse.estimation.estimatedGasPrice._hex;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        estimationResponse.estimation.signature,
        "The value of the signature field of the Estimation Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    // Submitting the batch
    let EstimatedGas_Submit;
    let FeeAmount_Submit;
    let EstimatedGasPrice_Submit;

    const submissionResponse = await sdkTestNet.submitGatewayBatch({
      guarded: false,
    });
    // console.log("Status of the batch submition: ", submissionResponse);
    hashAddressBig = BigNumber.from(submissionResponse.hash)._hex;
    console.log("BIG HASH ADDRESS: ", hashAddressBig);

    try {
      assert.isNull(
        submissionResponse.transaction,
        "It is not expected behaviour of the transaction in the Get Submitted Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.hash,
        "The value of the hash field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        submissionResponse.state,
        "Queued",
        "The status of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        submissionResponse.account,
        "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
        "The account address of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        submissionResponse.nonce,
        "The nonce number of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        submissionResponse.to[0],
        "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
        "The To Address in the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.data[0],
        "The value of the data field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.senderSignature,
        "The value of the senderSignature field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        submissionResponse.estimatedGas,
        "The Estimated Gas number of the Get Submitted Batch Response is not displayed."
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
        "The value of the estimatedGasPrice field of the Get Submitted Batch Response is not displayed."
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
        "It is not expected behaviour of the feeToken in the Get Submitted Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.feeAmount._hex,
        "The value of the feeAmount field of the Get Submitted Batch Response is not displayed."
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
        "The value of the feeData field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNull(
        submissionResponse.delayedUntil,
        "It is not expected behaviour of the delayedUntil in the Get Submitted Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    // get the submitted batch and wait till the status become sent
    do {
      const output = await sdkTestNet.getGatewaySubmittedBatch({
        hash: hashAddressBig,
      });
      transactionState = output.state;

      Helper.wait(2000);
    } while (!(transactionState == "Sent"));

    // get submmited batch with sent status
    let EstimatedGas_Submitted;
    let FeeAmount_Submitted;
    let EstimatedGasPrice_Submitted;

    const output = await sdkTestNet.getGatewaySubmittedBatch({
      hash: hashAddressBig,
    });
    // console.log("Gateway Submitted Batch after sending: ", output);

    try {
      assert.isNotEmpty(
        output.transaction.hash,
        "The Hash of the transaction of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.transaction.state,
        "Sent",
        "The state of the transaction of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.transaction.sender,
        "The sender address of the transaction of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.transaction.gasPrice,
        "The gasPrice of the transaction of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        output.transaction.gasUsed,
        "The gasUsed of the transaction of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.transaction.totalCost,
        "The totalCost of the transaction of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.logs[0].address,
        "The address of the logs of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.logs[0].data,
        "The data of the logs of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.logs[0].topics,
        "The topics of the logs of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.hash,
        "The value of the hash field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.state,
        "Sent",
        "The status of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.account,
        "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
        "The account address of the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        output.nonce,
        "The nonce number of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.to[0],
        "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
        "The To Address in the Get Submitted Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.data[0],
        "The value of the data field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.senderSignature,
        "The value of the senderSignature field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        output.estimatedGas,
        "The Estimated Gas number of the Get Submitted Batch Response is not displayed."
      );
      EstimatedGas_Submitted = output.estimatedGas;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        EstimatedGas_Estimate,
        EstimatedGas_Submitted,
        "The Estimated Gas value is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.estimatedGasPrice._hex,
        "The value of the estimatedGasPrice field of the Get Submitted Batch Response is not displayed."
      );
      EstimatedGasPrice_Submitted = output.estimatedGasPrice._hex;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        EstimatedGasPrice_Estimate,
        EstimatedGasPrice_Submitted,
        "The Estimated Gas Price value is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNull(
        output.feeToken,
        "It is not expected behaviour of the feeToken in the Get Submitted Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.feeAmount._hex,
        "The value of the feeAmount field of the Get Submitted Batch Response is not displayed."
      );

      FeeAmount_Submitted = output.feeAmount._hex;
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        FeeAmount_Estimate,
        FeeAmount_Submitted,
        "The Fee Amount value is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.feeData,
        "The value of the feeData field of the Get Submitted Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNull(
        output.delayedUntil,
        "It is not expected behaviour of the delayedUntil in the Get Submitted Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.events[0].contract,
        "PersonalAccountRegistry",
        "The contract of the events is not displayed in the Get Submitted Batch Response"
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.events[0].event,
        "AccountTransactionExecuted",
        "The event of the events is not displayed in the Get Submitted Batch Response"
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.events[0].args,
        "The args of the events is not displayed in the Get Submitted Batch Response"
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.events[1].contract,
        "PersonalAccountRegistry",
        "The contract of the events is not displayed in the Get Submitted Batch Response"
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        output.events[1].event,
        "AccountCallRefunded",
        "The event of the events is not displayed in the Get Submitted Batch Response"
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        output.events[1].args,
        "The args of the events is not displayed in the Get Submitted Batch Response"
      );
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

    const singleTransaction = await sdkTestNet.getTransaction({
      hash: output.transaction.hash, // Add your transaction hash
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

    const transactions = await sdkTestNet.getTransactions();
    // console.log("Transactions: ", transactions);

    for (let x = 0; x < transactions.items.length; x++) {
      blockNumber_transactions = transactions.items[x].blockNumber;

      if (blockNumber_singleTransaction == blockNumber_transactions) {
        try {
          assert.isNumber(
            transactions.items[x].blockNumber,
            "The blockNumber of the get transactions response is not displayed."
          );
          blockNumber_transactions = transactions.items[x].blockNumber;
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
          assert.isNumber(
            transactions.items[x].timestamp,
            "The timestamp of the get transactions response is not displayed."
          );
          timestamp_transactions = transactions.items[x].timestamp;
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
          assert.isNotEmpty(
            transactions.items[x].from,
            "The from address of the get transactions response is not displayed."
          );
          from_transactions = transactions.items[x].from;
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
          assert.isNumber(
            transactions.items[x].gasLimit,
            "The gasLimit of the get transactions response is not displayed."
          );
          gasLimit_transactions = transactions.items[x].gasLimit;
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
          assert.isNotEmpty(
            transactions.items[x].gasPrice,
            "The gasPrice of the get transactions response is not displayed."
          );
          gasPrice_transactions = transactions.items[x].gasPrice;
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
          assert.isNumber(
            transactions.items[x].gasUsed,
            "The gasUsed of the get transactions response is not displayed."
          );
          gasUsed_transactions = transactions.items[x].gasUsed;
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
          assert.isNotEmpty(
            transactions.items[x].hash,
            "The hash of the get transactions response is not displayed."
          );
          hash_transactions = transactions.items[x].hash;
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
          assert.isNotEmpty(
            transactions.items[x].logs,
            "The logs of the get transactions response is not displayed."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.strictEqual(
            transactions.items[x].status,
            "Completed",
            "The status of the get transactions response is not displayed."
          );
          status_transactions = transactions.items[x].status;
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
          assert.isNotEmpty(
            transactions.items[x].to,
            "The to address of the get transactions response is not displayed."
          );
          to_transactions = transactions.items[x].to;
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
          assert.isNotEmpty(
            transactions.items[x].value,
            "The value of the get transactions response is not displayed."
          );
          value_transactions = transactions.items[x].value;
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
            transactions.items[x].direction,
            "Sender",
            "The direction of the get transactions response is not displayed."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isTrue(
            transactions.items[x].mainTransactionDataFetched,
            "The mainTransactionDataFetched of the get transactions response is not displayed."
          );
          mainTransactionDataFetched_transactions =
            transactions.items[x].mainTransactionDataFetched;
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
          assert.isFalse(
            transactions.items[x].internalTransactionsFetched,
            "The internalTransactionsFetched of the get transactions response is not displayed."
          );
          internalTransactionsFetched_transactions =
            transactions.items[x].internalTransactionsFetched;
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
          assert.isNotEmpty(
            transactions.items[x].batch,
            "The batch of the get transactions response is not displayed."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNotEmpty(
            transactions.items[x].assert,
            "The assert of the get transactions response is not displayed."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNotEmpty(
            transactions.items[x].blockExplorerUrl,
            "The blockExplorerUrl of the get transactions response is not displayed."
          );
          blockExplorerUrl_transactions =
            transactions.items[x].blockExplorerUrl;
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

        // validate hash of submitted batch and single transaction is displayed same
        try {
          assert.strictEqual(
            output.transaction.hash,
            singleTransaction.hash,
            "The hash of the get single transaction response and get submitted Batch response are not matched."
          );
        } catch (e) {
          console.log(e);
        }

        // validate hash of submitted batch and from transactions list is displayed same
        try {
          assert.strictEqual(
            output.transaction.hash,
            transactions.items[x].hash,
            "The hash of the get transactions response and get submitted Batch response are not matched."
          );
        } catch (e) {
          console.log(e);
        }
        break;
      }
    }
  });
});
