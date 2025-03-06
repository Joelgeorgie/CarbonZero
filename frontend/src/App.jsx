import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Alert from './components/Alert';
import Dashboard from './components/Dashboard';
import { tokenA, privateKeyA } from './Recoil/atoms';
import { useRecoilState } from 'recoil';
import Companies from './components/Companies';

function App() {
    const [token, setToken] = useRecoilState(tokenA);
    const [privateKey, setPrivateKey] = useRecoilState(privateKeyA);
    const [loading, setLoading] = useState(true); // Prevents early redirects

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedPrivateKey = localStorage.getItem('privateKey');

        if (storedToken && storedPrivateKey) {
            setToken(storedToken);
            setPrivateKey(storedPrivateKey);
        }
        setLoading(false); // Mark loading as complete
    }, []);

    if (loading) {
        return <div className="text-white text-center mt-20">Loading...</div>; // Prevent redirects while checking state
    }

    return (
        <div className='w-full'>
            <Alert />
            <Routes>
                {!token || !privateKey ? (
                    <>
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="*" element={<Navigate to="/login" />} />
                    </>
                ) : (
                    <>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/companies" element={<Companies />} />
                        <Route path="*" element={<Navigate to="/dashboard" />} />
                    </>
                )}
            </Routes>
        </div>
    );
}

export default App;
