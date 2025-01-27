import React, { useState } from 'react';
import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';
import { Link } from 'react-router-dom';
import { tokenA ,privateKeyA } from '../Recoil/atoms';
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
                        
 
                        console.log(1)
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
        <div>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <label>
                    Password:
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter your password"
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
                <button type="submit">Login</button>
            </form>
            <p>
                Don't have an account? <Link to="/signup">SIGN UP</Link>
            </p>
        </div>
    );
};

export default Login;
