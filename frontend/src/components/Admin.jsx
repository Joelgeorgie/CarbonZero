import React, { useState } from "react";
import { useRecoilValue, useRecoilState } from "recoil";
import { keypairA, transactionCount } from "../Recoil/atoms";
import useBalance from "../hooks/useBalance";
import useTokenBalance from "../hooks/useTokenBalance";

import mintTo from "../solana-requests/mintTokens";
import burnTokens from "../solana-requests/burnTokens";
import LineData from "./LineData";

const Admin = () => {
  const keypair = useRecoilValue(keypairA);
  const [transactionNo, setTransactionNo] = useRecoilState(transactionCount);
  const balance = useBalance(keypair, transactionNo);
  const tokenBalance = useTokenBalance(keypair.publicKey, transactionNo);
  const [amount, setAmount] = useState(0);

  const mintCZ = async () => {
    const signature = await mintTo(keypair, amount);
    console.log(signature);
    setTransactionNo((prev) => prev + 1);
  };

  const burnCZ = async () => {
    const signature = await burnTokens(keypair, amount);
    console.log(signature);
    setTransactionNo((prev) => prev + 1);
  };

  return (
    <div className="flex flex-row items-start justify-between p-15 min-h-screen bg-gray-900 text-white">
      <div className="w-[50%] max-w-4xl p-6 space-y-6 bg-gray-800  rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-start border-b-2 border-gray-900 pb-5">
          Admin{" "}
        </h1>
        <div className="space-y-4 ">
          <LineData
            key={1}
            name="Public Key"
            value={keypair.publicKey.toString() }
            canCopied={true}
          />
          <LineData
            key={2}
            name="Token Mint Address"
            value="carQ4YQfUsjDRVwWXTvUxW5DwXWo5uCU7YuN9frvJ4w"
            canCopied={true}
          />
          <LineData key={3} name="Sol Balance" value={`${balance}`} />
          <LineData key={4} name="Token Balance" value={`${tokenBalance}`} />
        </div>
      </div>

      <div className="w-[40%] max-w-4xl  space-y-6 bg-gray-800  rounded-lg shadow-lg p-6 flex flex-col justify  ">
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
              className="px-4 py-2 font-bold  bg-green-400 rounded-md hover:bg-green-600"
            >
              Mint Tokens
            </button>

            <button
              onClick={burnCZ}
              className="px-4 py-2 font-bold  text-white bg-green-400 rounded-md hover:bg-green-600"
            >
              Burn Tokens
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
