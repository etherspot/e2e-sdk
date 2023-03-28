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
      "0x522E11D4F5DaC0d115Ab9792AE6b18e2C7b7B388"
    );

    // Compute the smart wallet address
    const smartWalletOutput = await sdkTestnet.computeContractAccount();
    console.log(smartWalletOutput);

    smartWalletAddress = smartWalletOutput.address;
    console.log("Smart wallet address: ", smartWalletAddress);

    // Create Contract Interface using Etherspot SDK
    const StakingContract =
      sdkTestnet.registerContract <
      { encodeStake: (amount: BigNumberish) => stakeTransactionRequest } >
      ("stakingContract", contractAbi, contractAddress);
    const stakeTransactionRequest = StakingContract.encodeStake(
      AmountToBeStakedInWei
    );

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
