import pkg from 'stellar-sdk';

const { Horizon } = pkg;
const { Server } = Horizon;

console.log('Horizon:', Horizon);
console.log('Server:', Server);
console.log('Is Server a constructor?', typeof Server === 'function');