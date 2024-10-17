// File: reactwallet/components/PaymentForm.tsx

'use client';

import React, { useState } from 'react';

interface Wallet {
  publicKey: string;
}

interface PaymentFormProps {
  wallets: Wallet[];
}

const PaymentForm: React.FC<PaymentFormProps> = ({ wallets }) => {
  const [fromWallet, setFromWallet] = useState('');
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!fromWallet || !toAddress || !amount) {
      setError('All fields are required');
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
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(`Payment successful! Transaction hash: ${data.transactionHash}`);
        setToAddress('');
        setAmount('');
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
                {wallet.publicKey}
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