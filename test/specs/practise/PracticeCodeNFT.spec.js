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

let sdkMainNet;
let smartWalletAddress;

describe("The SDK, when sending a NFT Transaction on the MainNet", () => {
  // export interface ERC20Contract {
  //   encodeApprove?(spender: string, value: BigNumberish): TransactionRequest;
  //   callAllowance?(owner: string, spender: string): Promise<string>;
  // }

  // SEND NFT ON XDAI NETWORK
  it.only("Setup the SDK for xDai network and perform the send NFT Transaction action", async () => {
    // initialize the sdk
    sdkMainNet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.MainNets,
      networkName: NetworkNames.Arbitrum,
    });

    assert.strictEqual(
      sdkMainNet.state.accountAddress,
      "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f",
      "The EOA Address is not displayed correctly."
    );

    // Compute the smart wallet address
    const smartWalletOutput = await sdkMainNet.computeContractAccount();
    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    assert.strictEqual(
      smartWalletAddress,
      "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
      "The smart address is not displayed correctly."
    );

    const XdaiUSDC = "0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83"; // Xdai - USDC
    const MaticUSDC = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"; // Matic - USDC

    const fromChainId = NETWORK_NAME_TO_CHAIN_ID[NetworkNames.Matic];
    const toChainId = NETWORK_NAME_TO_CHAIN_ID[NetworkNames.Xdai];
    const fromTokenAddress = MaticUSDC;
    const toTokenAddress = XdaiUSDC;
    const fromAmount = ethers.utils.parseUnits("0.0001", 6); // 10 USDC

    const quoteRequestPayload = {
      fromChainId: fromChainId,
      toChainId: toChainId,
      fromTokenAddress: fromTokenAddress,
      toTokenAddress: toTokenAddress,
      fromAmount: fromAmount,
      serviceProvider: CrossChainServiceProvider.LiFi, // Optional parameter
    };
    console.log(quoteRequestPayload);
    const quotes = await sdkMainNet.getCrossChainQuotes(quoteRequestPayload);

    console.log("Quotes", quotes);

    if (quotes.items.length > 0) {
      // Select the first quote
      const quote = quotes.items[0];
      logger.log("Quote Selected: ", quote);

      const tokenAddres = quote.estimate.data.fromToken.address;
      const approvalAddress = quote.approvalData.approvalAddress;
      const amount = quote.approvalData.amount;

      // Build the approval transaction request
      const abi = getContractAbi(ContractNames.ERC20Token);
      const erc20Contract =
        sdkMainNet.registerContract <
        ERC20Contract >
        ("erc20Contract", abi, tokenAddres);
      const approvalTransactionRequest = erc20Contract.encodeApprove(
        approvalAddress,
        amount
      );
      console.log("Approval transaction request", approvalTransactionRequest);
      await sdkMainNet.clearGatewayBatch();

      // Batch the approval transaction
      console.log(
        "gateway batch approval transaction",
        await sdkMainNet.batchExecuteAccountTransaction({
          to: approvalTransactionRequest.to,
          data: approvalTransactionRequest.data,
          value: approvalTransactionRequest.value,
        })
      );

      // Batch the cross chain transaction
      const { to, value, data } = quote.transaction;
      console.log(
        "gateway batch transfer token transaction",
        await sdkMainNet.batchExecuteAccountTransaction({
          to,
          data: data,
          value,
        })
      );
    }

    const estimatedGas = await sdkMainNet.estimateGatewayBatch();
  });
});
