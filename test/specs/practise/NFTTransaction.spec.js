import * as dotenv from "dotenv";
dotenv.config(); // init dotenv

import { expect } from "chai";
import { EnvNames, NetworkNames, Sdk } from "etherspot";
import abi from "../../data/NFTabi.json";
import { ethers } from "ethers";

let sdkTestnet;
let smartWalletAddress;

describe("The SDK, when sending a NFT Transaction on the TestNet", () => {
  it("Setup the SDK for Mumbai network and perform the send NFT Transaction action", async () => {
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

    // NFT Code
    console.log("NFTabi:::: " + abi);
    const contract = new ethers.utils.Interface(abi);
    console.log("contract " + contract);
  });
});
