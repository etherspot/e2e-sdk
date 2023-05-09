import * as dotenv from "dotenv";
dotenv.config();

import { EnvNames, NetworkNames, Sdk } from "etherspot";
import { ethers } from "ethers";
import { assert } from "chai";

describe("The regression suite for the single chain swap on the TestNet", () => {
  // SWAP ON XDAI NETWORK FROM ERC20 TOKEN TO NATIVE TOKEN
  it("Setup the SDK for xDai network and perform the single chain swap action from ERC20 token to Native Token.", async () => {
    let transactionDetails;
    let TransactionData_count = 0;

    // Initialize the SDK and define network
    try {
      let xdaiTestNetSdk = new Sdk(process.env.PRIVATE_KEY, {
        env: EnvNames.TestNets,
        networkName: NetworkNames.Xdai,
      });

      assert.strictEqual(
        xdaiTestNetSdk.state.accountAddress,
        "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f",
        "The EOA Address is not calculated correctly."
      );
    } catch (e) {
      console.log(e);
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
      console.log(e);
    }

    // Get exchange offers
    let offers;
    try {
      offers = await xdaiTestNetSdk.getExchangeOffers({
        fromTokenAddress: "0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83", // USDC Token
        toTokenAddress: ethers.letants.AddressZero,
        fromAmount: ethers.utils.parseUnits("0.0001", 6),
      });

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
          // BATCH EXECUTE ACCOUNT TRANSACTION
          let addTransactionToBatchOutput =
            await xdaiTestNetSdk.batchExecuteAccountTransaction(
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
              "The estimation value is not null in the batchExecuteAccountTransaction response."
            );
          } catch (e) {
            console.log(e);
          }
        }
      }
    } catch (e) {
      console.log(e);
    }

    // Estimating the batch
    let estimationResponse;
    let FeeAmount_Estimate;
    let EstimatedGas_Estimate;
    let EstimatedGasPrice_Estimate;

    try {
      estimationResponse = await xdaiTestNetSdk.estimateGatewayBatch();

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
            "The Data value is empty in the batchExecuteAccountTransaction response."
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
      console.log(e);
    }

    // Submitting the batch
    let submissionResponse;
    let FeeAmount_Submit;
    let EstimatedGas_Submit;
    let EstimatedGasPrice_Submit;

    try {
      submissionResponse = await xdaiTestNetSdk.submitGatewayBatch({
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
          "The data value of the Submit Batch Response is not displayed."
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
          "The estimatedGasPrice value is empty in the Submit Batch Response."
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
          "The delayedUntil value is not null in the Submit Batch Response."
        );
      } catch (e) {
        console.log(e);
      }
    } catch (e) {
      console.log(e);
    }
  });

  // SWAP ON XDAI NETWORK FROM NATIVE TOKEN TO ERC20 TOKEN
  it("Setup the SDK for xDai network and perform the single chain swap action from Native Token to ERC20 token.", async () => {
    let transactionDetails;

    // Initialize the SDK and define network
    try {
      let xdaiTestNetSdk = new Sdk(process.env.PRIVATE_KEY, {
        env: EnvNames.TestNets,
        networkName: NetworkNames.Xdai,
      });

      assert.strictEqual(
        xdaiTestNetSdk.state.accountAddress,
        "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f",
        "The EOA Address is not calculated correctly."
      );
    } catch (e) {
      console.log(e);
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
      console.log(e);
    }

    // Get exchange offers
    let offers;
    try {
      offers = await xdaiTestNetSdk.getExchangeOffers({
        fromTokenAddress: ethers.letants.AddressZero,
        toTokenAddress: "0x4ECaBa5870353805a9F068101A40E0f32ed605C6", // USDT Token
        fromAmount: ethers.utils.parseUnits("0.0001", 6),
      });

      try {
        assert.strictEqual(offers.length, 0, "The offers are displayed.");
      } catch (e) {
        console.log(
          e,
          "The offers are displayed, Even if the fromTokenAddress is set as a Native Token."
        );
      }
    } catch (e) {
      console.log(e);
    }

    // Batch execute account transaction
    try {
      await xdaiTestNetSdk.batchExecuteAccountTransaction(
        transactionDetails[0]
      );

      assert.fail(
        "The batch execution account transaction is performed, Even if the fromTokenAddress is set as a Native Token."
      );
    } catch (e) {
      console.log(
        e,
        "Cannot read properties of undefined, Because fromTokenAddress is set as a Native Token and not displayed the any offers in the list."
      );
    }

    // Estimating the batch
    try {
      await xdaiTestNetSdk.estimateGatewayBatch();

      assert.fail(
        "The estimation of the batch is performed, Even if the fromTokenAddress is set as a Native Token."
      );
    } catch (e) {
      console.log(
        e,
        "Can not estimate empty batch, Because fromTokenAddress is set as a Native Token and not batch execute account transaction."
      );
    }
  });

  // SWAP ON XDAI NETWORK WITHOUT ESTIMATION OF THE BATCH
  it("Setup the SDK for xDai network and perform the single chain swap action without estimation of the batch.", async () => {
    let transactionDetails;

    // Initialize the SDK and define network
    try {
      let xdaiTestNetSdk = new Sdk(process.env.PRIVATE_KEY, {
        env: EnvNames.TestNets,
        networkName: NetworkNames.Xdai,
      });

      assert.strictEqual(
        xdaiTestNetSdk.state.accountAddress,
        "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f",
        "The EOA Address is not calculated correctly."
      );
    } catch (e) {
      console.log(e);
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
      console.log(e);
    }

    // Get exchange offers
    let offers;
    try {
      offers = await xdaiTestNetSdk.getExchangeOffers({
        fromTokenAddress: "0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83", // USDC Token
        toTokenAddress: "0x4ECaBa5870353805a9F068101A40E0f32ed605C6", // USDT Token
        fromAmount: ethers.utils.parseUnits("0.0001", 6),
      });

      for (let j = 0; j < offers.length; j++) {
        transactionDetails = offers[j].transactions;

        for (let l = 0; l < transactionDetails.length; l++) {
          // Batch execute account transaction
          await xdaiTestNetSdk.batchExecuteAccountTransaction(
            transactionDetails[i]
          );
        }
      }
    } catch (e) {
      console.log(e);
    }

    // Submitting the batch
    try {
      await xdaiTestNetSdk.submitGatewayBatch({
        guarded: false,
      });
      assert.fail(
        "Status of the batch is submitted without Estimation of batch."
      );
    } catch (e) {
      console.log(
        e,
        "Status of the batch is not submitted, Because Estimation of batch is remaining."
      );
    }
  });

  // SWAP ON XDAI NETWORK FROM ERC20 TOKEN TO ERC20 TOKEN WITH EXCEED TOKEN BALANCE
  it("Setup the SDK for xDai network and perform the single chain swap action from ERC20 token to ERC20 Token with exceed token balance.", async () => {
    // Initialize the SDK and define network
    try {
      let xdaiTestNetSdk = new Sdk(process.env.PRIVATE_KEY, {
        env: EnvNames.TestNets,
        networkName: NetworkNames.Xdai,
      });

      assert.strictEqual(
        xdaiTestNetSdk.state.accountAddress,
        "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f",
        "The EOA Address is not calculated correctly."
      );
    } catch (e) {
      console.log(e);
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
      console.log(e);
    }

    // Get exchange offers
    let offers;
    try {
      offers = await xdaiTestNetSdk.getExchangeOffers({
        fromTokenAddress: "0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83", // USDC Token
        toTokenAddress: "0x4ECaBa5870353805a9F068101A40E0f32ed605C6", // USDT Token
        fromAmount: ethers.utils.parseUnits("100000000", 6), // Exceeded Token Balance
      });
    } catch (e) {
      console.log(e);
    }

    // Estimating the batch
    try {
      await xdaiTestNetSdk.estimateGatewayBatch();

      assert.fail(
        "The Estimation is performed even if exceed the token account."
      );
    } catch (e) {
      console.log(
        e,
        "The Estimation is not happened due to exceed token account."
      );
    }
  });

  // SWAP ON XDAI NETWORK FROM ERC20 TOKEN TO NATIVE TOKEN WITH EXCEED TOKEN BALANCE
  it("Setup the SDK for xDai network and perform the single chain swap action from ERC20 token to native token with exceed token balance.", async () => {
    // Initialize the SDK and define network
    try {
      let xdaiTestNetSdk = new Sdk(process.env.PRIVATE_KEY, {
        env: EnvNames.TestNets,
        networkName: NetworkNames.Xdai,
      });

      assert.strictEqual(
        xdaiTestNetSdk.state.accountAddress,
        "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f",
        "The EOA Address is not calculated correctly."
      );
    } catch (e) {
      console.log(e);
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
      console.log(e);
    }

    // Get exchange offers
    let offers;
    try {
      offers = await xdaiTestNetSdk.getExchangeOffers({
        fromTokenAddress: "0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83", // USDC Token
        toTokenAddress: ethers.letants.AddressZero, // Native Token
        fromAmount: ethers.utils.parseUnits("100000000", 6), // Exceeded Token Balance
      });
    } catch (e) {
      console.log(e);
    }

    // Estimating the batch
    try {
      await xdaiTestNetSdk.estimateGatewayBatch();

      assert.fail(
        "The Estimation is performed even if exceed the token account."
      );
    } catch (e) {
      console.log(
        e,
        "The Estimation is not happened due to exceed token account."
      );
    }
  });

  // SWAP ON XDAI NETWORK FROM ERC20 TOKEN TO THE SAME ERC20 TOKEN
  it("Setup the SDK for xDai network and perform the single chain swap action from ERC20 token to the same ERC20 token.", async () => {
    try {
      let xdaiTestNetSdk = new Sdk(process.env.PRIVATE_KEY, {
        env: EnvNames.TestNets,
        networkName: NetworkNames.Xdai,
      });

      assert.strictEqual(
        xdaiTestNetSdk.state.accountAddress,
        "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f",
        "The EOA Address is not calculated correctly."
      );
    } catch (e) {
      console.log(e);
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
      console.log(e);
    }

    // Get exchange offers
    try {
      await xdaiTestNetSdk.getExchangeOffers({
        fromTokenAddress: "0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83", // USDC Token
        toTokenAddress: "0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83", // Both are Same USDC Tokens
        fromAmount: ethers.utils.parseUnits("0.0001", 6),
      });
      assert.fail(
        "The Swap is performed, Even if the ERC20 Token addresses are equal."
      );
    } catch (e) {
      console.log(e, "The ERC20 Token addresses are not equal.");
    }
  });

  // SWAP ON XDAI NETWORK WITHOUT toTokenAddress VALUE WHILE GET THE EXCHANGE OFFERS
  it("Setup the SDK for xDai network and perform the single chain swap action without toTokenAddress value while get the exchange offers.", async () => {
    // Initialize the SDK and define network
    try {
      let xdaiTestNetSdk = new Sdk(process.env.PRIVATE_KEY, {
        env: EnvNames.TestNets,
        networkName: NetworkNames.Xdai,
      });

      assert.strictEqual(
        xdaiTestNetSdk.state.accountAddress,
        "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f",
        "The EOA Address is not calculated correctly."
      );
    } catch (e) {
      console.log(e);
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
      console.log(e);
    }

    // Get exchange offers
    try {
      await xdaiTestNetSdk.getExchangeOffers({
        fromTokenAddress: "0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83", // USDC Token
        fromAmount: ethers.utils.parseUnits("0.0001", 6),
      });
      assert.fail(
        "The Swap is performed, Even if the To Token Address is not added in the Get exchange offers."
      );
    } catch (e) {
      console.log(
        e,
        "The Get exchange offers is not performed due to The To Token Address is not added."
      );
    }
  });

  // SWAP ON XDAI NETWORK WITHOUT fromTokenAddress VALUE WHILE GET THE EXCHANGE OFFERS
  it("Setup the SDK for xDai network and perform the single chain swap action without fromTokenAddress value while get the exchange offers.", async () => {
    // Initialize the SDK and define network
    try {
      let xdaiTestNetSdk = new Sdk(process.env.PRIVATE_KEY, {
        env: EnvNames.TestNets,
        networkName: NetworkNames.Xdai,
      });

      assert.strictEqual(
        xdaiTestNetSdk.state.accountAddress,
        "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f",
        "The EOA Address is not calculated correctly."
      );
    } catch (e) {
      console.log(e);
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
      console.log(e);
    }

    // Get exchange offers
    try {
      await xdaiTestNetSdk.getExchangeOffers({
        toTokenAddress: "0x4ECaBa5870353805a9F068101A40E0f32ed605C6", // USDT Token
        fromAmount: ethers.utils.parseUnits("0.0001", 6),
      });
      assert.fail(
        "The Swap is performed, Even if the From Token Address is not added in the Get exchange offers."
      );
    } catch (e) {
      console.log(
        e,
        "The Get exchange offers is not performed due to The From Token Address is not added."
      );
    }
  });

  // SWAP ON XDAI NETWORK WITHOUT fromAmount VALUE WHILE GET THE EXCHANGE OFFERS
  it("Setup the SDK for xDai network and perform the single chain swap action without fromAmount value while get the exchange offers.", async () => {
    // Initialize the SDK and define network
    try {
      let xdaiTestNetSdk = new Sdk(process.env.PRIVATE_KEY, {
        env: EnvNames.TestNets,
        networkName: NetworkNames.Xdai,
      });

      assert.strictEqual(
        xdaiTestNetSdk.state.accountAddress,
        "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f",
        "The EOA Address is not calculated correctly."
      );
    } catch (e) {
      console.log(e);
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
      console.log(e);
    }

    // Get exchange offers
    try {
      await xdaiTestNetSdk.getExchangeOffers({
        fromTokenAddress: "0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83", // USDC Token
        toTokenAddress: "0x4ECaBa5870353805a9F068101A40E0f32ed605C6", // USDT Token
      });
      assert.fail(
        "The Swap is performed, Even if the From Amount is not added in the Get exchange offers."
      );
    } catch (e) {
      console.log(
        e,
        "The Get exchange offers is not performed due to The From Amount is not added."
      );
    }
  });

  // SWAP ON XDAI NETWORK WITH INVALID toTokenAddress VALUE WHILE GET THE EXCHANGE OFFERS
  it("Setup the SDK for xDai network and perform the single chain swap action with invalid toTokenAddress value while get the exchange offers.", async () => {
    // Initialize the SDK and define network
    try {
      let xdaiTestNetSdk = new Sdk(process.env.PRIVATE_KEY, {
        env: EnvNames.TestNets,
        networkName: NetworkNames.Xdai,
      });

      assert.strictEqual(
        xdaiTestNetSdk.state.accountAddress,
        "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f",
        "The EOA Address is not calculated correctly."
      );
    } catch (e) {
      console.log(e);
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
      console.log(e);
    }

    // Get exchange offers
    try {
      await xdaiTestNetSdk.getExchangeOffers({
        fromTokenAddress: "0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83", // USDC Token
        toTokenAddress: "0x4ECaBa5870353805a9F068101A40E0f32ed605CC", // Invalid USDT Token
        fromAmount: ethers.utils.parseUnits("0.0001", 6),
      });
      assert.fail(
        "The Swap is performed, Even if the To Token Address is not added in the Get exchange offers."
      );
    } catch (e) {
      console.log(
        e,
        "The Get exchange offers is not performed due to The To Token Address is not added."
      );
    }
  });

  // SWAP ON XDAI NETWORK WITH INVALID fromTokenAddress VALUE WHILE GET THE EXCHANGE OFFERS
  it("Setup the SDK for xDai network and perform the single chain swap action with invalid fromTokenAddress value while get the exchange offers.", async () => {
    // Initialize the SDK and define network
    try {
      let xdaiTestNetSdk = new Sdk(process.env.PRIVATE_KEY, {
        env: EnvNames.TestNets,
        networkName: NetworkNames.Xdai,
      });

      assert.strictEqual(
        xdaiTestNetSdk.state.accountAddress,
        "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f",
        "The EOA Address is not calculated correctly."
      );
    } catch (e) {
      console.log(e);
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
      console.log(e);
    }

    // Get exchange offers
    try {
      await xdaiTestNetSdk.getExchangeOffers({
        fromTokenAddress: "0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A88", // Invalid USDC Token
        toTokenAddress: "0x4ECaBa5870353805a9F068101A40E0f32ed605C6", // USDT Token
        fromAmount: ethers.utils.parseUnits("0.0001", 6),
      });
      assert.fail(
        "The Swap is performed, Even if the From Token Address is not added in the Get exchange offers."
      );
    } catch (e) {
      console.log(
        e,
        "The Get exchange offers is not performed due to The From Token Address is not added."
      );
    }
  });
});
