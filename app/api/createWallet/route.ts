// File: reactwallet/app/api/createWallet/route.ts

import { NextResponse } from 'next/server';
import pkg from 'stellar-sdk';

const { Keypair } = pkg;

export async function GET() {
  try {
    const keypair = Keypair.random();
    const publicKey = keypair.publicKey();
    const secretKey = keypair.secret();

    return NextResponse.json({ 
      publicKey,
      secretKey
    });
  } catch (error) {
    console.error('Error creating Stellar wallet:', error);
    return NextResponse.json({ error: 'Error creating wallet: ' + (error as Error).message }, { status: 500 });
  }
}