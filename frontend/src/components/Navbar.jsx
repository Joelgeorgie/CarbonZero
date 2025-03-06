import React from "react";
import { useRecoilState } from 'recoil';
import { useNavigate } from "react-router-dom";
import { tokenA, privateKeyA } from '../Recoil/atoms';

const Navbar = () => {
    const [token, setToken] = useRecoilState(tokenA);
    const [privateKey, setPrivateKey] = useRecoilState(privateKeyA);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('privateKey');
        setToken(null);
        setPrivateKey(null);
    };

    return (
        <div className="flex justify-between items-center p-4 bg-gray-800 text-amber-50 px-20">
            <div 
                className="flex text-3xl cursor-pointer" 
                onClick={() => navigate('/dashboard')}
            >
                Carbon<h1 className="text-green-400">Zero</h1>
            </div>
            <button
                onClick={handleLogout}
                className="bg-green-400 p-2 rounded-md w-40 text-gray-900"
            >
                Logout
            </button>
        </div>
    );
};

export default Navbar;

