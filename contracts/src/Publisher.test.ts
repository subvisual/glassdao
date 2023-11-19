import { Publisher } from './Publisher';
import {
  Field,
  Mina,
  PrivateKey,
  PublicKey,
  AccountUpdate,
  Signature,
  MerkleTree,
  MerkleWitness,
} from 'o1js';

/*
 * This file specifies how to test the `Add` example smart contract. It is safe to delete this file and replace
 * with your own tests.
 *
 * See https://docs.minaprotocol.com/zkapps for more info.
 */

let proofsEnabled = true;

class MyMerkleWitness extends MerkleWitness(4) {}

const signaturesMock = [
  '226737914325023845218636111057251780156036265551267936159326931770235510744',
  '226737914325023845218636111057251780156036265551267936159326931234234510744',
  '123737914325023845218636111057251780156036265551267936159326931770235510744',
  '16800499555793692526894213099480938382511091338422244196866733508727794867668',
];

function getMerkleRoot(userProvidedSig: string) {
  // Functions used in UI
  const createTree = (sigs: Field[]): MerkleTree => {
    const tree = new MerkleTree(sigs.length);
    tree.fill(sigs);

    return tree;
  };
  const getRootFromWitness = (
    tree: MerkleTree,
    pos: bigint,
    sig: Field
  ): string => {
    const witness = tree.getWitness(pos);
    const circuitWitness = new MyMerkleWitness(witness);
    console.log(sig);
    return circuitWitness.calculateRoot(sig).toString();
  };

  const pos = signaturesMock.findIndex((item) => userProvidedSig == item);
  const tree = createTree(signaturesMock.map((item) => Field(item)));

  return getRootFromWitness(tree, BigInt(pos), Field(userProvidedSig));
}

describe('Add', () => {
  let deployerAccount: PublicKey;
  let deployerKey: PrivateKey;
  let senderAccount: PublicKey;
  let senderKey: PrivateKey;
  let zkAppAddress: PublicKey;
  let zkAppPrivateKey: PrivateKey;
  let zkApp: Publisher;

  beforeAll(async () => {
    if (proofsEnabled) await Publisher.compile();
  });

  beforeEach(() => {
    const Local = Mina.LocalBlockchain({ proofsEnabled });
    Mina.setActiveInstance(Local);
    ({ privateKey: deployerKey, publicKey: deployerAccount } =
      Local.testAccounts[0]);
    ({ privateKey: senderKey, publicKey: senderAccount } =
      Local.testAccounts[1]);
    zkAppPrivateKey = PrivateKey.random();
    zkAppAddress = zkAppPrivateKey.toPublicKey();
    zkApp = new Publisher(zkAppAddress);
  });

  async function localDeploy() {
    const txn = await Mina.transaction(deployerAccount, () => {
      AccountUpdate.fundNewAccount(deployerAccount);
      zkApp.deploy();
    });
    await txn.prove();
    // this tx needs .sign(), because `deploy()` adds an account update that requires signature authorization
    await txn.sign([deployerKey, zkAppPrivateKey]).send();
  }

  it('generates and deploys the `Publisher` smart contract', async () => {
    await localDeploy();
    const root = zkApp.root.get();
    expect(root).toEqual(Field(0));
  });

  it('updates the root', async () => {
    await localDeploy();

    const newRoot = Field(2);

    // update transaction
    const txn = await Mina.transaction(senderAccount, () => {
      zkApp.setRoot(newRoot);
    });
    await txn.prove();
    await txn.sign([senderKey]).send();

    const updatedRoot = zkApp.root.get();
    expect(updatedRoot).toEqual(newRoot);
  });

  it('publishMessage ', async () => {
    await localDeploy();

    const root = getMerkleRoot(signaturesMock[0]);

    // set root first
    const txn = await Mina.transaction(senderAccount, () => {
      zkApp.setRoot(Field(root));
    });
    await txn.prove();
    await txn.sign([senderKey]).send();

    // now publish

    const userSig = signaturesMock[1];
    const testRoot = getMerkleRoot(userSig);

    const msg = Field(123);
    const msgEnd = Field(456);
    const signature = Signature.fromBase58(
      '7mXJBH2ZCCQrEMLyA1dt4cE8DNyTDscvxfXESynat3v91qVEBLgwuEqdaKEdhUni9JJTSWf2Umfv3B2cN9qUDmiJENXh1aKz'
    );

    // update transaction
    const txn2 = await Mina.transaction(senderAccount, () => {
      zkApp.publishMessage(msg, msgEnd, Field(testRoot), signature);
    });
    await txn2.prove();
    await txn2.sign([senderKey]).send();

    expect(zkApp.message.get()).toEqual(msg);
    expect(zkApp.messageEnd.get()).toEqual(msgEnd);
  });
});
