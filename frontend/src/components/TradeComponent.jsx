import React, { useState, useEffect } from "react";
import axios from "axios";
import executeBuy from "../solana-requests/executeBuy";
import executeSell from "../solana-requests/executeSell";
import { useRecoilValue, useRecoilState } from "recoil";
import { keypairA, tokenA, transactionCount,transactionLogs } from "../Recoil/atoms";

const TradeComponent = () => {
  const [tradeAmount, setTradeAmount] = useState(1);
  const keypair = useRecoilValue(keypairA);
  const authToken = useRecoilValue(tokenA);
  const [transactionNo, setTransactionNo] = useRecoilState(transactionCount);
  const [quote, setQuote] = useState({ buy: 0, sell: 0 });
  const [buySelect, setBuySelect] = useState(true);
  const [transactionState,setTransactionState] = useRecoilState(transactionLogs);

  // Function to fetch buy and sell quotes
  const fetchQuotes = async () => {
    const reqAmount = parseInt(tradeAmount);
    if (isNaN(reqAmount) || !Number.isInteger(reqAmount)) {
      console.log("Trade amount must be an integer");
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
      console.error("Error fetching quotes:", error);
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
      console.log("Trade amount must be an integer");
      setTransactionNo((prev) => prev + 1);
      setTransactionState((prev) => [
        ...prev,
        { type: "error" ,message:"Amount not valid" },
      ]);
      return;
    }
    const signature = await executeSell(keypair, tradeAmount, authToken);
    console.log(signature);
    
    // Update transaction count
    setTransactionNo((prev) => prev + 1);
    
    // Append new transaction to transactionState
    setTransactionState((prev) => [
      ...prev,
      { type: "sell", signature ,message:"Sell Order Executed" },
    ]);
  
    fetchQuotes();
  };
  
  const buyTokens = async () => {
    if (isNaN(tradeAmount) || !Number.isInteger(parseFloat(tradeAmount))) {
      console.log("Trade amount must be an integer");
      setTransactionNo((prev) => prev + 1);
      setTransactionState((prev) => [
        ...prev,
        { type: "error" ,message:"Amount not valid" },
      ]);
      return;
    }
    const signature = await executeBuy(keypair, tradeAmount, authToken);
    console.log(signature);
    
    // Update transaction count
    setTransactionNo((prev) => prev + 1);
    
    // Append new transaction to transactionState
    setTransactionState((prev) => [
      ...prev,
      { type: "buy", signature ,message:"Buy Order Executed" },
    ]);
  
    fetchQuotes();
  };
  

  return (
    <div className="space-y-4 flex flex-col items-center w-full p-6  rounded-lg shadow-lg bg-gray-800 mb-15">
      <h2 className="text-xl font-semibold text-start text-gray-100 border-b-2 border-gray-900 w-full pb-5">
        Trade
      </h2>

      <div className="w-full h-15  text-base mt-7">
        {buySelect ? (
          <div className="flex flex-row  w-full justify-between px-10">
            <input
              placeholder="Token Amount"
              value={tradeAmount}
              onChange={(e) => setTradeAmount(e.target.value)}
              className=" w-[30%] px-4 py-2 rounded-md border-gray-900 border-2 text-center focus:ring focus:ring-indigo-200 focus:outline-none"
            />
            <button
              className="w-[10%] rounded-b-full bg-gray-900 text-xl"
              onClick={(e) => {
                setBuySelect(!buySelect);
              }}
            >{"<=>"}</button>
            <label className="text-red-400 w-[30%] text-center flex items-center justify-center ">- {quote.buy}</label>
          </div>
        ) : (
          <div className="flex flex-row  w-full justify-between px-10">
            <label className="text-green-400 w-[30%] text-center flex items-center justify-center">+ {quote.sell}</label>
            
            <button
              className="w-[10%] rounded-b-full bg-gray-900"
              onClick={(e) => {
                setBuySelect(!buySelect);
              }}
            > {"<=>"}</button>

            <input
              placeholder="Token Amount"
              value={tradeAmount}
              onChange={(e) => setTradeAmount(e.target.value)}
              className=" w-[30%] px-4 py-2 rounded-md border-gray-900 border-2 text-center focus:ring focus:ring-indigo-200 focus:outline-none"
            />
            
          </div>
        )}
      </div>

      <div className="flex justify-center space-x-4">
        {buySelect ? (
        <button
          onClick={buyTokens}
          className="px-4 py-2 font-semibold  text-gray-900 bg-green-400 rounded-md hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-200 w-24"
        >
          Buy
        </button>) : (
            <button
            onClick={sellTokens}
            className="px-4 py-2 font-semibold text-gray-900 bg-red-400  rounded-md hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-200 w-24"
          >
            Sell
          </button>
            
        )}
        
        
        
      </div>
    </div>
  );
};

export default TradeComponent;
