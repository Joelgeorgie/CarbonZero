import React from 'react';
import { useRecoilValue } from 'recoil';
import { keypairA, parsedTokenA } from '../Recoil/atoms';
import useBalance from '../hooks/useBalance'; 
import useTokenBalance from '../hooks/useTokenBalance'; 

const User = () => {
    const keypair = useRecoilValue(keypairA);
    const parsedToken = useRecoilValue(parsedTokenA);
    const balance = useBalance(keypair);
    const tokenBalance = useTokenBalance(keypair.publicKey);

    return (
        <div>
            <h2>User Dashboard</h2>
            <h3>Public Key: {keypair.publicKey.toString()}</h3>
            <h3>Company Name: {parsedToken.companyName}</h3>
            <h3>Total Carbon Credit Requirement: {parsedToken.czTotal}</h3>
            <h3>Sol Balance: {balance} SOL</h3>
            <h2>Token Balance: {tokenBalance} Tokens</h2>
        </div>
    );
};

export default User;
