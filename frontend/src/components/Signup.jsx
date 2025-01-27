import React, { useState } from 'react';
import { Keypair } from '@solana/web3.js'; 
import bs58 from 'bs58';
import { Link } from 'react-router-dom';
import { tokenA ,privateKeyA } from '../Recoil/atoms';
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
                        console.log('Success:', data.message, data.token,data.errors);
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
        <div>
            <h1>Signup</h1>
            <form onSubmit={handleSignup}>
                <label>
                    Company name:
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                    />
                </label>
                <br />
                <label>
                    Password:
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                    />
                </label>
                <br />
                <label>
                    Solana Private Key (Base58-encoded):
                    <input
                        type="text"
                        name="privateKey"
                        value={formData.privateKey}
                        onChange={handleInputChange}
                        placeholder="Enter your Base58 private key"
                    />
                </label>
                <br />
                <label>
                    CZ Total:
                    <input
                        type="number"
                        name="czTotal"
                        value={formData.czTotal}
                        onChange={handleInputChange}
                    />
                </label>
                <br />
                <button type="submit">Signup</button>
            </form>

            <p>
                Already have an account? <Link to="/login">Login here</Link>
            </p>
        </div>
    );
};

export default Signup;
