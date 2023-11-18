import { AccountUpdate, Field, Mina, PrivateKey } from 'o1js';
import { Publisher } from './Publisher.js';

const STOP = 0x01;

function bytesOfConstantField(field: Field): Uint8Array {
  return Uint8Array.from(Field.toBytes(field));
}

function bytesToFields(bytes: Uint8Array) {
  // we encode 248 bits (31 bytes) at a time into one field element
  let fields = [];
  let currentBigInt = 0n;
  let bitPosition = 0n;
  for (let byte of bytes) {
    currentBigInt += BigInt(byte) << bitPosition;
    bitPosition += 8n;
    if (bitPosition === 248n) {
      fields.push(Field(currentBigInt.toString()));
      currentBigInt = 0n;
      bitPosition = 0n;
    }
  }
  // encode the final chunk, with an added STOP byte to make the mapping invertible
  currentBigInt += BigInt(STOP) << bitPosition;
  fields.push(Field(currentBigInt.toString()));
  return fields;
}

function bytesFromFields(fields: Field[]) {
  // find STOP byte in last chunk to determine length of byte array
  let lastChunk = fields.pop();
  if (lastChunk === undefined) return new Uint8Array();
  let lastChunkBytes = bytesOfConstantField(lastChunk);
  let i = lastChunkBytes.lastIndexOf(STOP, 30);
  if (i === -1) throw Error('Error (bytesFromFields): Invalid encoding.');
  let bytes = new Uint8Array(fields.length * 31 + i);
  bytes.set(lastChunkBytes.subarray(0, i), fields.length * 31);
  // convert the remaining fields
  i = 0;
  for (let field of fields) {
    bytes.set(bytesOfConstantField(field).subarray(0, 31), i);
    i += 31;
  }
  fields.push(lastChunk);
  return bytes;
}

export function stringToFields(message: string) {
  let bytes = new TextEncoder().encode(message);
  return bytesToFields(bytes);
}

export function stringFromFields(fields: Field[]) {
  let bytes = bytesFromFields(fields);
  return new TextDecoder().decode(bytes);
}

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
/* const deployTxn = await Mina.transaction(deployerAccount, () => {
  AccountUpdate.fundNewAccount(deployerAccount);
  zkAppInstance.deploy();
});
await deployTxn.prove();
await deployTxn.sign([deployerKey, zkAppPrivateKey]).send(); */

console.log(`Deployed to: ${zkAppAddress.toJSON()}`);

const cid = 'QmUWBDtbKdf6vQkfyeERNhhS4xhTZMc5KVy7f11YYtkebL';

/* const fields = stringToFields(cid);

fields.map((item) => console.log(item.toString())); */

const f1 =
  '175451729166171745266871132239843900406832068053938512107606952448200371537';
const f2 = '1725838268474687958952912626419911477';

const str = stringFromFields([Field(f1), Field(f2)]);

console.log(str);

/* 
const Bob2 = Local.testAccounts[1];
const txn2 = await Mina.transaction(Bob2.publicKey, () => {
  zkAppInstance.publishMessage(Field('45646'), Bob2.privateKey);
});
await txn2.prove();
await txn2.sign([Bob2.privateKey]).send();

console.log(`message: ${zkAppInstance.message.get()}`);
 */
