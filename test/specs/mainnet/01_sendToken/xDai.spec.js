import * as dotenv from 'dotenv';
dotenv.config(); // init dotenv

import { assert } from 'chai';
import { EnvNames, NetworkNames, Sdk } from 'etherspot';
import { utils } from 'ethers';
import customRetryAsync from '../../../utils/baseTest.js';
import data from '../../../data/testData.json' assert { type: 'json' };
import addContext from 'mochawesome/addContext.js';

let xdaiMainNetSdk;
let xdaiSmartWalletAddress;
let xdaiSmartWalletOutput;
let xdaiNativeAddress = null;
let runTest;

describe('The SDK, when sending a native token with xdai network on the MainNet', function () {
  beforeEach('Checking the sufficient wallet balance', async function () {
    var test = this;

    // initialize the sdk
    try {
      xdaiMainNetSdk = new Sdk(process.env.PRIVATE_KEY, {
        env: EnvNames.MainNets,
        networkName: NetworkNames.Xdai,
      });
      assert.strictEqual(
        xdaiMainNetSdk.state.accountAddress,
        data.eoaAddress,
        'The EOA Address is not calculated correctly.'
      );
    } catch (e) {
      console.error(e);
      const eString = e.toString();
      addContext(test, eString);
      assert.fail('The SDK is not initialled successfully.');
    }

    // Compute the smart wallet address
    try {
      xdaiSmartWalletOutput = await xdaiMainNetSdk.computeContractAccount();
      xdaiSmartWalletAddress = xdaiSmartWalletOutput.address;

      assert.strictEqual(
        xdaiSmartWalletAddress,
        data.sender,
        'The smart wallet address is not calculated correctly.'
      );
    } catch (e) {
      console.error(e);
      const eString = e.toString();
      addContext(test, eString);
      assert.fail('The smart wallet address is not calculated successfully.');
    }

    let output = await xdaiMainNetSdk.getAccountBalances();
    let native_balance;
    let usdc_balance;
    let usdt_balance;
    let native_final;
    let usdc_final;
    let usdt_final;

    for (let i = 0; i < output.items.length; i++) {
      let tokenAddress = output.items[i].token;
      if (tokenAddress === xdaiNativeAddress) {
        native_balance = output.items[i].balance;
        native_final = utils.formatUnits(native_balance, 18);
      } else if (tokenAddress === data.xdaiUsdcAddress) {
        usdc_balance = output.items[i].balance;
        usdc_final = utils.formatUnits(usdc_balance, 6);
      } else if (tokenAddress === data.xdaiUsdtAddress) {
        usdt_balance = output.items[i].balance;
        usdt_final = utils.formatUnits(usdt_balance, 6);
      }
    }

    if (
      native_final > data.minimum_native_balance &&
      usdc_final > data.minimum_token_balance &&
      usdt_final > data.minimum_token_balance
    ) {
      runTest = true;
    } else {
      runTest = false;
    }
  });

  it('SMOKE: Perform the send native token on the xdai network', async function () {
    var test = this;
    if (runTest) {
      await customRetryAsync(async function () {
        let AddTransactionToBatchOutput;
        // Adding transaction to a batch
        try {
          AddTransactionToBatchOutput =
            await xdaiMainNetSdk.batchExecuteAccountTransaction({
              to: data.recipient,
              value: data.value_18dec,
            });
        } catch (e) {
          console.error(e);
          const eString = e.toString();
          addContext(test, eString);
          assert.fail(
            'The addition of transaction in the batch is not performed successfully.'
          );
        }

        try {
          assert.isNotEmpty(
            AddTransactionToBatchOutput.requests[0].to,
            'The To Address value is empty in the Batch Response.'
          );
        } catch (e) {
          console.error(e);
          const eString = e.toString();
          addContext(test, eString);
        }

        try {
          assert.isNotEmpty(
            AddTransactionToBatchOutput.requests[0].data,
            'The data value is empty in the Batch Reponse.'
          );
        } catch (e) {
          console.error(e);
          const eString = e.toString();
          addContext(test, eString);
        }

        try {
          assert.isNull(
            AddTransactionToBatchOutput.estimation,
            'The estimation value is not null in the Batch Response.'
          );
        } catch (e) {
          console.error(e);
          const eString = e.toString();
          addContext(test, eString);
        }

        // Estimating the batch
        let EstimationResponse;
        let EstimatedGas_Estimate;
        let FeeAmount_Estimate;
        let EstimatedGasPrice_Estimate;

        try {
          EstimationResponse = await xdaiMainNetSdk.estimateGatewayBatch();
        } catch (e) {
          console.error(e);
          const eString = e.toString();
          addContext(test, eString);
          assert.fail(
            'The estimation of the batch is not performed successfully.'
          );
        }

        try {
          assert.isNotEmpty(
            EstimationResponse.requests[0].to,
            'The To Address value is empty in the Batch Estimation Response.'
          );
        } catch (e) {
          console.error(e);
          const eString = e.toString();
          addContext(test, eString);
        }

        try {
          assert.isNotEmpty(
            EstimationResponse.requests[0].data,
            'The data value is empty in the Batch Estimation Response.'
          );
        } catch (e) {
          console.error(e);
          const eString = e.toString();
          addContext(test, eString);
        }

        try {
          assert.isNotEmpty(
            EstimationResponse.estimation.feeTokenReceiver,
            data.recipient,
            'The feeTokenReceiver Address of the Batch Estimation Response is not displayed correctly.'
          );
        } catch (e) {
          console.error(e);
          const eString = e.toString();
          addContext(test, eString);
        }

        try {
          assert.isNumber(
            EstimationResponse.estimation.estimatedGas,
            'The estimatedGas value is not number in the Estimate Batch Response.'
          );
          EstimatedGas_Estimate = EstimationResponse.estimation.estimatedGas;
        } catch (e) {
          console.error(e);
          const eString = e.toString();
          addContext(test, eString);
        }

        try {
          assert.isNotEmpty(
            EstimationResponse.estimation.feeAmount,
            'The feeAmount value is empty in the Estimation Response.'
          );
          FeeAmount_Estimate = EstimationResponse.estimation.feeAmount._hex;
        } catch (e) {
          console.error(e);
          const eString = e.toString();
          addContext(test, eString);
        }

        try {
          assert.isNotEmpty(
            EstimationResponse.estimation.estimatedGasPrice,
            'The estimatedGasPrice value is empty in the Estimation Response.'
          );
          EstimatedGasPrice_Estimate =
            EstimationResponse.estimation.estimatedGasPrice._hex;
        } catch (e) {
          console.error(e);
          const eString = e.toString();
          addContext(test, eString);
        }

        try {
          assert.isNotEmpty(
            EstimationResponse.estimation.signature,
            'The signature value is empty in the Estimation Response.'
          );
        } catch (e) {
          console.error(e);
          const eString = e.toString();
          addContext(test, eString);
        }

        // Submitting the batch
        let SubmissionResponse;
        let EstimatedGas_Submit;
        let FeeAmount_Submit;
        let EstimatedGasPrice_Submit;

        try {
          SubmissionResponse = await xdaiMainNetSdk.submitGatewayBatch({
            guarded: false,
          });
        } catch (e) {
          console.error(e);
          const eString = e.toString();
          addContext(test, eString);
          assert.fail(
            'The submittion of the batch is not performed successfully.'
          );
        }

        try {
          assert.isNull(
            SubmissionResponse.transaction,
            'The transaction value is not null in the Submit Batch Response.'
          );
        } catch (e) {
          console.error(e);
          const eString = e.toString();
          addContext(test, eString);
        }

        try {
          assert.isNotEmpty(
            SubmissionResponse.hash,
            'The hash value is empty in the Submit Batch Response.'
          );
        } catch (e) {
          console.error(e);
          const eString = e.toString();
          addContext(test, eString);
        }

        try {
          assert.strictEqual(
            SubmissionResponse.state,
            'Queued',
            'The status of the Submit Batch Response is not displayed correctly.'
          );
        } catch (e) {
          console.error(e);
          const eString = e.toString();
          addContext(test, eString);
        }

        try {
          assert.strictEqual(
            SubmissionResponse.account,
            xdaiSmartWalletAddress,
            'The account address of the Submit Batch Response is not displayed correctly.'
          );
        } catch (e) {
          console.error(e);
          const eString = e.toString();
          addContext(test, eString);
        }

        try {
          assert.isNumber(
            SubmissionResponse.nonce,
            'The nonce value is not number in the Submit Batch Response.'
          );
        } catch (e) {
          console.error(e);
          const eString = e.toString();
          addContext(test, eString);
        }

        try {
          assert.isNotEmpty(
            SubmissionResponse.to[0],
            'The To Address value is empty in the Submit Batch Response.'
          );
        } catch (e) {
          console.error(e);
          const eString = e.toString();
          addContext(test, eString);
        }

        try {
          assert.isNotEmpty(
            SubmissionResponse.data[0],
            'The data value is empty in the Submit Batch Response.'
          );
        } catch (e) {
          console.error(e);
          const eString = e.toString();
          addContext(test, eString);
        }

        try {
          assert.isNotEmpty(
            SubmissionResponse.senderSignature,
            'The senderSignature value is empty in the Submit Batch Response.'
          );
        } catch (e) {
          console.error(e);
          const eString = e.toString();
          addContext(test, eString);
        }

        try {
          assert.isNumber(
            SubmissionResponse.estimatedGas,
            'The Estimated Gas value is not number in the Submit Batch Response.'
          );
          EstimatedGas_Submit = SubmissionResponse.estimatedGas;
        } catch (e) {
          console.error(e);
          const eString = e.toString();
          addContext(test, eString);
        }

        try {
          assert.strictEqual(
            EstimatedGas_Estimate,
            EstimatedGas_Submit,
            'The Estimated Gas value is not displayed correctly.'
          );
        } catch (e) {
          console.error(e);
          const eString = e.toString();
          addContext(test, eString);
        }

        try {
          assert.isNotEmpty(
            SubmissionResponse.estimatedGasPrice._hex,
            'The estimatedGasPrice value is empty in the Submit Batch Response.'
          );
          EstimatedGasPrice_Submit = SubmissionResponse.estimatedGasPrice._hex;
        } catch (e) {
          console.error(e);
          const eString = e.toString();
          addContext(test, eString);
        }

        try {
          assert.strictEqual(
            EstimatedGasPrice_Estimate,
            EstimatedGasPrice_Submit,
            'The Estimated Gas Price value is not displayed correctly.'
          );
        } catch (e) {
          console.error(e);
          const eString = e.toString();
          addContext(test, eString);
        }

        try {
          assert.isNull(
            SubmissionResponse.feeToken,
            'The feeToken value is not null in the Submit Batch Response.'
          );
        } catch (e) {
          console.error(e);
          const eString = e.toString();
          addContext(test, eString);
        }

        try {
          assert.isNotEmpty(
            SubmissionResponse.feeAmount._hex,
            'The feeAmount value is empty in the Submit Batch Response.'
          );
          FeeAmount_Submit = SubmissionResponse.feeAmount._hex;
        } catch (e) {
          console.error(e);
          const eString = e.toString();
          addContext(test, eString);
        }

        try {
          assert.strictEqual(
            FeeAmount_Estimate,
            FeeAmount_Submit,
            'The Fee Amount value is not displayed correctly.'
          );
        } catch (e) {
          console.error(e);
          const eString = e.toString();
          addContext(test, eString);
        }

        try {
          assert.isNotEmpty(
            SubmissionResponse.feeData,
            'The feeData value is empty in the Submit Batch Response.'
          );
        } catch (e) {
          console.error(e);
          const eString = e.toString();
          addContext(test, eString);
        }

        try {
          assert.isNull(
            SubmissionResponse.delayedUntil,
            'The delayedUntil value is not null in the Submit Batch Response.'
          );
        } catch (e) {
          console.error(e);
          const eString = e.toString();
          addContext(test, eString);
        }
      }, data.retry); // Retry this async test up to 5 times
    } else {
      console.warn(
        'DUE TO INSUFFICIENT WALLET BALANCE, SKIPPING TEST CASE OF THE SEND NATIVE TOKEN ON THE XDAI NETWORK'
      );
    }
  });

  it('REGRESSION: Perform the send native token with invalid to address on the xdai network', async function () {
    var test = this;
    if (runTest) {
      await customRetryAsync(async function () {
        // Adding transaction to a batch with invalid To Address
        try {
          try {
            await xdaiMainNetSdk.batchExecuteAccountTransaction({
              to: data.invalidRecipient, // Invalid To Address
              value: data.value_18dec,
            });
            addContext(
              test,
              'The batch execution completed with incorrect To Address.'
            );
            assert.fail(
              'The batch execution completed with incorrect To Address.'
            );
          } catch (e) {
            if (e.errors[0].constraints.isAddress == 'to must be an address') {
              console.log(
                'The validation for To Address is displayed as expected while batch execution.'
              );
            } else {
              console.error(e);
              const eString = e.toString();
              addContext(test, eString);
              assert.fail(
                'The expected validation is not displayed when entered the invalid To Address while performing batch execution.'
              );
            }
          }
        } catch (e) {
          console.error(e);
          const eString = e.toString();
          addContext(test, eString);
          assert.fail(
            'The expected validation is not displayed when entered the invalid To Address while performing batch execution.'
          );
        }
      }, data.retry); // Retry this async test up to 5 times
    } else {
      console.warn(
        'DUE TO INSUFFICIENT WALLET BALANCE, SKIPPING TEST CASE OF THE SEND NATIVE TOKEN WITH INVALID TO ADDRESS ON THE XDAI NETWORK'
      );
    }
  });

  it('REGRESSION: Perform the send native token with invalid value on the xdai network', async function () {
    var test = this;
    if (runTest) {
      await customRetryAsync(async function () {
        // Adding transaction to a batch with invalid Value
        try {
          try {
            await xdaiMainNetSdk.batchExecuteAccountTransaction({
              to: data.recipient,
              value: data.invalid_value_18dec, // Invalid Value
            });
            addContext(
              test,
              'The batch execution colmpleyed with incorrect Value.'
            );
            assert.fail('The batch execution colmpleyed with incorrect Value.');
          } catch (e) {
            if (
              e.errors[0].constraints.IsBigNumberish ==
              'value must be big numberish'
            ) {
              console.log(
                'The validation for Value is displayed as expected while the batch execution.'
              );
            } else {
              console.error(e);
              const eString = e.toString();
              addContext(test, eString);
              assert.fail(
                'The expected validation is not displayed when entered the invalid Value while performing batch execution.'
              );
            }
          }
        } catch (e) {
          console.error(e);
          const eString = e.toString();
          addContext(test, eString);
          assert.fail(
            'The expected validation is not displayed when entered the invalid Value while performing batch execution.'
          );
        }
      }, data.retry); // Retry this async test up to 5 times
    } else {
      console.warn(
        'DUE TO INSUFFICIENT WALLET BALANCE, SKIPPING TEST CASE OF THE SEND NATIVE TOKEN WITH INVALID VALUE ON THE XDAI NETWORK'
      );
    }
  });

  it('REGRESSION: Perform the send native token with exceeded value. on the xdai network', async function () {
    var test = this;
    if (runTest) {
      await customRetryAsync(async function () {
        // Adding transaction to a batch with Value as more than the actual Value of the wallet balance
        try {
          await xdaiMainNetSdk.batchExecuteAccountTransaction({
            to: data.recipient,
            value: data.exceeded_value_18dec, // Exceeded Value
          });
        } catch (e) {
          console.error(e);
          const eString = e.toString();
          addContext(test, eString);
          assert.fail(
            'The exceeded Value is not required in the wallet balance for the batch execution.'
          );
        }

        // estinating the batch
        try {
          try {
            await xdaiMainNetSdk.estimateGatewayBatch();
          } catch (e) {
            if (e.errors[0].constraints.reverted == 'Transaction reverted') {
              console.log(
                'The validation for exceeded Value is displayed as expected while the batch execution.'
              );
            } else {
              console.error(e);
              const eString = e.toString();
              addContext(test, eString);
              assert.fail(
                'The expected validation is not displayed when entered the exceeded Value while performing batch execution.'
              );
            }
          }
        } catch (e) {
          console.error(e);
          const eString = e.toString();
          addContext(test, eString);
          assert.fail(
            'The expected validation is not displayed when entered the exceeded Value while performing batch execution.'
          );
        }
      }, data.retry); // Retry this async test up to 5 times
    } else {
      console.warn(
        'DUE TO INSUFFICIENT WALLET BALANCE, SKIPPING TEST CASE OF THE SEND NATIVE TOKEN WITH EXCEEDED VALUE ON THE XDAI NETWORK'
      );
    }
  });

  it('REGRESSION: Perform the send native token on the same address on the xdai network', async function () {
    var test = this;
    if (runTest) {
      await customRetryAsync(async function () {
        // Adding transaction to a batch on the same address
        try {
          try {
            await xdaiMainNetSdk.batchExecuteAccountTransaction({
              to: data.sender, // Send Native Token on Same Address
              value: data.value_18dec,
            });
            addContext(
              test,
              'Addition of the transaction to batch on the same address is performed.'
            );
            assert.fail(
              'Addition of the transaction to batch on the same address is performed.'
            );
          } catch (e) {
            if (
              e.message ==
              'Destination address should not be the same as sender address'
            ) {
              console.log(
                'The validation is displayed while entering the duplicate sender address.'
              );
            } else {
              console.error(e);
              const eString = e.toString();
              addContext(test, eString);
              assert.fail(
                'The validation is not displayed while entering the duplicate sender address.'
              );
            }
          }
        } catch (e) {
          console.error(e);
          const eString = e.toString();
          addContext(test, eString);
          assert.fail(
            'The validation is not displayed while entering the duplicate sender address.'
          );
        }
      }, data.retry); // Retry this async test up to 5 times
    } else {
      console.warn(
        'DUE TO INSUFFICIENT WALLET BALANCE, SKIPPING TEST CASE OF THE SEND NATIVE TOKEN ON THE SAME ADDRESS ON THE XDAI NETWORK'
      );
    }
  });

  it('REGRESSION: Perform the send native token without estimation of the batch on the xdai network', async function () {
    var test = this;
    if (runTest) {
      await customRetryAsync(async function () {
        // Adding transaction to a batch without estimation of the batch
        try {
          await xdaiMainNetSdk.batchExecuteAccountTransaction({
            to: data.recipient,
            value: data.value_18dec,
          });
        } catch (e) {
          console.error(e);
          const eString = e.toString();
          addContext(test, eString);
          assert.fail(
            'The addition of transaction in the batch is not performed successfully.'
          );
        }

        // Submitting the batch
        try {
          try {
            await xdaiMainNetSdk.submitGatewayBatch({
              guarded: false,
            });
            addContext(
              test,
              'Status of the batch is submitted without Estimation of batch.'
            );
            assert.fail(
              'Status of the batch is submitted without Estimation of batch.'
            );
          } catch (e) {
            if (e.message == 'Can not submit not estimated batch') {
              console.log(
                'The validation is displayed when submiting the batch without estimation.'
              );
            } else {
              console.error(e);
              const eString = e.toString();
              addContext(test, eString);
              assert.fail(
                'The submition of batch is completed without estimation.'
              );
            }
          }
        } catch (e) {
          console.error(e);
          const eString = e.toString();
          addContext(test, eString);
          assert.fail(
            'The submition of batch is completed without estimation.'
          );
        }
      }, data.retry); // Retry this async test up to 5 times
    } else {
      console.warn(
        'DUE TO INSUFFICIENT WALLET BALANCE, SKIPPING TEST CASE OF THE SEND NATIVE TOKEN WITHOUT ESTIMATION OF THE BATCH ON THE XDAI NETWORK'
      );
    }
  });
});
