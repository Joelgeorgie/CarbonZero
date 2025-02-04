import { 
    getAssociatedTokenAddressSync, 
    TOKEN_2022_PROGRAM_ID, 
    createTransferCheckedInstruction 
  } from "@solana/spl-token";
  import { 
    Connection, 
    Keypair, 
    PublicKey, 
    Transaction, 
    sendAndConfirmTransaction,
    LAMPORTS_PER_SOL 
  } from "@solana/web3.js";
  import bs58 from 'bs58';
  import { MINT_ADDRESS , AUTHORITY_PRIVATE_KEY } from '../config.js';
  
  export default async function transferTokens(to, amount) {
    // Initialize connection to Solana devnet
    const connection = new Connection('http://127.0.0.1:8899', 'confirmed');
  
    // Decode the sender's secret key
    const privateKeyArray = bs58.decode(AUTHORITY_PRIVATE_KEY);
    const authority = Keypair.fromSecretKey(privateKeyArray);
    
  
    // Define the mint address for carbon credits
    const mint = new PublicKey(MINT_ADDRESS);
  
    // Get the recipient's public key
    const toAddress = new PublicKey(to);
  
    // Get the associated token addresses for sender and recipient
    const fromAssociatedToken = getAssociatedTokenAddressSync(
      mint,
      authority.publicKey,
      false,
      TOKEN_2022_PROGRAM_ID,
    );
  
    const toAssociatedToken = getAssociatedTokenAddressSync(
      mint,
      toAddress,
      false,
      TOKEN_2022_PROGRAM_ID,
    );
  
    console.log("Sender Associated Token Address:", fromAssociatedToken.toBase58());
    console.log("Recipient Associated Token Address:", toAssociatedToken.toBase58());
  
    // Create a transfer instruction
    const transaction = new Transaction().add(
      createTransferCheckedInstruction(
        fromAssociatedToken, 
        mint, 
        toAssociatedToken, 
        authority.publicKey, 
        amount * LAMPORTS_PER_SOL, 
        9, 
        [], 
        TOKEN_2022_PROGRAM_ID 
      )
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
  
  