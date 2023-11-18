import {
  Field,
  SmartContract,
  state,
  State,
  method,
  PublicKey,
  Encoding,
} from 'o1js';

export { Field, Encoding };

const oraclePubKey = 'B62qqqi4cbLkt5J14fshCSZpFz2fmS4fK8cuFmBuNvxR8pxFzmiwmM1';

export class Publisher extends SmartContract {
  // On-chain state definitions
  @state(Field) message = State<Field>();
  @state(Field) messageEnd = State<Field>();
  @state(PublicKey) oraclePublicKey = State<PublicKey>();
  @state(Field) root = State<Field>();

  @method init() {
    super.init();

    // Define initial values of on-chain state
    this.oraclePublicKey.set(PublicKey.fromJSON(oraclePubKey));
    this.message.set(Field(0));
    this.messageEnd.set(Field(0));
    this.root.set(Field(0));
  }

  @method publishMessage(
    message: Field,
    messageEnd: Field,
    calculatedRoot: Field
  ) {
    this.root.getAndAssertEquals();
    this.message.getAndAssertEquals();

    this.root.assertEquals(calculatedRoot);
    this.message.set(message);
    this.messageEnd.set(messageEnd);
  }

  @method setRoot(newRoot: Field) {
    this.root.getAndAssertEquals();
    this.root.set(newRoot);
  }

  @method setOraclePublicKey(oraclePubKey: PublicKey) {
    this.oraclePublicKey.getAndAssertEquals();
    this.oraclePublicKey.set(oraclePubKey);
  }
}
