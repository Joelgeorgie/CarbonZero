import axios from 'axios';
import transferTokens from './transferTokens';

export default async function executeSell(keypair, amount, token) {
  const dexAddress = 'DEeu5eisQA2k68uusV6LWcCyrRzEuMkdJGa2uFDsXNeL';

  const signature = await transferTokens(keypair, dexAddress, amount);

  try {
    
    const response = await axios.post(
      `http://localhost:3000/api/v1/trade/execute/sell/${amount}`, 
      {}, 
      {
        headers: {
          Authorization: token, 
        },
      }
    );

    console.log('Sell Execution Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error executing sell:', error.response ? error.response.data : error.message);
    throw error;
  }
}