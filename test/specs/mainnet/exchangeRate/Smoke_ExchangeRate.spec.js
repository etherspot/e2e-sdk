import { EnvNames, NetworkNames, Sdk } from "etherspot";
import { assert } from "chai";
import axios from "axios";
import Helper from "../../../utils/Helper.js";

import * as dotenv from "dotenv";
dotenv.config(); // init dotenv

let wait_time = 4000;
let deviationPercentage;

let network_etherspot = [
  "arbitrum",
  "bsc",
  "xdai",
  "matic",
  "optimism",
  "mainnet",
  "fantom",
  "aurora",
  "avalanche",
  "arbitrumNova",
  "moonbeam",
  "celo",
  "fuse",
];

let network_coingecho = [
  "arbitrum-one",
  "binance-smart-chain",
  "xdai",
  "polygon-pos",
  "optimistic-ethereum",
  "ethereum",
  "fantom",
  "aurora",
  "avalanche",
  "arbitrum-nova",
  "moonbeam",
  "celo",
  "fuse",
];

describe("Compare the Token Rates of the Etherspot and Coingecho Services", () => {
  for (let n = 0; n < network_etherspot.length; n++) {
    it("Validate the Token Rates of the Etherspot and Coingecho Services", async () => {
      let mainNetSdk;
      let tokenListAddress_Etherspot = [];
      let tokenListChainId_Etherspot;
      let tokenListAddress_Coingecho = [];
      let tokenListId_Coingecho = [];
      let responsesCoinList_CoinGecho;
      let requestPayload_Etherspot;

      // initialize the sdk
      try {
        mainNetSdk = new Sdk(process.env.PRIVATE_KEY, {
          env: EnvNames.MainNets,
          networkName: network_etherspot[n],
        });

        assert.strictEqual(
          mainNetSdk.state.accountAddress,
          "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f",
          "The EOA Address is not calculated correctly."
        );
      } catch (e) {
        assert.fail(e, "The SDK is not initialled successfully.");
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
          e,
          "The smart wallet address is not calculated successfully."
        );
      }

      // Get the token addresses and it's rate from the Coingecho
      try {
        try {
          responsesCoinList_CoinGecho = await axios.get(
            "https://api.coingecko.com/api/v3/coins/list?include_platform=true"
          );
        } catch (e) {
          assert.fail(
            e,
            "An error is displayed while getting the token addresses from the Coingecho."
          );
        }

        try {
          tokenListAddress_Coingecho = responsesCoinList_CoinGecho.data.filter(
            (address) => {
              return (
                typeof address.platforms[network_coingecho[n]] === "string" &&
                address.platforms[network_coingecho[n]] !== ""
              );
            }
          );

          tokenListId_Coingecho = responsesCoinList_CoinGecho.data.filter(
            (coinid) => {
              return coinid.id;
            }
          );
        } catch (e) {
          assert.fail(
            e,
            "An error is displayed while adding the address and ID of the chain in the respective arrays."
          );
        }
      } catch (e) {
        assert.fail(
          e,
          "An error is displayed while getting the token addresses and it's rate from the Coingecho."
        );
      }

      try {
        // get the token list of the Etherspot
        let TokenDetails = await mainNetSdk.getTokenListTokens({
          name: "EtherspotPopularTokens",
        });

        // get the list of token address of the Etherspot
        for (let x = 0; x < TokenDetails.length; x++) {
          tokenListAddress_Etherspot.push(TokenDetails[x].address);
        }

        // get the chain id of the Etherspot
        tokenListChainId_Etherspot = TokenDetails[0].chainId;

        // Request payload for fetch the token rates informaiton of the Etherspot
        requestPayload_Etherspot = {
          tokens: tokenListAddress_Etherspot,
          chainId: tokenListChainId_Etherspot,
        };
      } catch (e) {
        assert.fail(
          e,
          "An error is displayed while fetching the rate of the token from Etherspot."
        );
      }

      // Fetch the token rates of the Etherspot and compare with coingecho
      try {
        let rates = await mainNetSdk.fetchExchangeRates(
          requestPayload_Etherspot
        );
        for (let y = 0; y < rates.items.length; y++) {
          for (let j = 0; j < tokenListAddress_Coingecho.length; j++) {
            Helper.wait(wait_time);
            let etherspotAddress = rates.items[y].address;
            console.log("Etherspot Address:", etherspotAddress.toLowerCase());
            console.log(
              "Coingecho Address:",
              tokenListAddress_Coingecho[j].toLowerCase()
            );
            if (
              etherspotAddress.toLowerCase() ===
              tokenListAddress_Coingecho[j].toLowerCase()
            ) {
              Helper.wait(wait_time);

              let responsesCoidMarket = await axios.get(
                "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=" +
                  tokenListId_Coingecho[j] +
                  "&per_page=100&page=1&sparkline=true&locale=en"
              );

              let num1 = responsesCoidMarket.data[0].current_price; // rates of the coingecho
              let num2 = rates.items[y].usd; // rates of the etherspot

              deviationPercentage =
                (Math.abs(num1 - num2) / ((num1 + num2) / 2)) * 100;
              if (deviationPercentage > 5) {
                assert.fail(
                  "The rate of the " +
                    tokenListId_Coingecho[j] +
                    " token of the Etherspot is " +
                    rates.items[y].usd +
                    " and the Coingecho is " +
                    responsesCoidMarket.data[0].current_price +
                    ". So rate variation of the both the tokens are not displayed correctly."
                );
              } else {
                console.log(
                  "The rate of the " +
                    tokenListId_Coingecho[j] +
                    " token of the Etherspot is " +
                    rates.items[y].usd +
                    " and the Coingecho is " +
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
          e,
          "An error is displayed while comparing the rates of the Etherspot and Coingecho."
        );
      }
    });
  }
});
