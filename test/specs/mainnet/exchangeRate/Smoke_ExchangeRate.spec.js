import { EnvNames, NetworkNames, Sdk } from "etherspot";
import { assert } from "chai";

import * as dotenv from "dotenv";
dotenv.config(); // init dotenv

describe("Compare the Token Rates", () => {
  it("Validate the token rates.", async () => {
    let mainNetSdk;
    // initialize the sdk
    try {
      mainNetSdk = new Sdk(process.env.PRIVATE_KEY, {
        env: EnvNames.MainNets,
        networkName: NetworkNames.Xdai,
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
      assert.fail("The smart wallet address is not calculated successfully.");
    }

    // get the token list
    let TOKEN_LIST_ADDRESS = [];
    let TokenDetails = await mainNetSdk.getTokenListTokens({
      name: "EtherspotPopularTokens",
    });

    // get the list of token address
    for (let x = 0; x < TokenDetails.length; x++) {
      TOKEN_LIST_ADDRESS.push(TokenDetails[x].address);
    }

    // get the chain id
    let XDAI_CHAIN_ID = TokenDetails[0].chainId;

    // Request payload for fetch the token rates informaiton
    const requestPayload = {
      tokens: TOKEN_LIST_ADDRESS,
      chainId: XDAI_CHAIN_ID,
    };
    console.log("requestPayload:::", requestPayload);

    // Fetch the token rates
    const rates = await mainNetSdk.fetchExchangeRates(requestPayload);
    console.log("rates:::", rates);
    for (let y = 0; y < rates.items.length; y++) {
      console.log(
        "Token Address:",
        rates.items[y].address,
        "and Token Rate:",
        rates.items[y].usd
      );
    }
  });
});
