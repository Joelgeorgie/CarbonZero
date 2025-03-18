import React, { useState } from "react";
import { useRecoilValue, useRecoilState } from "recoil";
import { keypairA, transactionCount, transactionLogs } from "../Recoil/atoms";
import mintTo from "../solana-requests/mintTokens";
import burnTokens from "../solana-requests/burnTokens";

const RegulateSupply = () => {
  const [transactionNo, setTransactionNo] = useRecoilState(transactionCount);
  const keypair = useRecoilValue(keypairA);
  const [amount, setAmount] = useState(0);
  const [transactionState, setTransactionState] =useRecoilState(transactionLogs);

  const mintCZ = async () => {
    const signature = await mintTo(keypair, amount);
    console.log(signature);
    setTransactionNo((prev) => prev + 1);
    setTransactionState((prev) => [
      ...prev,
      { type: "mint", signature, message: "Minted tokens" },
    ]);
  };

  const burnCZ = async () => {
    const signature = await burnTokens(keypair, amount);
    console.log(signature);
    setTransactionNo((prev) => prev + 1);
    setTransactionState((prev) => [
      ...prev,
      { type: "burn", signature, message: "Burnt tokens" },
    ]);
  };

  return (
    <div className=" bg-gray-800  rounded-lg shadow-lg p-6 flex flex-col  ">
      <h1 className="text-2xl font-bold border-b-2 border-gray-900 pb-5">
        Regulate Supply
      </h1>
      <div className="flex flex-col items-center justify-center w-full my-5">
        <input
          placeholder="Amount"
          className="w-[50%] text-center px-4 py-2  rounded-md  border-gray-900 border-2"
          onChange={(e) => setAmount(e.target.value)}
        />
        <div className="flex flex-row  items-center justify-evenly w-full mt-6 ">
          <button
            onClick={mintCZ}
            className="px-4 py-2 font-semibold text-gray-900  bg-green-400 rounded-md hover:bg-green-600"
          >
            Mint Tokens
          </button>

          <button
            onClick={burnCZ}
            className="px-4 py-2 font-semibold  text-gray-900 bg-red-400 rounded-md hover:bg-red-600"
          >
            Burn Tokens
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegulateSupply;
