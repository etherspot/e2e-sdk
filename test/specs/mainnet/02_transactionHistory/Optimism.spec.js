import * as dotenv from "dotenv";
dotenv.config(); // init dotenv

import { assert } from "chai";
import { EnvNames, NetworkNames, Sdk } from "etherspot";
import { BigNumber } from "ethers";
import Helper from "../../../utils/Helper.js";

let optimismMainNetSdk;
let optimismSmartWalletAddress;
let optimismSmartWalletOutput;
let toAddress = "0x71Bec2309cC6BDD5F1D73474688A6154c28Db4B5";
let value = "1000000000000"; // 18 decimal

describe("Get the transaction history on the MainNet", () => {
  it("SMOKE: Perform the send native token on the optimism network and get the transaction history", async () => {
    let hashAddressBig;
    let transactionState;

    // initialize the sdk
    try {
      optimismMainNetSdk = new Sdk(process.env.PRIVATE_KEY, {
        env: EnvNames.MainNets,
        networkName: NetworkNames.Optimism,
      });

      assert.strictEqual(
        optimismMainNetSdk.state.accountAddress,
        "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f",
        "The EOA Address is not calculated correctly."
      );
    } catch (e) {
      console.log(e);
      assert.fail("The SDK is not initialled successfully.");
    }

    // Compute the smart wallet address
    try {
      optimismSmartWalletOutput =
        await optimismMainNetSdk.computeContractAccount();
      optimismSmartWalletAddress = optimismSmartWalletOutput.address;

      assert.strictEqual(
        optimismSmartWalletAddress,
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
        await optimismMainNetSdk.batchExecuteAccountTransaction({
          to: toAddress,
          value: value,
        });

      try {
        assert.isNotEmpty(
          addTransactionToBatchOutput.requests[0].to,
          "The To Address is empty in the Batch Response."
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
    } catch (e) {
      console.log(e);
    }

    // Estimating the batch
    let estimationResponse;
    let EstimatedGas_Estimate;
    let FeeAmount_Estimate;
    let EstimatedGasPrice_Estimate;

    try {
      estimationResponse = await optimismMainNetSdk.estimateGatewayBatch();

      try {
        assert.isNotEmpty(
          estimationResponse.requests[0].to,
          "The To Address is empty in the Batch Response."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          estimationResponse.requests[0].data,
          "The data value is empty in the Estimation Batch Response."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          estimationResponse.estimation.feeTokenReceiver,
          "The feeTokenReceiver Address isempty in the Estimation Batch Response."
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
          "The feeAmount value is empty in the Estimation Batch Response."
        );
        FeeAmount_Estimate = estimationResponse.estimation.feeAmount._hex;
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          estimationResponse.estimation.estimatedGasPrice,
          "The estimatedGasPrice value is empty in the Estimation Batch Response."
        );
        EstimatedGasPrice_Estimate =
          estimationResponse.estimation.estimatedGasPrice._hex;
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          estimationResponse.estimation.signature,
          "The signature value is empty in the Estimation Batch Response."
        );
      } catch (e) {
        console.log(e);
      }
    } catch (e) {
      console.log(e);
      assert.fail("The estimation of the batch is not performed successfully.");
    }

    // Submitting the batch
    let submissionResponse;
    let EstimatedGas_Submit;
    let FeeAmount_Submit;
    let EstimatedGasPrice_Submit;

    try {
      submissionResponse = await optimismMainNetSdk.submitGatewayBatch({
        guarded: false,
      });
      hashAddressBig = BigNumber.from(submissionResponse.hash)._hex;

      try {
        assert.isNull(
          submissionResponse.transaction,
          "The transaction value is not null in the Get Submitted Batch Response."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          submissionResponse.hash,
          "The hash value is empty in the Get Submitted Batch Response."
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
          optimismSmartWalletAddress,
          "The account address of the Get Submitted Batch Response is not displayed correctly."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNumber(
          submissionResponse.nonce,
          "The nonce value is not number in the Get Submitted Batch Response."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          submissionResponse.to[0],
          "The To Address is empty in the Get Submitted Batch Response."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          submissionResponse.data[0],
          "The data value is empty in the Get Submitted Batch Response."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          submissionResponse.senderSignature,
          "The senderSignature value is empty in the Get Submitted Batch Response."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNumber(
          submissionResponse.estimatedGas,
          "The Estimated Gas value is not number in the Get Submitted Batch Response."
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
          "The estimatedGasPrice value is empty in the Get Submitted Batch Response."
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
          "The feeToken value is not null in the Get Submitted Batch Response."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          submissionResponse.feeAmount._hex,
          "The feeAmount value is empty in the Get Submitted Batch Response."
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
          "The feeData value is empty in the Get Submitted Batch Response."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNull(
          submissionResponse.delayedUntil,
          "The delayedUntil value is not null in the Get Submitted Batch Response."
        );
      } catch (e) {
        console.log(e);
      }
    } catch (e) {
      console.log(e);
      assert.fail("The submittion of the batch is not performed successfully.");
    }

    // get the submitted batch and wait till the status become sent
    do {
      try {
        let output = await optimismMainNetSdk.getGatewaySubmittedBatch({
          hash: hashAddressBig,
        });
        transactionState = output.state;
        if (transactionState === "Reverted") {
          console.log("The transaction status is Reverted.");
          break;
        }

        Helper.wait(2000);
      } catch (e) {
        console.log(e);
      }
    } while (!(transactionState == "Sent"));

    // get submmited batch with sent status
    if (!(transactionState === "Reverted")) {
      let output;
      let EstimatedGas_Submitted;
      let FeeAmount_Submitted;
      let EstimatedGasPrice_Submitted;

      try {
        output = await optimismMainNetSdk.getGatewaySubmittedBatch({
          hash: hashAddressBig,
        });

        try {
          assert.isNotEmpty(
            output.transaction.hash,
            "The Hash value of the transaction is empty in the Get Submitted Batch Response."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.strictEqual(
            output.transaction.state,
            "Sent",
            "The state value of the transaction is empty in the Get Submitted Batch Response."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNotEmpty(
            output.transaction.sender,
            "The sender address value of the transaction is empty in the Get Submitted Batch Response."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNotEmpty(
            output.transaction.gasPrice,
            "The gasPrice value of the transaction is empty in the Get Submitted Batch Response."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNumber(
            output.transaction.gasUsed,
            "The gasUsed value of the transaction is not number in the Get Submitted Batch Response."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNotEmpty(
            output.transaction.totalCost,
            "The totalCost value of the transaction is empty in the Get Submitted Batch Response."
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
            "hash transaction value is not null in the Get Submitted Batch Response."
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
            optimismSmartWalletAddress,
            "The account address of the Get Submitted Batch Response is not displayed correctly."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNumber(
            output.nonce,
            "The nonce value is not number in the Get Submitted Batch Response."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNotEmpty(
            output.to[0],
            "The To Address is empty in the Get Submitted Batch Response."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNotEmpty(
            output.data[0],
            "The data value is empty in the Get Submitted Batch Response."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNotEmpty(
            output.senderSignature,
            "The senderSignature value is empty in the Get Submitted Batch Response."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNumber(
            output.estimatedGas,
            "The Estimated Gas value is not number in the Get Submitted Batch Response."
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
            "The estimatedGasPrice value is empty in the Get Submitted Batch Response."
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
            "The feeToken value is not null in the Get Submitted Batch Response."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNotEmpty(
            output.feeAmount._hex,
            "The feeAmount value is empty in the Get Submitted Batch Response."
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
            "The feeData value is empty in the Get Submitted Batch Response."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNull(
            output.delayedUntil,
            "The delayedUntil value is not null in the Get Submitted Batch Response."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.strictEqual(
            output.events[0].contract,
            "PersonalAccountRegistry",
            "The contract of the events is enpty in the Get Submitted Batch Response"
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.strictEqual(
            output.events[0].event,
            "AccountTransactionExecuted",
            "The event of the events is enpty in the Get Submitted Batch Response"
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNotEmpty(
            output.events[0].args,
            "The args of the events is empty in the Get Submitted Batch Response"
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.strictEqual(
            output.events[1].contract,
            "PersonalAccountRegistry",
            "The contract of the events is empty in the Get Submitted Batch Response"
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.strictEqual(
            output.events[1].event,
            "AccountCallRefunded",
            "The event of the events is enpty in the Get Submitted Batch Response"
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNotEmpty(
            output.events[1].args,
            "The args of the events is enpty in the Get Submitted Batch Response"
          );
        } catch (e) {
          console.log(e);
        }
      } catch (e) {
        console.log(e);
        assert.fail(
          "An error is displayed while getting the submmited batch with sent status."
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
      let value_singleTransaction;
      let blockExplorerUrl_singleTransaction;

      try {
        singleTransaction = await optimismMainNetSdk.getTransaction({
          hash: output.transaction.hash, // Add your transaction hash
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
            "The from address value is empty in the Get Single Transaction Response."
          );
          from_singleTransaction = singleTransaction.from;
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNumber(
            singleTransaction.gasLimit,
            "The gasLimit value is not number in the Get Single Transaction Response."
          );
          gasLimit_singleTransaction = singleTransaction.gasLimit;
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNotEmpty(
            singleTransaction.gasPrice,
            "The gasPrice value is empty in the Get Single Transaction Response."
          );
          gasPrice_singleTransaction = singleTransaction.gasPrice;
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNumber(
            singleTransaction.gasUsed,
            "The gasUsed value is not number in the Get Single Transaction Response."
          );
          gasUsed_singleTransaction = singleTransaction.gasUsed;
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNotEmpty(
            singleTransaction.hash,
            "The hash value is empty in the Get Single Transaction Response."
          );
          hash_singleTransaction = singleTransaction.hash;
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNotEmpty(
            singleTransaction.input,
            "The input value is empty in the Get Single Transaction Response."
          );
        } catch (e) {
          console.log(e);
        }

        for (let i = 0; i < singleTransaction.logs.length; i++) {
          try {
            assert.isNotEmpty(
              singleTransaction.logs[i].address,
              "The address of the logs value is empty in the Get Single Transaction Response."
            );
          } catch (e) {
            console.log(e);
          }

          try {
            assert.isNotEmpty(
              singleTransaction.logs[i].data,
              "The data of the logs value is empty in the Get Single Transaction Response."
            );
          } catch (e) {
            console.log(e);
          }

          try {
            assert.isNotEmpty(
              singleTransaction.logs[i].decoded,
              "The decoded of the logs value is empty in the Get Single Transaction Response."
            );
          } catch (e) {
            console.log(e);
          }

          try {
            assert.isNotEmpty(
              singleTransaction.logs[i].topics,
              "The topics of the logs value is empty in the Get Single Transaction Response."
            );
          } catch (e) {
            console.log(e);
          }
        }

        try {
          assert.isNumber(
            singleTransaction.nonce,
            "The nonce value is not number in the Get Single Transaction Response."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.strictEqual(
            singleTransaction.status,
            "Completed",
            "The status value is empty in the Get Single Transaction Response."
          );
          status_singleTransaction = singleTransaction.status;
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNumber(
            singleTransaction.timestamp,
            "The timestamp value is not number in the Get Single Transaction Response."
          );
          timestamp_singleTransaction = singleTransaction.timestamp;
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNotEmpty(
            singleTransaction.to,
            "The To Address value is empty in the Get Single Transaction Response."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNumber(
            singleTransaction.transactionIndex,
            "The To transactionIndex value is not number in the Get Single Transaction Response."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNotEmpty(
            singleTransaction.value,
            "The To value value is empty in the Get Single Transaction Response."
          );
          value_singleTransaction = singleTransaction.value;
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNotEmpty(
            singleTransaction.blockExplorerUrl,
            "The To blockExplorerUrl value is empty in the Get Single Transaction Response."
          );
          blockExplorerUrl_singleTransaction =
            singleTransaction.blockExplorerUrl;
        } catch (e) {
          console.log(e);
        }
      } catch (e) {
        console.log(e);
        assert.fail("An error is displayed while Fetching single transaction.");
      }

      // Fetching historical transactions
      let transactions;
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

      try {
        transactions = await optimismMainNetSdk.getTransactions();

        for (let x = 0; x < transactions.items.length; x++) {
          blockNumber_transactions = transactions.items[x].blockNumber;

          if (blockNumber_singleTransaction == blockNumber_transactions) {
            try {
              assert.isNumber(
                transactions.items[x].blockNumber,
                "The blockNumber value is not number in the Get Transactions Response."
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
                "The timestamp value is not number in the Get Transactions Response."
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
                "The from address value is empty in the Get Transactions Response."
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
                "The gasLimit value is not number in the Get Transactions Response."
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
                "The gasPrice value is empty in the Get Transactions Response."
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
                "The gasUsed value is not number in the Get Transactions Response."
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
                "The hash value is empty in the Get Transactions Response."
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
                "The logs value is empty in the Get Transactions Response."
              );
            } catch (e) {
              console.log(e);
            }

            try {
              assert.strictEqual(
                transactions.items[x].status,
                "Completed",
                "The status value is empty in the Get Transactions Response."
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
                "The to address value is empty in the Get Transactions Response."
              );
              to_transactions = transactions.items[x].to;
            } catch (e) {
              console.log(e);
            }

            try {
              assert.isNotEmpty(
                transactions.items[x].value,
                "The value value is empty in the Get Transactions Response."
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
                "The direction value is empty in the Get Transactions Response."
              );
            } catch (e) {
              console.log(e);
            }

            try {
              assert.isNotEmpty(
                transactions.items[x].batch,
                "The batch value is empty in the Get Transactions Response."
              );
            } catch (e) {
              console.log(e);
            }

            try {
              assert.isNotEmpty(
                transactions.items[x].asset,
                "The asset value is empty in the Get Transactions Response."
              );
            } catch (e) {
              console.log(e);
            }

            try {
              assert.isNotEmpty(
                transactions.items[x].blockExplorerUrl,
                "The blockExplorerUrl value is empty in the Get Transactions Response."
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
      } catch (e) {
        console.log(e);
        assert.fail(
          "An error is displayed while Fetching historical transactions."
        );
      }
    } else {
      assert.fail(
        "The submitted batch is not received with sent transaction status."
      );
    }
  });

  it("REGRESSION: Perform the send native token on the optimism network and get the transaction history from the random hash", async () => {
    // initialize the sdk
    try {
      optimismMainNetSdk = new Sdk(process.env.PRIVATE_KEY, {
        env: EnvNames.MainNets,
        networkName: NetworkNames.Optimism,
      });

      assert.strictEqual(
        optimismMainNetSdk.state.accountAddress,
        "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f",
        "The EOA Address is not calculated correctly."
      );
    } catch (e) {
      console.log(e);
      assert.fail("The SDK is not initialled successfully.");
    }

    // Compute the smart wallet address
    try {
      optimismSmartWalletOutput =
        await optimismMainNetSdk.computeContractAccount();
      optimismSmartWalletAddress = optimismSmartWalletOutput.address;

      assert.strictEqual(
        optimismSmartWalletAddress,
        "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
        "The smart wallet address is not calculated correctly."
      );
    } catch (e) {
      console.log(e);
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
    let to_transactions;
    let timestamp_transactions;
    let value_transactions;
    let blockExplorerUrl_transactions;

    try {
      transactions = await optimismMainNetSdk.getTransactions();
      randomTransaction =
        Math.floor(Math.random() * (transactions.items.length - 1)) + 1;
      randomHash = transactions.items[randomTransaction].hash;

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
          "The direction value is not equal in the get transactions response."
        );
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
          transactions.items[randomTransaction].asset,
          "The asset value is empty in the get transactions response."
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
      console.log(e);
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
    let value_singleTransaction;
    let blockExplorerUrl_singleTransaction;

    try {
      singleTransaction = await optimismMainNetSdk.getTransaction({
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
        assert.isNotEmpty(
          singleTransaction.to,
          "The To Address value is empty in the get single transaction response."
        );
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
          value_singleTransaction,
          value_transactions,
          "The value of get single transaction response and get transactions response are not matched."
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
      console.log(e);
      assert.fail("An error is displayed while Fetching single transaction.");
    }
  });

  it("REGRESSION: Perform the send native token on the optimism network and get the transaction history with incorrect hash", async () => {
    // initialize the sdk
    try {
      optimismMainNetSdk = new Sdk(process.env.PRIVATE_KEY, {
        env: EnvNames.MainNets,
        networkName: NetworkNames.Optimism,
      });

      assert.strictEqual(
        optimismMainNetSdk.state.accountAddress,
        "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f",
        "The EOA Address is not calculated correctly."
      );
    } catch (e) {
      console.log(e);
      assert.fail("The SDK is not initialled successfully.");
    }

    // Compute the smart wallet address
    try {
      optimismSmartWalletOutput =
        await optimismMainNetSdk.computeContractAccount();
      optimismSmartWalletAddress = optimismSmartWalletOutput.address;

      assert.strictEqual(
        optimismSmartWalletAddress,
        "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
        "The smart wallet address is not calculated correctly."
      );
    } catch (e) {
      console.log(e);
      assert.fail("The smart wallet address is not calculated successfully.");
    }

    // Fetching a single transaction
    try {
      let output = await optimismMainNetSdk.getTransaction({
        hash: "0x3df9fe91b29f4b2bf1b148baf2f9E207e98137F8318ccf39eDc930d1ceA551df", // Incorrect Transaction Hash
      });

      if (output == null) {
        console.log(
          "The null is received while fetching the transaction history with incorrect hash."
        );
      } else {
        console.log(e);
        assert.fail(
          "Getting the single transaction history with incorrect Hash."
        );
      }
    } catch (e) {
      console.log(e);
      assert.fail(
        "Getting the single transaction history with incorrect Hash."
      );
    }
  });

  it("REGRESSION: Perform the send native token on the optimism network and get the transaction history when hash hex is not with 32 size", async () => {
    // initialize the sdk
    try {
      optimismMainNetSdk = new Sdk(process.env.PRIVATE_KEY, {
        env: EnvNames.MainNets,
        networkName: NetworkNames.Optimism,
      });

      assert.strictEqual(
        optimismMainNetSdk.state.accountAddress,
        "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f",
        "The EOA Address is not calculated correctly."
      );
    } catch (e) {
      console.log(e);
      assert.fail("The SDK is not initialled successfully.");
    }

    // Compute the smart wallet address
    try {
      optimismSmartWalletOutput =
        await optimismMainNetSdk.computeContractAccount();
      optimismSmartWalletAddress = optimismSmartWalletOutput.address;

      assert.strictEqual(
        optimismSmartWalletAddress,
        "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
        "The smart wallet address is not calculated correctly."
      );
    } catch (e) {
      console.log(e);
      assert.fail("The smart wallet address is not calculated successfully.");
    }

    // Fetching a single transaction
    try {
      try {
        await optimismMainNetSdk.getTransaction({
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
          console.log(e);
          assert.fail(
            "The transaction history is fetched with hash which not having 32 size hex."
          );
        }
      }
    } catch (e) {
      console.log(e);
      assert.fail(
        "The transaction history is fetched with hash which not having 32 size hex."
      );
    }
  });
});
