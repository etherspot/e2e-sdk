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

describe("The SDK, when advance route lifi flow on the MainNet", () => {
  // ADVANCE ROUTES LIFI ON XDAI NETWORK WITHOUT fromChainId VALUE IN THE QUOTE REQUEST PAYLOAD.
  it("Setup the SDK for xDai network and perform the advance route lifi action without fromChainId value in the quote request payload.", async () => {
    let xdaiMainNetSdk;
    try {
      // initialize the sdk
      xdaiMainNetSdk = new Sdk(process.env.PRIVATE_KEY, {
        env: EnvNames.MainNets,
        networkName: NetworkNames.Xdai,
      });

      assert.strictEqual(
        xdaiMainNetSdk.state.accountAddress,
        "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f",
        "The EOA Address is not calculated correctly."
      );
    } catch (e) {
      assert.fail("The SDK is not initialled successfully.");
    }

    // Compute the smart wallet address
    try {
      let smartWalletOutput = await xdaiMainNetSdk.computeContractAccount();
      let xdaiSmartWalletAddress = smartWalletOutput.address;

      assert.strictEqual(
        xdaiSmartWalletAddress,
        "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
        "The smart wallet address is not calculated correctly."
      );
    } catch (e) {
      assert.fail("The smart wallet address is not calculated successfully.");
    }

    let XdaiUSDC = "0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83"; // Xdai - USDC
    let MaticUSDC = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"; // Matic - USDC

    let toChainId = NETWORK_NAME_TO_CHAIN_ID[NetworkNames.Matic];
    let fromTokenAddress = XdaiUSDC;
    let toTokenAddress = MaticUSDC;
    let fromAmount = ethers.utils.parseUnits("0.5", 6);

    let quoteRequestPayload = {
      toChainId: toChainId,
      fromTokenAddress: fromTokenAddress,
      toTokenAddress: toTokenAddress,
      fromAmount: fromAmount,
      serviceProvider: CrossChainServiceProvider.LiFi, // Optional parameter
    };

    // Get the advance routes lifi without fromchainid value
    try {
      try {
        await xdaiMainNetSdk.getAdvanceRoutesLiFi(quoteRequestPayload);
        assert.fail(
          "The advance routes lifi is completed without fromChainId of the Get advance routes lifi."
        );
      } catch (e) {
        if (
          e.errors[0].constraints.isPositive ==
          "fromChainId must be a positive number"
        ) {
          console.log(
            "The advance routes lifi is not completed without fromChainId of the Get advance routes lifi as expected."
          );
        } else {
          assert.fail(
            "The advance routes lifi is completed without fromChainId of the Get advance routes lifi."
          );
        }
      }
    } catch (e) {
      assert.fail(
        "The advance routes lifi is completed without fromChainId of the Get advance routes lifi."
      );
    }
  });

  // ADVANCE ROUTES LIFI ON XDAI NETWORK WITHOUT toChainId VALUE IN THE QUOTE REQUEST PAYLOAD.
  it("Setup the SDK for xDai network and perform the advance route lifi action without toChainId value in the quote request payload.", async () => {
    let xdaiMainNetSdk;
    try {
      // initialize the sdk
      xdaiMainNetSdk = new Sdk(process.env.PRIVATE_KEY, {
        env: EnvNames.MainNets,
        networkName: NetworkNames.Xdai,
      });

      assert.strictEqual(
        xdaiMainNetSdk.state.accountAddress,
        "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f",
        "The EOA Address is not calculated correctly."
      );
    } catch (e) {
      assert.fail("The SDK is not initialled successfully.");
    }

    // Compute the smart wallet address
    try {
      let smartWalletOutput = await xdaiMainNetSdk.computeContractAccount();
      let xdaiSmartWalletAddress = smartWalletOutput.address;

      assert.strictEqual(
        xdaiSmartWalletAddress,
        "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
        "The smart wallet address is not calculated correctly."
      );
    } catch (e) {
      assert.fail("The smart wallet address is not calculated successfully.");
    }

    let XdaiUSDC = "0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83"; // Xdai - USDC
    let MaticUSDC = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"; // Matic - USDC

    let fromChainId = NETWORK_NAME_TO_CHAIN_ID[NetworkNames.Xdai];
    let fromTokenAddress = XdaiUSDC;
    let toTokenAddress = MaticUSDC;
    let fromAmount = ethers.utils.parseUnits("0.5", 6);

    let quoteRequestPayload = {
      fromChainId: fromChainId,
      fromTokenAddress: fromTokenAddress,
      toTokenAddress: toTokenAddress,
      fromAmount: fromAmount,
      serviceProvider: CrossChainServiceProvider.LiFi, // Optional parameter
    };

    // Get the advance routes lifi without tochainid value
    try {
      try {
        await xdaiMainNetSdk.getAdvanceRoutesLiFi(quoteRequestPayload);
        assert.fail(
          "The advance routes lifi is completed without toChainId of the Get advance routes lifi."
        );
      } catch (e) {
        if (
          e.errors[0].constraints.isPositive ==
          "toChainId must be a positive number"
        ) {
          console.log(
            "The advance routes lifi is not completed without toChainId of the Get advance routes lifi as expected."
          );
        } else {
          assert.fail(
            "The advance routes lifi is completed without toChainId of the Get advance routes lifi."
          );
        }
      }
    } catch (e) {
      assert.fail(
        "The advance routes lifi is completed without toChainId of the Get advance routes lifi."
      );
    }
  });

  // ADVANCE ROUTES LIFI ON XDAI NETWORK WITHOUT fromTokenAddress VALUE IN THE QUOTE REQUEST PAYLOAD.
  it("Setup the SDK for xDai network and perform the advance route lifi action without fromTokenAddress value in the quote request payload.", async () => {
    let xdaiMainNetSdk;
    try {
      // initialize the sdk
      xdaiMainNetSdk = new Sdk(process.env.PRIVATE_KEY, {
        env: EnvNames.MainNets,
        networkName: NetworkNames.Xdai,
      });

      assert.strictEqual(
        xdaiMainNetSdk.state.accountAddress,
        "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f",
        "The EOA Address is not calculated correctly."
      );
    } catch (e) {
      assert.fail("The SDK is not initialled successfully.");
    }

    // Compute the smart wallet address
    try {
      let smartWalletOutput = await xdaiMainNetSdk.computeContractAccount();
      let xdaiSmartWalletAddress = smartWalletOutput.address;

      assert.strictEqual(
        xdaiSmartWalletAddress,
        "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
        "The smart wallet address is not calculated correctly."
      );
    } catch (e) {
      assert.fail("The smart wallet address is not calculated successfully.");
    }

    let MaticUSDC = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"; // Matic - USDC

    let fromChainId = NETWORK_NAME_TO_CHAIN_ID[NetworkNames.Xdai];
    let toChainId = NETWORK_NAME_TO_CHAIN_ID[NetworkNames.Matic];
    let toTokenAddress = MaticUSDC;
    let fromAmount = ethers.utils.parseUnits("0.5", 6);

    let quoteRequestPayload = {
      fromChainId: fromChainId,
      toChainId: toChainId,
      toTokenAddress: toTokenAddress,
      fromAmount: fromAmount,
      serviceProvider: CrossChainServiceProvider.LiFi, // Optional parameter
    };

    // Get the advance routes lifi without fromtokenaddress value
    try {
      try {
        await xdaiMainNetSdk.getAdvanceRoutesLiFi(quoteRequestPayload);
        assert.fail(
          "The advance routes lifi is completed without fromTokenAddress of the Get advance routes lifi."
        );
      } catch (e) {
        if (
          e.errors[0].constraints.isAddress ==
          "fromTokenAddress must be an address"
        ) {
          console.log(
            "The advance routes lifi is not completed without fromTokenAddress of the Get advance routes lifi as expected."
          );
        } else {
          assert.fail(
            "The advance routes lifi is completed without fromTokenAddress of the Get advance routes lifi."
          );
        }
      }
    } catch (e) {
      assert.fail(
        "The advance routes lifi is completed without fromTokenAddress of the Get advance routes lifi."
      );
    }
  });

  // ADVANCE ROUTES LIFI ON XDAI NETWORK WITHOUT toTokenAddress VALUE IN THE QUOTE REQUEST PAYLOAD.
  it("Setup the SDK for xDai network and perform the advance route lifi action without toTokenAddress value in the quote request payload.", async () => {
    let xdaiMainNetSdk;
    try {
      // initialize the sdk
      xdaiMainNetSdk = new Sdk(process.env.PRIVATE_KEY, {
        env: EnvNames.MainNets,
        networkName: NetworkNames.Xdai,
      });

      assert.strictEqual(
        xdaiMainNetSdk.state.accountAddress,
        "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f",
        "The EOA Address is not calculated correctly."
      );
    } catch (e) {
      assert.fail("The SDK is not initialled successfully.");
    }

    // Compute the smart wallet address
    try {
      let smartWalletOutput = await xdaiMainNetSdk.computeContractAccount();
      let xdaiSmartWalletAddress = smartWalletOutput.address;

      assert.strictEqual(
        xdaiSmartWalletAddress,
        "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
        "The smart wallet address is not calculated correctly."
      );
    } catch (e) {
      assert.fail("The smart wallet address is not calculated successfully.");
    }

    let XdaiUSDC = "0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83"; // Xdai - USDC

    let fromChainId = NETWORK_NAME_TO_CHAIN_ID[NetworkNames.Xdai];
    let toChainId = NETWORK_NAME_TO_CHAIN_ID[NetworkNames.Matic];
    let fromTokenAddress = XdaiUSDC;
    let fromAmount = ethers.utils.parseUnits("0.5", 6);

    let quoteRequestPayload = {
      fromChainId: fromChainId,
      toChainId: toChainId,
      fromTokenAddress: fromTokenAddress,
      fromAmount: fromAmount,
      serviceProvider: CrossChainServiceProvider.LiFi, // Optional parameter
    };

    // Get the advance routes lifi without totokenaddress value
    try {
      try {
        await xdaiMainNetSdk.getAdvanceRoutesLiFi(quoteRequestPayload);
        assert.fail(
          "The advance routes lifi is completed without totokenaddress of the Get advance routes lifi."
        );
      } catch (e) {
        if (
          e.errors[0].constraints.isAddress ==
          "toTokenAddress must be an address"
        ) {
          console.log(
            "The advance routes lifi is not completed without totokenaddress of the Get advance routes lifi as expected."
          );
        } else {
          assert.fail(
            "The advance routes lifi is completed without totokenaddress of the Get advance routes lifi."
          );
        }
      }
    } catch (e) {
      assert.fail(
        "The advance routes lifi is completed without totokenaddress of the Get advance routes lifi."
      );
    }
  });

  // ADVANCE ROUTES LIFI ON XDAI NETWORK WITHOUT fromAmount VALUE IN THE QUOTE REQUEST PAYLOAD.
  it("Setup the SDK for xDai network and perform the advance route lifi action without fromAmount value in the quote request payload.", async () => {
    let xdaiMainNetSdk;
    try {
      // initialize the sdk
      xdaiMainNetSdk = new Sdk(process.env.PRIVATE_KEY, {
        env: EnvNames.MainNets,
        networkName: NetworkNames.Xdai,
      });

      assert.strictEqual(
        xdaiMainNetSdk.state.accountAddress,
        "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f",
        "The EOA Address is not calculated correctly."
      );
    } catch (e) {
      assert.fail("The SDK is not initialled successfully.");
    }

    // Compute the smart wallet address
    try {
      let smartWalletOutput = await xdaiMainNetSdk.computeContractAccount();
      let xdaiSmartWalletAddress = smartWalletOutput.address;

      assert.strictEqual(
        xdaiSmartWalletAddress,
        "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
        "The smart wallet address is not calculated correctly."
      );
    } catch (e) {
      assert.fail("The smart wallet address is not calculated successfully.");
    }

    let XdaiUSDC = "0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83"; // Xdai - USDC
    let MaticUSDC = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"; // Matic - USDC

    let fromChainId = NETWORK_NAME_TO_CHAIN_ID[NetworkNames.Xdai];
    let toChainId = NETWORK_NAME_TO_CHAIN_ID[NetworkNames.Matic];
    let fromTokenAddress = XdaiUSDC;
    let toTokenAddress = MaticUSDC;

    let quoteRequestPayload = {
      fromChainId: fromChainId,
      toChainId: toChainId,
      fromTokenAddress: fromTokenAddress,
      toTokenAddress: toTokenAddress,
      serviceProvider: CrossChainServiceProvider.LiFi, // Optional parameter
    };

    // Get the advance routes lifi without fromamount value
    try {
      try {
        await xdaiMainNetSdk.getAdvanceRoutesLiFi(quoteRequestPayload);
        assert.fail(
          "The advance routes lifi is completed without fromamount of the Get advance routes lifi."
        );
      } catch (e) {
        if (
          e.errors[0].constraints.IsBigNumberish ==
          "fromAmount must be big numberish"
        ) {
          console.log(
            "The advance routes lifi is not completed without fromamount of the Get advance routes lifi as expected."
          );
        } else {
          assert.fail(
            "The advance routes lifi is completed without fromamount of the Get advance routes lifi."
          );
        }
      }
    } catch (e) {
      assert.fail(
        "The advance routes lifi is completed without fromamount of the Get advance routes lifi."
      );
    }
  });

  // ADVANCE ROUTES LIFI ON XDAI NETWORK FROM NATIVE TOKEN TO ANOTHER CHAIN'S ERC20 TOKEN IN THE QUOTE REQUEST PAYLOAD.
  it("Setup the SDK for xDai network and perform the advance route lifi action from native token to another chain's ERC20 token in the quote request payload.", async () => {
    let xdaiMainNetSdk;
    try {
      // initialize the sdk
      xdaiMainNetSdk = new Sdk(process.env.PRIVATE_KEY, {
        env: EnvNames.MainNets,
        networkName: NetworkNames.Xdai,
      });

      assert.strictEqual(
        xdaiMainNetSdk.state.accountAddress,
        "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f",
        "The EOA Address is not calculated correctly."
      );
    } catch (e) {
      assert.fail("The SDK is not initialled successfully.");
    }

    // Compute the smart wallet address
    try {
      let smartWalletOutput = await xdaiMainNetSdk.computeContractAccount();
      let xdaiSmartWalletAddress = smartWalletOutput.address;

      assert.strictEqual(
        xdaiSmartWalletAddress,
        "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
        "The smart wallet address is not calculated correctly."
      );
    } catch (e) {
      assert.fail("The smart wallet address is not calculated successfully.");
    }

    let MaticUSDC = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"; // Matic - USDC

    let fromChainId = NETWORK_NAME_TO_CHAIN_ID[NetworkNames.Xdai];
    let toChainId = NETWORK_NAME_TO_CHAIN_ID[NetworkNames.Matic];
    let fromTokenAddress = ethers.constants.AddressZero; // xDai - Native Token
    let toTokenAddress = MaticUSDC;
    let fromAmount = ethers.utils.parseUnits("0.5", 6);

    let quoteRequestPayload = {
      fromChainId: fromChainId,
      toChainId: toChainId,
      fromTokenAddress: fromTokenAddress,
      toTokenAddress: toTokenAddress,
      fromAmount: fromAmount,
      serviceProvider: CrossChainServiceProvider.LiFi, // Optional parameter
    };

    // Get the advance routes lifi
    try {
      let advanceRoutesLiFi = await xdaiMainNetSdk.getAdvanceRoutesLiFi(
        quoteRequestPayload
      );

      if (advanceRoutesLiFi.items.length == 0) {
        console.log(
          "The items are not displayed in the get advance Routes LiFi response as expected."
        );
      } else {
        assert.fail(
          "The items are displayed in the get advance Routes LiFi response when perform the advance route lifi action from native token to another chain's ERC20 token."
        );
      }
    } catch (e) {
      assert.fail(
        "The items are displayed in the get advance Routes LiFi response when perform the advance route lifi action from native token to another chain's ERC20 token."
      );
    }
  });

  // ADVANCE ROUTES LIFI ON XDAI NETWORK FROM ERC20 TOKEN TO ANOTHER CHAIN'S NATIVE TOKEN IN THE QUOTE REQUEST PAYLOAD.
  it("Setup the SDK for xDai network and perform the advance route lifi action from ERC20 token to another chain's native token in the quote request payload.", async () => {
    let xdaiMainNetSdk;
    try {
      // initialize the sdk
      xdaiMainNetSdk = new Sdk(process.env.PRIVATE_KEY, {
        env: EnvNames.MainNets,
        networkName: NetworkNames.Xdai,
      });

      assert.strictEqual(
        xdaiMainNetSdk.state.accountAddress,
        "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f",
        "The EOA Address is not calculated correctly."
      );
    } catch (e) {
      assert.fail("The SDK is not initialled successfully.");
    }

    // Compute the smart wallet address
    try {
      let smartWalletOutput = await xdaiMainNetSdk.computeContractAccount();
      let xdaiSmartWalletAddress = smartWalletOutput.address;

      assert.strictEqual(
        xdaiSmartWalletAddress,
        "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
        "The smart wallet address is not calculated correctly."
      );
    } catch (e) {
      assert.fail("The smart wallet address is not calculated successfully.");
    }

    let XdaiUSDC = "0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83"; // Xdai - USDC

    let fromChainId = NETWORK_NAME_TO_CHAIN_ID[NetworkNames.Xdai];
    let toChainId = NETWORK_NAME_TO_CHAIN_ID[NetworkNames.Matic];
    let fromTokenAddress = XdaiUSDC;
    let toTokenAddress = ethers.constants.AddressZero; // Matic - Native Token
    let fromAmount = ethers.utils.parseUnits("0.5", 6);

    let quoteRequestPayload = {
      fromChainId: fromChainId,
      toChainId: toChainId,
      fromTokenAddress: fromTokenAddress,
      toTokenAddress: toTokenAddress,
      fromAmount: fromAmount,
      serviceProvider: CrossChainServiceProvider.LiFi, // Optional parameter
    };

    // Get the advance routes lifi
    try {
      let advanceRoutesLiFi = await xdaiMainNetSdk.getAdvanceRoutesLiFi(
        quoteRequestPayload
      );

      if (advanceRoutesLiFi.items.length == 0) {
        console.log(
          "The items are not displayed in the get advance Routes LiFi response as expected."
        );
      } else {
        assert.fail(
          "The items are displayed in the get advance Routes LiFi response when perform the advance route lifi action from ERC20 token to another chain's native token."
        );
      }
    } catch (e) {
      assert.fail(
        "The items are displayed in the get advance Routes LiFi response when perform the advance route lifi action from ERC20 token to another chain's native token."
      );
    }
  });

  // ADVANCE ROUTES LIFI ON XDAI NETWORK WITH THE SAME ERC20 TOKENS IN THE QUOTE REQUEST PAYLOAD.
  it("Setup the SDK for xDai network and perform the advance route lifi action with the same ERC20 tokens in the quote request payload.", async () => {
    let xdaiMainNetSdk;
    try {
      // initialize the sdk
      xdaiMainNetSdk = new Sdk(process.env.PRIVATE_KEY, {
        env: EnvNames.MainNets,
        networkName: NetworkNames.Xdai,
      });

      assert.strictEqual(
        xdaiMainNetSdk.state.accountAddress,
        "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f",
        "The EOA Address is not calculated correctly."
      );
    } catch (e) {
      assert.fail("The SDK is not initialled successfully.");
    }

    // Compute the smart wallet address
    try {
      let smartWalletOutput = await xdaiMainNetSdk.computeContractAccount();
      let xdaiSmartWalletAddress = smartWalletOutput.address;

      assert.strictEqual(
        xdaiSmartWalletAddress,
        "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
        "The smart wallet address is not calculated correctly."
      );
    } catch (e) {
      assert.fail("The smart wallet address is not calculated successfully.");
    }

    let XdaiUSDC = "0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83"; // Xdai - USDC

    let fromChainId = NETWORK_NAME_TO_CHAIN_ID[NetworkNames.Xdai];
    let toChainId = NETWORK_NAME_TO_CHAIN_ID[NetworkNames.Matic];
    let fromTokenAddress = XdaiUSDC; // xDai - USDC
    let toTokenAddress = XdaiUSDC; // xDai - USDC
    let fromAmount = ethers.utils.parseUnits("0.5", 6);

    let quoteRequestPayload = {
      fromChainId: fromChainId,
      toChainId: toChainId,
      fromTokenAddress: fromTokenAddress,
      toTokenAddress: toTokenAddress,
      fromAmount: fromAmount,
      serviceProvider: CrossChainServiceProvider.LiFi, // Optional parameter
    };

    // Get the advance routes lifi
    try {
      let advanceRoutesLiFi = await xdaiMainNetSdk.getAdvanceRoutesLiFi(
        quoteRequestPayload
      );

      if (advanceRoutesLiFi.items.length == 0) {
        console.log(
          "The items are not displayed in the get advance Routes LiFi response as expected."
        );
      } else {
        assert.fail(
          "The items are displayed in the get advance Routes LiFi response when perform the advance route lifi action with the same ERC20 tokens."
        );
      }
    } catch (e) {
      assert.fail(
        "The items are displayed in the get advance Routes LiFi response when perform the advance route lifi action with the same ERC20 tokens."
      );
    }
  });

  // ADVANCE ROUTES LIFI ON XDAI NETWORK WITH EXCEEDED TOKEN BALANCE IN THE QUOTE REQUEST PAYLOAD.
  it("Setup the SDK for xDai network and perform the advance route lifi action with exceeded token balance in the quote request payload.", async () => {
    let xdaiMainNetSdk;
    try {
      // initialize the sdk
      xdaiMainNetSdk = new Sdk(process.env.PRIVATE_KEY, {
        env: EnvNames.MainNets,
        networkName: NetworkNames.Xdai,
      });

      assert.strictEqual(
        xdaiMainNetSdk.state.accountAddress,
        "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f",
        "The EOA Address is not calculated correctly."
      );
    } catch (e) {
      assert.fail("The SDK is not initialled successfully.");
    }

    // Compute the smart wallet address
    try {
      let smartWalletOutput = await xdaiMainNetSdk.computeContractAccount();
      let xdaiSmartWalletAddress = smartWalletOutput.address;

      assert.strictEqual(
        xdaiSmartWalletAddress,
        "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
        "The smart wallet address is not calculated correctly."
      );
    } catch (e) {
      assert.fail("The smart wallet address is not calculated successfully.");
    }

    let XdaiUSDC = "0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83"; // Xdai - USDC
    let MaticUSDC = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"; // Matic - USDC

    let fromChainId = NETWORK_NAME_TO_CHAIN_ID[NetworkNames.Xdai];
    let toChainId = NETWORK_NAME_TO_CHAIN_ID[NetworkNames.Matic];
    let fromTokenAddress = XdaiUSDC;
    let toTokenAddress = MaticUSDC;
    let fromAmount = ethers.utils.parseUnits("1000", 6); // Exceeded Token Balance

    let quoteRequestPayload = {
      fromChainId: fromChainId,
      toChainId: toChainId,
      fromTokenAddress: fromTokenAddress,
      toTokenAddress: toTokenAddress,
      fromAmount: fromAmount,
      serviceProvider: CrossChainServiceProvider.LiFi, // Optional parameter
    };

    // Get the advance routes lifi
    let advanceRoutesLiFi;
    try {
      advanceRoutesLiFi = await xdaiMainNetSdk.getAdvanceRoutesLiFi(
        quoteRequestPayload
      );

      if (advanceRoutesLiFi.items.length > 0) {
        // Select the first advance route lifi
        let advanceRouteLiFi = advanceRoutesLiFi.items[0];
        let transactions = await xdaiMainNetSdk.getStepTransaction({
          route: advanceRouteLiFi,
        });

        for (let transaction of transactions.items) {
          // Batch the approval transaction
          await xdaiMainNetSdk.batchExecuteAccountTransaction({
            to: transaction.to,
            data: transaction.data,
            value: transaction.value,
          });
        }
      }
    } catch (e) {
      assert.fail(
        "An error is dipslayed in the getAdvanceRoutesLiFi response."
      );
    }

    // Estimating the batch
    try {
      try {
        await xdaiMainNetSdk.estimateGatewayBatch();
      } catch (e) {
        if (e.errors[0].constraints.reverted == "Transaction reverted") {
          console.log(
            "The validation for exceeded Value is displayed as expected while the batch execution."
          );
        } else {
          assert.fail(
            "The expected validation is not displayed when entered the exceeded Value while performing batch execution."
          );
        }
      }
    } catch (e) {
      assert.fail(
        "The expected validation is not displayed when entered the exceeded Value while performing batch execution."
      );
    }
  });

  // ADVANCE ROUTES LIFI ON XDAI NETWORK WITH LOW TOKEN BALANCE IN THE QUOTE REQUEST PAYLOAD
  it("Setup the SDK for xDai network and perform the advance route lifi action with low token balance in the quote request payload.", async () => {
    let xdaiMainNetSdk;
    try {
      // initialize the sdk
      xdaiMainNetSdk = new Sdk(process.env.PRIVATE_KEY, {
        env: EnvNames.MainNets,
        networkName: NetworkNames.Xdai,
      });

      assert.strictEqual(
        xdaiMainNetSdk.state.accountAddress,
        "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f",
        "The EOA Address is not calculated correctly."
      );
    } catch (e) {
      assert.fail("The SDK is not initialled successfully.");
    }

    // Compute the smart wallet address
    try {
      let smartWalletOutput = await xdaiMainNetSdk.computeContractAccount();
      let xdaiSmartWalletAddress = smartWalletOutput.address;

      assert.strictEqual(
        xdaiSmartWalletAddress,
        "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
        "The smart wallet address is not calculated correctly."
      );
    } catch (e) {
      assert.fail("The smart wallet address is not calculated successfully.");
    }

    let XdaiUSDC = "0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83"; // Xdai - USDC
    let MaticUSDC = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"; // Matic - USDC

    let fromChainId = NETWORK_NAME_TO_CHAIN_ID[NetworkNames.Xdai];
    let toChainId = NETWORK_NAME_TO_CHAIN_ID[NetworkNames.Matic];
    let fromTokenAddress = XdaiUSDC;
    let toTokenAddress = MaticUSDC;
    let fromAmount = ethers.utils.parseUnits("0.00001", 6); // Low Token Balance

    let quoteRequestPayload = {
      fromChainId: fromChainId,
      toChainId: toChainId,
      fromTokenAddress: fromTokenAddress,
      toTokenAddress: toTokenAddress,
      fromAmount: fromAmount,
      serviceProvider: CrossChainServiceProvider.LiFi, // Optional parameter
    };

    // Get the advance routes lifi
    let advanceRoutesLiFi;
    try {
      advanceRoutesLiFi = await xdaiMainNetSdk.getAdvanceRoutesLiFi(
        quoteRequestPayload
      );

      if (advanceRoutesLiFi.items.length > 0) {
        // Select the first advance route lifi
        let advanceRouteLiFi = advanceRoutesLiFi.items[0];
        let transactions = await xdaiMainNetSdk.getStepTransaction({
          route: advanceRouteLiFi,
        });

        for (let transaction of transactions.items) {
          // Batch the approval transaction
          await xdaiMainNetSdk.batchExecuteAccountTransaction({
            to: transaction.to,
            data: transaction.data,
            value: transaction.value,
          });
        }
      }
    } catch (e) {
      assert.fail(
        "An error is dipslayed in the getAdvanceRoutesLiFi response."
      );
    }

    // Estimating the batch
    try {
      try {
        await xdaiMainNetSdk.estimateGatewayBatch();

        assert.fail(
          "The estimation is performed even if the token balance is low."
        );
      } catch (e) {
        if (e.message == "Can not estimate empty batch") {
          console.log(
            "The estimation is not performed with low token balance as expected."
          );
        } else {
          assert.fail("The estimation is performed with low token balance.");
        }
      }
    } catch (e) {
      assert.fail("The estimation is performed with low token balance.");
    }
  });

  // ADVANCE ROUTES LIFI ON XDAI NETWORK WITHOUT ESTIMATION OF THE BATCH
  it("Setup the SDK for xDai network and perform the advance route lifi action without estimation of the batch.", async () => {
    let xdaiMainNetSdk;
    try {
      // initialize the sdk
      xdaiMainNetSdk = new Sdk(process.env.PRIVATE_KEY, {
        env: EnvNames.MainNets,
        networkName: NetworkNames.Xdai,
      });

      assert.strictEqual(
        xdaiMainNetSdk.state.accountAddress,
        "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f",
        "The EOA Address is not calculated correctly."
      );
    } catch (e) {
      assert.fail("The SDK is not initialled successfully.");
    }

    // Compute the smart wallet address
    try {
      let smartWalletOutput = await xdaiMainNetSdk.computeContractAccount();
      let xdaiSmartWalletAddress = smartWalletOutput.address;

      assert.strictEqual(
        xdaiSmartWalletAddress,
        "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
        "The smart wallet address is not calculated correctly."
      );
    } catch (e) {
      assert.fail("The smart wallet address is not calculated successfully.");
    }

    let XdaiUSDC = "0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83"; // Xdai - USDC
    let MaticUSDC = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"; // Matic - USDC

    let fromChainId = NETWORK_NAME_TO_CHAIN_ID[NetworkNames.Xdai];
    let toChainId = NETWORK_NAME_TO_CHAIN_ID[NetworkNames.Matic];
    let fromTokenAddress = XdaiUSDC;
    let toTokenAddress = MaticUSDC;
    let fromAmount = ethers.utils.parseUnits("1", 6);

    let quoteRequestPayload = {
      fromChainId: fromChainId,
      toChainId: toChainId,
      fromTokenAddress: fromTokenAddress,
      toTokenAddress: toTokenAddress,
      fromAmount: fromAmount,
      serviceProvider: CrossChainServiceProvider.LiFi, // Optional parameter
    };

    // Get the advance routes lifi
    let advanceRoutesLiFi;
    try {
      advanceRoutesLiFi = await xdaiMainNetSdk.getAdvanceRoutesLiFi(
        quoteRequestPayload
      );

      if (advanceRoutesLiFi.items.length > 0) {
        // Select the first advance route lifi
        let advanceRouteLiFi = advanceRoutesLiFi.items[0];
        let transactions = await xdaiMainNetSdk.getStepTransaction({
          route: advanceRouteLiFi,
        });

        for (let transaction of transactions.items) {
          // Batch the approval transaction
          await xdaiMainNetSdk.batchExecuteAccountTransaction({
            to: transaction.to,
            data: transaction.data,
            value: transaction.value,
          });
        }
      }
    } catch (e) {
      assert.fail(
        "An error is dipslayed in the getAdvanceRoutesLiFi response."
      );
    }

    // Submitting the batch
    try {
      try {
        await xdaiMainNetSdk.submitGatewayBatch({
          guarded: false,
        });
        assert.fail(
          "Status of the batch is submitted without Estimation of batch."
        );
      } catch (e) {
        if (e.message == "Can not submit not estimated batch") {
          console.log(
            "The validation is displayed when submiting the batch without estimation."
          );
        } else {
          assert.fail(
            "The submition of batch is completed without estimation."
          );
        }
      }
    } catch (e) {
      assert.fail("The submition of batch is completed without estimation.");
    }
  });
});