// File: reactwallet/app/api/getWallets/route.ts

import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'wallets.json');
    const data = await fs.readFile(filePath, 'utf-8');
    const wallets = JSON.parse(data);
    
    // Return only public keys for security
    const safeWallets = wallets.map(({publicKey}: {publicKey: string}) => ({publicKey}));
    
    return NextResponse.json(safeWallets);
  } catch (error) {
    console.error('Error fetching wallets:', error);
    return NextResponse.json({ error: 'Error fetching wallets' }, { status: 500 });
  }
}