import React, { useState } from 'react';
import { useRecoilValue,useRecoilState } from 'recoil';
import { keypairA ,transactionCount } from '../Recoil/atoms';
import useBalance from '../hooks/useBalance';
import useTokenBalance from '../hooks/useTokenBalance'; 
import bs58 from 'bs58';

import mintTo  from '../solana-requests/mintTokens';
import burnTokens from '../solana-requests/burnTokens';

const Admin = () => {
    const keypair = useRecoilValue(keypairA);
    const [transactionNo,setTransactionNo] = useRecoilState(transactionCount);
    const balance = useBalance(keypair,transactionNo);
    const tokenBalance = useTokenBalance(keypair.publicKey,transactionNo);
    const [mintAmount, setMintAmount] = useState(0);
    const [burnAmount, setBurnAmount] = useState(0);

    const mintCZ = async () => {
        const signature = await mintTo(keypair, mintAmount);
        console.log(signature);
        setTransactionNo((prev)=>prev+1);
    }

    const burnCZ = async () => {
        const signature = await burnTokens(keypair, burnAmount);
        console.log(signature);
        setTransactionNo((prev)=>prev+1);
    }


    return (
        <div>
            <h1>Admin Dashboard</h1>
            <h2>Public Key: {keypair.publicKey.toString()}</h2>
            <h2>Token Mint Address : carQ4YQfUsjDRVwWXTvUxW5DwXWo5uCU7YuN9frvJ4w </h2>
            
            <h2>Sol Balance: {balance} SOL</h2>
            <h2>Token Balance: {tokenBalance} Tokens</h2>
            <input type="number"  placeholder='Amount' onChange={(e)=>{setMintAmount(e.target.value)}}/>
            <button onClick={mintCZ} style={{ marginBottom: '20px' }}>
                Mint Tokens
            </button>
            <input type="number" placeholder='Amount' onChange={(e)=>{setBurnAmount(e.target.value)}}/>
            <button onClick={burnCZ} style={{ marginBottom: '20px' }}>
               Burn Tokens
            </button>
        </div>
    );
};

export default Admin;
