// File: reactwallet/components/WalletList.tsx

'use client';

import React, { useState, useEffect } from 'react';

interface Wallet {
  publicKey: string;
  name: string;
  balance?: string;
}

const WalletList: React.FC = () => {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [editingWallet, setEditingWallet] = useState<string | null>(null);
  const [editPublicKey, setEditPublicKey] = useState('');
  const [editSecretKey, setEditSecretKey] = useState('');
  const [editWalletName, setEditWalletName] = useState('');
  const [deletingWallet, setDeletingWallet] = useState<string | null>(null);

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

   const startEditing = (publicKey: string) => {
    setEditingWallet(publicKey);
    const wallet = wallets.find(w => w.publicKey === publicKey);
    if (wallet) {
      setEditPublicKey(wallet.publicKey);
      setEditWalletName(wallet.name);
      setEditSecretKey(''); // For security, we don't pre-fill the secret key
    }
  };

  const cancelEditing = () => {
    setEditingWallet(null);
    setEditPublicKey('');
    setEditSecretKey('');
    setEditWalletName('');
  };

  const saveEdit = async () => {
    if (!editingWallet || !editPublicKey || !editSecretKey || !editWalletName) {
      setError('Public key, secret key, and wallet name are required for editing.');
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
          newSecretKey: editSecretKey,
          newName: editWalletName
        }),
      });
      
      if (response.ok) {
        const result = await response.json();
        setWallets(wallets.map(wallet => 
          wallet.publicKey === editingWallet ? result.updatedWallet : wallet
        ));
        setEditingWallet(null);
        setEditPublicKey('');
        setEditSecretKey('');
        setEditWalletName('');
        setError(null);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to edit wallet');
      }
    } catch (err) {
      setError(`Error editing wallet: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const confirmDelete = (publicKey: string) => {
    setDeletingWallet(publicKey);
  };

  const cancelDelete = () => {
    setDeletingWallet(null);
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
    } finally {
      setDeletingWallet(null);
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
                value={editWalletName}
                onChange={(e) => setEditWalletName(e.target.value)}
                placeholder="Enter Wallet Name"
                className="w-full p-2 mb-2 border rounded"
              />
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
              <p>Name: {wallet.name}</p>
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
              
              {deletingWallet === wallet.publicKey ? (
                <div className="mt-2">
                  <p className="text-red-500">Are you sure you want to delete this wallet?</p>
                  <button
                    onClick={() => deleteWallet(wallet.publicKey)}
                    className="mr-2 p-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Confirm Delete
                  </button>
                  <button
                    onClick={cancelDelete}
                    className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  </div>
              ) : (
                <button
                  onClick={() => confirmDelete(wallet.publicKey)}
                  className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      ))}
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
};

export default WalletList;