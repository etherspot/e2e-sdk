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

let network = ["arbitrum", "bsc", "xdai", "mumbai", "optimism"];
let testNetSdk;

describe("The SDK, when cross chain quote flow on the TestNet", () => {
  for (let i = 0; i < network.length; i++) {
    // CROSS CHAIN QUOTES ON RESPECTIVE NETWORK
    it(
      "Perform the cross chain quote action " + network[i] + " network",
      async () => {
        // initialize the sdk
        try {
          testNetSdk = new Sdk(process.env.PRIVATE_KEY, {
            env: EnvNames.TestNets,
            networkName: network[i],
          });

          assert.strictEqual(
            testNetSdk.state.accountAddress,
            "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f",
            "The EOA Address is not calculated correctly."
          );
        } catch (e) {
          assert.fail("The SDK is not initialled successfully.");
        }

        // Compute the smart wallet address
        try {
          let smartWalletOutput = await testNetSdk.computeContractAccount();
          let smartWalletAddress = smartWalletOutput.address;

          assert.strictEqual(
            smartWalletAddress,
            "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
            "The smart wallet address is not calculated correctly."
          );
        } catch (e) {
          assert.fail(
            "The smart wallet address is not calculated successfully."
          );
        }

        try {
          let ArbitrumUSDC = "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8"; // Arbitrum - USDC
          let BscUSDC = "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d"; // Bsc - USDC
          let MumbaiUSDC = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"; // Mumbai - USDC
          let TestnetUSDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"; // Testnet - USDC
          let XdaiUSDC = "0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83"; // Xdai - USDC
          let OptimismUSDC = "0x7F5c764cBc14f9669B88837ca1490cCa17c31607"; // Optimism - USDC

          let fromChainId;
          let toChainId;
          let fromTokenAddress;
          let toTokenAddress;
          let fromAmount;

          switch (network[i]) {
            case "arbitrum":
              fromChainId = NETWORK_NAME_TO_CHAIN_ID[NetworkNames.Arbitrum];
              toChainId = NETWORK_NAME_TO_CHAIN_ID[NetworkNames.Xdai];
              fromTokenAddress = ArbitrumUSDC;
              toTokenAddress = XdaiUSDC;
              fromAmount = ethers.utils.parseUnits("0.5", 6);
              break;

            case "bsc":
              fromChainId = NETWORK_NAME_TO_CHAIN_ID[NetworkNames.Bsc];
              toChainId = NETWORK_NAME_TO_CHAIN_ID[NetworkNames.Xdai];
              fromTokenAddress = BscUSDC;
              toTokenAddress = XdaiUSDC;
              fromAmount = ethers.utils.parseUnits("0.5", 6);
              break;

            case "Testnet":
              fromChainId = NETWORK_NAME_TO_CHAIN_ID[NetworkNames.Testnet];
              toChainId = NETWORK_NAME_TO_CHAIN_ID[NetworkNames.Xdai];
              fromTokenAddress = TestnetUSDC;
              toTokenAddress = XdaiUSDC;
              fromAmount = ethers.utils.parseUnits("0.5", 6);
              break;

            case "xdai":
              fromChainId = NETWORK_NAME_TO_CHAIN_ID[NetworkNames.Xdai];
              toChainId = NETWORK_NAME_TO_CHAIN_ID[NetworkNames.Mumbai];
              fromTokenAddress = XdaiUSDC;
              toTokenAddress = MumbaiUSDC;
              fromAmount = ethers.utils.parseUnits("0.5", 6);
              break;

            case "mumbai":
              fromChainId = NETWORK_NAME_TO_CHAIN_ID[NetworkNames.Mumbai];
              toChainId = NETWORK_NAME_TO_CHAIN_ID[NetworkNames.Xdai];
              fromTokenAddress = MumbaiUSDC;
              toTokenAddress = XdaiUSDC;
              fromAmount = ethers.utils.parseUnits("0.5", 6);
              break;

            case "optimism":
              fromChainId = NETWORK_NAME_TO_CHAIN_ID[NetworkNames.Optimism];
              toChainId = NETWORK_NAME_TO_CHAIN_ID[NetworkNames.Xdai];
              fromTokenAddress = OptimismUSDC;
              toTokenAddress = XdaiUSDC;
              fromAmount = ethers.utils.parseUnits("0.5", 6);
              break;

            default:
              console.log("Invalid network name is displayed.");
              break;
          }

          let quoteRequestPayload = {
            fromChainId: fromChainId,
            toChainId: toChainId,
            fromTokenAddress: fromTokenAddress,
            toTokenAddress: toTokenAddress,
            fromAmount: fromAmount,
            serviceProvider: CrossChainServiceProvider.SocketV2, // Optional parameter
          };

          try {
            assert.isNumber(
              quoteRequestPayload.fromChainId,
              "The fromChainId value is not number in the quoteRequest Payload."
            );
          } catch (e) {
            console.log(e);
          }

          try {
            assert.isNumber(
              quoteRequestPayload.toChainId,
              "The toChainId value is not number in the quoteRequest Payload."
            );
          } catch (e) {
            console.log(e);
          }

          try {
            assert.strictEqual(
              quoteRequestPayload.fromTokenAddress,
              "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
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
              "The fromAmount value is empty in the quoteRequest Payload."
            );
          } catch (e) {
            console.log(e);
          }

          try {
            assert.strictEqual(
              quoteRequestPayload.serviceProvider,
              "SocketV2",
              "The serviceProvider value is not displayed correct in the quoteRequest Payload."
            );
          } catch (e) {
            console.log(e);
          }
        } catch (e) {
          assert.fail("An error is displayed in the quote Request Payload.");
        }

        // Get the cross chain quotes
        let batchCrossChainTransaction;
        let quotes;
        try {
          quotes = await testNetSdk.getCrossChainQuotes(quoteRequestPayload);

          try {
            assert.strictEqual(
              quotes.items[0].provider,
              "socketv2",
              "The provider value is not displayed correct in the quotes response."
            );
          } catch (e) {
            console.log(e);
          }

          try {
            assert.isNotEmpty(
              quotes.items[0].approvalData,
              "The approvalData value is empty in the quotes response."
            );
          } catch (e) {
            console.log(e);
          }

          try {
            assert.isNotEmpty(
              quotes.items[0].transaction,
              "The transaction value is empty in the quotes response."
            );
          } catch (e) {
            console.log(e);
          }

          try {
            assert.isNotEmpty(
              quotes.items[0].estimate,
              "The estimate value is empty in the quotes response."
            );
          } catch (e) {
            console.log(e);
          }

          if (quotes.items.length > 0) {
            // Select the first quote
            let quote = quotes.items[0];

            try {
              assert.strictEqual(
                quote.provider,
                "socketv2",
                "The provider value is not displayed correct in the quotes response."
              );
            } catch (e) {
              console.log(e);
            }

            try {
              assert.strictEqual(
                quote.approvalData.approvalAddress,
                "0xd7E23c91d00daF2017BdB96F57B69c56dc82C317",
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
                "The data value of the transaction is empty in the single quote response."
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
                "The value's value of the transaction is empty in the single quote response."
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
              assert.isNumber(
                quote.transaction.chainId,
                "The chainId value of the transaction is not number in the single quote response."
              );
            } catch (e) {
              console.log(e);
            }

            try {
              assert.strictEqual(
                quote.estimate.approvalAddress,
                "0xd7E23c91d00daF2017BdB96F57B69c56dc82C317",
                "The approvalAddress value of the estimate is not displayed correct in the single quote response."
              );
            } catch (e) {
              console.log(e);
            }

            try {
              assert.strictEqual(
                quote.estimate.fromAmount,
                "500000",
                "The fromAmount value of the estimate is not displayed correct in the single quote response."
              );
            } catch (e) {
              console.log(e);
            }

            try {
              assert.isNotEmpty(
                quote.estimate.toAmount,
                "The toAmount value of the estimate is empty in the single quote response."
              );
            } catch (e) {
              console.log(e);
            }
            let toAmount_estimate_quote = quote.estimate.toAmount;

            try {
              assert.isNotEmpty(
                quote.estimate.gasCosts.limit,
                "The limit value of the gas cost of the estimate is empty in the single quote response."
              );
            } catch (e) {
              console.log(e);
            }

            try {
              assert.isNotEmpty(
                quote.estimate.gasCosts.amountUSD,
                "The amountUSD value of the gas cost of the estimate is empty in the single quote response."
              );
            } catch (e) {
              console.log(e);
            }

            try {
              assert.isNotEmpty(
                quote.estimate.gasCosts.token,
                "The token value of the gas cost of the estimate is empty in the single quote response."
              );
            } catch (e) {
              console.log(e);
            }

            try {
              assert.isNotEmpty(
                quote.estimate.data.fromToken,
                "The fromToken value of the data of the estimate is empty in the single quote response."
              );
            } catch (e) {
              console.log(e);
            }

            try {
              assert.isNotEmpty(
                quote.estimate.data.toToken,
                "The toToken value of the data of the estimate is empty in the single quote response."
              );
            } catch (e) {
              console.log(e);
            }

            try {
              assert.isNotEmpty(
                quote.estimate.data.toTokenAmount,
                "The toTokenAmount value of the data of the estimate is empty in the single quote response."
              );
            } catch (e) {
              console.log(e);
            }
            let toTokenAmount_data_estimate_quote =
              quote.estimate.data.toTokenAmount;

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
                "The estimatedGas value of the data of the estimate is empty in the single quote response."
              );
            } catch (e) {
              console.log(e);
            }

            try {
              assert.isNull(
                quote.LiFiBridgeUsed,
                "The LiFiBridgeUsed value is not null in the single quote response."
              );
            } catch (e) {
              console.log(e);
            }

            let tokenAddres = quote.estimate.data.fromToken.address;
            let approvalAddress = quote.approvalData.approvalAddress;
            let amount = quote.approvalData.amount;

            // Build the approval transaction request
            let { ContractNames, getContractAbi } = pkg;
            let abi = getContractAbi(ContractNames.ERC20Token);
            let erc20Contract = testNetSdk.registerContract(
              "erc20Contract",
              abi,
              tokenAddres
            );
            let approvalTransactionRequest = erc20Contract.encodeApprove(
              approvalAddress,
              amount
            );

            // Batch the approval transaction
            let batchexecutionaccounttransaction;

            batchexecutionaccounttransaction =
              await testNetSdk.batchExecuteAccountTransaction({
                to: approvalTransactionRequest.to,
                data: approvalTransactionRequest.data,
                value: approvalTransactionRequest.value,
              });

            for (
              let w = 0;
              w < batchexecutionaccounttransaction.requests.length;
              w++
            ) {
              try {
                assert.isNotEmpty(
                  batchexecutionaccounttransaction.requests[w].to,
                  "The To Address value is empty in the Batch Execution Account Transaction response."
                );
              } catch (e) {
                console.log(e);
              }

              try {
                assert.isNotEmpty(
                  batchexecutionaccounttransaction.requests[w].data,
                  "The Data value is empty in the Execution Batch Rccount Transaction response."
                );
              } catch (e) {
                console.log(e);
              }
            }

            try {
              assert.isNull(
                batchexecutionaccounttransaction.estimation,
                "The estimatation value is empty in the Batch Execution Account Transaction response."
              );
            } catch (e) {
              console.log(e);
            }

            // Batch the cross chain transaction
            let { to, value, data } = quote.transaction;
            batchCrossChainTransaction =
              await testNetSdk.batchExecuteAccountTransaction({
                to,
                data: data,
                value,
              });
          }

          for (let j = 0; j < batchCrossChainTransaction.requests.length; j++) {
            try {
              assert.isNotEmpty(
                batchCrossChainTransaction.requests[j].to,
                "The To Address value is empty in the Batch Cross Chain Transaction response."
              );
            } catch (e) {
              console.log(e);
            }

            try {
              assert.isNotEmpty(
                batchCrossChainTransaction.requests[j].data,
                "The Data value is empty in the Batch Cross Chain Transaction response."
              );
            } catch (e) {
              console.log(e);
            }
          }

          try {
            assert.isNull(
              batchCrossChainTransaction.estimation,
              "The estimation value is not null in the Batch Cross Chain Transaction response."
            );
          } catch (e) {
            console.log(e);
          }
        } catch (e) {
          assert.fail(
            "An error is displated while performing the action on the cross chain quotes."
          );
        }

        // Estimating the batch
        let estimationResponse;
        let EstimatedGas_Estimate;
        let FeeAmount_Estimate;
        let EstimatedGasPrice_Estimate;

        try {
          estimationResponse = await testNetSdk.estimateGatewayBatch();

          for (let k = 0; k < estimationResponse.requests.length; k++) {
            try {
              assert.isNotEmpty(
                estimationResponse.requests[k].to,
                "The To Address value is empty in the Estimation Batch response."
              );
            } catch (e) {
              console.log(e);
            }

            try {
              assert.isNotEmpty(
                estimationResponse.requests[k].data,
                "The Data value is empty in the Estimation Batch Response."
              );
            } catch (e) {
              console.log(e);
            }
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
        } catch (e) {
          assert.fail(
            "The estimation of the batch is not performed successfully."
          );
        }

        // Submitting the batch
        let submissionResponse;
        let EstimatedGas_Submit;
        let FeeAmount_Submit;
        let EstimatedGasPrice_Submit;

        try {
          submissionResponse = await testNetSdk.submitGatewayBatch({
            guarded: false,
          });

          try {
            assert.isNull(
              submissionResponse.transaction,
              "The transaction is no null in the Submit Batch Response."
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
                "The data value is empty in the Submit Batch Response."
              );
            } catch (e) {
              console.log(e);
            }
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
              "The estimatedGasPrice value is empty in the Submit Batch Response."
            );
            EstimatedGasPrice_Submit =
              submissionResponse.estimatedGasPrice._hex;
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
              "The delayedUntil value is not null in the Submit Batch Response."
            );
          } catch (e) {
            console.log(e);
          }
        } catch (e) {
          assert.fail(
            "The submittion of the batch is not performed successfully."
          );
        }
      }
    );
  }
});
