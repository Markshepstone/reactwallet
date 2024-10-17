//Do not remove the comments
//location of this file reactwallet/app/api/StellarBallance/page.ts

import WalletBalance from '../components/WalletBalance';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Stellar Wallet Balance Checker</h1>
      <WalletBalance />
    </main>
  );
}