import React, { useState } from 'react';
import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';
import { Link } from 'react-router-dom';
import { tokenA, privateKeyA } from '../Recoil/atoms';
import { useRecoilState } from 'recoil';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        password: '',
        privateKey: '',
        czTotal: '',
    });

    const [token, setToken] = useRecoilState(tokenA);
    const [privateKey, setPrivateKey] = useRecoilState(privateKeyA);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSignup = (e) => {
        e.preventDefault(); // Prevent default form submission

        try {
            // Decode the Base58 private key and derive the public key
            const privateKeyArray = bs58.decode(formData.privateKey);
            const keypair = Keypair.fromSecretKey(privateKeyArray);
            const publicKey = keypair.publicKey.toString();

            // Send the signup request with the derived public key
            fetch('http://localhost:3000/api/v1/companies/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    password: formData.password,
                    publicKey,
                    czTotal: Number(formData.czTotal),
                    czNeeded: Number(formData.czTotal), // czNeeded equals czTotal
                }),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.token) {
                        console.log('Success:', data.message, data.token, data.errors);
                        localStorage.setItem('token', 'Bearer ' + data.token); // Save token to localStorage
                        localStorage.setItem('privateKey', formData.privateKey); // Store the private key as Base58
                        setToken(localStorage.getItem('token'));
                        setPrivateKey(localStorage.getItem('privateKey'));
                    } else {
                        console.error('Error:', data);
                    }
                })
                .catch((error) => {
                    console.error('Network Error:', error);
                });
        } catch (error) {
            console.error('Invalid Private Key:', error);
            alert('Invalid private key. Please ensure it is a valid Base58-encoded Solana private key.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="w-full max-w-md bg-gray-800 p-12 rounded-lg shadow-lg">
                <h1 className="text-3xl font-semibold text-center text-green-400 mb-8">Sign Up</h1>
                <form onSubmit={handleSignup}>
                    <div className="mb-6">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300">Company Name</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter your company name"
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
                    <div className="mb-6">
                        <label htmlFor="privateKey" className="block text-sm font-medium text-gray-300">Solana Private Key </label>
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
                        <label htmlFor="czTotal" className="block text-sm font-medium text-gray-300">CZ Total</label>
                        <input
                            // type="number"
                            name="czTotal"
                            id="czTotal"
                            value={formData.czTotal}
                            onChange={handleInputChange}
                            placeholder="Enter the total CZ amount"
                            className="mt-2 w-full px-4 py-3 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-gray-200"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-green-400 text-gray-900 py-3 rounded-lg hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Sign Up
                    </button>
                </form>
                <p className="mt-6 text-center text-sm text-gray-400">
                    Already have an account?{' '}
                    <Link to="/login" className="text-green-400 hover:text-green-500">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
