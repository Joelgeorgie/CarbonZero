import axios from 'axios';
import transferTokens from './transferTokens';

export default async function executeDeposit(keypair, amount, token) {
  const dexAddress = 'DEeu5eisQA2k68uusV6LWcCyrRzEuMkdJGa2uFDsXNeL';

  const signature = await transferTokens(keypair, dexAddress, amount);

  try {
    
    const response = await axios.post(
      `http://localhost:3000/api/v1/deposit/credits/${amount}`, 
      {}, 
      {
        headers: {
          Authorization: token, 
        },
      }
    );

    console.log('Deposit Response:', response.data);
    return signature;
  } catch (error) {
    console.error('Error executing deposit:', error.response ? error.response.data : error.message);
    throw error;
  }
}