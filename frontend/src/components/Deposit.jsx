import React,{useState} from 'react'
import { useRecoilValue,useRecoilState } from 'recoil';
import { keypairA ,transactionCount , tokenA } from '../Recoil/atoms';
import executeDeposit from '../solana-requests/executeDeposit';

const Deposit = () => {
    const keypair = useRecoilValue(keypairA);
    const [transactionNo,setTransactionNo] = useRecoilState(transactionCount);
    const [authToken, setAuthToken] = useRecoilState(tokenA);
    const [depositAmount, setDepositAmount] = useState(0);
    

    const deposit = async () => {
        const signature = await executeDeposit(keypair, depositAmount, authToken);
        console.log(signature);
        setTransactionNo((prev)=>prev+1);
    }
  return (
    <div>
        <h1>Deposit</h1>
        <p>Clear your dues</p>
        <input type="number" placeholder="Amount" onChange={(e)=>setDepositAmount(e.target.value)}/>
        <button  onClick={deposit}>Deposit</button>
    </div>
  )
}

export default Deposit