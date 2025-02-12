import React from 'react';

const LineData = ({ name, value, canCopied }) => {
  const explorerURL = `https://explorer.solana.com/address/${value}?cluster=custom`;

  return (
    <div className="h-10 flex flex-row justify-between border-b-2 border-gray-900">
      <p>{name}</p>
      {canCopied ? (
        <p
          className="text-green-400 flex flex-row cursor-pointer"
          onClick={() => {
            window.open(explorerURL, '_blank', 'noopener,noreferrer');
          }}
        >
          {value}
        </p>
      ) : (
        <p className="text-gray-100  flex flex-row">{value}</p>
      )}
    </div>
  );
};

export default LineData;
