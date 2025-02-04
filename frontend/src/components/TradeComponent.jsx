import React, { useState, useEffect } from 'react';
import axios from 'axios';
import executeBuy from '../solana-requests/executeBuy';
import executeSell from '../solana-requests/executeSell';
import { useRecoilValue ,useRecoilState } from 'recoil';
import { keypairA, tokenA ,transactionCount} from '../Recoil/atoms';

const TradeComponent = () => {
    const [tradeAmount, setTradeAmount] = useState(1);
    const keypair = useRecoilValue(keypairA);
    const authToken = useRecoilValue(tokenA);
    const [transactionNo,setTransactionNo] = useRecoilState(transactionCount);
    const [quote, setQuote] = useState({ buy: 0, sell: 0 });

    // Function to fetch buy and sell quotes
    const fetchQuotes = async () => {
        const reqAmount = parseInt(tradeAmount);
        if (isNaN(reqAmount) || !Number.isInteger(reqAmount)) {
            console.log('Trade amount must be an integer');
            setQuote({
                buy: 0, 
                sell: 0, 
            });

            return;
        }
        try {
            const buyResponse = await axios.get(
                `http://localhost:3000/api/v1/trade/quote/buy/${reqAmount}`
            );

            const sellResponse = await axios.get(
                `http://localhost:3000/api/v1/trade/quote/sell/${reqAmount}`
            );
            
            setQuote({
                buy: buyResponse.data.solAmount, 
                sell: sellResponse.data.solAmount, 
            });
        } catch (error) {
            setQuote({
                buy: 0, 
                sell: 0, 
            });
            console.error('Error fetching quotes:', error);
        }
    };

    // useEffect to fetch quotes when tradeAmount changes
    useEffect(() => {
        fetchQuotes(); // Fetch quotes immediately when tradeAmount changes
    }, [tradeAmount]);

    // useEffect to fetch quotes every 10 seconds
    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         fetchQuotes(); // Fetch quotes every 10 seconds
    //     }, 10000); // 10 seconds

    //     return () => clearInterval(interval); // Cleanup interval on component unmount
    // }, []);

    const sellTokens = async () => {
        if (isNaN(tradeAmount) || !Number.isInteger(parseFloat(tradeAmount))) {
            console.log('Trade amount must be an integer');
            return;
        }
        const signature = await executeSell(keypair, tradeAmount, authToken);
        console.log(signature);
        setTransactionNo((prev)=>prev+1);
        fetchQuotes()
    };

    const buyTokens = async () => {
        if (isNaN(tradeAmount) || !Number.isInteger(parseFloat(tradeAmount))) {
            console.log('Trade amount must be an integer');
            return;
        }
        const signature = await executeBuy(keypair, tradeAmount, authToken);
        console.log(signature);
        setTransactionNo((prev)=>prev+1);
        fetchQuotes()
    };

    return (
        <div>
            <h2>Trade Tokens</h2>
            <label>Buy Quote: {quote.buy}</label>
            <button onClick={buyTokens} style={{ marginBottom: '20px', marginRight: '10px' }}>
                Buy Tokens
            </button>

            <input
                type="number"
                placeholder="Token Amount"
                value={tradeAmount}
                onChange={(e) => setTradeAmount(e.target.value)}
            />

            <button onClick={sellTokens} style={{ marginBottom: '20px' }}>
                Sell Tokens
            </button>
            <label>Sell Quote: {quote.sell}</label>
        </div>
    );
};

export default TradeComponent;