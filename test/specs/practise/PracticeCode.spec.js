import * as dotenv from "dotenv";
dotenv.config();

import { expect } from "chai";
import { EnvNames, NetworkNames, Sdk } from "etherspot";
import { BigNumber } from "ethers";
import Helper from "../../utils/Helper.js";

let sdkMainNet;
let smartWalletAddress;
let hashAddressBig;
let transactionState;

let networkname = [Xdai, Mumbai];
// let networkname = {
//   xdai: Xdai,
//   mumbai: Mumbai,
// };

describe("Get the transaction history on the MainNet", () => {
  // SEND NATIVE TOKEN FOR XDAI
  it("Setup the SDK for Xdai network and perform the send native asset action", async () => {
    for (let i = 0; i < networkname.length; i++) {
      // initialize the sdk
      sdkMainNet = new Sdk(process.env.PRIVATE_KEY, {
        env: EnvNames.MainNets,
        networkName: NetworkNames.networkname[i],
      });

      expect(sdkMainNet.state.accountAddress).to.equal(
        "0xa5494Ed2eB09F37b4b0526a8e4789565c226C84f"
      );

      // Compute the smart wallet address
      const smartWalletOutput = await sdkMainNet.computeContractAccount();
      smartWalletAddress = smartWalletOutput.address;
      console.log("Smart wallet address: ", smartWalletAddress);

      expect(smartWalletAddress).to.equal(
        "0x666E17ad27fB620D7519477f3b33d809775d65Fe"
      );

      // Adding transaction to a batch
      const addTransactionToBatchOutput =
        await sdkMainNet.batchExecuteAccountTransaction({
          to: "0x0fd7508903376dab743a02743cadfdc2d92fceb8",
          value: "1000000000000",
        });
      console.log("Batch Reponse: ", addTransactionToBatchOutput);

      // Estimating the batch
      const estimationResponse = await sdkMainNet.estimateGatewayBatch();
      console.log("Gas estimated at:", estimationResponse);

      // Submitting the batch
      const submissionResponse = await sdkMainNet.submitGatewayBatch({
        guarded: false,
      });
      console.log("Status of the batch submition: ", submissionResponse);
      hashAddressBig = BigNumber.from(submissionResponse.hash)._hex;
      console.log("BIG HASH ADDRESS: ", hashAddressBig);

      // get the submitted batch and wait till the status become sent
      do {
        const output = await sdkMainNet.getGatewaySubmittedBatch({
          hash: hashAddressBig,
        });
        transactionState = output.state;

        Helper.wait(2000);
      } while (!(transactionState == "Sent"));

      // get submmited batch with sent status
      const output = await sdkMainNet.getGatewaySubmittedBatch({
        hash: hashAddressBig,
      });
      console.log("Gateway Submitted Batch after sending: ", output);
      console.log(
        "Transaction State of Fetched Batch after sending: ",
        output.transaction.state
      );
      console.log(
        "Transaction Hash of Fetched Batch after sending: ",
        output.transaction.hash
      );

      // Fetching a single transaction
      const singleTransaction = await sdkMainNet.getTransaction({
        hash: output.transaction.hash, // Add your transaction hash
      });
      console.log("Single Transaction: ", singleTransaction);
      console.log(
        "Single Transaction Hash of the blockchain: ",
        singleTransaction.hash
      );
      console.log(
        "Final Status of the single transaction on xDai network: ",
        singleTransaction.status
      );

      expect(singleTransaction.status).to.equal("Completed");

      // Fetching historical transactions
      const transactions = await sdkMainNet.getTransactions();
      //console.log("Transactions: ", transactions);
      console.log(
        "Respective Transaction Hash from the transactions list of the blockchain: ",
        transactions.items[0].hash
      );
      console.log(
        "Respective Transaction Status from the transactions list of the blockchain: ",
        transactions.items[0].status
      );

      expect(transactions.items[0].status).to.equal("Completed");

      // VALIDATE THE TRANSACTION HASH OF THE SINGLE TRANSACTION AND FROM THE TRANSACTION LIST
      expect(output.transaction.hash).to.equal(singleTransaction.hash); // validate hash of sent batch and single transaction is displayed same
      expect(output.transaction.hash).to.equal(transactions.items[0].hash); // validate hash of sent batch and from transaction list is displayed same
      expect(singleTransaction.hash).to.equal(transactions.items[0].hash); // validate hash of single transaction and from transaction list is displayed same
    }
  });
});
