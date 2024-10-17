//Do not remove the comments
//location of this file reactwallet/components/WalletBalance.tsx

'use client';

import React, { useState } from 'react';

const WalletBalance: React.FC = () => {
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [secretKey, setSecretKey] = useState<string | null>(null);

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

  const createWallet = async () => {
    try {
      const response = await fetch('/api/createWallet');
      const data = await response.json();

      if (response.ok) {
        setPublicKey(data.publicKey);
        setSecretKey(data.secretKey);
        setError(null);
      } else {
        throw new Error(data.error || 'Error creating wallet');
      }
    } catch (err) {
      setPublicKey(null);
      setSecretKey(null);
      setError('Error creating wallet. Please try again.');
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
        className="w-full p-2 mb-4 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Check Balance
      </button>
      {balance && <p className="mt-4">Balance: {balance} XLM</p>}
      
      <button
        onClick={createWallet}
        className="w-full p-2 mt-4 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Create New Wallet
      </button>
      {publicKey && (
        <div className="mt-4">
          <p>Public Key: {publicKey}</p>
          <p>Secret Key: {secretKey}</p>
          <p className="text-red-500 mt-2">Warning: Store your secret key securely. Never share it with anyone.</p>
        </div>
      )}
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
};

export default WalletBalance;