import React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { tokenA, privateKeyA, keypairA, parsedTokenA } from '../Recoil/atoms';
import Admin from './Admin';
import User from './User';

const Dashboard = () => {
    const [token, setToken] = useRecoilState(tokenA);
    const [privateKey, setPrivateKey] = useRecoilState(privateKeyA);
    const keypair = useRecoilValue(keypairA);
    const parsedToken = useRecoilValue(parsedTokenA);


    // Admin public key
    const adminPublicKey = 'DEeu5eisQA2k68uusV6LWcCyrRzEuMkdJGa2uFDsXNeL';

    // Logout function
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('privateKey');
        setToken(null);
        setPrivateKey(null);
    };

    // Check if the user is an admin
    const isAdmin = keypair.publicKey.toString() === adminPublicKey;

    return (
        <div>
            <h1>Welcome to the Dashboard!</h1>
            <button onClick={handleLogout} style={{ marginBottom: '20px' }}>
                Logout
            </button>
            {isAdmin ? <Admin /> : <User />}
        </div>
    );
};

export default Dashboard;
