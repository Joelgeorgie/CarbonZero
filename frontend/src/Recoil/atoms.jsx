import { atom, selector } from 'recoil';
import { Keypair, Connection, LAMPORTS_PER_SOL } from '@solana/web3.js';
import bs58 from 'bs58';

// Atoms for storing token and private key as strings
const tokenA = atom({
  key: 'tokenA', 
  default: null,         
});

const privateKeyA = atom({
  key: 'privateKeyA', 
  default: null,         
});



// Selector for deriving the Keypair class instance
const keypairA = selector({
  key: 'keypairA',
  get: ({ get }) => {
    const privateKey = get(privateKeyA);
    if (!privateKey) return null; // Handle null case gracefully
    try {
      const privateKeyArray = bs58.decode(privateKey);
      return Keypair.fromSecretKey(privateKeyArray);
    } catch (error) {
      console.error('Invalid private key:', error);
      return null;
    }
  },
});


const parsedTokenA = selector({
  key: 'parsedTokenA',
  get: ({ get }) => {
    const token = get(tokenA);
    if (!token) return null; // Return null if token is not set

    try {
      const tokenParts = token.split('.'); // JWT is in the form header.payload.signature
      if (tokenParts.length !== 3) throw new Error('Invalid JWT token format.');

      const payload = JSON.parse(atob(tokenParts[1])); // Decode the payload (Base64)
      const { name: companyName, publicKey, czTotal } = payload;

      return { companyName, publicKey, czTotal };
    } catch (error) {
      console.error('Failed to parse JWT token:', error);
      return null; // Return null if parsing fails
    }
  },
});




export { tokenA, privateKeyA, keypairA , parsedTokenA  };
