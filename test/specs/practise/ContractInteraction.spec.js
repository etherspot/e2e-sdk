import * as dotenv from "dotenv";
dotenv.config(); // init dotenv

import { expect } from "chai";
import { EnvNames, NetworkNames, Sdk } from "etherspot";
import { abi } from "erc-20-abi";
import { BigNumberish } from "ethers";

let sdkTestnet;
let smartWalletAddress;

describe("The SDK, when sending a Smart Contract interaction on the TestNet", () => {
  it("Setup the SDK for Mumbai network and perform the send Smart Contract interaction action", async () => {
    // initialize the sdk
    sdkTestnet = new Sdk(process.env.PRIVATE_KEY, {
      env: EnvNames.TestNets,
      networkName: NetworkNames.Mumbai,
    });

    expect(sdkTestnet.state.accountAddress).to.equal(
      "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f"
    );

    // Compute the smart wallet address
    const smartWalletOutput = await sdkMainNet.computeContractAccount();
    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    expect(smartWalletAddress).to.equal(
      "0x666E17ad27fB620D7519477f3b33d809775d65Fe"
    );

    // Create Contract Interface using Etherspot SDK
    // const StakingContract =
    //   sdkTestnet.registerContract <
    //   { encodeStake: (amount: BigNumberish) => stakeTransactionRequest } >
    //   ("stakingContract", contractAbi, contractAddress);
    // const stakeTransactionRequest = StakingContract.encodeStake(
    //   AmountToBeStakedInWei
    // );

    // Adding your transaction to a batch
    await etherspotSdk.batchExecuteAccountTransaction({
      to: stakeTransactionRequest.to,
      data: stakeTransactionRequest.data,
      value: stakeTransactionRequest.value,
    });

    // Estimating your batch
    const estimationResponse = await etherspotSdk.estimateGatewayBatch();
    console.log("Gas estimated at: ", estimationResponse);

    // Submitting your batch
    const submissionResponse = await sdkTestnet.submitGatewayBatch();
    console.log("Status of the batch submition: ", submissionResponse);
  });
});
