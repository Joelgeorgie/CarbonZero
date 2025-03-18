import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import axios from "axios";
import { keypairA, parsedTokenA, tokenA, transactionCount, alertState, transactionLogs } from "../Recoil/atoms";

import useBalance from "../hooks/useBalance";
import useTokenBalance from "../hooks/useTokenBalance";
import TradeComponent from "./TradeComponent";
import Deposit from "./Deposit";
import UserDetails from "./Details/UserDetails";

const User = () => {
  const keypair = useRecoilValue(keypairA);
  const parsedToken = useRecoilValue(parsedTokenA);
  const [transactionNo, setTransactionNo] = useRecoilState(transactionCount);
  const [authToken, setAuthToken] = useRecoilState(tokenA);
  const balance = useBalance(keypair, transactionNo);
  const tokenBalance = useTokenBalance(keypair.publicKey, transactionNo);
  const [czDepositBalance, setCzDepositBalance] = useState(0);
  const [alert, setAlert] = useRecoilState(alertState);
  const [transactionState, setTransactionState] = useRecoilState(transactionLogs);

  const fetchDepositBalance = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/v1/deposit/balance/`, {
        headers: {
          Authorization: `${authToken}`,
        },
      });

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

        let signature = lastTransaction.type === "error" 
            ? null 
            : lastTransaction.type === "deposit" 
                ? lastTransaction.signature 
                : lastTransaction.signature.signature;

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
    <div className="flex flex-row w-full items-start justify-between p-14 h-max bg-gray-900 text-white ">
      <div className="w-[50%] max-w-4xl">
        <UserDetails
          publicKey={keypair.publicKey.toString()}
          companyName={parsedToken.companyName}
          czTotal={parsedToken.czTotal}
          czDepositBalance={czDepositBalance}
          solBalance={balance}
          czBalance={tokenBalance}
        />
        {czDepositBalance > 0 && <Deposit />}
      </div>

      <div className="w-[40%] max-w-4xl h-full flex flex-col justify-start">
        <TradeComponent />
        
      </div>
    </div>
  );
};

export default User;
