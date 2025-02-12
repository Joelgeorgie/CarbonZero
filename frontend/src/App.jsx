import React, { useState, useEffect } from 'react';
import {  Routes, Route, Navigate } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { tokenA ,privateKeyA } from './Recoil/atoms';
import { useRecoilState } from 'recoil';

function App() {
  
    const [token, setToken] = useRecoilState(tokenA);
    const [privateKey, setPrivateKey] = useRecoilState(privateKeyA);
    

    
    useEffect(() => {
        // Set initial authentication status
        if (localStorage.getItem('token') && localStorage.getItem('privateKey')) {
            setToken(localStorage.getItem('token'));
            setPrivateKey(localStorage.getItem('privateKey'));
        }
    }, []);  

    return (
        <><div className='w-full'>
            <Routes>
                {/* Public Routes */}
                {!(token && privateKey) ? (
                    <>
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="*" element={<Navigate to="/login" />} />
                    </>
                ) : (
                    // Protected Routes
                    <>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="*" element={<Navigate to="/dashboard" />} />
                    </>
                )}
            </Routes>
            </div>
            </>
    );
}

export default App;
