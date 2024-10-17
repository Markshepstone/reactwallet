// File: reactwallet/app/api/editWallet/route.ts

import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function PUT(request: Request) {
  try {
    const { oldPublicKey, newPublicKey, newSecretKey } = await request.json();
    const filePath = path.join(process.cwd(), 'wallets.json');
    
    const data = await fs.readFile(filePath, 'utf-8');
    let wallets = JSON.parse(data);
    
    const index = wallets.findIndex((wallet: {publicKey: string}) => wallet.publicKey === oldPublicKey);
    if (index !== -1) {
      wallets[index] = { publicKey: newPublicKey, secretKey: newSecretKey };
      await fs.writeFile(filePath, JSON.stringify(wallets, null, 2));
      return NextResponse.json({ message: 'Wallet updated successfully' });
    } else {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error updating wallet:', error);
    return NextResponse.json({ error: 'Error updating wallet' }, { status: 500 });
  }
}