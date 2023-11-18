import { FormEvent, useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import ZkappWorkerClient from "@/lib/zkappWorkerClient";
import { Field, MerkleTree, PublicKey } from "o1js";
import {
  calculateMerkleRoot,
  createTree,
  getRootFromWitness,
} from "@/lib/merkleroot";
import { stringFromFields } from "o1js/dist/node/bindings/lib/encoding";
import { getReviews, updateReviews } from "@/lib/reviews";
import { useZKSetup } from "@/lib/useZkSetup";
import { stringToFields } from "@/lib/transform";

const signaturesMock = [
  "226737914325023845218636111057251780156036265551267936159326931770235510744",
  "226737914325023845218636111057251780156036265551267936159326931234234510744",
  "123737914325023845218636111057251780156036265551267936159326931770235510744",
  "16800499555793692526894213099480938382511091338422244196866733508727794867668",
];

const MESSAGE = "Hello";
const ZKAPP_ADDRESS = "B62qjyvNLaYNvzVxPAj8yG8q6hYnkK9rmcWLdVAmkpijKnng46GCGbK";

export default function Home() {
  const state = useZKSetup();
  const [reviewContent, setReviewContent] = useState<
    { position: string; body: string; rating: string }[]
  >([]);

  async function getReviewsFromContractState() {
    const messageCid = await state.zkappWorkerClient?.getCurrentMessage();

    console.log(messageCid);

    if (!messageCid) return;

    const str = messageCid.toString();
    //const cid = "QmUWBDtbKdf6vQkfyeERNhhS4xhTZMc5KVy7f11YYtkebL";

    const data = await getReviews(messageCid);

    console.log(data);

    setReviewContent(data);
  }

  useEffect(() => {
    if (state.hasBeenSetup) {
      getReviewsFromContractState();
    }
  }, [state.hasBeenSetup]);

  async function setRootState() {
    const root = calculateMerkleRoot(signaturesMock.map((item) => Field(item)));
    console.log("root: ", root);

    await state.zkappWorkerClient!.setRoot(root);

    await state.zkappWorkerClient?.provePublishTransaction();

    console.log(await state.zkappWorkerClient!.getRoot());
    const json = await state.zkappWorkerClient?.getTransactionJSON();
    const updateResult = await (window as any).mina?.sendTransaction({
      transaction: json,
    });

    console.log(updateResult);
  }

  async function postMessage(newMessageCid: string[]) {
    console.log("Publish");

    const signResult = await (window as any).mina
      ?.signMessage({
        message: MESSAGE,
      })
      .catch((err: any) => err);

    console.log(signResult);

    const pos = signaturesMock.findIndex(
      (item) => signResult.signature.field.toString() == item
    );
    const tree = createTree(signaturesMock.map((item) => Field(item)));

    const calculatedRoot = getRootFromWitness(
      tree,
      BigInt(pos),
      Field(signResult.signature.field)
    );

    const pub = await state.zkappWorkerClient!.publishMessage(
      newMessageCid,
      calculatedRoot
    );

    await state.zkappWorkerClient?.provePublishTransaction();
    const json = await state.zkappWorkerClient?.getTransactionJSON();

    console.log(json);

    const updateResult = await (window as any).mina?.sendTransaction({
      transaction: json, // this is zk commond, create by zkApp.
    });

    console.log(updateResult);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const data = new FormData(event.target as HTMLFormElement);

    const position = data.get("position") as string;
    const rating = data.get("rating") as string;
    const body = data.get("body") as string;

    const newCid = await updateReviews([
      ...reviewContent,
      { position, rating, body },
    ]);
    const newCidAsFields = stringToFields(newCid).map((item) =>
      item.toString()
    );

    console.log({
      newCid,
      newCidAsFields,
    });

    postMessage(newCidAsFields);
  }

  // Create UI elements

  let hasWallet;
  if (state.hasWallet != null && !state.hasWallet) {
    const auroLink = "https://www.aurowallet.com/";
    const auroLinkElem = (
      <a href={auroLink} target="_blank" rel="noreferrer">
        Install Auro wallet here
      </a>
    );
    hasWallet = <div>Could not find a wallet. {auroLinkElem}</div>;
  }

  let setup = (
    <div
      className={styles.start}
      style={{ fontWeight: "bold", fontSize: "1.5rem", paddingBottom: "5rem" }}
    >
      {state.statusMessage}
      {hasWallet}
    </div>
  );

  let accountDoesNotExist;
  if (state.hasBeenSetup && !state.accountExists) {
    const faucetLink =
      "https://faucet.minaprotocol.com/?address=" + state.publicKey!.toBase58();
    accountDoesNotExist = (
      <div>
        <span style={{ paddingRight: "1rem" }}>Account does not exist.</span>
        <a href={faucetLink} target="_blank" rel="noreferrer">
          Visit the faucet to fund this fee payer account
        </a>
      </div>
    );
  }

  let mainContent;
  if (state.hasBeenSetup && state.accountExists) {
    mainContent = (
      <div style={{ justifyContent: "center", alignItems: "center" }}>
        <p>Done!</p>
        <button type="button" onClick={setRootState}>
          setRootState
        </button>
        <button type="button">postMessage</button>
      </div>
    );
  }

  return (
    <div className={styles.main} style={{ padding: 0 }}>
      <div className={styles.center} style={{ padding: 0 }}>
        {setup}
        {accountDoesNotExist}
        {mainContent}
      </div>
      <div>
        <form action="" onSubmit={handleSubmit}>
          <input type="text" name="position" />
          <input type="text" name="rating" />
          <textarea name="body" rows={10}></textarea>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}
