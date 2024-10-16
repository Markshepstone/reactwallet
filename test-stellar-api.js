import * as StellarSdk from 'stellar-sdk';

// Test wallet address
const testAddress = 'GCWXBSNTTC7NWMGJVMTIRNGKTOZFVLAY5ROUB5XOMI5UXP4RWS3B57LU';

async function testStellarAPI() {
  try {
    const server = new StellarSdk.Server('https://horizon.stellar.org');
    console.log('Successfully created Stellar Server instance');

    const account = await server.loadAccount(testAddress);
    console.log('Successfully loaded account');

    const balances = account.balances.filter(b => b.asset_type === 'native');
    
    if (balances.length > 0) {
      console.log(`Balance: ${balances[0].balance} XLM`);
    } else {
      console.log('No native balance found');
    }
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

testStellarAPI();