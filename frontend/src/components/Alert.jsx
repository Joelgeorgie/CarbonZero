import React from 'react';
import { useRecoilState } from 'recoil';
import { alertState } from '../Recoil/atoms';

const Alert = () => {
    const [alert, setAlert] = useRecoilState(alertState);

    if (!alert) return null;

    const isError = alert.type === "error";
    const explorerURL = !isError 
        ? `https://explorer.solana.com/tx/${alert.signature}?cluster=custom` 
        : null;

    return (
        <div className={`fixed bottom-4 right-4 p-4 rounded-md text-white border-2 flex flex-row `}>
            <div className={isError ? 'text-red-400' : 'text-green-500'}>
                {isError ? `Error: ${alert.message}` : alert.message}
            </div>
            {!isError && (
                <>
                    : {alert.signature.slice(0, 20)}...
                    <button 
                        className="ml-2 text-green-500"
                        onClick={() => window.open(explorerURL, '_blank', 'noopener,noreferrer')}
                    >
                        &#8599;
                    </button>
                </>
            )}
        </div>
    );
};

export default Alert;
