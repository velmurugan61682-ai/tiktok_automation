import { getCollection } from './src/lib/db.js';

const accounts = getCollection("connectedAccounts");
console.log("Total Connected Accounts:", accounts.length);
console.log("Accounts:", JSON.stringify(accounts, null, 2));
