// File: reactwallet/app/page.tsx

import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">aaaStellar Wallet Manager</h1>
      <div className="space-y-4">
        <Link href="/make-payment" className="block w-64 p-4 bg-blue-500 text-white text-center rounded hover:bg-blue-600">
          Make Payment
        </Link><br></br>
        <Link href="/my-wallets" className="block w-64 p-4 bg-green-500 text-white text-center rounded hover:bg-green-600">
          My Wallets
        </Link><br></br>
        <Link href="/create-wallet" className="block w-64 p-4 bg-yellow-500 text-white text-center rounded hover:bg-yellow-600">
          Create Wallet
        </Link><br></br>
        <Link href="/add-wallet" className="block w-64 p-4 bg-purple-500 text-white text-center rounded hover:bg-purple-600">
          Add Wallet
        </Link>
      </div>
    </div>
  );
}