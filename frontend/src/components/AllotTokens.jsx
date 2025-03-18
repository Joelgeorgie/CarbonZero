import React, { useState } from "react";
import { useRecoilValue, useRecoilState } from "recoil";
import { keypairA, transactionCount, transactionLogs } from "../Recoil/atoms";
import transferTokens from "../solana-requests/transferTokens";

const AllotTokens = () => {
  const [transactionNo, setTransactionNo] = useRecoilState(transactionCount);
  const keypair = useRecoilValue(keypairA);
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionState, setTransactionState] = useRecoilState(transactionLogs);

  const allotTokens = async () => {
    if (!to || !amount || isNaN(amount) || amount <= 0) {
      alert("Please enter a valid public key and amount.");
      return;
    }

    try {
      const signature = await transferTokens(keypair, to, parseFloat(amount));
      setTransactionState([...transactionState, { type: "transfer", message: "Transfer successful", signature }]);
      setTransactionNo(transactionNo + 1);
    } catch (error) {
      console.error("Error allotting tokens:", error);
      setTransactionState([...transactionState, { type: "error", message: "Transfer failed" }]);
    }
  };

  return (
    <div className="mt-12 h-max p-6 space-y-6 bg-gray-800 rounded-lg shadow-lg flex flex-col">
      <h1 className="text-2xl font-bold border-b-2 border-gray-900 pb-5">Allot Tokens</h1>
      <input
        type="text"
        placeholder="Recipient Public Key"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        className="w-full text-center px-2  py-2 rounded-md border-gray-900 border-2"
      />
      <div className="w-full flex justify-between  py-2">
      <input
        type="text"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-[70%] text-center px-2 rounded-md border-gray-900 border-2"
      />
      <button
        onClick={allotTokens}
        className=" w-[20%] py-2 font-semibold text-gray-900 bg-green-400 rounded-md hover:bg-green-600"
      >
        Allot
      </button>
      </div>
      
    </div>
  );
};

export default AllotTokens;
