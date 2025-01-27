import {  getAssociatedTokenAddressSync, createMintToInstruction, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import {  Connection, PublicKey, Transaction, sendAndConfirmTransaction , LAMPORTS_PER_SOL} from "@solana/web3.js";


async function mintTo (keypair,amount)  {

  const connection = new Connection('http://127.0.0.1:8899', 'confirmed');
  const wallet = keypair ; 
  console.log(wallet.publicKey.toString());
  
  const mintAddress = "carQ4YQfUsjDRVwWXTvUxW5DwXWo5uCU7YuN9frvJ4w";
  const mint = new PublicKey(mintAddress);

  const associatedToken = getAssociatedTokenAddressSync(
    mint,
    wallet.publicKey,
    false,
    TOKEN_2022_PROGRAM_ID,
  );

  console.log("Associated Token Address:", associatedToken.toBase58());

  

//   Create a transaction to mint tokens to the associated token account
  const transaction = new Transaction().add(
    createMintToInstruction(
      mint,
      associatedToken, // destination account
      wallet.publicKey, // mint authority
      LAMPORTS_PER_SOL*amount, // amount to mint
      [], // signers (mint authority)
      TOKEN_2022_PROGRAM_ID
    )
  );

  
  try {
    const signature = await sendAndConfirmTransaction(connection, transaction, [wallet]);
    console.log('Transaction Signature:', signature);
    return signature;
  } catch (error) {
    console.error('Error sending transaction:', error);
  }
};

export default mintTo;