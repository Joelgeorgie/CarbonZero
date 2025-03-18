import React, { useState } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import { keypairA, transactionCount, tokenA, transactionLogs } from '../Recoil/atoms';
import executeDeposit from '../solana-requests/executeDeposit';

const Deposit = () => {
    const keypair = useRecoilValue(keypairA);
    const [transactionNo, setTransactionNo] = useRecoilState(transactionCount);
    const [authToken, setAuthToken] = useRecoilState(tokenA);
    const [depositAmount, setDepositAmount] = useState(0);
    const [transactionState,setTransactionState] = useRecoilState(transactionLogs);

    const deposit = async () => {
        const signature = await executeDeposit(keypair, depositAmount, authToken);
        console.log(signature);
        setTransactionNo((prev) => prev + 1);
        setTransactionState((prev) => [
            ...prev,
            { type: "deposit", signature, message:"Amount deposited"  },
          ]);
    };

    return (
        <div className="space-y-4 p-6  rounded-lg shadow-lg bg-gray-800 mt-12">
            <h2 className="text-xl font-semibold text-start text-gray-100 border-b-2 border-gray-900 w-full pb-5">
                Deposit
            </h2>
            <div className="flex items-center justify-between mt-5 ">
                <input
                    
                    placeholder="Amount"
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-[40%] px-4 py-2 rounded-md border-gray-900 border-2  focus:ring text-center "
                />
                <button
                    onClick={deposit}
                    className="px-4 py-2 font-semibold  bg-green-400 rounded-md  text-gray-900 focus:outline-none focus:ring "
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default Deposit;
