// File: reactwallet/components/WalletList.tsx

'use client';

import React, { useState, useEffect } from 'react';
import PaymentForm from './PaymentForm';

interface Wallet {
  publicKey: string;
  balance?: string;
}

const WalletList: React.FC = () => {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [newPublicKey, setNewPublicKey] = useState('');
  const [newSecretKey, setNewSecretKey] = useState('');
  const [editingWallet, setEditingWallet] = useState<string | null>(null);
  const [editPublicKey, setEditPublicKey] = useState('');
  const [editSecretKey, setEditSecretKey] = useState('');

  useEffect(() => {
    fetchWallets();
  }, []);

  const fetchWallets = async () => {
    try {
      const response = await fetch('/api/getWallets');
      if (response.ok) {
        const data = await response.json();
        setWallets(data);
        setError(null);
      } else {
        throw new Error('Failed to fetch wallets');
      }
    } catch (err) {
      setError('Error fetching wallets. Please try again.');
    }
  };

  const checkBalance = async (publicKey: string) => {
    try {
      const response = await fetch(`/api/walletInfo?address=${encodeURIComponent(publicKey)}`);
      if (response.ok) {
        const data = await response.json();
        setWallets(wallets.map(wallet => 
          wallet.publicKey === publicKey ? {...wallet, balance: data.balance} : wallet
        ));
        setError(null);
      } else {
        throw new Error('Failed to fetch balance');
      }
    } catch (err) {
      setError('Error fetching balance. Please try again.');
    }
  };

  const deleteWallet = async (publicKey: string) => {
    try {
      const response = await fetch('/api/deleteWallet', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ publicKey }),
      });
      if (response.ok) {
        setWallets(wallets.filter(wallet => wallet.publicKey !== publicKey));
        setError(null);
      } else {
        throw new Error('Failed to delete wallet');
      }
    } catch (err) {
      setError('Error deleting wallet. Please try again.');
    }
  };

  const addWallet = async () => {
    if (!newPublicKey || !newSecretKey) {
      setError('Both public key and secret key are required.');
      return;
    }
    try {
      const response = await fetch('/api/saveWallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ publicKey: newPublicKey, secretKey: newSecretKey }),
      });
      if (response.ok) {
        setWallets([...wallets, { publicKey: newPublicKey }]);
        setNewPublicKey('');
        setNewSecretKey('');
        setError(null);
      } else {
        throw new Error('Failed to add wallet');
      }
    } catch (err) {
      setError('Error adding wallet. Please try again.');
    }
  };

  const startEditing = (publicKey: string) => {
    setEditingWallet(publicKey);
    const wallet = wallets.find(w => w.publicKey === publicKey);
    if (wallet) {
      setEditPublicKey(wallet.publicKey);
      setEditSecretKey(''); // For security, we don't pre-fill the secret key
    }
  };

  const cancelEditing = () => {
    setEditingWallet(null);
    setEditPublicKey('');
    setEditSecretKey('');
  };

  const saveEdit = async () => {
    if (!editingWallet || !editPublicKey || !editSecretKey) {
      setError('Both public key and secret key are required for editing.');
      return;
    }
    try {
      const response = await fetch('/api/editWallet', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          oldPublicKey: editingWallet, 
          newPublicKey: editPublicKey, 
          newSecretKey: editSecretKey 
        }),
      });
      if (response.ok) {
        setWallets(wallets.map(wallet => 
          wallet.publicKey === editingWallet ? { ...wallet, publicKey: editPublicKey } : wallet
        ));
        setEditingWallet(null);
        setEditPublicKey('');
        setEditSecretKey('');
        setError(null);
      } else {
        throw new Error('Failed to edit wallet');
      }
    } catch (err) {
      setError('Error editing wallet. Please try again.');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">My Wallets</h2>
      {wallets.map((wallet) => (
        <div key={wallet.publicKey} className="mb-4 p-4 border rounded">
          {editingWallet === wallet.publicKey ? (
            <div>
              <input
                type="text"
                value={editPublicKey}
                onChange={(e) => setEditPublicKey(e.target.value)}
                placeholder="Enter New Public Key"
                className="w-full p-2 mb-2 border rounded"
              />
              <input
                type="text"
                value={editSecretKey}
                onChange={(e) => setEditSecretKey(e.target.value)}
                placeholder="Enter New Secret Key"
                className="w-full p-2 mb-2 border rounded"
              />
              <button
                onClick={saveEdit}
                className="mr-2 p-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Save
              </button>
              <button
                onClick={cancelEditing}
                className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div>
              <p>Public Key: {wallet.publicKey}</p>
              {wallet.balance && <p>Balance: {wallet.balance} XLM</p>}
              <button
                onClick={() => checkBalance(wallet.publicKey)}
                className="mr-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Check Balance
              </button>
              <button
                onClick={() => startEditing(wallet.publicKey)}
                className="mr-2 p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => deleteWallet(wallet.publicKey)}
                className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ))}


      <PaymentForm wallets={wallets} />



      <div className="mt-8">
        <h3 className="text-xl font-bold mb-2">Add New Wallet</h3>
        <input
          type="text"
          value={newPublicKey}
          onChange={(e) => setNewPublicKey(e.target.value)}
          placeholder="Enter Public Key"
          className="w-full p-2 mb-2 border rounded"
        />
        <input
          type="text"
          value={newSecretKey}
          onChange={(e) => setNewSecretKey(e.target.value)}
          placeholder="Enter Secret Key"
          className="w-full p-2 mb-2 border rounded"
        />
        <button
          onClick={addWallet}
          className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Add Wallet
        </button>
      </div>
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
};

export default WalletList;