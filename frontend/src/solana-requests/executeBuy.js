import axios from 'axios';
import transferSol from './transferSol';

export default async function executeBuy(keypair, czAmount, token) {
  const dexAddress = 'DEeu5eisQA2k68uusV6LWcCyrRzEuMkdJGa2uFDsXNeL';
  console.log('CZ Amount:', czAmount);
  try {
    // Step 1: Fetch the solAmount by making a GET request to the quote endpoint
    const quoteResponse = await axios.get(
      `http://localhost:3000/api/v1/trade/quote/buy/${czAmount}`
    );
    console.log('Quote Response:', quoteResponse.data.solAmount);
    const solAmount = quoteResponse.data.solAmount; // Assuming the response contains solAmount
    console.log('SOL Amount:', solAmount);

    // Step 2: Transfer SOL using the transferSol function
    const signature = await transferSol(keypair, dexAddress, solAmount);

    // Step 3: Make a POST request to execute the buy trade
    const buyResponse = await axios.post(
      `http://localhost:3000/api/v1/trade/execute/buy/${czAmount}`,
      {}, // Request body (empty in this case)
      {
        headers: {
          Authorization: token,
        },
      }
    );

    console.log('Buy Execution Response:', buyResponse.data);
    return buyResponse.data;
  } catch (error) {
    console.error('Error executing buy:', error.response ? error.response.data : error.message);
    throw error;
  }
}