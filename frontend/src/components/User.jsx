import React, { useEffect , useState } from 'react';
import {useRecoilState , useRecoilValue } from 'recoil';
import axios from 'axios';
import { keypairA, parsedTokenA, tokenA , transactionCount} from '../Recoil/atoms';
import useBalance from '../hooks/useBalance';
import useTokenBalance from '../hooks/useTokenBalance';
import TradeComponent from './TradeComponent'; 
import Deposit from './Deposit';

const User = () => {
    const keypair = useRecoilValue(keypairA);
    const parsedToken = useRecoilValue(parsedTokenA);
    const [transactionNo,setTransactionNo] = useRecoilState(transactionCount);
    const [authToken, setAuthToken] = useRecoilState(tokenA);
    const balance = useBalance(keypair,transactionNo);
    const tokenBalance = useTokenBalance(keypair.publicKey,transactionNo);
    const [czDepositBalance, setCzDepositBalance] = useState(0);

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
            console.error('Error fetching deposit balance:', error);
        }
    };

    useEffect(() => {
        fetchDepositBalance();
    }, [transactionNo]);
    
    return (
        <div>
            <h2>User Dashboard</h2>
            <h3>Public Key: {keypair.publicKey.toString()}</h3>
            <h3>Company Name: {parsedToken.companyName}</h3>
            <h3>Total Carbon Credit Requirement: {parsedToken.czTotal}</h3>
            <h3>Remaining Carbon Credits Needed : {czDepositBalance}</h3>
            <h3>Sol Balance: {balance} SOL</h3>
            <h2>Token Balance: {tokenBalance} Tokens</h2>

           
            <TradeComponent/>
            <Deposit/>

            
        </div>
    );
};

export default User;