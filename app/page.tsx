import WalletManager from '../components/WalletManager';
import WalletList from '../components/WalletList';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Stellar Wallet Manager</h1>
      <WalletManager />
      <WalletList />
    </main>
  );
}