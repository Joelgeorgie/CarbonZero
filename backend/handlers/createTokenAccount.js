import { Connection, PublicKey , Keypair, Transaction, sendAndConfirmTransaction} from '@solana/web3.js';
import { getAssociatedTokenAddressSync ,TOKEN_2022_PROGRAM_ID , createAssociatedTokenAccountInstruction } from '@solana/spl-token';
import bs58 from 'bs58';



export async function createTokenAccount(owner) {

    const mintAddress = "carQ4YQfUsjDRVwWXTvUxW5DwXWo5uCU7YuN9frvJ4w";
    const mint = new PublicKey(mintAddress);
    const ownerkey = new PublicKey(owner);
    const privateKeyArray = bs58.decode("2aT2mNYQikPYpyy6kZ3uyTXcVaaKJfRuAdnjeXiYjMZihUiC2TTRDBikeAkHQGhcuUEwvHrhzyo3j1VptorfiWWk");
    const authority = Keypair.fromSecretKey(privateKeyArray);
    const connection = new Connection('http://127.0.0.1:8899', 'confirmed');

    const associatedToken = getAssociatedTokenAddressSync(
        mint,
        ownerkey,
        false,
        TOKEN_2022_PROGRAM_ID,
    );
    
    console.log(associatedToken.toBase58());
    
    const transaction = new Transaction().add(
        createAssociatedTokenAccountInstruction(
            authority.publicKey,
            associatedToken,
            ownerkey,
            mint,
            TOKEN_2022_PROGRAM_ID,
        ),
    );
    
    const signature = await sendAndConfirmTransaction(connection, transaction,[authority]);

    return signature
}