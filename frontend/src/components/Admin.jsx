import React, { useState, useEffect } from "react";
import { useRecoilValue, useRecoilState } from "recoil";
import { keypairA, transactionCount, transactionLogs, alertState } from "../Recoil/atoms";
import useBalance from "../hooks/useBalance";
import useTokenBalance from "../hooks/useTokenBalance";
import RegulateSupply from "./RegulateSupply";
import DexReserves from "./DexReserves";
import AdminDetails from "./Details/AdminDetails";
import AllotTokens from "./AllotTokens";


const Admin = () => {
  const keypair = useRecoilValue(keypairA); // Extracting the keypair
  const publicKey = keypair.publicKey.toString(); // Converting it to string

  const [transactionNo, setTransactionNo] = useRecoilState(transactionCount);
  const balance = useBalance(keypair, transactionNo);
  const tokenBalance = useTokenBalance(keypair.publicKey, transactionNo);
  const [transactionState, setTransactionState] = useRecoilState(transactionLogs);
  const [alert, setAlert] = useRecoilState(alertState);

  useEffect(() => {
    if (transactionState.length > 0) {
      const lastTransaction = transactionState[transactionState.length - 1];
      setAlert({
        type: lastTransaction.type,
        message: lastTransaction.message,
        signature: lastTransaction.signature,
      });

      setTimeout(() => {
        setAlert(null);
      }, 5000);
    }
  }, [transactionNo]);

  return (
    <div className="flex flex-col h-full bg-gray-900">
      <div className="flex flex-row items-start justify-between p-15 h-[90%] text-white">
        <div className="w-[50%] max-w-4xl flex flex-col">
          <AdminDetails publicKey={publicKey} solBalance={balance} czBalance={tokenBalance} />
          <div id="dexdetails">
            <DexReserves />
          </div>
        </div>
        <div className="w-[40%] max-w-4xl space-y-6">
          
          <RegulateSupply />
          <AllotTokens/>
        </div>
      </div>
    </div>
  );
};

export default Admin;
