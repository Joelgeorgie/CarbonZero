import React, { useState } from 'react';
import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';
import { Link } from 'react-router-dom';
import { tokenA, privateKeyA } from '../Recoil/atoms';
import { useRecoilState } from 'recoil';

const Login = () => {
    const [formData, setFormData] = useState({
        password: '',
        privateKey: '',
    });

    const [token, setToken] = useRecoilState(tokenA);
    const [privateKey, setPrivateKey] = useRecoilState(privateKeyA);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleLogin = (e) => {
        e.preventDefault(); // Prevent default form submission

        try {
            // Decode the Base58 private key and derive the public key
            const privateKeyArray = bs58.decode(formData.privateKey);
            const keypair = Keypair.fromSecretKey(privateKeyArray);
            const publicKey = keypair.publicKey.toString();

            // Send the login request with the derived public key
            fetch('http://localhost:3000/api/v1/companies/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    password: formData.password,
                    publicKey,
                }),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.message) {
                        console.log('Success:', data.message, data.token);
                        localStorage.setItem('token', 'Bearer ' + data.token); // Save token to localStorage
                        localStorage.setItem('privateKey', formData.privateKey); // Save private key as Base58 in localStorage
                        setToken(localStorage.getItem('token'));
                        setPrivateKey(localStorage.getItem('privateKey'));
                        console.log(1);
                    } else {
                        console.error('Error:', data);
                        alert(data.message || 'Login failed. Please check your credentials.');
                    }
                })
                .catch((error) => {
                    console.error('Network Error:', error);
                    alert('Network error occurred. Please try again.');
                });
        } catch (error) {
            console.error('Invalid Private Key:', error);
            alert('Invalid private key. Please ensure it is a valid Base58-encoded Solana private key.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="w-full max-w-md bg-gray-800 p-12 rounded-lg shadow-lg">
                <h1 className="text-3xl font-semibold text-center text-green-400 mb-8">Login</h1>
                <form onSubmit={handleLogin}>
                    <div className="mb-6">
                        <label htmlFor="privateKey" className="block text-sm font-medium text-gray-300">Solana Private Key</label>
                        <input
                            type="text"
                            name="privateKey"
                            id="privateKey"
                            value={formData.privateKey}
                            onChange={handleInputChange}
                            placeholder="Enter your Base58 private key"
                            className="mt-2 w-full px-4 py-3 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-gray-200"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Enter your password"
                            className="mt-2 w-full px-4 py-3 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-gray-200"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-green-400 text-gray-900 py-3 rounded-lg hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Login
                    </button>
                </form>
                <p className="mt-6 text-center text-sm text-gray-400">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-green-400 hover:text-green-500 ">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
