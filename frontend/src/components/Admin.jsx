import React, { useState ,useEffect } from "react";
import { useRecoilValue, useRecoilState } from "recoil";
import { keypairA, transactionCount ,transactionLogs ,alertState } from "../Recoil/atoms";
import useBalance from "../hooks/useBalance";
import useTokenBalance from "../hooks/useTokenBalance";
import RegulateSupply from "./RegulateSupply";
import Companies from "./Companies";
import { useNavigate } from "react-router-dom";


import LineData from "./LineData";

const Admin = () => {
  const keypair = useRecoilValue(keypairA);
  const [transactionNo, setTransactionNo] = useRecoilState(transactionCount);
  const balance = useBalance(keypair, transactionNo);
  const tokenBalance = useTokenBalance(keypair.publicKey, transactionNo);
  const [transactionState,setTransactionState] = useRecoilState(transactionLogs);
  const [alert, setAlert] = useRecoilState(alertState);
  const navigate = useNavigate();

  useEffect(() => {
      console.log(transactionState);
    
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
    <div className="flex flex-row items-start justify-between p-15 h-[90%]  text-white">
      <div className="w-[50%] max-w-4xl p-6 space-y-6 bg-gray-800  rounded-lg shadow-lg">
        <div className=" font-bold  justify-between border-b-2 border-gray-900 pb-5 flex">
        <h1 className="text-2xl">
          Admin{" "}
        </h1>
        <div className="text-xs flex text-center justify-center items-end cursor-pointer" onClick={() => navigate('/companies')}>Company List</div>
        </div>
        
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
          <LineData key={4} name="CZ Balance" value={`${tokenBalance}`} />
        </div>
      </div >
        <div className="w-[40%] max-w-4xl  space-y-6">
          <RegulateSupply/>
          
        </div>
        
      </div>
      {/* <div></div> */}
    </div>
  );
};

export default Admin;
