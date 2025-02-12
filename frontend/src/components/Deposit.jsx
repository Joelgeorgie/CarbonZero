import React, { useState } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import { keypairA, transactionCount, tokenA } from '../Recoil/atoms';
import executeDeposit from '../solana-requests/executeDeposit';

const Deposit = () => {
    const keypair = useRecoilValue(keypairA);
    const [transactionNo, setTransactionNo] = useRecoilState(transactionCount);
    const [authToken, setAuthToken] = useRecoilState(tokenA);
    const [depositAmount, setDepositAmount] = useState(0);

    const deposit = async () => {
        const signature = await executeDeposit(keypair, depositAmount, authToken);
        console.log(signature);
        setTransactionNo((prev) => prev + 1);
    };

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-start text-gray-100 border-b-2 border-gray-900 w-full pb-5">
                Deposit
            </h2>
            <div className="flex items-center justify-between mt-10 px-10">
                <input
                    
                    placeholder="Amount"
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-[40%] px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:ring  "
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
