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

describe("The SDK, when cross chain quote flow on the TestNet", () => {
  // CROSS CHAIN QUOTES ON XDAI NETWORK WITHOUT fromChainId VALUE IN THE QUOTE REQUEST PAYLOAD.
  it("Setup the SDK for xDai network and perform the cross chain quote action without fromChainId value in the quote request payload.", async () => {
    try {
      // initialize the sdk
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
      serviceProvider: CrossChainServiceProvider.SocketV2, // Optional parameter
    };

    // Get the cross chain quotes without fromchainid value
    try {
      await xdaiTestNetSdk.getCrossChainQuotes(quoteRequestPayload);
      assert.fail(
        "The Cross Chain Quote is completed without fromChainId parameter."
      );
    } catch (e) {
      console.log(
        e,
        "The Cross Chain Quote is not completed without fromChainId parameter as expected."
      );
    }
  });

  // CROSS CHAIN QUOTES ON XDAI NETWORK WITHOUT toChainId VALUE IN THE QUOTE REQUEST PAYLOAD.
  it("Setup the SDK for xDai network and perform the cross chain quote action without toChainId value in the quote request payload.", async () => {
    try {
      // initialize the sdk
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
      serviceProvider: CrossChainServiceProvider.SocketV2, // Optional parameter
    };

    // Get the cross chain quotes without tochainid value
    try {
      await xdaiTestNetSdk.getCrossChainQuotes(quoteRequestPayload);
      assert.fail(
        "The Cross Chain Quote is completed without toChainId parameter."
      );
    } catch (e) {
      console.log(
        e,
        "The Cross Chain Quote is not completed without toChainId parameter as expected."
      );
    }
  });

  // CROSS CHAIN QUOTES ON XDAI NETWORK WITHOUT fromTokenAddress VALUE IN THE QUOTE REQUEST PAYLOAD.
  it("Setup the SDK for xDai network and perform the cross chain quote action without fromTokenAddress value in the quote request payload.", async () => {
    try {
      // initialize the sdk
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
      serviceProvider: CrossChainServiceProvider.SocketV2, // Optional parameter
    };

    // Get the cross chain quotes without fromtokenaddress value
    try {
      await xdaiTestNetSdk.getCrossChainQuotes(quoteRequestPayload);
      assert.fail(
        "The Cross Chain Quote is completed without fromTokenAddress parameter."
      );
    } catch (e) {
      console.log(
        e,
        "The Cross Chain Quote is not completed without fromTokenAddress parameter as expected."
      );
    }
  });

  // CROSS CHAIN QUOTES ON XDAI NETWORK WITHOUT toTokenAddress VALUE IN THE QUOTE REQUEST PAYLOAD.
  it("Setup the SDK for xDai network and perform the cross chain quote action without toTokenAddress value in the quote request payload.", async () => {
    try {
      // initialize the sdk
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
      serviceProvider: CrossChainServiceProvider.SocketV2, // Optional parameter
    };

    // Get the cross chain quotes without totokenaddress value
    try {
      await xdaiTestNetSdk.getCrossChainQuotes(quoteRequestPayload);
      assert.fail(
        "The Cross Chain Quote is completed without toTokenAddress parameter."
      );
    } catch (e) {
      console.log(
        e,
        "The Cross Chain Quote is not completed without toTokenAddress parameter as expected."
      );
    }
  });

  // CROSS CHAIN QUOTES ON XDAI NETWORK WITHOUT fromAmount VALUE IN THE QUOTE REQUEST PAYLOAD.
  it("Setup the SDK for xDai network and perform the cross chain quote action without fromAmount value in the quote request payload.", async () => {
    try {
      // initialize the sdk
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
      serviceProvider: CrossChainServiceProvider.SocketV2, // Optional parameter
    };

    // Get the cross chain quotes without fromamount value
    try {
      await xdaiTestNetSdk.getCrossChainQuotes(quoteRequestPayload);
      assert.fail(
        "The Cross Chain Quote is completed without fromAmount parameter."
      );
    } catch (e) {
      console.log(
        e,
        "The Cross Chain Quote is not completed without fromAmount parameter as expected."
      );
    }
  });

  // CROSS CHAIN QUOTES ON XDAI NETWORK FROM NATIVE TOKEN TO ANOTHER CHAIN'S ERC20 TOKEN IN THE QUOTE REQUEST PAYLOAD.
  it("Setup the SDK for xDai network and perform the cross chain quote action from native token to another chain's ERC20 token in the quote request payload.", async () => {
    try {
      // initialize the sdk
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

    let MaticUSDC = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"; // Matic - USDC

    let fromChainId = NETWORK_NAME_TO_CHAIN_ID[NetworkNames.Xdai];
    let toChainId = NETWORK_NAME_TO_CHAIN_ID[NetworkNames.Matic];
    let fromTokenAddress = ethers.letants.AddressZero; // xDai - Native Token
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

    // Get the cross chain quotes
    try {
      let quotes = await xdaiTestNetSdk.getCrossChainQuotes(
        quoteRequestPayload
      );

      if (quotes.items.length == 0) {
        console.log(
          "The items are not displayed in the quotes response as expected."
        );
      } else {
        assert.fail(
          "The items are displayed in the quotes response when perform the cross chain quote action from native token to another chain's ERC20 token."
        );
      }
    } catch (e) {
      console.log(e);
    }
  });

  // CROSS CHAIN QUOTES ON XDAI NETWORK FROM ERC20 TOKEN TO ANOTHER CHAIN'S NATIVE TOKEN IN THE QUOTE REQUEST PAYLOAD.
  it("Setup the SDK for xDai network and perform the cross chain quote action from ERC20 token to another chain's native token in the quote request payload.", async () => {
    try {
      // initialize the sdk
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

    let XdaiUSDC = "0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83"; // Xdai - USDC

    let fromChainId = NETWORK_NAME_TO_CHAIN_ID[NetworkNames.Xdai];
    let toChainId = NETWORK_NAME_TO_CHAIN_ID[NetworkNames.Matic];
    let fromTokenAddress = XdaiUSDC;
    let toTokenAddress = ethers.letants.AddressZero; // Matic - Native Token
    let fromAmount = ethers.utils.parseUnits("0.5", 6);

    let quoteRequestPayload = {
      fromChainId: fromChainId,
      toChainId: toChainId,
      fromTokenAddress: fromTokenAddress,
      toTokenAddress: toTokenAddress,
      fromAmount: fromAmount,
      serviceProvider: CrossChainServiceProvider.SocketV2, // Optional parameter
    };

    // Get the cross chain quotes
    try {
      let quotes = await xdaiTestNetSdk.getCrossChainQuotes(
        quoteRequestPayload
      );

      if (quotes.items.length == 0) {
        console.log(
          "The items are not displayed in the quotes response as expected."
        );
      } else {
        assert.fail(
          "The items are displayed in the quotes response when perform the cross chain quote action from ERC20 token to another chain's native token."
        );
      }
    } catch (e) {
      console.log(e);
    }
  });

  // CROSS CHAIN QUOTES ON XDAI NETWORK WITH THE SAME ERC20 TOKENS IN THE QUOTE REQUEST PAYLOAD.
  it("Setup the SDK for xDai network and perform the cross chain quote action with the same ERC20 tokens in the quote request payload.", async () => {
    try {
      // initialize the sdk
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
      serviceProvider: CrossChainServiceProvider.SocketV2, // Optional parameter
    };

    // Get the cross chain quotes
    try {
      let quotes = await xdaiTestNetSdk.getCrossChainQuotes(
        quoteRequestPayload
      );

      if (quotes.items.length == 0) {
        console.log(
          "The items are not displayed in the quotes response as expected."
        );
      } else {
        assert.fail(
          "The items are displayed in the quotes response when perform the cross chain quote action with the same ERC20 tokens."
        );
      }
    } catch (e) {
      console.log(e);
    }
  });

  // CROSS CHAIN QUOTES ON XDAI NETWORK WITH EXCEEDED TOKEN BALANCE IN THE QUOTE REQUEST PAYLOAD.
  it("Setup the SDK for xDai network and perform the cross chain quote action with exceeded token balance in the quote request payload.", async () => {
    try {
      // initialize the sdk
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
      serviceProvider: CrossChainServiceProvider.SocketV2, // Optional parameter
    };

    // Get the cross chain quotes
    let quotes;
    try {
      quotes = await xdaiTestNetSdk.getCrossChainQuotes(quoteRequestPayload);

      if (quotes.items.length > 0) {
        // Select the first quote
        let quote = quotes.items[0];

        let tokenAddres = quote.estimate.data.fromToken.address;
        let approvalAddress = quote.approvalData.approvalAddress;
        let amount = quote.approvalData.amount;

        // Build the approval transaction request
        let { ContractNames, getContractAbi } = pkg;
        let abi = getContractAbi(ContractNames.ERC20Token);
        let erc20Contract = xdaiTestNetSdk.registerContract(
          "erc20Contract",
          abi,
          tokenAddres
        );
        let approvalTransactionRequest = erc20Contract.encodeApprove(
          approvalAddress,
          amount
        );

        // Batch the approval transaction
        await xdaiTestNetSdk.batchExecuteAccountTransaction({
          to: approvalTransactionRequest.to,
          data: approvalTransactionRequest.data,
          value: approvalTransactionRequest.value,
        });

        // Batch the cross chain transaction
        let { to, value, data } = quote.transaction;
        batchCrossChainTransaction =
          await xdaiTestNetSdk.batchExecuteAccountTransaction({
            to,
            data: data,
            value,
          });
      }
    } catch (e) {
      console.log(e);
    }

    // Estimating the batch
    try {
      await xdaiTestNetSdk.estimateGatewayBatch();

      assert.fail(
        "The estimation is performed even if the token balance is exceed."
      );
    } catch (e) {
      console.log(
        e,
        "The estimation is not performed as expected when the token balance is exceed."
      );
    }
  });

  // CROSS CHAIN QUOTES ON XDAI NETWORK WITH LOW TOKEN BALANCE IN THE QUOTE REQUEST PAYLOAD
  it("Setup the SDK for xDai network and perform the cross chain quote action with low token balance in the quote request payload.", async () => {
    try {
      // initialize the sdk
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
      serviceProvider: CrossChainServiceProvider.SocketV2, // Optional parameter
    };

    // Get the cross chain quotes
    let quotes;
    try {
      quotes = await xdaiTestNetSdk.getCrossChainQuotes(quoteRequestPayload);

      if (quotes.items.length > 0) {
        // Select the first quote
        let quote = quotes.items[0];

        let tokenAddres = quote.estimate.data.fromToken.address;
        let approvalAddress = quote.approvalData.approvalAddress;
        let amount = quote.approvalData.amount;

        // Build the approval transaction request
        let { ContractNames, getContractAbi } = pkg;
        let abi = getContractAbi(ContractNames.ERC20Token);
        let erc20Contract = xdaiTestNetSdk.registerContract(
          "erc20Contract",
          abi,
          tokenAddres
        );
        let approvalTransactionRequest = erc20Contract.encodeApprove(
          approvalAddress,
          amount
        );

        // Batch the approval transaction
        await xdaiTestNetSdk.batchExecuteAccountTransaction({
          to: approvalTransactionRequest.to,
          data: approvalTransactionRequest.data,
          value: approvalTransactionRequest.value,
        });

        // Batch the cross chain transaction
        let { to, value, data } = quote.transaction;
        batchCrossChainTransaction =
          await xdaiTestNetSdk.batchExecuteAccountTransaction({
            to,
            data: data,
            value,
          });
      }
    } catch (e) {
      console.log(e);
    }

    // Estimating the batch
    try {
      await xdaiTestNetSdk.estimateGatewayBatch();

      assert.fail(
        "The estimation is performed even if the token balance is low."
      );
    } catch (e) {
      console.log(
        e,
        "The estimation is not performed as expected when the token balance is low."
      );
    }
  });

  // CROSS CHAIN QUOTES ON XDAI NETWORK WITHOUT ESTIMATION OF THE BATCH
  it("Setup the SDK for xDai network and perform the cross chain quote action without estimation of the batch.", async () => {
    try {
      // initialize the sdk
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
      serviceProvider: CrossChainServiceProvider.SocketV2, // Optional parameter
    };

    // Get the cross chain quotes
    let quotes;
    try {
      quotes = await xdaiTestNetSdk.getCrossChainQuotes(quoteRequestPayload);

      if (quotes.items.length > 0) {
        // Select the first quote
        let quote = quotes.items[0];

        let tokenAddres = quote.estimate.data.fromToken.address;
        let approvalAddress = quote.approvalData.approvalAddress;
        let amount = quote.approvalData.amount;

        // Build the approval transaction request
        let { ContractNames, getContractAbi } = pkg;
        let abi = getContractAbi(ContractNames.ERC20Token);
        let erc20Contract = xdaiTestNetSdk.registerContract(
          "erc20Contract",
          abi,
          tokenAddres
        );
        let approvalTransactionRequest = erc20Contract.encodeApprove(
          approvalAddress,
          amount
        );

        // Batch the approval transaction
        await xdaiTestNetSdk.batchExecuteAccountTransaction({
          to: approvalTransactionRequest.to,
          data: approvalTransactionRequest.data,
          value: approvalTransactionRequest.value,
        });

        // Batch the cross chain transaction
        let { to, value, data } = quote.transaction;
        batchCrossChainTransaction =
          await xdaiTestNetSdk.batchExecuteAccountTransaction({
            to,
            data: data,
            value,
          });
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

  // CROSS CHAIN QUOTES ON XDAI NETWORK WITH INVALID TOKENADDRESS OF THE APPROVAL TRANSACTION REQUEST
  it("Setup the SDK for xDai network and perform the cross chain quote action with invalid tokenAddress of the approval transaction request.", async () => {
    try {
      // initialize the sdk
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

    // Get the cross chain quotes
    let quotes;
    try {
      quotes = await xdaiTestNetSdk.getCrossChainQuotes(quoteRequestPayload);

      if (quotes.items.length > 0) {
        // Select the first quote
        let quote = quotes.items[0];

        let tokenAddres = "0xAC313d7491910516E06FBfC2A0b5BB49bb072D92"; // Invalid token address
        let approvalAddress = quote.approvalData.approvalAddress;
        let amount = quote.approvalData.amount;

        // Build the approval transaction request
        let { ContractNames, getContractAbi } = pkg;
        let abi = getContractAbi(ContractNames.ERC20Token);
        let erc20Contract = xdaiTestNetSdk.registerContract(
          "erc20Contract",
          abi,
          tokenAddres
        );
        let approvalTransactionRequest = erc20Contract.encodeApprove(
          approvalAddress,
          amount
        );

        // Batch the approval transaction with invalid tokenAddress in the selected quote request
        try {
          await xdaiTestNetSdk.batchExecuteAccountTransaction({
            to: approvalTransactionRequest.to,
            data: approvalTransactionRequest.data,
            value: approvalTransactionRequest.value,
          });

          assert.fail(
            "The batch executed the account transaction with invalid tokenAddress of the approval transaction request."
          );
        } catch (e) {
          e,
            console.log(
              "The batch is not executed the account transaction with invalid tokenAddress of the approval transaction request."
            );
        }
      }
    } catch (e) {
      console.log(e);
    }
  });

  // CROSS CHAIN QUOTES ON XDAI NETWORK WITH INVALID APPROVALADDRESS OF THE APPROVAL TRANSACTION REQUEST
  it("Setup the SDK for xDai network and perform the cross chain quote action with invalid approvalAddress of the approval transaction request.", async () => {
    try {
      // initialize the sdk
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

    let XdaiUSDC = "0x4ECaBa5870353805a9F068101A40E0f32ed605C6"; // Xdai - USDC
    let MaticUSDC = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"; // Matic - USDC

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

    // Get the cross chain quotes
    let quotes;
    try {
      quotes = await xdaiTestNetSdk.getCrossChainQuotes(quoteRequestPayload);

      if (quotes.items.length > 0) {
        // Select the first quote
        let quote = quotes.items[0];

        let tokenAddres = quote.estimate.data.fromToken.address;
        let approvalAddress = "0xAC313d7491910516E06FBfC2A0b5BB49bb072D9z"; // Invalid Approval Address
        let amount = quote.approvalData.amount;

        // Build the approval transaction request
        let { ContractNames, getContractAbi } = pkg;
        let abi = getContractAbi(ContractNames.ERC20Token);
        let erc20Contract = xdaiTestNetSdk.registerContract(
          "erc20Contract",
          abi,
          tokenAddres
        );
        let approvalTransactionRequest = erc20Contract.encodeApprove(
          approvalAddress,
          amount
        );

        // Batch the approval transaction
        await xdaiTestNetSdk.batchExecuteAccountTransaction({
          to: approvalTransactionRequest.to,
          data: approvalTransactionRequest.data,
          value: approvalTransactionRequest.value,
        });

        // Batch the cross chain transaction
        let { to, value, data } = quote.transaction;
        batchCrossChainTransaction =
          await xdaiTestNetSdk.batchExecuteAccountTransaction({
            to,
            data: data,
            value,
          });
      }
    } catch (e) {
      console.log(e);
    }

    // Estimating the batch
    try {
      await xdaiTestNetSdk.estimateGatewayBatch();
      assert.fail(
        "The batch executed the account transaction with invalid approvalAddress of the approval transaction request."
      );
    } catch (e) {
      e,
        console.log(
          "The batch is not executed the account transaction with invalid approvalAddress of the approval transaction request."
        );
    }
  });

  // CROSS CHAIN QUOTES ON XDAI NETWORK WITH INVALID AMOUNT OF THE APPROVAL TRANSACTION REQUEST
  it("Setup the SDK for xDai network and perform the cross chain quote action with invalid amount of the approval transaction request.", async () => {
    try {
      // initialize the sdk
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

    let XdaiUSDC = "0x4ECaBa5870353805a9F068101A40E0f32ed605C6"; // Xdai - USDC
    let MaticUSDC = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"; // Matic - USDC

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

    // Get the cross chain quotes
    let quotes;
    try {
      quotes = await xdaiTestNetSdk.getCrossChainQuotes(quoteRequestPayload);

      if (quotes.items.length > 0) {
        // Select the first quote
        let quote = quotes.items[0];

        let tokenAddres = quote.estimate.data.fromToken.address;
        let approvalAddress = quote.approvalData.approvalAddress;
        let amount_num = Math.floor(Math.random() * 5000);
        let amount = amount_num.toString(); // Invalid Amount

        // Build the approval transaction request
        let { ContractNames, getContractAbi } = pkg;
        let abi = getContractAbi(ContractNames.ERC20Token);
        let erc20Contract = xdaiTestNetSdk.registerContract(
          "erc20Contract",
          abi,
          tokenAddres
        );
        let approvalTransactionRequest = erc20Contract.encodeApprove(
          approvalAddress,
          amount
        );

        // Batch the approval transaction
        await xdaiTestNetSdk.batchExecuteAccountTransaction({
          to: approvalTransactionRequest.to,
          data: approvalTransactionRequest.data,
          value: approvalTransactionRequest.value,
        });

        // Batch the cross chain transaction
        let { to, value, data } = quote.transaction;
        batchCrossChainTransaction =
          await xdaiTestNetSdk.batchExecuteAccountTransaction({
            to,
            data: data,
            value,
          });
      }

      // Estimating the batch
      try {
        await xdaiTestNetSdk.estimateGatewayBatch();
        assert.fail(
          "The batch executed the account transaction with invalid amount of the approval transaction request."
        );
      } catch (e) {
        e,
          console.log(
            "The batch is not executed the account transaction with invalid amount of the approval transaction request."
          );
      }
    } catch (e) {
      console.log(e);
    }
  });

  // CROSS CHAIN QUOTES ON XDAI NETWORK WITH INVALID TO ADDRESS OF THE APPROVAL TRANSACTION PAYLOAD
  it("Setup the SDK for xDai network and perform the cross chain quote action with invalid To Address of the approval transaction payload.", async () => {
    try {
      // initialize the sdk
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

    let XdaiUSDC = "0x4ECaBa5870353805a9F068101A40E0f32ed605C6"; // Xdai - USDC
    let MaticUSDC = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"; // Matic - USDC

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

    // Get the cross chain quotes
    let quotes;
    try {
      quotes = await xdaiTestNetSdk.getCrossChainQuotes(quoteRequestPayload);

      if (quotes.items.length > 0) {
        // Select the first quote
        let quote = quotes.items[0];

        let tokenAddres = quote.estimate.data.fromToken.address;
        let approvalAddress = quote.approvalData.approvalAddress;
        let amount = quote.approvalData.amount;

        // Build the approval transaction request
        let { ContractNames, getContractAbi } = pkg;
        let abi = getContractAbi(ContractNames.ERC20Token);
        let erc20Contract = xdaiTestNetSdk.registerContract(
          "erc20Contract",
          abi,
          tokenAddres
        );
        let approvalTransactionRequest = erc20Contract.encodeApprove(
          approvalAddress,
          amount
        );

        // Batch the approval transaction
        try {
          await xdaiTestNetSdk.batchExecuteAccountTransaction({
            to: "0x4ECaBa5870353805a9F068101A40E0f32ed605Cz", // Invalid To Address
            data: approvalTransactionRequest.data,
            value: approvalTransactionRequest.value,
          });

          assert.fail(
            "The batch approval transaction is performed with invalid To Address of the approval transaction payload."
          );
        } catch (e) {
          console.log(
            e,
            "The batch approval transaction is not performed with invalid To Address of the approval transaction payload."
          );
        }
      }
    } catch (e) {
      console.log(e);
    }
  });
});
