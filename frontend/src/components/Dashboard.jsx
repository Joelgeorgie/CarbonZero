import React from 'react';
import {  useRecoilValue } from 'recoil';
import {  keypairA } from '../Recoil/atoms';
import Admin from './Admin';
import User from './User';
import Navbar from './Navbar';

const Dashboard = () => {
    
    const keypair = useRecoilValue(keypairA);
    


    // Admin public key
    const adminPublicKey = 'DEeu5eisQA2k68uusV6LWcCyrRzEuMkdJGa2uFDsXNeL';

    

    // Check if the user is an admin
    const isAdmin = keypair.publicKey.toString() === adminPublicKey;

    return (
        <div className='w-full h-screen'>
            <Navbar/>
            {isAdmin ? <Admin /> : <User />}
        </div>
    );
};

export default Dashboard;
