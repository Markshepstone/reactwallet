// File: reactwallet/app/create-wallet/page.tsx

'use client';

import { useState } from 'react';
import { Keypair } from 'stellar-sdk';

export default function CreateWallet() {
  const [publicKey, setPublicKey] = useState('');
  const [secretKey, setSecretKey] = useState('');

  const generateWallet = () => {
    const keypair = Keypair.random();
    setPublicKey(keypair.publicKey());
    setSecretKey(keypair.secret());
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Create New Wallet</h1>
      <button
        onClick={generateWallet}
        className="mb-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Generate New Wallet
      </button>
      {publicKey && (
        <div>
          <p>Public Key: {publicKey}</p>
          <p>Secret Key: {secretKey}</p>
          <p className="text-red-500 mt-2">
            Warning: Store your secret key securely. Never share it with anyone.
          </p>
        </div>
      )}
    </div>
  );
}