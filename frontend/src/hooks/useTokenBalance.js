import { useState, useEffect } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddressSync ,TOKEN_2022_PROGRAM_ID } from '@solana/spl-token';

const useTokenBalance = ( userPublicKey) => {
    const [balance, setBalance] = useState(null);

    useEffect(() => {
        if (!userPublicKey) return;

        const connection = new Connection('http://127.0.0.1:8899', 'confirmed');

        const fetchTokenBalance = async () => {
            try {
                // Convert the token mint address and user public key to PublicKey objects
                const tokenMintPublicKey = new PublicKey("carQ4YQfUsjDRVwWXTvUxW5DwXWo5uCU7YuN9frvJ4w");
                const userPublicKeyObj = userPublicKey;

                // Get the associated token account address for the user
                const associatedTokenAccount = await getAssociatedTokenAddressSync(
                    tokenMintPublicKey,
                    userPublicKeyObj,
                    false,
                    TOKEN_2022_PROGRAM_ID,
                );

                // Fetch the token account information
                
                const amount =await connection.getTokenAccountBalance(associatedTokenAccount);

                // Set the balance (amount is in the smallest unit, e.g., lamports for SOL)
                setBalance(amount.value.uiAmount);
                
            } catch (error) {
                console.error('Error fetching token balance:', error);
                setBalance(null);
            }
        };

        fetchTokenBalance();

        // Optionally, you can set up an interval to poll the balance periodically
        const intervalId = setInterval(fetchTokenBalance, 20 * 1000); // Poll every 20 seconds
        return () => clearInterval(intervalId); // Cleanup on unmount
    }, [ userPublicKey]);

    return balance;
};

export default useTokenBalance;