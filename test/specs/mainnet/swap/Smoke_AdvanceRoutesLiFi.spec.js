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

let network = ["arbitrum", "bsc", "xdai", "matic", "optimism"];
let mainNetSdk;

describe("The SDK, when advance routes lifi flow on the MainNet", () => {
  for (let l = 0; l < network.length; l++) {
    // ADVANCE ROUTES LIFI ON RESPECTIVE NETWORK
    it(
      "Perform the advance routes lifi action " + network[i] + " network",
      async () => {
        // initialize the sdk
        try {
          mainNetSdk = new Sdk(process.env.PRIVATE_KEY, {
            env: EnvNames.MainNets,
            networkName: network[l],
          });

          assert.strictEqual(
            mainNetSdk.state.accountAddress,
            "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f",
            "The EOA Address is not calculated correctly."
          );
        } catch (e) {
          assert.fail("The SDK is not initialled successfully.");
        }

        // Compute the smart wallet address
        try {
          let smartWalletOutput = await mainNetSdk.computeContractAccount();
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
          let MaticUSDC = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"; // Matic - USDC
          let MainnetUSDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"; // Mainnet - USDC
          let XdaiUSDC = "0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83"; // Xdai - USDC
          let OptimismUSDC = "0x7F5c764cBc14f9669B88837ca1490cCa17c31607"; // Optimism - USDC

          let fromChainId;
          let toChainId;
          let fromTokenAddress;
          let toTokenAddress;
          let fromAmount;

          switch (network[l]) {
            case "arbitrum":
              fromChainId = NETWORK_NAME_TO_CHAIN_ID[NetworkNames.Arbitrum];
              toChainId = NETWORK_NAME_TO_CHAIN_ID[NetworkNames.Xdai];
              fromTokenAddress = ArbitrumUSDC;
              toTokenAddress = MaticUSDC;
              fromAmount = ethers.utils.parseUnits("0.5", 6);
              break;

            case "bsc":
              fromChainId = NETWORK_NAME_TO_CHAIN_ID[NetworkNames.Bsc];
              toChainId = NETWORK_NAME_TO_CHAIN_ID[NetworkNames.Xdai];
              fromTokenAddress = BscUSDC;
              toTokenAddress = XdaiUSDC;
              fromAmount = ethers.utils.parseUnits("0.5", 6);
              break;

            case "mainnet":
              fromChainId = NETWORK_NAME_TO_CHAIN_ID[NetworkNames.Mainnet];
              toChainId = NETWORK_NAME_TO_CHAIN_ID[NetworkNames.Xdai];
              fromTokenAddress = MainnetUSDC;
              toTokenAddress = XdaiUSDC;
              fromAmount = ethers.utils.parseUnits("0.5", 6);
              break;

            case "xdai":
              fromChainId = NETWORK_NAME_TO_CHAIN_ID[NetworkNames.Xdai];
              toChainId = NETWORK_NAME_TO_CHAIN_ID[NetworkNames.Matic];
              fromTokenAddress = XdaiUSDC;
              toTokenAddress = MaticUSDC;
              fromAmount = ethers.utils.parseUnits("0.5", 6);
              break;

            case "matic":
              fromChainId = NETWORK_NAME_TO_CHAIN_ID[NetworkNames.Matic];
              toChainId = NETWORK_NAME_TO_CHAIN_ID[NetworkNames.Xdai];
              fromTokenAddress = MaticUSDC;
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
            serviceProvider: CrossChainServiceProvider.LiFi, // Optional parameter
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
              "0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83",
              "The toTokenAddress value is not displayed correct in the quoteRequest Payload."
            );
          } catch (e) {
            console.log(e);
          }

          try {
            assert.isNotEmpty(
              quoteRequestPayload.fromAmount._hex,
              "The fromAmount value is empty in the quoteRequest Payload."
            );
          } catch (e) {
            console.log(e);
          }

          try {
            assert.strictEqual(
              quoteRequestPayload.serviceProvider,
              "LiFi",
              "The serviceProvider value is not displayed correct in the quoteRequest Payload."
            );
          } catch (e) {
            console.log(e);
          }
        } catch (e) {
          assert.fail("An error is displayed in the quote Request Payload.");
        }

        // Get the advance routes lifi
        let advanceRoutesLiFi;
        try {
          advanceRoutesLiFi = await mainNetSdk.getAdvanceRoutesLiFi(
            quoteRequestPayload
          );

          for (let i; i < advanceRoutesLiFi.items.length; i++) {
            try {
              assert.isNotEmpty(
                advanceRoutesLiFi.items[i].id,
                "The id value is empty in the advance routes lifi response."
              );
            } catch (e) {
              console.log(e);
            }

            try {
              assert.isNumber(
                advanceRoutesLiFi.items[i].fromChainId,
                "The fromChainId value is not number in the advance routes lifi response."
              );
            } catch (e) {
              console.log(e);
            }

            try {
              assert.isNotEmpty(
                advanceRoutesLiFi.items[i].fromAmountUSD,
                "The fromAmountUSD value is empty in the advance routes lifi response."
              );
            } catch (e) {
              console.log(e);
            }

            try {
              assert.isNotEmpty(
                advanceRoutesLiFi.items[i].fromAmount,
                "The fromAmount value is empty in the advance routes lifi response."
              );
            } catch (e) {
              console.log(e);
            }

            try {
              assert.isNotEmpty(
                advanceRoutesLiFi.items[i].fromToken,
                "The fromToken value is empty in the advance routes lifi response."
              );
            } catch (e) {
              console.log(e);
            }

            try {
              assert.strictEqual(
                advanceRoutesLiFi.items[i].fromAddress,
                "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
                "The fromAmount value is empty in the advance routes lifi response."
              );
            } catch (e) {
              console.log(e);
            }

            try {
              assert.isNumber(
                advanceRoutesLiFi.items[i].toChainId,
                "The toChainId value is not number in the advance routes lifi response."
              );
            } catch (e) {
              console.log(e);
            }

            try {
              assert.isNotEmpty(
                advanceRoutesLiFi.items[i].toAmountUSD,
                "The toAmountUSD value is empty in the advance routes lifi response."
              );
            } catch (e) {
              console.log(e);
            }

            try {
              assert.isNotEmpty(
                advanceRoutesLiFi.items[i].toAmount,
                "The toAmount value is empty in the advance routes lifi response."
              );
            } catch (e) {
              console.log(e);
            }

            try {
              assert.isNotEmpty(
                advanceRoutesLiFi.items[i].toAmountMin,
                "The toAmountMin value is empty in the advance routes lifi response."
              );
            } catch (e) {
              console.log(e);
            }

            try {
              assert.isNotEmpty(
                advanceRoutesLiFi.items[i].toToken,
                "The toToken value is empty in the advance routes lifi response."
              );
            } catch (e) {
              console.log(e);
            }

            try {
              assert.strictEqual(
                advanceRoutesLiFi.items[i].toAddress,
                "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
                "The toAddress value is not displayed correct in the advance routes lifi response."
              );
            } catch (e) {
              console.log(e);
            }

            try {
              assert.isNotEmpty(
                advanceRoutesLiFi.items[i].gasCostUSD,
                "The gasCostUSD value is empty in the advance routes lifi response."
              );
            } catch (e) {
              console.log(e);
            }

            try {
              assert.isFalse(
                advanceRoutesLiFi.items[i].containsSwitchChain,
                "The containsSwitchChain value is not false in the advance routes lifi response."
              );
            } catch (e) {
              console.log(e);
            }

            try {
              assert.isNotEmpty(
                advanceRoutesLiFi.items[i].steps,
                "The steps value is empty in the advance routes lifi response."
              );
            } catch (e) {
              console.log(e);
            }

            try {
              assert.isNotEmpty(
                advanceRoutesLiFi.items[i].insurance,
                "The insurance value is empty in the advance routes lifi response."
              );
            } catch (e) {
              console.log(e);
            }

            try {
              assert.isNotEmpty(
                advanceRoutesLiFi.items[i].tags,
                "The tags value is enpty in the advance routes lifi response."
              );
            } catch (e) {
              console.log(e);
            }
          }

          if (advanceRoutesLiFi.items.length > 0) {
            // Select the first advance route lifi
            let advanceRouteLiFi = advanceRoutesLiFi.items[0];
            let transactions = await mainNetSdk.getStepTransaction({
              route: advanceRouteLiFi,
            });

            for (let j = 0; j < transactions.items.length; j++) {
              try {
                assert.isNotEmpty(
                  transactions.items[j].to,
                  "The To Address value is empty in the transactions response."
                );
              } catch (e) {
                console.log(e);
              }

              try {
                assert.isNotEmpty(
                  transactions.items[j].gasLimit,
                  "The gasLimit value is empty in the transactions response."
                );
              } catch (e) {
                console.log(e);
              }

              try {
                assert.isNotEmpty(
                  transactions.items[j].gasPrice,
                  "The gasPrice value is empty in the transactions response."
                );
              } catch (e) {
                console.log(e);
              }

              try {
                assert.isNotEmpty(
                  transactions.items[j].data,
                  "The data value is empty in the transactions response."
                );
              } catch (e) {
                console.log(e);
              }

              try {
                assert.isNotEmpty(
                  transactions.items[j].value,
                  "The value's value is empty in the transactions response."
                );
              } catch (e) {
                console.log(e);
              }

              try {
                assert.isNumber(
                  transactions.items[j].chainId,
                  "The chainId value is not number in the transactions response."
                );
              } catch (e) {
                console.log(e);
              }

              try {
                assert.isNull(
                  transactions.items[j].type,
                  "The type value is not null in the transactions response."
                );
              } catch (e) {
                console.log(e);
              }
            }

            for (let transaction of transactions.items) {
              // Batch the approval transaction
              await mainNetSdk.batchExecuteAccountTransaction({
                to: transaction.to,
                data: transaction.data,
                value: transaction.value,
              });
            }
          }
        } catch (e) {
          assert.fail(
            "An error is displated while performing the action on the advance routes lifi."
          );
        }

        // Estimating the batch
        let estimationResponse;
        let EstimatedGas_Estimate;
        let FeeAmount_Estimate;
        let EstimatedGasPrice_Estimate;

        try {
          estimationResponse = await mainNetSdk.estimateGatewayBatch();

          for (let k = 0; k < estimationResponse.requests.length; k++) {
            try {
              assert.isNotEmpty(
                estimationResponse.requests[k].to,
                "The To Address value is empty in the Batch Execution Account Transaction response."
              );
            } catch (e) {
              console.log(e);
            }

            try {
              assert.isNotEmpty(
                estimationResponse.requests[k].data,
                "The data value is empty in the Batch Execution Account Transaction response."
              );
            } catch (e) {
              console.log(e);
            }
          }

          try {
            assert.isNotEmpty(
              estimationResponse.estimation.feeAmount,
              "The feeAmount value is empty in the Estimation Response."
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
              "The estimatedGasPrice value is empty in the Estimation Response."
            );
            EstimatedGasPrice_Estimate =
              estimationResponse.estimation.estimatedGasPrice._hex;
          } catch (e) {
            console.log(e);
          }

          try {
            assert.isNotEmpty(
              estimationResponse.estimation.signature,
              "The signature value is empty in the Estimation Response."
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
          submissionResponse = await mainNetSdk.submitGatewayBatch({
            guarded: false,
          });

          try {
            assert.isNull(
              submissionResponse.transaction,
              "The transaction value is not null in the Submit Batch Response."
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
