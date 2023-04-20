import * as dotenv from "dotenv";
dotenv.config(); // init dotenv

import { assert } from "chai";
import { EnvNames, NetworkNames, Sdk } from "etherspot";

let sdkTestNet;
let smartWalletAddress;

describe("The SDK, when sending a native asset on the TestNet", () => {
  // SEND NATIVE TOKEN FOR XDAI WITH INVALID TO ADDRESS
  it("Setup the SDK for Xdai network and perform the send native token with invalid to address", async () => {
    // initialize the sdk
    sdkTestNet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.TestNets,
      networkName: NetworkNames.Xdai,
    });

    assert.strictEqual(
      sdkTestNet.state.accountAddress,
      "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f",
      "The EOA Address is not displayed correctly."
    );

    // Compute the smart wallet address
    const smartWalletOutput = await sdkTestNet.computeContractAccount();
    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    assert.strictEqual(
      smartWalletAddress,
      "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
      "The smart address is not displayed correctly."
    );

    // Adding transaction to a batch with invalid To Address
    try {
      await sdkTestNet.batchExecuteAccountTransaction({
        to: "0x0fd7508903376dab743a02743cadfdc2d92fceb",
        value: "1000000000000",
      });
      assert.isFalse(
        "The batch execution colmpleyed with incorrect To Address."
      );
    } catch (e) {
      console.log(
        e,
        "The correct To Address is required for the batch execution."
      );
    }
  });

  // SEND NATIVE TOKEN FOR XDAI WITH INVALID VALUE
  it("Setup the SDK for Xdai network and perform the send native token with invalid value", async () => {
    // initialize the sdk
    sdkTestNet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.TestNets,
      networkName: NetworkNames.Xdai,
    });

    assert.strictEqual(
      sdkTestNet.state.accountAddress,
      "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f",
      "The EOA Address is not displayed correctly."
    );

    // Compute the smart wallet address
    const smartWalletOutput = await sdkTestNet.computeContractAccount();
    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    assert.strictEqual(
      smartWalletAddress,
      "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
      "The smart address is not displayed correctly."
    );

    // Adding transaction to a batch with invalid Value
    try {
      await sdkTestNet.batchExecuteAccountTransaction({
        to: "0x0fd7508903376dab743a02743cadfdc2d92fceb8",
        value: "0.001",
      });
      assert.isFalse("The batch execution colmpleyed with incorrect Value.");
    } catch (e) {
      console.log(e, "The correct Value is required for the batch execution.");
    }
  });

  // SEND NATIVE TOKEN FOR XDAI WITH VALUE AS MORE THAN THE ACTUAL VALUE OF THE WALLER BALANCE
  it("Setup the SDK for Xdai network and perform the send native token with value as more than the actual value of the wallet balance.", async () => {
    // initialize the sdk
    sdkTestNet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.TestNets,
      networkName: NetworkNames.Xdai,
    });

    assert.strictEqual(
      sdkTestNet.state.accountAddress,
      "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f",
      "The EOA Address is not displayed correctly."
    );

    // Compute the smart wallet address
    const smartWalletOutput = await sdkTestNet.computeContractAccount();
    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    assert.strictEqual(
      smartWalletAddress,
      "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
      "The smart address is not displayed correctly."
    );

    // Adding transaction to a batch with Value as more than the actual Value of the wallet balance
    try {
      await sdkTestNet.batchExecuteAccountTransaction({
        to: "0x0fd7508903376dab743a02743cadfdc2d92fceb8",
        value: "1000000000000000000000",
      });
      assert.isFalse(
        "The batch execution with value as more than the actual Value of the wallet balance is not allowed."
      );
    } catch (e) {
      console.log(
        e,
        "The equal or less Value is required as compare to the wallet balance for the batch execution."
      );
    }
  });

  // SEND NATIVE TOKEN FOR XDAI ON THE SAME ADDRESS
  it("Setup the SDK for Xdai network and perform the send native token on the same address", async () => {
    // initialize the sdk
    sdkTestNet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.TestNets,
      networkName: NetworkNames.Xdai,
    });

    assert.strictEqual(
      sdkTestNet.state.accountAddress,
      "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f",
      "The EOA Address is not displayed correctly."
    );

    // Compute the smart wallet address
    const smartWalletOutput = await sdkTestNet.computeContractAccount();
    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    assert.strictEqual(
      smartWalletAddress,
      "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
      "The smart address is not displayed correctly."
    );

    // Adding transaction to a batch on the same address
    try {
      await sdkTestNet.batchExecuteAccountTransaction({
        to: "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
        value: "1000000000000",
      });
      assert.isFalse(
        "Addion of the transaction to batch on the same address is performed."
      );
    } catch (e) {
      console.log(
        e,
        "Addion of the transaction to batch on the same address is not allowed."
      );
    }
  });

  // SEND NATIVE TOKEN FOR XDAI WITHOUT ESTIMATION OF THE BATCH
  it("Setup the SDK for Xdai network and perform the send native token without estimation of the batch", async () => {
    // initialize the sdk
    sdkTestNet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.TestNets,
      networkName: NetworkNames.Xdai,
    });

    assert.strictEqual(
      sdkTestNet.state.accountAddress,
      "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f",
      "The EOA Address is not displayed correctly."
    );

    // Compute the smart wallet address
    const smartWalletOutput = await sdkTestNet.computeContractAccount();
    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    assert.strictEqual(
      smartWalletAddress,
      "0x666E17ad27fB620D7519477f3b33d809775d65Fe",
      "The smart address is not displayed correctly."
    );

    // Adding transaction to a batch without estimation of the batch
    await sdkTestNet.batchExecuteAccountTransaction({
      to: "0x0fd7508903376dab743a02743cadfdc2d92fceb8",
      value: "1000000000000",
    });

    // Submitting the batch
    try {
      await sdkTestNet.submitGatewayBatch({
        guarded: false,
      });
      assert.isFalse(
        "Status of the batch is submitted without Estimation of batch."
      );
    } catch (e) {
      console.log(
        e,
        "Status of the batch is not submitted, Because Estimation of batch is remaining."
      );
    }
  });
});
