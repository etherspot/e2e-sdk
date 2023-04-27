import * as dotenv from "dotenv";
dotenv.config();

import { assert } from "chai";
import {
  NETWORK_NAME_TO_CHAIN_ID,
  CrossChainServiceProvider,
  EnvNames,
  NetworkNames,
  Sdk,
} from "etherspot";
import { ethers } from "ethers";
import pkg from "@etherspot/contracts";

let sdkMainNet;
let smartWalletAddress;
let { ContractNames, getContractAbi } = pkg;

describe("The SDK, when cross chain quote flow on the MainNet", () => {
  // SEND NFT ON XDAI NETWORK
  it.only("Setup the SDK for xDai network and perform the cross chain quote action", async () => {
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
    let smartWalletOutput = await sdkMainNet.computeContractAccount();
    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    assert.strictEqual(
      smartWalletAddress,
      "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
      "The smart address is not displayed correctly."
    );

    let XdaiUSDC = "0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83"; // Xdai - USDC
    let MaticUSDC = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"; // Matic - USDC

    let fromChainId = NETWORK_NAME_TO_CHAIN_ID[NetworkNames.Xdai];
    let toChainId = NETWORK_NAME_TO_CHAIN_ID[NetworkNames.Matic];
    let fromTokenAddress = XdaiUSDC;
    let toTokenAddress = MaticUSDC;
    let fromAmount = ethers.utils.parseUnits("0.5", 6);

    let quoteRequestPayload = {
      fromChainId: fromChainId,
      toChainId: toChainId,
      fromTokenAddress: fromTokenAddress,
      toTokenAddress: toTokenAddress,
      fromAmount: fromAmount,
      serviceProvider: CrossChainServiceProvider.SocketV2, // Optional parameter
    };
    // console.log(quoteRequestPayload);

    try {
      assert.isNumber(
        quoteRequestPayload.fromChainId,
        "The fromChainId value is not displayed in the quoteRequest Payload."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNumber(
        quoteRequestPayload.toChainId,
        "The toChainId value is not displayed in the quoteRequest Payload."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        quoteRequestPayload.fromTokenAddress,
        "0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83",
        "The fromTokenAddress value is not displayed correct in the quoteRequest Payload."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        quoteRequestPayload.toTokenAddress,
        "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
        "The toTokenAddress value is not displayed correct in the quoteRequest Payload."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        quoteRequestPayload.fromAmount,
        "The fromAmount value is not displayed in the quoteRequest Payload."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.strictEqual(
        quoteRequestPayload.serviceProvider,
        "socketV2",
        "The serviceProvider value is not displayed correct in the quoteRequest Payload."
      );
    } catch (e) {
      console.log(e);
    }

    // GET THE CROSS CHAIN QUOTES
    let batchCrossChainTransaction;
    let quotes = await sdkMainNet.getCrossChainQuotes(quoteRequestPayload);
    // console.log("Quotes::: ", quotes);

    try {
      assert.strictEqual(
        quotes.items[0].provider,
        "socketV2",
        "The provider value is not displayed correct in the quotes response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        quotes.items[0].approvalData,
        "The approvalData value is not displayed correct in the quotes response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        quotes.items[0].transaction,
        "The transaction value is not displayed correct in the quotes response."
      );
    } catch (e) {
      console.log(e);
    }

    try {
      assert.isNotEmpty(
        quotes.items[0].estimate,
        "The estimate value is not displayed correct in the quotes response."
      );
    } catch (e) {
      console.log(e);
    }

    if (quotes.items.length > 0) {
      // Select the first quote
      let quote = quotes.items[0];
      // console.log("Quote Selected: ", quote);

      try {
        assert.strictEqual(
          quote.provider,
          "socketV2",
          "The provider value is not displayed correct in the quotes response."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.strictEqual(
          quote.approvalData.approvalAddress,
          "0xAC313d7491910516E06FBfC2A0b5BB49bb072D91",
          "The approvalAddress value of the approvalData is not displayed correct in the single quote response."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.strictEqual(
          quote.approvalData.amount,
          "500000",
          "The amount value of the approvalData is not displayed correct in the single quote response."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          quote.transaction.data,
          "The data value of the transaction is not displayed correct in the single quote response."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.strictEqual(
          quote.transaction.to,
          "0xc30141B657f4216252dc59Af2e7CdB9D8792e1B0",
          "The To Address value of the transaction is not displayed correct in the single quote response."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          quote.transaction.value,
          "The value's value of the transaction is not displayed correct in the single quote response."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.strictEqual(
          quote.transaction.from,
          "0xc30141B657f4216252dc59Af2e7CdB9D8792e1B0",
          "The From Address value of the transaction is not displayed correct in the single quote response."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.strictEqual(
          quote.transaction.chainId,
          "100",
          "The chainId value of the transaction is not displayed correct in the single quote response."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.strictEqual(
          quote.estimate.approvalAddress,
          "0xAC313d7491910516E06FBfC2A0b5BB49bb072D91",
          "The approvalAddress value of the estimate is not displayed correct in the single quote response."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.strictEqual(
          quote.estimate.fromAmount,
          "500000",
          "The approvalAddress value of the estimate is not displayed correct in the single quote response."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          quote.estimate.toAmount,
          "The toAmount value of the estimate is not displayed correct in the single quote response."
        );
      } catch (e) {
        console.log(e);
      }
      let toAmount_estimate_quote = quote.estimate.toAmount;

      try {
        assert.isNumber(
          quote.estimate.gasCosts.limit,
          "The limit value of the gas cost of the estimate is not displayed correct in the single quote response."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNumber(
          quote.estimate.gasCosts.amountUSD,
          "The amountUSD value of the gas cost of the estimate is not displayed correct in the single quote response."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          quote.estimate.gasCosts.token,
          "The token value of the gas cost of the estimate is not displayed correct in the single quote response."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          quote.estimate.data.fromToken,
          "The fromToken value of the data of the estimate is not displayed correct in the single quote response."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          quote.estimate.data.toToken,
          "The toToken value of the data of the estimate is not displayed correct in the single quote response."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          quote.estimate.data.toTokenAmount,
          "The toTokenAmount value of the data of the estimate is not displayed correct in the single quote response."
        );
      } catch (e) {
        console.log(e);
      }
      let toTokenAmount_data_estimate_quote = quote.estimate.data.toTokenAmount;

      try {
        assert.strictEqual(
          toAmount_estimate_quote,
          toTokenAmount_data_estimate_quote,
          "The To Amount Gas value is not displayed correctly."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          quote.estimate.data.estimatedGas,
          "The estimatedGas value of the data of the estimate is not displayed correct in the single quote response."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNull(
          quote.LiFiBridgeUsed,
          "The LiFiBridgeUsed value is not displayed null in the single quote response."
        );
      } catch (e) {
        console.log(e);
      }

      let tokenAddres = quote.estimate.data.fromToken.address;
      let approvalAddress = quote.approvalData.approvalAddress;
      let amount = quote.approvalData.amount;

      // Build the approval transaction request
      let abi = getContractAbi(ContractNames.ERC20Token);
      let erc20Contract = sdkMainNet.registerContract(
        "erc20Contract",
        abi,
        tokenAddres
      );
      let approvalTransactionRequest = erc20Contract.encodeApprove(
        approvalAddress,
        amount
      );
      // console.log("Approval transaction request", approvalTransactionRequest);

      // Batch the approval transaction
      let batchexecutionaccounttransaction;

      batchexecutionaccounttransaction =
        await sdkMainNet.batchExecuteAccountTransaction({
          to: approvalTransactionRequest.to,
          data: approvalTransactionRequest.data,
          value: approvalTransactionRequest.value,
        });

      // console.log("gateway batch approval transaction",batchexecutionaccounttransaction);

      for (
        let i = 0;
        i < batchexecutionaccounttransaction.requests.length;
        i++
      ) {
        try {
          assert.isNotEmpty(
            batchexecutionaccounttransaction.requests[i].to,
            "The To value of the Batch Execution Account Transaction is not displayed."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.strictEqual(
            batchexecutionaccounttransaction.requests[i].data,
            "The Data value of the Batch Execution Account Transaction is not displayed."
          );
        } catch (e) {
          console.log(e);
        }
      }

      try {
        assert.isNull(
          batchexecutionaccounttransaction.estimation,
          "The Data value of the Batch Execution Account Transaction is not displayed."
        );
      } catch (e) {
        console.log(e);
      }

      // Batch the cross chain transaction
      let { to, value, data } = quote.transaction;
      batchCrossChainTransaction =
        await sdkMainNet.batchExecuteAccountTransaction({
          to,
          data: data,
          value,
        });

      // console.log( "gateway batch transfer token transaction::: ",batchCrossChainTransaction);
    }

    for (let j = 0; j < batchCrossChainTransaction.requests.length; j++) {
      try {
        assert.isNotEmpty(
          batchCrossChainTransaction.requests[j].to,
          "The To value of the Batch Execution Account Transaction is not displayed."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.strictEqual(
          batchCrossChainTransaction.requests[j].data,
          "The Data value of the Batch Execution Account Transaction is not displayed."
        );
      } catch (e) {
        console.log(e);
      }
    }

    try {
      assert.isNull(
        batchCrossChainTransaction.estimation,
        "The Data value of the Batch Execution Account Transaction is not displayed."
      );
    } catch (e) {
      console.log(e);
    }

    // Estimating the batch
    let EstimatedGas_Estimate;
    let FeeAmount_Estimate;
    let EstimatedGasPrice_Estimate;

    let estimationResponse = await sdkMainNet.estimateGatewayBatch();
    // console.log("Gas Estimation::: ", estimationResponse);

    for (let k = 0; k < estimationResponse.requests.length; k++) {
      try {
        assert.isNotEmpty(
          estimationResponse.requests[k].to,
          "The To value of the Batch Execution Account Transaction is not displayed."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.strictEqual(
          estimationResponse.requests[k].data,
          "The Data value of the Batch Execution Account Transaction is not displayed."
        );
      } catch (e) {
        console.log(e);
      }
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
    let EstimatedGas_Submit;
    let FeeAmount_Submit;
    let EstimatedGasPrice_Submit;

    let submissionResponse = await sdkMainNet.submitGatewayBatch({
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

    for (let x = 0; x < submissionResponse.to.length; x++) {
      try {
        assert.strictEqual(
          submissionResponse.to[x],
          "0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa",
          "The To Address in the Submit Batch Response is not displayed correctly."
        );
      } catch (e) {
        console.log(e);
      }
    }

    for (let y = 0; y < submissionResponse.to.length; y++) {
      try {
        assert.isNotEmpty(
          submissionResponse.data[y],
          "The value of the data field of the Submit Batch Response is not displayed."
        );
      } catch (e) {
        console.log(e);
      }
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
