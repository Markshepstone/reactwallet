import { NextResponse } from 'next/server';
import pkg from 'stellar-sdk';

const { Horizon } = pkg;
const { Server } = Horizon;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');

  if (!address) {
    return NextResponse.json({ error: 'Address is required' }, { status: 400 });
  }

  try {
    const server = new Server('https://horizon.stellar.org');
    const account = await server.loadAccount(address);
    const balances = account.balances.filter((b: any) => b.asset_type === 'native');
    
    if (balances.length > 0) {
      return NextResponse.json({ balance: balances[0].balance });
    } else {
      return NextResponse.json({ balance: '0' });
    }
  } catch (error) {
    console.error('Error fetching Stellar balance:', error);
    return NextResponse.json({ error: 'Error fetching balance: ' + (error as Error).message }, { status: 500 });
  }
}