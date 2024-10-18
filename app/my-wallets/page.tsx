// File: reactwallet/app/my-wallets/page.tsx

import WalletList from '../../components/WalletList';

export default function MyWallets() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">My Wallets</h1>
      <WalletList />
    </div>
  );
}