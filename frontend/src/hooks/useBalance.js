import { useState, useEffect } from 'react';
import { Connection, LAMPORTS_PER_SOL } from '@solana/web3.js';

const useBalance = (keypair,transactionNo) => {
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        if (!keypair) return;

        const connection = new Connection('http://127.0.0.1:8899', 'confirmed');

        const fetchBalance = async () => {
            try {
                const publicKey = keypair.publicKey;
                const walletBalance = await connection.getBalance(publicKey);
                setBalance(walletBalance / LAMPORTS_PER_SOL);
            } catch (error) {
                console.error('Error fetching balance:', error);
            }
        };

        fetchBalance();

        const intervalId = setInterval(fetchBalance, 20 * 1000); 
        return () => clearInterval(intervalId); 
    }, [keypair,transactionNo]);

    return balance;
};

export default useBalance;
