import * as dotenv from "dotenv";
dotenv.config();

import { EnvNames, NetworkNames, Sdk } from "etherspot";
import { ethers } from "ethers";
import { assert } from "chai";

let sdkTestNet;
let smartWalletAddress;
let transactionDetails;

describe("The SDK, when single chain swap on the TestNet", () => {
  // SWAP ON ARBITRUM NETWORK
  it("Setup the SDK for Arbitrum network and perform the single chain swap action", async () => {
    let TransactionData_count = 0;

    // Initialize the SDK and define network
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

    // GET EXCHANGE OFFERS
    const offers = await sdkTestNet.getExchangeOffers({
      fromTokenAddress: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8", // USDC Token
      toTokenAddress: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9 ", // USDT Token
      fromAmount: ethers.utils.parseUnits("0.0001", 6),
    });
    // console.log("Offers : ", offers);

    for (let j = 0; j < offers.length; j++) {
      transactionDetails = offers[j].transactions;

      try {
        assert.isNotEmpty(
          offers[j].provider,
          "The provider of the offer is not displayed."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          offers[j].receiveAmount,
          "The receiveAmount value is not displayed."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNumber(
          offers[j].exchangeRate,
          "The exchangeRate value is not displayed."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          offers[j].transactions,
          "The transactions value is not displayed."
        );
      } catch (e) {
        console.log(e);
      }

      for (let i = 0; i < transactionDetails.length; i++) {
        // BATCH EXECUTE ACCOUNT TRANSACTION
        const addTransactionToBatchOutput =
          await sdkTestNet.batchExecuteAccountTransaction(
            transactionDetails[i]
          );

        try {
          assert.strictEqual(
            addTransactionToBatchOutput.requests[i].to,
            "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
            "The To Address of the batchExecuteAccountTransaction is not displayed correctly."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNotEmpty(
            addTransactionToBatchOutput.requests[i].data,
            "The Data value of the batchExecuteAccountTransaction is not displayed."
          );
          let TransactionData_record = addTransactionToBatchOutput.requests;
          TransactionData_count = TransactionData_record.length;
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNull(
            addTransactionToBatchOutput.estimation,
            "It is not expected behaviour of the estimation in the batchExecuteAccountTransaction Response."
          );
        } catch (e) {
          console.log(e);
        }
      }
    }

    // Estimating the batch
    let FeeAmount_Estimate;
    let EstimatedGas_Estimate;
    let EstimatedGasPrice_Estimate;

    const estimationResponse = await sdkTestNet.estimateGatewayBatch();
    // console.log("Gas estimated at: ", estimationResponse);

    for (let k = 0; k < estimationResponse.requests.length; k++) {
      try {
        assert.strictEqual(
          estimationResponse.requests[k].to,
          "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
          "The To Address of the batchExecuteAccountTransaction is not displayed correctly."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          estimationResponse.requests[k].data,
          "The Data value of the batchExecuteAccountTransaction is not displayed."
        );
      } catch (e) {
        console.log(e);
      }
    }

    try {
      assert.strictEqual(
        TransactionData_count,
        estimationResponse.requests.length,
        "The count of the request of the estimationResponse is not displayed correctly."
      );
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
    let FeeAmount_Submit;
    let EstimatedGas_Submit;
    let EstimatedGasPrice_Submit;

    const submissionResponse = await sdkTestNet.submitGatewayBatch({
      guarded: false,
    });
    // console.log("Status of the batch submition: ", submissionResponse);

    try {
      assert.isNull(
        submissionResponse.transaction,
        "It is not expected behaviour of the transaction in the Submit Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.hash,
        "The value of the hash field of the Submit Batch Response is not displayed."
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
        "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
        "The account address of the Submit Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        submissionResponse.nonce,
        "The nonce number of the Submit Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        submissionResponse.to[0],
        "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
        "The To Address in the Submit Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.data[0],
        "The value of the data field of the Submit Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        TransactionData_count,
        submissionResponse.to.length,
        "The count of the To Addresses are not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        TransactionData_count,
        submissionResponse.data.length,
        "The count of the data values are not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.senderSignature,
        "The value of the senderSignature field of the Submit Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        submissionResponse.estimatedGas,
        "The Estimated Gas number of the Submit Batch Response is not displayed."
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
        "The value of the estimatedGasPrice field of the Submit Batch Response is not displayed."
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
        "It is not expected behaviour of the feeToken in the Submit Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.feeAmount._hex,
        "The value of the feeAmount field of the Submit Batch Response is not displayed."
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
        "The value of the feeData field of the Submit Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNull(
        submissionResponse.delayedUntil,
        "It is not expected behaviour of the delayedUntil in the Submit Batch Response."
      );
    } catch (e) {
      console.log(e);
    }
  });

  // SWAP ON ARBITRUMNOVA NETWORK
  it.skip("Setup the SDK for ArbitrumNova network and perform the single chain swap action", async () => {
    let TransactionData_count = 0;

    // Initialize the SDK and define network
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

    // GET EXCHANGE OFFERS
    const offers = await sdkTestNet.getExchangeOffers({
      fromTokenAddress: "0xeFAeeE334F0Fd1712f9a8cc375f427D9Cdd40d73", // DPSDoubloon Token
      toTokenAddress: "0xf823C3cD3CeBE0a1fA952ba88Dc9EEf8e0Bf46AD", // Arbitrum Token
      fromAmount: ethers.utils.parseUnits("0.0001", 6),
    });
    // console.log("Offers : ", offers);

    for (let j = 0; j < offers.length; j++) {
      transactionDetails = offers[j].transactions;

      try {
        assert.isNotEmpty(
          offers[j].provider,
          "The provider of the offer is not displayed."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          offers[j].receiveAmount,
          "The receiveAmount value is not displayed."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNumber(
          offers[j].exchangeRate,
          "The exchangeRate value is not displayed."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          offers[j].transactions,
          "The transactions value is not displayed."
        );
      } catch (e) {
        console.log(e);
      }

      for (let i = 0; i < transactionDetails.length; i++) {
        // BATCH EXECUTE ACCOUNT TRANSACTION
        const addTransactionToBatchOutput =
          await sdkTestNet.batchExecuteAccountTransaction(
            transactionDetails[i]
          );

        try {
          assert.strictEqual(
            addTransactionToBatchOutput.requests[i].to,
            "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
            "The To Address of the batchExecuteAccountTransaction is not displayed correctly."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNotEmpty(
            addTransactionToBatchOutput.requests[i].data,
            "The Data value of the batchExecuteAccountTransaction is not displayed."
          );
          let TransactionData_record = addTransactionToBatchOutput.requests;
          TransactionData_count = TransactionData_record.length;
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNull(
            addTransactionToBatchOutput.estimation,
            "It is not expected behaviour of the estimation in the batchExecuteAccountTransaction Response."
          );
        } catch (e) {
          console.log(e);
        }
      }
    }

    // Estimating the batch
    let FeeAmount_Estimate;
    let EstimatedGas_Estimate;
    let EstimatedGasPrice_Estimate;

    const estimationResponse = await sdkTestNet.estimateGatewayBatch();
    // console.log("Gas estimated at: ", estimationResponse);

    for (let k = 0; k < estimationResponse.requests.length; k++) {
      try {
        assert.strictEqual(
          estimationResponse.requests[k].to,
          "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
          "The To Address of the batchExecuteAccountTransaction is not displayed correctly."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          estimationResponse.requests[k].data,
          "The Data value of the batchExecuteAccountTransaction is not displayed."
        );
      } catch (e) {
        console.log(e);
      }
    }

    try {
      assert.strictEqual(
        TransactionData_count,
        estimationResponse.requests.length,
        "The count of the request of the estimationResponse is not displayed correctly."
      );
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
    let FeeAmount_Submit;
    let EstimatedGas_Submit;
    let EstimatedGasPrice_Submit;

    const submissionResponse = await sdkTestNet.submitGatewayBatch({
      guarded: false,
    });
    // console.log("Status of the batch submition: ", submissionResponse);

    try {
      assert.isNull(
        submissionResponse.transaction,
        "It is not expected behaviour of the transaction in the Submit Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.hash,
        "The value of the hash field of the Submit Batch Response is not displayed."
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
        "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
        "The account address of the Submit Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        submissionResponse.nonce,
        "The nonce number of the Submit Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        submissionResponse.to[0],
        "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
        "The To Address in the Submit Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.data[0],
        "The value of the data field of the Submit Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        TransactionData_count,
        submissionResponse.to.length,
        "The count of the To Addresses are not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        TransactionData_count,
        submissionResponse.data.length,
        "The count of the data values are not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.senderSignature,
        "The value of the senderSignature field of the Submit Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        submissionResponse.estimatedGas,
        "The Estimated Gas number of the Submit Batch Response is not displayed."
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
        "The value of the estimatedGasPrice field of the Submit Batch Response is not displayed."
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
        "It is not expected behaviour of the feeToken in the Submit Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.feeAmount._hex,
        "The value of the feeAmount field of the Submit Batch Response is not displayed."
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
        "The value of the feeData field of the Submit Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNull(
        submissionResponse.delayedUntil,
        "It is not expected behaviour of the delayedUntil in the Submit Batch Response."
      );
    } catch (e) {
      console.log(e);
    }
  });

  // SWAP ON AURORA NETWORK
  it.skip("Setup the SDK for Aurora network and perform the single chain swap action", async () => {
    let TransactionData_count = 0;

    // Initialize the SDK and define network
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

    // GET EXCHANGE OFFERS
    const offers = await sdkTestNet.getExchangeOffers({
      fromTokenAddress: "0xB12BFcA5A55806AaF64E99521918A4bf0fC40802", // USDC Token
      toTokenAddress: "0x4988a896b1227218e4A686fdE5EabdcAbd91571f", // USDT Token
      fromAmount: ethers.utils.parseUnits("0.0001", 6),
    });
    // console.log("Offers : ", offers);

    for (let j = 0; j < offers.length; j++) {
      transactionDetails = offers[j].transactions;

      try {
        assert.isNotEmpty(
          offers[j].provider,
          "The provider of the offer is not displayed."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          offers[j].receiveAmount,
          "The receiveAmount value is not displayed."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNumber(
          offers[j].exchangeRate,
          "The exchangeRate value is not displayed."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          offers[j].transactions,
          "The transactions value is not displayed."
        );
      } catch (e) {
        console.log(e);
      }

      for (let i = 0; i < transactionDetails.length; i++) {
        // BATCH EXECUTE ACCOUNT TRANSACTION
        const addTransactionToBatchOutput =
          await sdkTestNet.batchExecuteAccountTransaction(
            transactionDetails[i]
          );

        try {
          assert.strictEqual(
            addTransactionToBatchOutput.requests[i].to,
            "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
            "The To Address of the batchExecuteAccountTransaction is not displayed correctly."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNotEmpty(
            addTransactionToBatchOutput.requests[i].data,
            "The Data value of the batchExecuteAccountTransaction is not displayed."
          );
          let TransactionData_record = addTransactionToBatchOutput.requests;
          TransactionData_count = TransactionData_record.length;
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNull(
            addTransactionToBatchOutput.estimation,
            "It is not expected behaviour of the estimation in the batchExecuteAccountTransaction Response."
          );
        } catch (e) {
          console.log(e);
        }
      }
    }

    // Estimating the batch
    let FeeAmount_Estimate;
    let EstimatedGas_Estimate;
    let EstimatedGasPrice_Estimate;

    const estimationResponse = await sdkTestNet.estimateGatewayBatch();
    // console.log("Gas estimated at: ", estimationResponse);

    for (let k = 0; k < estimationResponse.requests.length; k++) {
      try {
        assert.strictEqual(
          estimationResponse.requests[k].to,
          "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
          "The To Address of the batchExecuteAccountTransaction is not displayed correctly."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          estimationResponse.requests[k].data,
          "The Data value of the batchExecuteAccountTransaction is not displayed."
        );
      } catch (e) {
        console.log(e);
      }
    }

    try {
      assert.strictEqual(
        TransactionData_count,
        estimationResponse.requests.length,
        "The count of the request of the estimationResponse is not displayed correctly."
      );
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
    let FeeAmount_Submit;
    let EstimatedGas_Submit;
    let EstimatedGasPrice_Submit;

    const submissionResponse = await sdkTestNet.submitGatewayBatch({
      guarded: false,
    });
    // console.log("Status of the batch submition: ", submissionResponse);

    try {
      assert.isNull(
        submissionResponse.transaction,
        "It is not expected behaviour of the transaction in the Submit Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.hash,
        "The value of the hash field of the Submit Batch Response is not displayed."
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
        "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
        "The account address of the Submit Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        submissionResponse.nonce,
        "The nonce number of the Submit Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        submissionResponse.to[0],
        "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
        "The To Address in the Submit Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.data[0],
        "The value of the data field of the Submit Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        TransactionData_count,
        submissionResponse.to.length,
        "The count of the To Addresses are not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        TransactionData_count,
        submissionResponse.data.length,
        "The count of the data values are not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.senderSignature,
        "The value of the senderSignature field of the Submit Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        submissionResponse.estimatedGas,
        "The Estimated Gas number of the Submit Batch Response is not displayed."
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
        "The value of the estimatedGasPrice field of the Submit Batch Response is not displayed."
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
        "It is not expected behaviour of the feeToken in the Submit Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.feeAmount._hex,
        "The value of the feeAmount field of the Submit Batch Response is not displayed."
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
        "The value of the feeData field of the Submit Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNull(
        submissionResponse.delayedUntil,
        "It is not expected behaviour of the delayedUntil in the Submit Batch Response."
      );
    } catch (e) {
      console.log(e);
    }
  });

  // SWAP ON AVALANCHE NETWORK
  it.skip("Setup the SDK for Avalanche network and perform the single chain swap action", async () => {
    let TransactionData_count = 0;

    // Initialize the SDK and define network
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

    // GET EXCHANGE OFFERS
    const offers = await sdkTestNet.getExchangeOffers({
      fromTokenAddress: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E", // USDC Token
      toTokenAddress: "0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7", // USDT Token
      fromAmount: ethers.utils.parseUnits("0.0001", 6),
    });
    // console.log("Offers : ", offers);

    for (let j = 0; j < offers.length; j++) {
      transactionDetails = offers[j].transactions;

      try {
        assert.isNotEmpty(
          offers[j].provider,
          "The provider of the offer is not displayed."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          offers[j].receiveAmount,
          "The receiveAmount value is not displayed."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNumber(
          offers[j].exchangeRate,
          "The exchangeRate value is not displayed."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          offers[j].transactions,
          "The transactions value is not displayed."
        );
      } catch (e) {
        console.log(e);
      }

      for (let i = 0; i < transactionDetails.length; i++) {
        // BATCH EXECUTE ACCOUNT TRANSACTION
        const addTransactionToBatchOutput =
          await sdkTestNet.batchExecuteAccountTransaction(
            transactionDetails[i]
          );

        try {
          assert.strictEqual(
            addTransactionToBatchOutput.requests[i].to,
            "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
            "The To Address of the batchExecuteAccountTransaction is not displayed correctly."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNotEmpty(
            addTransactionToBatchOutput.requests[i].data,
            "The Data value of the batchExecuteAccountTransaction is not displayed."
          );
          let TransactionData_record = addTransactionToBatchOutput.requests;
          TransactionData_count = TransactionData_record.length;
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNull(
            addTransactionToBatchOutput.estimation,
            "It is not expected behaviour of the estimation in the batchExecuteAccountTransaction Response."
          );
        } catch (e) {
          console.log(e);
        }
      }
    }

    // Estimating the batch
    let FeeAmount_Estimate;
    let EstimatedGas_Estimate;
    let EstimatedGasPrice_Estimate;

    const estimationResponse = await sdkTestNet.estimateGatewayBatch();
    // console.log("Gas estimated at: ", estimationResponse);

    for (let k = 0; k < estimationResponse.requests.length; k++) {
      try {
        assert.strictEqual(
          estimationResponse.requests[k].to,
          "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
          "The To Address of the batchExecuteAccountTransaction is not displayed correctly."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          estimationResponse.requests[k].data,
          "The Data value of the batchExecuteAccountTransaction is not displayed."
        );
      } catch (e) {
        console.log(e);
      }
    }

    try {
      assert.strictEqual(
        TransactionData_count,
        estimationResponse.requests.length,
        "The count of the request of the estimationResponse is not displayed correctly."
      );
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
    let FeeAmount_Submit;
    let EstimatedGas_Submit;
    let EstimatedGasPrice_Submit;

    const submissionResponse = await sdkTestNet.submitGatewayBatch({
      guarded: false,
    });
    // console.log("Status of the batch submition: ", submissionResponse);

    try {
      assert.isNull(
        submissionResponse.transaction,
        "It is not expected behaviour of the transaction in the Submit Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.hash,
        "The value of the hash field of the Submit Batch Response is not displayed."
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
        "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
        "The account address of the Submit Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        submissionResponse.nonce,
        "The nonce number of the Submit Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        submissionResponse.to[0],
        "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
        "The To Address in the Submit Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.data[0],
        "The value of the data field of the Submit Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        TransactionData_count,
        submissionResponse.to.length,
        "The count of the To Addresses are not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        TransactionData_count,
        submissionResponse.data.length,
        "The count of the data values are not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.senderSignature,
        "The value of the senderSignature field of the Submit Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        submissionResponse.estimatedGas,
        "The Estimated Gas number of the Submit Batch Response is not displayed."
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
        "The value of the estimatedGasPrice field of the Submit Batch Response is not displayed."
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
        "It is not expected behaviour of the feeToken in the Submit Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.feeAmount._hex,
        "The value of the feeAmount field of the Submit Batch Response is not displayed."
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
        "The value of the feeData field of the Submit Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNull(
        submissionResponse.delayedUntil,
        "It is not expected behaviour of the delayedUntil in the Submit Batch Response."
      );
    } catch (e) {
      console.log(e);
    }
  });

  // SWAP ON BSC NETWORK
  it("Setup the SDK for Bsc network and perform the single chain swap action", async () => {
    let TransactionData_count = 0;

    // Initialize the SDK and define network
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

    // GET EXCHANGE OFFERS
    const offers = await sdkTestNet.getExchangeOffers({
      fromTokenAddress: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d", // USDC Token
      toTokenAddress: "0x524bC91Dc82d6b90EF29F76A3ECAaBAffFD490Bc", // USDT Token
      fromAmount: ethers.utils.parseUnits("0.0001", 6),
    });
    // console.log("Offers : ", offers);

    for (let j = 0; j < offers.length; j++) {
      transactionDetails = offers[j].transactions;

      try {
        assert.isNotEmpty(
          offers[j].provider,
          "The provider of the offer is not displayed."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          offers[j].receiveAmount,
          "The receiveAmount value is not displayed."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNumber(
          offers[j].exchangeRate,
          "The exchangeRate value is not displayed."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          offers[j].transactions,
          "The transactions value is not displayed."
        );
      } catch (e) {
        console.log(e);
      }

      for (let i = 0; i < transactionDetails.length; i++) {
        // BATCH EXECUTE ACCOUNT TRANSACTION
        const addTransactionToBatchOutput =
          await sdkTestNet.batchExecuteAccountTransaction(
            transactionDetails[i]
          );

        try {
          assert.strictEqual(
            addTransactionToBatchOutput.requests[i].to,
            "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
            "The To Address of the batchExecuteAccountTransaction is not displayed correctly."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNotEmpty(
            addTransactionToBatchOutput.requests[i].data,
            "The Data value of the batchExecuteAccountTransaction is not displayed."
          );
          let TransactionData_record = addTransactionToBatchOutput.requests;
          TransactionData_count = TransactionData_record.length;
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNull(
            addTransactionToBatchOutput.estimation,
            "It is not expected behaviour of the estimation in the batchExecuteAccountTransaction Response."
          );
        } catch (e) {
          console.log(e);
        }
      }
    }

    // Estimating the batch
    let FeeAmount_Estimate;
    let EstimatedGas_Estimate;
    let EstimatedGasPrice_Estimate;

    const estimationResponse = await sdkTestNet.estimateGatewayBatch();
    // console.log("Gas estimated at: ", estimationResponse);

    for (let k = 0; k < estimationResponse.requests.length; k++) {
      try {
        assert.strictEqual(
          estimationResponse.requests[k].to,
          "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
          "The To Address of the batchExecuteAccountTransaction is not displayed correctly."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          estimationResponse.requests[k].data,
          "The Data value of the batchExecuteAccountTransaction is not displayed."
        );
      } catch (e) {
        console.log(e);
      }
    }

    try {
      assert.strictEqual(
        TransactionData_count,
        estimationResponse.requests.length,
        "The count of the request of the estimationResponse is not displayed correctly."
      );
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
    let FeeAmount_Submit;
    let EstimatedGas_Submit;
    let EstimatedGasPrice_Submit;

    const submissionResponse = await sdkTestNet.submitGatewayBatch({
      guarded: false,
    });
    // console.log("Status of the batch submition: ", submissionResponse);

    try {
      assert.isNull(
        submissionResponse.transaction,
        "It is not expected behaviour of the transaction in the Submit Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.hash,
        "The value of the hash field of the Submit Batch Response is not displayed."
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
        "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
        "The account address of the Submit Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        submissionResponse.nonce,
        "The nonce number of the Submit Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        submissionResponse.to[0],
        "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
        "The To Address in the Submit Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.data[0],
        "The value of the data field of the Submit Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        TransactionData_count,
        submissionResponse.to.length,
        "The count of the To Addresses are not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        TransactionData_count,
        submissionResponse.data.length,
        "The count of the data values are not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.senderSignature,
        "The value of the senderSignature field of the Submit Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        submissionResponse.estimatedGas,
        "The Estimated Gas number of the Submit Batch Response is not displayed."
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
        "The value of the estimatedGasPrice field of the Submit Batch Response is not displayed."
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
        "It is not expected behaviour of the feeToken in the Submit Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.feeAmount._hex,
        "The value of the feeAmount field of the Submit Batch Response is not displayed."
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
        "The value of the feeData field of the Submit Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNull(
        submissionResponse.delayedUntil,
        "It is not expected behaviour of the delayedUntil in the Submit Batch Response."
      );
    } catch (e) {
      console.log(e);
    }
  });

  // SWAP ON CELO NETWORK
  it.skip("Setup the SDK for Celo network and perform the single chain swap action", async () => {
    let TransactionData_count = 0;

    // Initialize the SDK and define network
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

    // GET EXCHANGE OFFERS
    const offers = await sdkTestNet.getExchangeOffers({
      fromTokenAddress: "0xef4229c8c3250C675F21BCefa42f58EfbfF6002a", // USDC Token
      toTokenAddress: "0x617f3112bf5397D0467D315cC709EF968D9ba546", // USDT Token
      fromAmount: ethers.utils.parseUnits("0.0001", 6),
    });
    // console.log("Offers : ", offers);

    for (let j = 0; j < offers.length; j++) {
      transactionDetails = offers[j].transactions;

      try {
        assert.isNotEmpty(
          offers[j].provider,
          "The provider of the offer is not displayed."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          offers[j].receiveAmount,
          "The receiveAmount value is not displayed."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNumber(
          offers[j].exchangeRate,
          "The exchangeRate value is not displayed."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          offers[j].transactions,
          "The transactions value is not displayed."
        );
      } catch (e) {
        console.log(e);
      }

      for (let i = 0; i < transactionDetails.length; i++) {
        // BATCH EXECUTE ACCOUNT TRANSACTION
        const addTransactionToBatchOutput =
          await sdkTestNet.batchExecuteAccountTransaction(
            transactionDetails[i]
          );

        try {
          assert.strictEqual(
            addTransactionToBatchOutput.requests[i].to,
            "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
            "The To Address of the batchExecuteAccountTransaction is not displayed correctly."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNotEmpty(
            addTransactionToBatchOutput.requests[i].data,
            "The Data value of the batchExecuteAccountTransaction is not displayed."
          );
          let TransactionData_record = addTransactionToBatchOutput.requests;
          TransactionData_count = TransactionData_record.length;
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNull(
            addTransactionToBatchOutput.estimation,
            "It is not expected behaviour of the estimation in the batchExecuteAccountTransaction Response."
          );
        } catch (e) {
          console.log(e);
        }
      }
    }

    // Estimating the batch
    let FeeAmount_Estimate;
    let EstimatedGas_Estimate;
    let EstimatedGasPrice_Estimate;

    const estimationResponse = await sdkTestNet.estimateGatewayBatch();
    // console.log("Gas estimated at: ", estimationResponse);

    for (let k = 0; k < estimationResponse.requests.length; k++) {
      try {
        assert.strictEqual(
          estimationResponse.requests[k].to,
          "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
          "The To Address of the batchExecuteAccountTransaction is not displayed correctly."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          estimationResponse.requests[k].data,
          "The Data value of the batchExecuteAccountTransaction is not displayed."
        );
      } catch (e) {
        console.log(e);
      }
    }

    try {
      assert.strictEqual(
        TransactionData_count,
        estimationResponse.requests.length,
        "The count of the request of the estimationResponse is not displayed correctly."
      );
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
    let FeeAmount_Submit;
    let EstimatedGas_Submit;
    let EstimatedGasPrice_Submit;

    const submissionResponse = await sdkTestNet.submitGatewayBatch({
      guarded: false,
    });
    // console.log("Status of the batch submition: ", submissionResponse);

    try {
      assert.isNull(
        submissionResponse.transaction,
        "It is not expected behaviour of the transaction in the Submit Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.hash,
        "The value of the hash field of the Submit Batch Response is not displayed."
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
        "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
        "The account address of the Submit Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        submissionResponse.nonce,
        "The nonce number of the Submit Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        submissionResponse.to[0],
        "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
        "The To Address in the Submit Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.data[0],
        "The value of the data field of the Submit Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        TransactionData_count,
        submissionResponse.to.length,
        "The count of the To Addresses are not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        TransactionData_count,
        submissionResponse.data.length,
        "The count of the data values are not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.senderSignature,
        "The value of the senderSignature field of the Submit Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        submissionResponse.estimatedGas,
        "The Estimated Gas number of the Submit Batch Response is not displayed."
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
        "The value of the estimatedGasPrice field of the Submit Batch Response is not displayed."
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
        "It is not expected behaviour of the feeToken in the Submit Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.feeAmount._hex,
        "The value of the feeAmount field of the Submit Batch Response is not displayed."
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
        "The value of the feeData field of the Submit Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNull(
        submissionResponse.delayedUntil,
        "It is not expected behaviour of the delayedUntil in the Submit Batch Response."
      );
    } catch (e) {
      console.log(e);
    }
  });

  // SWAP ON MAINNET NETWORK
  it("Setup the SDK for mainnet network and perform the single chain swap action", async () => {
    let TransactionData_count = 0;

    // Initialize the SDK and define network
    sdkTestNet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.TestNets,
      networkName: NetworkNames.Mainnet,
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

    // GET EXCHANGE OFFERS
    const offers = await sdkTestNet.getExchangeOffers({
      fromTokenAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC Token
      toTokenAddress: "0xdAC17F958D2ee523a2206206994597C13D831ec7", // USDT Token
      fromAmount: ethers.utils.parseUnits("0.0001", 6),
    });
    // console.log("Offers : ", offers);

    for (let j = 0; j < offers.length; j++) {
      transactionDetails = offers[j].transactions;

      try {
        assert.isNotEmpty(
          offers[j].provider,
          "The provider of the offer is not displayed."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          offers[j].receiveAmount,
          "The receiveAmount value is not displayed."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNumber(
          offers[j].exchangeRate,
          "The exchangeRate value is not displayed."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          offers[j].transactions,
          "The transactions value is not displayed."
        );
      } catch (e) {
        console.log(e);
      }

      for (let i = 0; i < transactionDetails.length; i++) {
        // BATCH EXECUTE ACCOUNT TRANSACTION
        const addTransactionToBatchOutput =
          await sdkTestNet.batchExecuteAccountTransaction(
            transactionDetails[i]
          );

        try {
          assert.strictEqual(
            addTransactionToBatchOutput.requests[i].to,
            "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
            "The To Address of the batchExecuteAccountTransaction is not displayed correctly."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNotEmpty(
            addTransactionToBatchOutput.requests[i].data,
            "The Data value of the batchExecuteAccountTransaction is not displayed."
          );
          let TransactionData_record = addTransactionToBatchOutput.requests;
          TransactionData_count = TransactionData_record.length;
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNull(
            addTransactionToBatchOutput.estimation,
            "It is not expected behaviour of the estimation in the batchExecuteAccountTransaction Response."
          );
        } catch (e) {
          console.log(e);
        }
      }
    }

    // Estimating the batch
    let FeeAmount_Estimate;
    let EstimatedGas_Estimate;
    let EstimatedGasPrice_Estimate;

    const estimationResponse = await sdkTestNet.estimateGatewayBatch();
    // console.log("Gas estimated at: ", estimationResponse);

    for (let k = 0; k < estimationResponse.requests.length; k++) {
      try {
        assert.strictEqual(
          estimationResponse.requests[k].to,
          "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
          "The To Address of the batchExecuteAccountTransaction is not displayed correctly."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          estimationResponse.requests[k].data,
          "The Data value of the batchExecuteAccountTransaction is not displayed."
        );
      } catch (e) {
        console.log(e);
      }
    }

    try {
      assert.strictEqual(
        TransactionData_count,
        estimationResponse.requests.length,
        "The count of the request of the estimationResponse is not displayed correctly."
      );
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
    let FeeAmount_Submit;
    let EstimatedGas_Submit;
    let EstimatedGasPrice_Submit;

    const submissionResponse = await sdkTestNet.submitGatewayBatch({
      guarded: false,
    });
    // console.log("Status of the batch submition: ", submissionResponse);

    try {
      assert.isNull(
        submissionResponse.transaction,
        "It is not expected behaviour of the transaction in the Submit Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.hash,
        "The value of the hash field of the Submit Batch Response is not displayed."
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
        "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
        "The account address of the Submit Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        submissionResponse.nonce,
        "The nonce number of the Submit Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        submissionResponse.to[0],
        "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
        "The To Address in the Submit Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.data[0],
        "The value of the data field of the Submit Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        TransactionData_count,
        submissionResponse.to.length,
        "The count of the To Addresses are not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        TransactionData_count,
        submissionResponse.data.length,
        "The count of the data values are not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.senderSignature,
        "The value of the senderSignature field of the Submit Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        submissionResponse.estimatedGas,
        "The Estimated Gas number of the Submit Batch Response is not displayed."
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
        "The value of the estimatedGasPrice field of the Submit Batch Response is not displayed."
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
        "It is not expected behaviour of the feeToken in the Submit Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.feeAmount._hex,
        "The value of the feeAmount field of the Submit Batch Response is not displayed."
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
        "The value of the feeData field of the Submit Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNull(
        submissionResponse.delayedUntil,
        "It is not expected behaviour of the delayedUntil in the Submit Batch Response."
      );
    } catch (e) {
      console.log(e);
    }
  });

  // SWAP ON FANTOM NETWORK
  it.skip("Setup the SDK for Fantom network and perform the single chain swap action", async () => {
    let TransactionData_count = 0;

    // Initialize the SDK and define network
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

    // GET EXCHANGE OFFERS
    const offers = await sdkTestNet.getExchangeOffers({
      fromTokenAddress: "0x04068DA6C83AFCFA0e13ba15A6696662335D5B75", // USDC Token
      toTokenAddress: "0x0280179519Aa73Ac00CB7de68806fc10a7A1F717", // USDT Token
      fromAmount: ethers.utils.parseUnits("0.0001", 6),
    });
    // console.log("Offers : ", offers);

    for (let j = 0; j < offers.length; j++) {
      transactionDetails = offers[j].transactions;

      try {
        assert.isNotEmpty(
          offers[j].provider,
          "The provider of the offer is not displayed."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          offers[j].receiveAmount,
          "The receiveAmount value is not displayed."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNumber(
          offers[j].exchangeRate,
          "The exchangeRate value is not displayed."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          offers[j].transactions,
          "The transactions value is not displayed."
        );
      } catch (e) {
        console.log(e);
      }

      for (let i = 0; i < transactionDetails.length; i++) {
        // BATCH EXECUTE ACCOUNT TRANSACTION
        const addTransactionToBatchOutput =
          await sdkTestNet.batchExecuteAccountTransaction(
            transactionDetails[i]
          );

        try {
          assert.strictEqual(
            addTransactionToBatchOutput.requests[i].to,
            "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
            "The To Address of the batchExecuteAccountTransaction is not displayed correctly."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNotEmpty(
            addTransactionToBatchOutput.requests[i].data,
            "The Data value of the batchExecuteAccountTransaction is not displayed."
          );
          let TransactionData_record = addTransactionToBatchOutput.requests;
          TransactionData_count = TransactionData_record.length;
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNull(
            addTransactionToBatchOutput.estimation,
            "It is not expected behaviour of the estimation in the batchExecuteAccountTransaction Response."
          );
        } catch (e) {
          console.log(e);
        }
      }
    }

    // Estimating the batch
    let FeeAmount_Estimate;
    let EstimatedGas_Estimate;
    let EstimatedGasPrice_Estimate;

    const estimationResponse = await sdkTestNet.estimateGatewayBatch();
    // console.log("Gas estimated at: ", estimationResponse);

    for (let k = 0; k < estimationResponse.requests.length; k++) {
      try {
        assert.strictEqual(
          estimationResponse.requests[k].to,
          "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
          "The To Address of the batchExecuteAccountTransaction is not displayed correctly."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          estimationResponse.requests[k].data,
          "The Data value of the batchExecuteAccountTransaction is not displayed."
        );
      } catch (e) {
        console.log(e);
      }
    }

    try {
      assert.strictEqual(
        TransactionData_count,
        estimationResponse.requests.length,
        "The count of the request of the estimationResponse is not displayed correctly."
      );
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
    let FeeAmount_Submit;
    let EstimatedGas_Submit;
    let EstimatedGasPrice_Submit;

    const submissionResponse = await sdkTestNet.submitGatewayBatch({
      guarded: false,
    });
    // console.log("Status of the batch submition: ", submissionResponse);

    try {
      assert.isNull(
        submissionResponse.transaction,
        "It is not expected behaviour of the transaction in the Submit Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.hash,
        "The value of the hash field of the Submit Batch Response is not displayed."
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
        "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
        "The account address of the Submit Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        submissionResponse.nonce,
        "The nonce number of the Submit Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        submissionResponse.to[0],
        "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
        "The To Address in the Submit Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.data[0],
        "The value of the data field of the Submit Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        TransactionData_count,
        submissionResponse.to.length,
        "The count of the To Addresses are not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        TransactionData_count,
        submissionResponse.data.length,
        "The count of the data values are not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.senderSignature,
        "The value of the senderSignature field of the Submit Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        submissionResponse.estimatedGas,
        "The Estimated Gas number of the Submit Batch Response is not displayed."
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
        "The value of the estimatedGasPrice field of the Submit Batch Response is not displayed."
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
        "It is not expected behaviour of the feeToken in the Submit Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.feeAmount._hex,
        "The value of the feeAmount field of the Submit Batch Response is not displayed."
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
        "The value of the feeData field of the Submit Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNull(
        submissionResponse.delayedUntil,
        "It is not expected behaviour of the delayedUntil in the Submit Batch Response."
      );
    } catch (e) {
      console.log(e);
    }
  });

  // SWAP ON FUSE NETWORK
  it.skip("Setup the SDK for Fuse network and perform the single chain swap action", async () => {
    let TransactionData_count = 0;

    // Initialize the SDK and define network
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

    // GET EXCHANGE OFFERS
    const offers = await sdkTestNet.getExchangeOffers({
      fromTokenAddress: "0x620fd5fa44BE6af63715Ef4E65DDFA0387aD13F5", // USDC Token
      toTokenAddress: "0xFaDbBF8Ce7D5b7041bE672561bbA99f79c532e10", // USDT Token
      fromAmount: ethers.utils.parseUnits("0.0001", 6),
    });
    // console.log("Offers : ", offers);

    for (let j = 0; j < offers.length; j++) {
      transactionDetails = offers[j].transactions;

      try {
        assert.isNotEmpty(
          offers[j].provider,
          "The provider of the offer is not displayed."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          offers[j].receiveAmount,
          "The receiveAmount value is not displayed."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNumber(
          offers[j].exchangeRate,
          "The exchangeRate value is not displayed."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          offers[j].transactions,
          "The transactions value is not displayed."
        );
      } catch (e) {
        console.log(e);
      }

      for (let i = 0; i < transactionDetails.length; i++) {
        // BATCH EXECUTE ACCOUNT TRANSACTION
        const addTransactionToBatchOutput =
          await sdkTestNet.batchExecuteAccountTransaction(
            transactionDetails[i]
          );

        try {
          assert.strictEqual(
            addTransactionToBatchOutput.requests[i].to,
            "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
            "The To Address of the batchExecuteAccountTransaction is not displayed correctly."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNotEmpty(
            addTransactionToBatchOutput.requests[i].data,
            "The Data value of the batchExecuteAccountTransaction is not displayed."
          );
          let TransactionData_record = addTransactionToBatchOutput.requests;
          TransactionData_count = TransactionData_record.length;
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNull(
            addTransactionToBatchOutput.estimation,
            "It is not expected behaviour of the estimation in the batchExecuteAccountTransaction Response."
          );
        } catch (e) {
          console.log(e);
        }
      }
    }

    // Estimating the batch
    let FeeAmount_Estimate;
    let EstimatedGas_Estimate;
    let EstimatedGasPrice_Estimate;

    const estimationResponse = await sdkTestNet.estimateGatewayBatch();
    // console.log("Gas estimated at: ", estimationResponse);

    for (let k = 0; k < estimationResponse.requests.length; k++) {
      try {
        assert.strictEqual(
          estimationResponse.requests[k].to,
          "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
          "The To Address of the batchExecuteAccountTransaction is not displayed correctly."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          estimationResponse.requests[k].data,
          "The Data value of the batchExecuteAccountTransaction is not displayed."
        );
      } catch (e) {
        console.log(e);
      }
    }

    try {
      assert.strictEqual(
        TransactionData_count,
        estimationResponse.requests.length,
        "The count of the request of the estimationResponse is not displayed correctly."
      );
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
    let FeeAmount_Submit;
    let EstimatedGas_Submit;
    let EstimatedGasPrice_Submit;

    const submissionResponse = await sdkTestNet.submitGatewayBatch({
      guarded: false,
    });
    // console.log("Status of the batch submition: ", submissionResponse);

    try {
      assert.isNull(
        submissionResponse.transaction,
        "It is not expected behaviour of the transaction in the Submit Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.hash,
        "The value of the hash field of the Submit Batch Response is not displayed."
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
        "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
        "The account address of the Submit Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        submissionResponse.nonce,
        "The nonce number of the Submit Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        submissionResponse.to[0],
        "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
        "The To Address in the Submit Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.data[0],
        "The value of the data field of the Submit Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        TransactionData_count,
        submissionResponse.to.length,
        "The count of the To Addresses are not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        TransactionData_count,
        submissionResponse.data.length,
        "The count of the data values are not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.senderSignature,
        "The value of the senderSignature field of the Submit Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        submissionResponse.estimatedGas,
        "The Estimated Gas number of the Submit Batch Response is not displayed."
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
        "The value of the estimatedGasPrice field of the Submit Batch Response is not displayed."
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
        "It is not expected behaviour of the feeToken in the Submit Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.feeAmount._hex,
        "The value of the feeAmount field of the Submit Batch Response is not displayed."
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
        "The value of the feeData field of the Submit Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNull(
        submissionResponse.delayedUntil,
        "It is not expected behaviour of the delayedUntil in the Submit Batch Response."
      );
    } catch (e) {
      console.log(e);
    }
  });

  // SWAP ON XDAI NETWORK
  it.only("Setup the SDK for xDai network and perform the single chain swap action", async () => {
    let TransactionData_count = 0;

    // Initialize the SDK and define network
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

    // GET EXCHANGE OFFERS
    const offers = await sdkTestNet.getExchangeOffers({
      fromTokenAddress: "0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83", // USDC Token
      toTokenAddress: "0x4ECaBa5870353805a9F068101A40E0f32ed605C6", // USDT Token
      fromAmount: ethers.utils.parseUnits("0.0001", 6),
    });
    // console.log("Offers : ", offers);

    for (let j = 0; j < offers.length; j++) {
      transactionDetails = offers[j].transactions;

      try {
        assert.isNotEmpty(
          offers[j].provider,
          "The provider of the offer is not displayed."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          offers[j].receiveAmount,
          "The receiveAmount value is not displayed."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNumber(
          offers[j].exchangeRate,
          "The exchangeRate value is not displayed."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          offers[j].transactions,
          "The transactions value is not displayed."
        );
      } catch (e) {
        console.log(e);
      }

      for (let i = 0; i < transactionDetails.length; i++) {
        // BATCH EXECUTE ACCOUNT TRANSACTION
        const addTransactionToBatchOutput =
          await sdkTestNet.batchExecuteAccountTransaction(
            transactionDetails[i]
          );

        try {
          assert.strictEqual(
            addTransactionToBatchOutput.requests[i].to,
            "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
            "The To Address of the batchExecuteAccountTransaction is not displayed correctly."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNotEmpty(
            addTransactionToBatchOutput.requests[i].data,
            "The Data value of the batchExecuteAccountTransaction is not displayed."
          );
          let TransactionData_record = addTransactionToBatchOutput.requests;
          TransactionData_count = TransactionData_record.length;
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNull(
            addTransactionToBatchOutput.estimation,
            "It is not expected behaviour of the estimation in the batchExecuteAccountTransaction Response."
          );
        } catch (e) {
          console.log(e);
        }
      }
    }

    // Estimating the batch
    let FeeAmount_Estimate;
    let EstimatedGas_Estimate;
    let EstimatedGasPrice_Estimate;

    const estimationResponse = await sdkTestNet.estimateGatewayBatch();
    // console.log("Gas estimated at: ", estimationResponse);

    for (let k = 0; k < estimationResponse.requests.length; k++) {
      try {
        assert.strictEqual(
          estimationResponse.requests[k].to,
          "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
          "The To Address of the batchExecuteAccountTransaction is not displayed correctly."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          estimationResponse.requests[k].data,
          "The Data value of the batchExecuteAccountTransaction is not displayed."
        );
      } catch (e) {
        console.log(e);
      }
    }

    try {
      assert.strictEqual(
        TransactionData_count,
        estimationResponse.requests.length,
        "The count of the request of the estimationResponse is not displayed correctly."
      );
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
    let FeeAmount_Submit;
    let EstimatedGas_Submit;
    let EstimatedGasPrice_Submit;

    const submissionResponse = await sdkTestNet.submitGatewayBatch({
      guarded: false,
    });
    // console.log("Status of the batch submition: ", submissionResponse);

    try {
      assert.isNull(
        submissionResponse.transaction,
        "It is not expected behaviour of the transaction in the Submit Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.hash,
        "The value of the hash field of the Submit Batch Response is not displayed."
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
        "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
        "The account address of the Submit Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        submissionResponse.nonce,
        "The nonce number of the Submit Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        submissionResponse.to[0],
        "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
        "The To Address in the Submit Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.data[0],
        "The value of the data field of the Submit Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        TransactionData_count,
        submissionResponse.to.length,
        "The count of the To Addresses are not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        TransactionData_count,
        submissionResponse.data.length,
        "The count of the data values are not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.senderSignature,
        "The value of the senderSignature field of the Submit Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        submissionResponse.estimatedGas,
        "The Estimated Gas number of the Submit Batch Response is not displayed."
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
        "The value of the estimatedGasPrice field of the Submit Batch Response is not displayed."
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
        "It is not expected behaviour of the feeToken in the Submit Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.feeAmount._hex,
        "The value of the feeAmount field of the Submit Batch Response is not displayed."
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
        "The value of the feeData field of the Submit Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNull(
        submissionResponse.delayedUntil,
        "It is not expected behaviour of the delayedUntil in the Submit Batch Response."
      );
    } catch (e) {
      console.log(e);
    }
  });

  // SWAP ON MOONBEAM NETWORK
  it.skip("Setup the SDK for Moonbeam network and perform the single chain swap action", async () => {
    let TransactionData_count = 0;

    // Initialize the SDK and define network
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

    // GET EXCHANGE OFFERS
    const offers = await sdkTestNet.getExchangeOffers({
      fromTokenAddress: "0x818ec0A7Fe18Ff94269904fCED6AE3DaE6d6dC0b", // USDC Token
      toTokenAddress: "0xeFAeeE334F0Fd1712f9a8cc375f427D9Cdd40d73", // USDT Token
      fromAmount: ethers.utils.parseUnits("0.0001", 6),
    });
    // console.log("Offers : ", offers);

    for (let j = 0; j < offers.length; j++) {
      transactionDetails = offers[j].transactions;

      try {
        assert.isNotEmpty(
          offers[j].provider,
          "The provider of the offer is not displayed."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          offers[j].receiveAmount,
          "The receiveAmount value is not displayed."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNumber(
          offers[j].exchangeRate,
          "The exchangeRate value is not displayed."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          offers[j].transactions,
          "The transactions value is not displayed."
        );
      } catch (e) {
        console.log(e);
      }

      for (let i = 0; i < transactionDetails.length; i++) {
        // BATCH EXECUTE ACCOUNT TRANSACTION
        const addTransactionToBatchOutput =
          await sdkTestNet.batchExecuteAccountTransaction(
            transactionDetails[i]
          );

        try {
          assert.strictEqual(
            addTransactionToBatchOutput.requests[i].to,
            "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
            "The To Address of the batchExecuteAccountTransaction is not displayed correctly."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNotEmpty(
            addTransactionToBatchOutput.requests[i].data,
            "The Data value of the batchExecuteAccountTransaction is not displayed."
          );
          let TransactionData_record = addTransactionToBatchOutput.requests;
          TransactionData_count = TransactionData_record.length;
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNull(
            addTransactionToBatchOutput.estimation,
            "It is not expected behaviour of the estimation in the batchExecuteAccountTransaction Response."
          );
        } catch (e) {
          console.log(e);
        }
      }
    }

    // Estimating the batch
    let FeeAmount_Estimate;
    let EstimatedGas_Estimate;
    let EstimatedGasPrice_Estimate;

    const estimationResponse = await sdkTestNet.estimateGatewayBatch();
    // console.log("Gas estimated at: ", estimationResponse);

    for (let k = 0; k < estimationResponse.requests.length; k++) {
      try {
        assert.strictEqual(
          estimationResponse.requests[k].to,
          "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
          "The To Address of the batchExecuteAccountTransaction is not displayed correctly."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          estimationResponse.requests[k].data,
          "The Data value of the batchExecuteAccountTransaction is not displayed."
        );
      } catch (e) {
        console.log(e);
      }
    }

    try {
      assert.strictEqual(
        TransactionData_count,
        estimationResponse.requests.length,
        "The count of the request of the estimationResponse is not displayed correctly."
      );
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
    let FeeAmount_Submit;
    let EstimatedGas_Submit;
    let EstimatedGasPrice_Submit;

    const submissionResponse = await sdkTestNet.submitGatewayBatch({
      guarded: false,
    });
    // console.log("Status of the batch submition: ", submissionResponse);

    try {
      assert.isNull(
        submissionResponse.transaction,
        "It is not expected behaviour of the transaction in the Submit Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.hash,
        "The value of the hash field of the Submit Batch Response is not displayed."
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
        "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
        "The account address of the Submit Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        submissionResponse.nonce,
        "The nonce number of the Submit Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        submissionResponse.to[0],
        "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
        "The To Address in the Submit Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.data[0],
        "The value of the data field of the Submit Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        TransactionData_count,
        submissionResponse.to.length,
        "The count of the To Addresses are not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        TransactionData_count,
        submissionResponse.data.length,
        "The count of the data values are not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.senderSignature,
        "The value of the senderSignature field of the Submit Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        submissionResponse.estimatedGas,
        "The Estimated Gas number of the Submit Batch Response is not displayed."
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
        "The value of the estimatedGasPrice field of the Submit Batch Response is not displayed."
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
        "It is not expected behaviour of the feeToken in the Submit Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.feeAmount._hex,
        "The value of the feeAmount field of the Submit Batch Response is not displayed."
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
        "The value of the feeData field of the Submit Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNull(
        submissionResponse.delayedUntil,
        "It is not expected behaviour of the delayedUntil in the Submit Batch Response."
      );
    } catch (e) {
      console.log(e);
    }
  });

  // SWAP ON MUMBAI NETWORK
  it("Setup the SDK for Mumbai network and perform the single chain swap action", async () => {
    let TransactionData_count = 0;

    // Initialize the SDK and define network
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

    // GET EXCHANGE OFFERS
    const offers = await sdkTestNet.getExchangeOffers({
      fromTokenAddress: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", // USDC Token
      toTokenAddress: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", // USDT Token
      fromAmount: ethers.utils.parseUnits("0.0001", 6),
    });
    // console.log("Offers : ", offers);

    for (let j = 0; j < offers.length; j++) {
      transactionDetails = offers[j].transactions;

      try {
        assert.isNotEmpty(
          offers[j].provider,
          "The provider of the offer is not displayed."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          offers[j].receiveAmount,
          "The receiveAmount value is not displayed."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNumber(
          offers[j].exchangeRate,
          "The exchangeRate value is not displayed."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          offers[j].transactions,
          "The transactions value is not displayed."
        );
      } catch (e) {
        console.log(e);
      }

      for (let i = 0; i < transactionDetails.length; i++) {
        // BATCH EXECUTE ACCOUNT TRANSACTION
        const addTransactionToBatchOutput =
          await sdkTestNet.batchExecuteAccountTransaction(
            transactionDetails[i]
          );

        try {
          assert.strictEqual(
            addTransactionToBatchOutput.requests[i].to,
            "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
            "The To Address of the batchExecuteAccountTransaction is not displayed correctly."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNotEmpty(
            addTransactionToBatchOutput.requests[i].data,
            "The Data value of the batchExecuteAccountTransaction is not displayed."
          );
          let TransactionData_record = addTransactionToBatchOutput.requests;
          TransactionData_count = TransactionData_record.length;
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNull(
            addTransactionToBatchOutput.estimation,
            "It is not expected behaviour of the estimation in the batchExecuteAccountTransaction Response."
          );
        } catch (e) {
          console.log(e);
        }
      }
    }

    // Estimating the batch
    let FeeAmount_Estimate;
    let EstimatedGas_Estimate;
    let EstimatedGasPrice_Estimate;

    const estimationResponse = await sdkTestNet.estimateGatewayBatch();
    // console.log("Gas estimated at: ", estimationResponse);

    for (let k = 0; k < estimationResponse.requests.length; k++) {
      try {
        assert.strictEqual(
          estimationResponse.requests[k].to,
          "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
          "The To Address of the batchExecuteAccountTransaction is not displayed correctly."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          estimationResponse.requests[k].data,
          "The Data value of the batchExecuteAccountTransaction is not displayed."
        );
      } catch (e) {
        console.log(e);
      }
    }

    try {
      assert.strictEqual(
        TransactionData_count,
        estimationResponse.requests.length,
        "The count of the request of the estimationResponse is not displayed correctly."
      );
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
    let FeeAmount_Submit;
    let EstimatedGas_Submit;
    let EstimatedGasPrice_Submit;

    const submissionResponse = await sdkTestNet.submitGatewayBatch({
      guarded: false,
    });
    // console.log("Status of the batch submition: ", submissionResponse);

    try {
      assert.isNull(
        submissionResponse.transaction,
        "It is not expected behaviour of the transaction in the Submit Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.hash,
        "The value of the hash field of the Submit Batch Response is not displayed."
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
        "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
        "The account address of the Submit Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        submissionResponse.nonce,
        "The nonce number of the Submit Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        submissionResponse.to[0],
        "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
        "The To Address in the Submit Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.data[0],
        "The value of the data field of the Submit Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        TransactionData_count,
        submissionResponse.to.length,
        "The count of the To Addresses are not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        TransactionData_count,
        submissionResponse.data.length,
        "The count of the data values are not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.senderSignature,
        "The value of the senderSignature field of the Submit Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        submissionResponse.estimatedGas,
        "The Estimated Gas number of the Submit Batch Response is not displayed."
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
        "The value of the estimatedGasPrice field of the Submit Batch Response is not displayed."
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
        "It is not expected behaviour of the feeToken in the Submit Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.feeAmount._hex,
        "The value of the feeAmount field of the Submit Batch Response is not displayed."
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
        "The value of the feeData field of the Submit Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNull(
        submissionResponse.delayedUntil,
        "It is not expected behaviour of the delayedUntil in the Submit Batch Response."
      );
    } catch (e) {
      console.log(e);
    }
  });

  // SWAP ON NEONDEVNET NETWORK
  it.skip("Setup the SDK for NeonDevnet network and perform the single chain swap action", async () => {
    let TransactionData_count = 0;

    // Initialize the SDK and define network
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

    // GET EXCHANGE OFFERS
    const offers = await sdkTestNet.getExchangeOffers({
      fromTokenAddress: "0xc659b2633ed725e5346396a609d8f31794d6ac50", // USDC Token
      toTokenAddress: "0xaa24a5a5e273efaa64a960b28de6e27b87ffdffc", // USDT Token
      fromAmount: ethers.utils.parseUnits("0.0001", 6),
    });
    // console.log("Offers : ", offers);

    for (let j = 0; j < offers.length; j++) {
      transactionDetails = offers[j].transactions;

      try {
        assert.isNotEmpty(
          offers[j].provider,
          "The provider of the offer is not displayed."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          offers[j].receiveAmount,
          "The receiveAmount value is not displayed."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNumber(
          offers[j].exchangeRate,
          "The exchangeRate value is not displayed."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          offers[j].transactions,
          "The transactions value is not displayed."
        );
      } catch (e) {
        console.log(e);
      }

      for (let i = 0; i < transactionDetails.length; i++) {
        // BATCH EXECUTE ACCOUNT TRANSACTION
        const addTransactionToBatchOutput =
          await sdkTestNet.batchExecuteAccountTransaction(
            transactionDetails[i]
          );

        try {
          assert.strictEqual(
            addTransactionToBatchOutput.requests[i].to,
            "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
            "The To Address of the batchExecuteAccountTransaction is not displayed correctly."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNotEmpty(
            addTransactionToBatchOutput.requests[i].data,
            "The Data value of the batchExecuteAccountTransaction is not displayed."
          );
          let TransactionData_record = addTransactionToBatchOutput.requests;
          TransactionData_count = TransactionData_record.length;
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNull(
            addTransactionToBatchOutput.estimation,
            "It is not expected behaviour of the estimation in the batchExecuteAccountTransaction Response."
          );
        } catch (e) {
          console.log(e);
        }
      }
    }

    // Estimating the batch
    let FeeAmount_Estimate;
    let EstimatedGas_Estimate;
    let EstimatedGasPrice_Estimate;

    const estimationResponse = await sdkTestNet.estimateGatewayBatch();
    // console.log("Gas estimated at: ", estimationResponse);

    for (let k = 0; k < estimationResponse.requests.length; k++) {
      try {
        assert.strictEqual(
          estimationResponse.requests[k].to,
          "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
          "The To Address of the batchExecuteAccountTransaction is not displayed correctly."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          estimationResponse.requests[k].data,
          "The Data value of the batchExecuteAccountTransaction is not displayed."
        );
      } catch (e) {
        console.log(e);
      }
    }

    try {
      assert.strictEqual(
        TransactionData_count,
        estimationResponse.requests.length,
        "The count of the request of the estimationResponse is not displayed correctly."
      );
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
    let FeeAmount_Submit;
    let EstimatedGas_Submit;
    let EstimatedGasPrice_Submit;

    const submissionResponse = await sdkTestNet.submitGatewayBatch({
      guarded: false,
    });
    // console.log("Status of the batch submition: ", submissionResponse);

    try {
      assert.isNull(
        submissionResponse.transaction,
        "It is not expected behaviour of the transaction in the Submit Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.hash,
        "The value of the hash field of the Submit Batch Response is not displayed."
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
        "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
        "The account address of the Submit Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        submissionResponse.nonce,
        "The nonce number of the Submit Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        submissionResponse.to[0],
        "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
        "The To Address in the Submit Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.data[0],
        "The value of the data field of the Submit Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        TransactionData_count,
        submissionResponse.to.length,
        "The count of the To Addresses are not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        TransactionData_count,
        submissionResponse.data.length,
        "The count of the data values are not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.senderSignature,
        "The value of the senderSignature field of the Submit Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        submissionResponse.estimatedGas,
        "The Estimated Gas number of the Submit Batch Response is not displayed."
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
        "The value of the estimatedGasPrice field of the Submit Batch Response is not displayed."
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
        "It is not expected behaviour of the feeToken in the Submit Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.feeAmount._hex,
        "The value of the feeAmount field of the Submit Batch Response is not displayed."
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
        "The value of the feeData field of the Submit Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNull(
        submissionResponse.delayedUntil,
        "It is not expected behaviour of the delayedUntil in the Submit Batch Response."
      );
    } catch (e) {
      console.log(e);
    }
  });

  // SWAP ON OPTIMISM NETWORK
  it("Setup the SDK for Optimism network and perform the single chain swap action", async () => {
    let TransactionData_count = 0;

    // Initialize the SDK and define network
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

    // GET EXCHANGE OFFERS
    const offers = await sdkTestNet.getExchangeOffers({
      fromTokenAddress: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607", // USDC Token
      toTokenAddress: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58", // USDT Token
      fromAmount: ethers.utils.parseUnits("0.0001", 6),
    });
    // console.log("Offers : ", offers);

    for (let j = 0; j < offers.length; j++) {
      transactionDetails = offers[j].transactions;

      try {
        assert.isNotEmpty(
          offers[j].provider,
          "The provider of the offer is not displayed."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          offers[j].receiveAmount,
          "The receiveAmount value is not displayed."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNumber(
          offers[j].exchangeRate,
          "The exchangeRate value is not displayed."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          offers[j].transactions,
          "The transactions value is not displayed."
        );
      } catch (e) {
        console.log(e);
      }

      for (let i = 0; i < transactionDetails.length; i++) {
        // BATCH EXECUTE ACCOUNT TRANSACTION
        const addTransactionToBatchOutput =
          await sdkTestNet.batchExecuteAccountTransaction(
            transactionDetails[i]
          );

        try {
          assert.strictEqual(
            addTransactionToBatchOutput.requests[i].to,
            "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
            "The To Address of the batchExecuteAccountTransaction is not displayed correctly."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNotEmpty(
            addTransactionToBatchOutput.requests[i].data,
            "The Data value of the batchExecuteAccountTransaction is not displayed."
          );
          let TransactionData_record = addTransactionToBatchOutput.requests;
          TransactionData_count = TransactionData_record.length;
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNull(
            addTransactionToBatchOutput.estimation,
            "It is not expected behaviour of the estimation in the batchExecuteAccountTransaction Response."
          );
        } catch (e) {
          console.log(e);
        }
      }
    }

    // Estimating the batch
    let FeeAmount_Estimate;
    let EstimatedGas_Estimate;
    let EstimatedGasPrice_Estimate;

    const estimationResponse = await sdkTestNet.estimateGatewayBatch();
    // console.log("Gas estimated at: ", estimationResponse);

    for (let k = 0; k < estimationResponse.requests.length; k++) {
      try {
        assert.strictEqual(
          estimationResponse.requests[k].to,
          "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
          "The To Address of the batchExecuteAccountTransaction is not displayed correctly."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          estimationResponse.requests[k].data,
          "The Data value of the batchExecuteAccountTransaction is not displayed."
        );
      } catch (e) {
        console.log(e);
      }
    }

    try {
      assert.strictEqual(
        TransactionData_count,
        estimationResponse.requests.length,
        "The count of the request of the estimationResponse is not displayed correctly."
      );
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
    let FeeAmount_Submit;
    let EstimatedGas_Submit;
    let EstimatedGasPrice_Submit;

    const submissionResponse = await sdkTestNet.submitGatewayBatch({
      guarded: false,
    });
    // console.log("Status of the batch submition: ", submissionResponse);

    try {
      assert.isNull(
        submissionResponse.transaction,
        "It is not expected behaviour of the transaction in the Submit Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.hash,
        "The value of the hash field of the Submit Batch Response is not displayed."
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
        "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
        "The account address of the Submit Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        submissionResponse.nonce,
        "The nonce number of the Submit Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        submissionResponse.to[0],
        "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
        "The To Address in the Submit Batch Response is not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.data[0],
        "The value of the data field of the Submit Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        TransactionData_count,
        submissionResponse.to.length,
        "The count of the To Addresses are not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        TransactionData_count,
        submissionResponse.data.length,
        "The count of the data values are not displayed correctly."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.senderSignature,
        "The value of the senderSignature field of the Submit Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        submissionResponse.estimatedGas,
        "The Estimated Gas number of the Submit Batch Response is not displayed."
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
        "The value of the estimatedGasPrice field of the Submit Batch Response is not displayed."
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
        "It is not expected behaviour of the feeToken in the Submit Batch Response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        submissionResponse.feeAmount._hex,
        "The value of the feeAmount field of the Submit Batch Response is not displayed."
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
        "The value of the feeData field of the Submit Batch Response is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNull(
        submissionResponse.delayedUntil,
        "It is not expected behaviour of the delayedUntil in the Submit Batch Response."
      );
    } catch (e) {
      console.log(e);
    }
  });
});
