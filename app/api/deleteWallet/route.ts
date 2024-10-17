// File: reactwallet/app/api/deleteWallet/route.ts

import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function DELETE(request: Request) {
  try {
    const { publicKey } = await request.json();
    const filePath = path.join(process.cwd(), 'wallets.json');
    
    const data = await fs.readFile(filePath, 'utf-8');
    let wallets = JSON.parse(data);
    
    wallets = wallets.filter((wallet: {publicKey: string}) => wallet.publicKey !== publicKey);
    
    await fs.writeFile(filePath, JSON.stringify(wallets, null, 2));
    
    return NextResponse.json({ message: 'Wallet deleted successfully' });
  } catch (error) {
    console.error('Error deleting wallet:', error);
    return NextResponse.json({ error: 'Error deleting wallet' }, { status: 500 });
  }
}