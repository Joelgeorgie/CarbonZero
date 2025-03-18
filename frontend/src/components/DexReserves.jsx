import React, { useEffect, useState } from 'react';

const DexReserves = () => {
  const [reserves, setReserves] = useState({ totalCZ: 0, totalSol: 0 });

  useEffect(() => {
    const fetchReserves = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/v1/trade/reserves');
        const data = await response.json();
        setReserves(data);
      } catch (error) {
        console.error('Error fetching reserves:', error);
      }
    };

    fetchReserves();
    const interval = setInterval(fetchReserves, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='mt-15 h-max p-6 space-y-6 bg-gray-800 rounded-lg shadow-lg flex flex-col'>
      <h1 className='text-2xl font-bold border-b-2 border-gray-900 pb-5'>DEX Reserves</h1>
      <div className='flex justify-between text-gray-100'>
        <div>{reserves.totalCZ} CZ</div> <div>:</div> <div>{reserves.totalSol.toFixed(6)} Sol</div>
      </div>
    </div>
  );
};

export default DexReserves;
