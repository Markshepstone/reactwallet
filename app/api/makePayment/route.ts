// File: reactwallet/app/api/makePayment/route.ts

import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import StellarSdk from 'stellar-sdk';

export async function POST(request: Request) {
  try {
    const { fromPublicKey, toAddress, amount, memo } = await request.json();
    
    // Retrieve the secret key for the fromPublicKey
    const filePath = path.join(process.cwd(), 'wallets.json');
    const data = await fs.readFile(filePath, 'utf-8');
    const wallets = JSON.parse(data);
    const wallet = wallets.find((w: {publicKey: string}) => w.publicKey === fromPublicKey);
    
    if (!wallet) {
      return NextResponse.json({ error: 'Source wallet not found' }, { status: 404 });
    }

    // Use the live Stellar network
    const server = new StellarSdk.Horizon.Server('https://horizon.stellar.org');
    const sourceKeys = StellarSdk.Keypair.fromSecret(wallet.secretKey);

    const sourceAccount = await server.loadAccount(sourceKeys.publicKey());
    
    // Check if destination account exists
    try {
      await server.loadAccount(toAddress);
    } catch (e) {
      if (e instanceof StellarSdk.NotFoundError) {
        // Destination account doesn't exist
        return NextResponse.json({ error: 'Destination account does not exist' }, { status: 400 });
      } else {
        throw e; // Re-throw if it's a different error
      }
    }

    // If we reach here, the account exists and is active, so let's make the payment
    let transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: StellarSdk.Networks.PUBLIC,
    })
      .addOperation(
        StellarSdk.Operation.payment({
          destination: toAddress,
          asset: StellarSdk.Asset.native(),
          amount: amount.toString(),
        }),
      );

    // Add memo if provided
    if (memo) {
      transaction = transaction.addMemo(StellarSdk.Memo.text(memo));
    }

    transaction = transaction
      .setTimeout(180)
      .build();
    
    transaction.sign(sourceKeys);
    const result = await server.submitTransaction(transaction);

    return NextResponse.json({ 
      message: 'Payment successful', 
      transactionHash: result.hash
    });
  } catch (error) {
    console.error('Error making payment:', error);
    return NextResponse.json({ error: 'Error making payment: ' + (error as Error).message }, { status: 500 });
  }
}