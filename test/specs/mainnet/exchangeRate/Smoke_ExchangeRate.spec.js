import { EnvNames, NetworkNames, Sdk } from "etherspot";
import { assert } from "chai";
import axios from "axios";
import Helper from "../../../utils/Helper.js";

import * as dotenv from "dotenv";
dotenv.config(); // init dotenv

describe("Compare the Token Rates of the Etherspot and CoinGecho Services.", () => {
  it("Validate the Token Rates of the Etherspot and CoinGecho Services.", async () => {
    let mainNetSdk;
    let TOKEN_LIST_ADDRESS_ETHERSPOT = [];
    let XDAI_CHAIN_ID_ETHERSPOT;
    let TOKEN_LIST_ADDRESS_COINGECHO = [];
    let TOKEN_LIST_ID_COINGECHO = [];
    let responsesCoidList;
    let requestPayload;

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

    // Get the token addresses and it's rate from the CoinGecho
    try {
      responsesCoidList = await axios.get(
        "https://api.coingecko.com/api/v3/coins/list?include_platform=true"
      );

      for (let z = 0; z < responsesCoidList.data.length; z++) {
        if (
          typeof responsesCoidList.data[z].platforms.xdai === "string" &&
          responsesCoidList.data[z].platforms.xdai != ""
        ) {
          TOKEN_LIST_ADDRESS_COINGECHO.push(
            responsesCoidList.data[z].platforms.xdai
          );
          TOKEN_LIST_ID_COINGECHO.push(responsesCoidList.data[z].id);
        }
      }
    } catch (e) {
      assert.fail(
        "An error is displayed while getting the token addresses and it's rate from the CoinGecho."
      );
    }

    try {
      // get the token list of the Etherspot
      let TokenDetails = await mainNetSdk.getTokenListTokens({
        name: "EtherspotPopularTokens",
      });

      // get the list of token address of the Etherspot
      for (let x = 0; x < TokenDetails.length; x++) {
        TOKEN_LIST_ADDRESS_ETHERSPOT.push(TokenDetails[x].address);
      }

      // get the chain id of the Etherspot
      XDAI_CHAIN_ID_ETHERSPOT = TokenDetails[0].chainId;

      // Request payload for fetch the token rates informaiton of the Etherspot
      requestPayload = {
        tokens: TOKEN_LIST_ADDRESS_ETHERSPOT,
        chainId: XDAI_CHAIN_ID_ETHERSPOT,
      };
    } catch (e) {
      assert.fail(
        "An error is displayed while fetching the rate of the token from Etherspot."
      );
    }

    // Fetch the token rates of the Etherspot and compare with coinGecho
    try {
      let rates = await mainNetSdk.fetchExchangeRates(requestPayload);
      for (let y = 0; y < rates.items.length; y++) {
        for (let j = 0; j < TOKEN_LIST_ADDRESS_COINGECHO.length; j++) {
          Helper.wait(5000);
          let etherspotAddress = rates.items[y].address;
          console.log("Etherspot Address:", etherspotAddress.toLowerCase());
          console.log("CoinGecho Address:", TOKEN_LIST_ADDRESS_COINGECHO[j]);
          if (
            etherspotAddress.toLowerCase() == TOKEN_LIST_ADDRESS_COINGECHO[j]
          ) {
            Helper.wait(5000);
            let responsesCoidMarket = await axios.get(
              "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=" +
                TOKEN_LIST_ID_COINGECHO[j] +
                "&per_page=100&page=1&sparkline=true&locale=en"
            );

            let num1 = responsesCoidMarket.data[0].current_price; // rates of the coingecho
            let num2 = rates.items[y].usd; // rates of the etherspot

            let deviationPercentage =
              (Math.abs(num1 - num2) / ((num1 + num2) / 2)) * 100;
            if (deviationPercentage > 5) {
              assert.fail(
                "The rate of the " +
                  TOKEN_LIST_ID_COINGECHO[j] +
                  " token of the Etherspot is " +
                  rates.items[y].usd +
                  " and the CoinGecho is " +
                  responsesCoidMarket.data[0].current_price +
                  ". So rate variation of the both the tokens are not displayed correctly."
              );
            } else {
              console.log(
                "The rate of the " +
                  TOKEN_LIST_ID_COINGECHO[j] +
                  " token of the Etherspot is " +
                  rates.items[y].usd +
                  " and the CoinGecho is " +
                  responsesCoidMarket.data[0].current_price +
                  ". So rate variation of the both the tokens are displayed correctly."
              );
            }
            break;
          }
        }
      }
    } catch (e) {
      assert.fail(
        "An error is displayed while comparing the rates of the Etherspot and CoinGecho."
      );
    }
  });
});
