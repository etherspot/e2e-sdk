import * as dotenv from "dotenv";
dotenv.config(); // init dotenv

import { assert } from "chai";
import { EnvNames, NetworkNames, Sdk } from "etherspot";

describe("The SDK, when sending a native asset on the MainNet", () => {
  // SEND NATIVE TOKEN FOR XDAI WITH INVALID TO ADDRESS
  it("Setup the SDK for Xdai network and perform the send native token with invalid to address", async () => {
    // initialize the sdk
    let xdaiMainNetSdk;
    try {
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
      console.log(e);
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
      console.log(e);
      assert.fail("The smart wallet address is not calculated successfully.");
    }

    // Adding transaction to a batch with invalid To Address
    try {
      try {
        await xdaiMainNetSdk.batchExecuteAccountTransaction({
          to: "0x0fd7508903376dab743a02743cadfdc2d92fceb", // Invalid To Address
          value: "1000000000000",
        });
        assert.fail("The batch execution completed with incorrect To Address.");
      } catch (e) {
        if (e.errors[0].constraints.isAddress == "to must be an address") {
          console.log(
            "The validation for To Address is displayed as expected while batch execution."
          );
        } else {
          console.log(e);
          assert.fail(
            "The expected validation is not displayed when entered the invalid To Address while performing batch execution."
          );
        }
      }
    } catch (e) {
      console.log(e);
      assert.fail(
        "The expected validation is not displayed when entered the invalid To Address while performing batch execution."
      );
    }
  });

  // SEND NATIVE TOKEN FOR XDAI WITH INVALID VALUE
  it("Setup the SDK for Xdai network and perform the send native token with invalid value", async () => {
    let xdaiMainNetSdk;
    // initialize the sdk
    try {
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
      console.log(e);
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
      console.log(e);
      assert.fail("The smart wallet address is not calculated successfully.");
    }

    // Adding transaction to a batch with invalid Value
    try {
      try {
        await xdaiMainNetSdk.batchExecuteAccountTransaction({
          to: "0x0fd7508903376dab743a02743cadfdc2d92fceb8",
          value: "0.001", // Invalid Value
        });
        assert.fail("The batch execution colmpleyed with incorrect Value.");
      } catch (e) {
        if (
          e.errors[0].constraints.IsBigNumberish ==
          "value must be big numberish"
        ) {
          console.log(
            "The validation for Value is displayed as expected while the batch execution."
          );
        } else {
          console.log(e);
          assert.fail(
            "The expected validation is not displayed when entered the invalid Value while performing batch execution."
          );
        }
      }
    } catch (e) {
      console.log(e);
      assert.fail(
        "The expected validation is not displayed when entered the invalid Value while performing batch execution."
      );
    }
  });

  // SEND NATIVE TOKEN FOR XDAI WITH VALUE AS MORE THAN THE ACTUAL VALUE OF THE WALLER BALANCE
  it("Setup the SDK for Xdai network and perform the send native token with value as more than the actual value of the wallet balance.", async () => {
    let xdaiMainNetSdk;
    // initialize the sdk
    try {
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
      console.log(e);
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
      console.log(e);
      assert.fail("The smart wallet address is not calculated successfully.");
    }

    // Adding transaction to a batch with Value as more than the actual Value of the wallet balance
    try {
      await xdaiMainNetSdk.batchExecuteAccountTransaction({
        to: "0x0fd7508903376dab743a02743cadfdc2d92fceb8",
        value: "100000000000000000000000", // Exceeded Value
      });
    } catch (e) {
      console.log(e);
      assert.fail(
        "The exceeded Value is not required in the wallet balance for the batch execution."
      );
    }

    // estinating the batch
    try {
      try {
        await xdaiMainNetSdk.estimateGatewayBatch();
      } catch (e) {
        if (e.errors[0].constraints.reverted == "Transaction reverted") {
          console.log(
            "The validation for exceeded Value is displayed as expected while the batch execution."
          );
        } else {
          console.log(e);
          assert.fail(
            "The expected validation is not displayed when entered the exceeded Value while performing batch execution."
          );
        }
      }
    } catch (e) {
      console.log(e);
      assert.fail(
        "The expected validation is not displayed when entered the exceeded Value while performing batch execution."
      );
    }
  });

  // SEND NATIVE TOKEN FOR XDAI ON THE SAME ADDRESS
  it("Setup the SDK for Xdai network and perform the send native token on the same address", async () => {
    let xdaiMainNetSdk;
    // initialize the sdk
    try {
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
      console.log(e);
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
      console.log(e);
      assert.fail("The smart wallet address is not calculated successfully.");
    }

    // Adding transaction to a batch on the same address
    try {
      try {
        await xdaiMainNetSdk.batchExecuteAccountTransaction({
          to: "0x666E17ad27fB620D7519477f3b33d809775d65Fe", // Send Native Token on Same Address
          value: "1000000000000",
        });
        assert.fail(
          "Addition of the transaction to batch on the same address is performed."
        );
      } catch (e) {
        if (
          e.message ==
          "Destination address should not be the same as sender address"
        ) {
          console.log(
            "The validation is displayed while entering the duplicate sender address."
          );
        } else {
          console.log(e);
          assert.fail(
            "The validation is not displayed while entering the duplicate sender address."
          );
        }
      }
    } catch (e) {
      console.log(e);
      assert.fail(
        "The validation is not displayed while entering the duplicate sender address."
      );
    }
  });

  // SEND NATIVE TOKEN FOR XDAI WITHOUT ESTIMATION OF THE BATCH
  it("Setup the SDK for Xdai network and perform the send native token without estimation of the batch", async () => {
    let xdaiMainNetSdk;
    // initialize the sdk
    try {
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
      console.log(e);
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
      console.log(e);
      assert.fail("The smart wallet address is not calculated successfully.");
    }

    // Adding transaction to a batch without estimation of the batch
    try {
      await xdaiMainNetSdk.batchExecuteAccountTransaction({
        to: "0x0fd7508903376dab743a02743cadfdc2d92fceb8",
        value: "1000000000000",
      });
    } catch (e) {
      console.log(e);
      assert.fail(
        "The addition of transaction in the batch is not performed successfully."
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
          console.log(e);
          assert.fail(
            "The submition of batch is completed without estimation."
          );
        }
      }
    } catch (e) {
      console.log(e);
      assert.fail("The submition of batch is completed without estimation.");
    }
  });
});
