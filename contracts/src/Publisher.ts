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

  @method publishMessage(message: Field, sig: Field) {
    // Get the oracle public key from the contract state
    /* const oraclePublicKey = this.oraclePublicKey.get();
    this.oraclePublicKey.assertEquals(oraclePublicKey); */

    // Get data from oracle
    const addresses = [
      '226737914325023845218636111057251780156036265551267936159326931770235510744',
    ];
    const list = addresses.map((addr) => Field(addr));

    // Assert that signer in list
    const isAllowed = list.reduce(
      (memo, value) => memo.or(value.equals(sig)),
      Bool(false)
    );
    isAllowed.assertTrue();

    // Update on-chain message state
    this.message.set(message);
  }
}
