import { 
    Connection, 
    Keypair, 
    PublicKey, 
    Transaction, 
    sendAndConfirmTransaction,
    SystemProgram,
    LAMPORTS_PER_SOL 
  } from "@solana/web3.js";
  import bs58 from 'bs58';
  import { AUTHORITY_PRIVATE_KEY } from '../config.js';
  
  export default async function transferSol(to, amount) {
    // Initialize connection to Solana devnet
    const connection = new Connection('http://127.0.0.1:8899', 'confirmed');
  
    // Decode the sender's secret key
    const privateKeyArray = bs58.decode(AUTHORITY_PRIVATE_KEY);
    const authority = Keypair.fromSecretKey(privateKeyArray);
  
    // Define the recipient's public key
    const toAddress = new PublicKey(to);
  
    // Create a transfer instruction using SystemProgram
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: authority.publicKey,
        toPubkey: toAddress,
        lamports: amount * LAMPORTS_PER_SOL, // Convert SOL to lamports
      })
    );
  
    try {
      // Send the transaction
      const signature = await sendAndConfirmTransaction(connection, transaction, [authority]);
      console.log('Transaction Signature:', signature);
      return signature;
    } catch (error) {
      console.error('Error sending transaction:', error);
      throw error; // Re-throw the error for handling upstream
    }
  }