import { 
    Connection, 
    Keypair, 
    PublicKey, 
    Transaction, 
    sendAndConfirmTransaction,
    SystemProgram,
    LAMPORTS_PER_SOL 
  } from "@solana/web3.js";
  

  export default async function transferSol(fromkeyPair,to, amount) {
    // Initialize connection to Solana devnet
    const connection = new Connection('http://127.0.0.1:8899', 'confirmed');
  
    const authority = fromkeyPair
  
    // Define the recipient's public key
    const toAddress = new PublicKey(to);
    
    const roundAmount = parseFloat(amount);
    
    // Create a transfer instruction using SystemProgram
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: authority.publicKey,
        toPubkey: toAddress,
        lamports: Math.floor(roundAmount * LAMPORTS_PER_SOL), // Convert SOL to lamports
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