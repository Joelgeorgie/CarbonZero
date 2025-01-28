import { 
    Connection, 
    PublicKey, 
    Keypair, 
    Transaction, 
    sendAndConfirmTransaction 
} from '@solana/web3.js';

import { 
    getAssociatedTokenAddressSync, 
    TOKEN_2022_PROGRAM_ID, 
    createAssociatedTokenAccountInstruction 
} from '@solana/spl-token';

import bs58 from 'bs58';

import { MINT_ADDRESS , AUTHORITY_PRIVATE_KEY } from '../config.js';

export default async function createTokenAccount(owner) {
   
    const mint = new PublicKey(MINT_ADDRESS);
    const ownerKey = new PublicKey(owner);
    const privateKeyArray = bs58.decode(AUTHORITY_PRIVATE_KEY);
    const authority = Keypair.fromSecretKey(privateKeyArray);
    const connection = new Connection('http://127.0.0.1:8899', 'confirmed');

    const associatedToken = getAssociatedTokenAddressSync(
        mint,
        ownerKey,
        false,
        TOKEN_2022_PROGRAM_ID,
    );

    console.log(associatedToken.toBase58());

    const transaction = new Transaction().add(
        createAssociatedTokenAccountInstruction(
            authority.publicKey,
            associatedToken,
            ownerKey,
            mint,
            TOKEN_2022_PROGRAM_ID,
        ),
    );

    const signature = await sendAndConfirmTransaction(connection, transaction, [authority]);

    return {signature, associatedToken};
}
