import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { keypairA } from '../Recoil/atoms';
import useBalance from '../hooks/useBalance';
import useTokenBalance from '../hooks/useTokenBalance'; 
import bs58 from 'bs58';

import mintTo  from '../solana-requests/mintTokens';
import burnTokens from '../solana-requests/burnTokens';

const Admin = () => {
    const keypair = useRecoilValue(keypairA);
    const balance = useBalance(keypair);
    const tokenBalance = useTokenBalance(keypair.publicKey);
    const [mintAmount, setMintAmount] = useState(0);
    const [burnAmount, setBurnAmount] = useState(0);

    const mintCZ = async () => {
        const signature = await mintTo(keypair, mintAmount);
        console.log(signature);
    }

    const burnCZ = async () => {
        const signature = await burnTokens(keypair, burnAmount);
        console.log(signature);
    }


    return (
        <div>
            <h1>Admin Dashboard</h1>
            <h2>Public Key: {keypair.publicKey.toString()}</h2>
            <h2>Private Key: {bs58.encode(keypair.secretKey)}</h2>
            
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
