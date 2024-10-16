import pkg from 'stellar-sdk';
const { Server } = pkg;

async function testStellarServer() {
  try {
    console.log('Server class:', Server);
    const server = new Server('https://horizon.stellar.org');
    console.log('Successfully created Stellar Server instance');
    
    const testAddress = 'GCWXBSNTTC7NWMGJVMTIRNGKTOZFVLAY5ROUB5XOMI5UXP4RWS3B57LU';
    const account = await server.loadAccount(testAddress);
    console.log('Successfully loaded account');
    console.log('Account ID:', account.account_id);
  } catch (error) {
    console.error('Error:', error);
  }
}

testStellarServer();