// File: reactwallet/app/add-wallet/page.tsx

'use client';

import { useState } from 'react';

export default function AddWallet() {
  const [name, setName] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/saveWallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, publicKey, secretKey }),
      });
      if (response.ok) {
        setMessage('Wallet added successfully');
        setName('');
        setPublicKey('');
        setSecretKey('');
      } else {
        throw new Error('Failed to add wallet');
      }
    } catch (error) {
      setMessage('Error adding wallet. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Add Existing Wallet</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1">Wallet Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="publicKey" className="block mb-1">Public Key</label>
          <input
            type="text"
            id="publicKey"
            value={publicKey}
            onChange={(e) => setPublicKey(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="secretKey" className="block mb-1">Secret Key</label>
          <input
            type="text"
            id="secretKey"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button type="submit" className="p-2 bg-green-500 text-white rounded hover:bg-green-600">
          Add Wallet
        </button>
      </form>
      {message && <p className="mt-4 text-green-500">{message}</p>}
    </div>
  );
}