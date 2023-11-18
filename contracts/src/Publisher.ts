import {
  Field,
  SmartContract,
  state,
  State,
  method,
  PrivateKey,
  PublicKey,
  Encoding,
  Bool,
  Reducer,
} from 'o1js';

export { Field, Encoding };

const oraclePubKey = 'B62qqqi4cbLkt5J14fshCSZpFz2fmS4fK8cuFmBuNvxR8pxFzmiwmM1';

export class Publisher extends SmartContract {
  // On-chain state definitions
  @state(Field) message = State<Field>();
  @state(PublicKey) oraclePublicKey = State<PublicKey>();

  @method init() {
    super.init();

    // Define initial values of on-chain state
    this.oraclePublicKey.set(PublicKey.fromJSON(oraclePubKey));
    this.message.set(Field(0));
  }

  @method publishMessage(message: Field, signerPrivateKey: PrivateKey) {
    const signerPublicKey = signerPrivateKey.toPublicKey();

    // Get the oracle public key from the contract state
    const oraclePublicKey = this.oraclePublicKey.get();
    this.oraclePublicKey.assertEquals(oraclePublicKey);

    // Get data from oracle
    const addresses = [
      'B62qqqi4cbLkt5J14fshCSZpFz2fmS4fK8cuFmBuNvxR8pxFzmiwmM1',
    ];
    const list = addresses.map((addr) => PublicKey.fromJSON(addr));

    // Assert that signer in list
    const isAllowed = list.reduce(
      (memo, value) => memo.or(value.equals(signerPublicKey)),
      Bool(false)
    );
    isAllowed.assertTrue();

    // Update on-chain message state
    this.message.set(message);
  }
}
