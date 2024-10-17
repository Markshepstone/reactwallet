// File: reactwallet/app/api/saveWallet/route.ts

import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { publicKey, secretKey } = await request.json();

    if (!publicKey || !secretKey) {
      return NextResponse.json({ error: 'Public key and secret key are required' }, { status: 400 });
    }

    const wallet = { publicKey, secretKey };
    const walletData = JSON.stringify(wallet);

    const filePath = path.join(process.cwd(), 'wallets.json');

    let wallets = [];
    try {
      const existingData = await fs.readFile(filePath, 'utf-8');
      wallets = JSON.parse(existingData);
    } catch (error) {
      // File doesn't exist or is empty, we'll create a new one
    }

    wallets.push(wallet);

    await fs.writeFile(filePath, JSON.stringify(wallets, null, 2));

    return NextResponse.json({ message: 'Wallet saved successfully' });
  } catch (error) {
    console.error('Error saving wallet:', error);
    return NextResponse.json({ error: 'Error saving wallet: ' + (error as Error).message }, { status: 500 });
  }
}