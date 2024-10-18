// File: reactwallet/app/api/editWallet/route.ts

import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function PUT(request: Request) {
  try {
    const { oldPublicKey, newPublicKey, newSecretKey, newName } = await request.json();
    console.log('Received edit request:', { oldPublicKey, newPublicKey, newName });
    
    const filePath = path.join(process.cwd(), 'wallets.json');
    
    const data = await fs.readFile(filePath, 'utf-8');
    let wallets = JSON.parse(data);
    
    const index = wallets.findIndex((wallet: {publicKey: string}) => wallet.publicKey === oldPublicKey);
    if (index !== -1) {
      wallets[index] = { publicKey: newPublicKey, secretKey: newSecretKey, name: newName };
      await fs.writeFile(filePath, JSON.stringify(wallets, null, 2));
      console.log('Wallet updated successfully:', wallets[index]);
      return NextResponse.json({ 
        message: 'Wallet updated successfully',
        updatedWallet: { publicKey: newPublicKey, name: newName }
      });
    } else {
      console.log('Wallet not found:', oldPublicKey);
      return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error updating wallet:', error);
    return NextResponse.json({ error: 'Error updating wallet: ' + (error as Error).message }, { status: 500 });
  }
}