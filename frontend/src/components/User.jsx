// User.js
import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import axios from "axios";
import {
  keypairA,
  parsedTokenA,
  tokenA,
  transactionCount,
  alertState,
  transactionLogs,
} from "../Recoil/atoms";

import useBalance from "../hooks/useBalance";
import useTokenBalance from "../hooks/useTokenBalance";
import TradeComponent from "./TradeComponent";
import Deposit from "./Deposit";
import LineData from "./LineData";

const User = () => {
  const keypair = useRecoilValue(keypairA);
  const parsedToken = useRecoilValue(parsedTokenA);
  const [transactionNo, setTransactionNo] = useRecoilState(transactionCount);
  const [authToken, setAuthToken] = useRecoilState(tokenA);
  const balance = useBalance(keypair, transactionNo);
  const tokenBalance = useTokenBalance(keypair.publicKey, transactionNo);
  const [czDepositBalance, setCzDepositBalance] = useState(0);
  const [alert, setAlert] = useRecoilState(alertState);
  const [transactionState, setTransactionState] =
    useRecoilState(transactionLogs);

  const fetchDepositBalance = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/v1/deposit/balance/`,
        {
          headers: {
            Authorization: `${authToken}`,
          },
        }
      );

      const data = response.data;
      setCzDepositBalance(data.company.czNeeded);
      console.log(data);
    } catch (error) {
      console.error("Error fetching deposit balance:", error);
    }
  };

  useEffect(() => {
    fetchDepositBalance();
    console.log(transactionState);

    if (transactionState.length > 0) {
      const lastTransaction = transactionState[transactionState.length - 1];
      let signature = "";
      if (lastTransaction.type === "deposit") {
        signature = lastTransaction.signature;
      } else {
        signature = lastTransaction.signature.signature;
      }
      setAlert({
        type: lastTransaction.type,
        message: lastTransaction.message,
        signature,
      });

      setTimeout(() => {
        setAlert(null);
      }, 5000);
    }
  }, [transactionNo]);

  return (
    <div className="flex flex-row w-full items-start justify-between p-15 h-[90%] bg-gray-900 text-white ">
      <div className="w-[50%] max-w-4xl p-6 space-y-6 bg-gray-800  rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-start border-b-2 border-gray-900 pb-5">
          {parsedToken.companyName}
        </h1>
        <LineData
          name="Public Key"
          value={keypair.publicKey.toString()}
          canCopied={true}
        />
        {parsedToken.czTotal !== 0 && (
          <>
            <LineData
              name="Total Carbon Credit Requirement"
              value={parsedToken.czTotal}
            />
            <LineData
              name="Remaining Carbon Credits Needed"
              value={czDepositBalance}
            />
          </>
        )}
        <LineData name="Sol Balance" value={`${balance}`} />
        <LineData name="CZ Balance" value={`${tokenBalance}`} />
      </div>

      <div className="w-[40%] max-w-4xl h-full flex flex-col justify-start">
        <div className=" p-6 space-y-6 rounded-lg shadow-lg bg-gray-800 mb-15">
          <TradeComponent />
        </div>
        {czDepositBalance > 0 && (
          <div className="p-6 space-y-6 rounded-lg shadow-lg bg-gray-800">
            <Deposit />
          </div>
        )}
      </div>
    </div>
  );
};

export default User;
