// File: reactwallet/components/PaymentForm.tsx

'use client';

import React, { useState, useEffect } from 'react';

interface Wallet {
  publicKey: string;
  name: string;
}

const PaymentForm: React.FC = () => {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [fromWallet, setFromWallet] = useState('');
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchWallets();
  }, []);

  const fetchWallets = async () => {
    try {
      const response = await fetch('/api/getWallets');
      if (response.ok) {
        const data = await response.json();
        setWallets(data);
      } else {
        throw new Error('Failed to fetch wallets');
      }
    } catch (err) {
      setError('Error fetching wallets. Please try again.');
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!fromWallet || !toAddress || !amount) {
      setError('From wallet, to address, and amount are required');
      return;
    }

    try {
      const response = await fetch('/api/makePayment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromPublicKey: fromWallet,
          toAddress,
          amount,
          memo,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(`Payment successful! Transaction hash: ${data.transactionHash}`);
        setToAddress('');
        setAmount('');
        setMemo('');
      } else {
        throw new Error(data.error || 'Payment failed');
      }
    } catch (err) {
      setError('Error making payment. Please try again.');
    }
  };

  return (
    <div className="p-4 border rounded mt-8">
      <h2 className="text-2xl font-bold mb-4">Make a Payment</h2>
      <form onSubmit={handlePayment}>
        <div className="mb-4">
          <label className="block mb-2">From Wallet:</label>
          <select
            value={fromWallet}
            onChange={(e) => setFromWallet(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Select a wallet</option>
            {wallets.map((wallet) => (
              <option key={wallet.publicKey} value={wallet.publicKey}>
                {wallet.name} ({wallet.publicKey})
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2">To Address:</label>
          <input
            type="text"
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter recipient's address"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Amount (XLM):</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter amount to send"
            step="0.0000001"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Memo (optional):</label>
          <input
            type="text"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter memo (required for some exchanges)"
            maxLength={28}
          />
        </div>
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Send Payment
        </button>
      </form>
      {error && <p className="mt-4 text-red-500">{error}</p>}
      {success && <p className="mt-4 text-green-500">{success}</p>}
    </div>
  );
};

export default PaymentForm;