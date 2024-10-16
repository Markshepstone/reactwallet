'use client';

import React, { useState } from 'react';

const WalletBalance: React.FC = () => {
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkBalance = async () => {
    try {
      const response = await fetch(`/api/stellarBalance?address=${encodeURIComponent(address)}`);
      const data = await response.json();
      
      if (response.ok) {
        setBalance(data.balance);
        setError(null);
      } else {
        throw new Error(data.error || 'Error fetching balance');
      }
    } catch (err) {
      setBalance(null);
      setError('Error fetching balance. Please check the address and try again.');
    }
  };

  return (
    <div className="p-4">
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Enter Stellar address"
        className="w-full p-2 mb-4 border rounded"
      />
      <button
        onClick={checkBalance}
        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Check Balance
      </button>
      {balance && <p className="mt-4">Balance: {balance} XLM</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
};

export default WalletBalance;