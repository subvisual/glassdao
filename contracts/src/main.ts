import { AccountUpdate, Field, Mina, PrivateKey } from 'o1js';
import { Publisher } from './Publisher.js';

const useProof = false;
const Local = Mina.LocalBlockchain({ proofsEnabled: useProof });
Mina.setActiveInstance(Local);
const { privateKey: deployerKey, publicKey: deployerAccount } =
  Local.testAccounts[0];

// Create a public/private key pair. The public key is your address and where you deploy the zkApp to
const zkAppPrivateKey = PrivateKey.random();
const zkAppAddress = zkAppPrivateKey.toPublicKey();
//const zkAppInstance = new Add(zkAppAddress);
const zkAppInstance = new Publisher(zkAppAddress);
const deployTxn = await Mina.transaction(deployerAccount, () => {
  AccountUpdate.fundNewAccount(deployerAccount);
  zkAppInstance.deploy();
});
await deployTxn.prove();
await deployTxn.sign([deployerKey, zkAppPrivateKey]).send();

console.log(`Deployed to: ${zkAppAddress.toJSON()}`);


/* 
const Bob2 = Local.testAccounts[1];
const txn2 = await Mina.transaction(Bob2.publicKey, () => {
  zkAppInstance.publishMessage(Field('45646'), Bob2.privateKey);
});
await txn2.prove();
await txn2.sign([Bob2.privateKey]).send();

console.log(`message: ${zkAppInstance.message.get()}`);
 */
