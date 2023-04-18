import * as dotenv from "dotenv";
dotenv.config();

import { EnvNames, NetworkNames, Sdk } from "etherspot";
import { ethers } from "ethers";
import { assert } from "chai";

let sdkTestNet;
let smartWalletAddress;
let transactionDetails;

describe("The SDK, when single chain swap on the TestNet", () => {
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
      fromTokenAddress: "0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83",
      toTokenAddress: "0x4ECaBa5870353805a9F068101A40E0f32ed605C6",
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
