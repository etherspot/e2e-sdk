import * as dotenv from "dotenv";
dotenv.config();

import { EnvNames, NetworkNames, Sdk } from "etherspot";
import { ethers } from "ethers";
import { assert } from "chai";

let network = ["arbitrum", "bsc", "mainnet", "xdai", "matic", "optimism"];
let mainNetSdk;
let transactionDetails;

describe("The SDK, when single chain swap on the MainNet", () => {
  for (let i = 0; i < network.length; i++) {
    // SINGLE CHAIN SWAP ON ARBITRUM NETWORK
    it("Setup the SDK for Arbitrum network and perform the single chain swap action", async () => {
      let TransactionData_count = 0;

      // Initialize the SDK and define network
      mainNetSdk = new Sdk(process.env.PRIVATE_KEY, {
        env: EnvNames.MainNets,
        networkName: network[i],
      });

      assert.strictEqual(
        mainNetSdk.state.accountAddress,
        "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f",
        "The EOA Address is not calculated correctly."
      );

      // Compute the smart wallet address
      let smartWalletOutput = await mainNetSdk.computeContractAccount();
      let smartWalletAddress = smartWalletOutput.address;

      assert.strictEqual(
        smartWalletAddress,
        "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
        "The smart wallet address is not calculated correctly."
      );

      // Get exchange offers
      let offers;
      switch (network[i]) {
        case "arbitrum":
          offers = await mainNetSdk.getExchangeOffers({
            fromTokenAddress: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8", // USDC Token
            toTokenAddress: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9 ", // USDT Token
            fromAmount: ethers.utils.parseUnits("0.0001", 6),
          });
          break;

        case "bsc":
          offers = await mainNetSdk.getExchangeOffers({
            fromTokenAddress: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d", // USDC Token
            toTokenAddress: "0x524bC91Dc82d6b90EF29F76A3ECAaBAffFD490Bc", // USDT Token
            fromAmount: ethers.utils.parseUnits("0.0001", 6),
          });
          break;

        case "mainnet":
          offers = await mainNetSdk.getExchangeOffers({
            fromTokenAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC Token
            toTokenAddress: "0xdAC17F958D2ee523a2206206994597C13D831ec7", // USDT Token
            fromAmount: ethers.utils.parseUnits("0.0001", 6),
          });
          break;

        case "xdai":
          offers = await mainNetSdk.getExchangeOffers({
            fromTokenAddress: "0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83", // USDC Token
            toTokenAddress: "0x4ECaBa5870353805a9F068101A40E0f32ed605C6", // USDT Token
            fromAmount: ethers.utils.parseUnits("0.0001", 6),
          });
          break;

        case "matic":
          offers = await mainNetSdk.getExchangeOffers({
            fromTokenAddress: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", // USDC Token
            toTokenAddress: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", // USDT Token
            fromAmount: ethers.utils.parseUnits("0.0001", 6),
          });
          break;

        case "optimism":
          offers = await mainNetSdk.getExchangeOffers({
            fromTokenAddress: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607", // USDC Token
            toTokenAddress: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58", // USDT Token
            fromAmount: ethers.utils.parseUnits("0.0001", 6),
          });
          break;

        default:
          console.log("Invalid network name is displayed.");
          break;
      }

      for (let j = 0; j < offers.length; j++) {
        transactionDetails = offers[j].transactions;

        try {
          assert.isNotEmpty(
            offers[j].provider,
            "The provider value is empty in the offer response."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNotEmpty(
            offers[j].receiveAmount,
            "The receiveAmount value is empty in the offer response."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNumber(
            offers[j].exchangeRate,
            "The exchangeRate value is not number in the offer response."
          );
        } catch (e) {
          console.log(e);
        }

        try {
          assert.isNotEmpty(
            offers[j].transactions,
            "The transactions value is empty in the offer response."
          );
        } catch (e) {
          console.log(e);
        }

        for (let i = 0; i < transactionDetails.length; i++) {
          // Batch execute account transaction
          let addTransactionToBatchOutput =
            await mainNetSdk.batchExecuteAccountTransaction(
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
              "The Data value is empty in the batchExecuteAccountTransaction response."
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

      let estimationResponse = await mainNetSdk.estimateGatewayBatch();

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
            "The Data value is empty in the Estimation Batch response."
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
          "The feeAmount value is empty in the Estimation Batch Response."
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
          "The estimatedGas value is not number in the Estimate Batch Response."
        );
        EstimatedGas_Estimate = estimationResponse.estimation.estimatedGas;
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

      // Submitting the batch
      let FeeAmount_Submit;
      let EstimatedGas_Submit;
      let EstimatedGasPrice_Submit;

      let submissionResponse = await mainNetSdk.submitGatewayBatch({
        guarded: false,
      });

      try {
        assert.isNull(
          submissionResponse.transaction,
          "The transaction is not null in the Submit Batch Response."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          submissionResponse.hash,
          "The hash value is empty in the Submit Batch Response."
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
          "The nonce value is not number in the Submit Batch Response."
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
          "The data value is empty in the Submit Batch Response."
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
          "The senderSignature value is empty in the Submit Batch Response."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNumber(
          submissionResponse.estimatedGas,
          "The Estimated Gas value is not number in the Submit Batch Response."
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
          "The feeToken value is not null in the Submit Batch Response."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNotEmpty(
          submissionResponse.feeAmount._hex,
          "The feeAmount value is empty in the Submit Batch Response."
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
          "The feeData value is empty in the Submit Batch Response."
        );
      } catch (e) {
        console.log(e);
      }

      try {
        assert.isNull(
          submissionResponse.delayedUntil,
          "The delayedUntil value is npot null in the Submit Batch Response."
        );
      } catch (e) {
        console.log(e);
      }
    });
  }
});
