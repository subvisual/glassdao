import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import ZkappWorkerClient from "@/lib/zkappWorkerClient";
import { Field, MerkleTree, PublicKey } from "o1js";
import {
  calculateMerkleRoot,
  createTree,
  getRootFromWitness,
} from "@/lib/merkleroot";

const signaturesMock = [
  "226737914325023845218636111057251780156036265551267936159326931770235510744",
  "226737914325023845218636111057251780156036265551267936159326931234234510744",
  "123737914325023845218636111057251780156036265551267936159326931770235510744",
  "16800499555793692526894213099480938382511091338422244196866733508727794867668",
];

const MESSAGE = "Hello";
const ZKAPP_ADDRESS = "B62qrRRD1XbVB22g3YHw7cw5QP6gm8KyEUQ2hr5dAVgmeiKXmS2rgcb";

export default function Home() {
  const [state, setState] = useState({
    zkappWorkerClient: null as null | ZkappWorkerClient,
    hasWallet: null as null | boolean,
    hasBeenSetup: false,
    accountExists: false,
    currentNum: null as null | Field,
    publicKey: null as null | PublicKey,
    zkappPublicKey: null as null | PublicKey,
    creatingTransaction: false,
  });

  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    async function timeout(seconds: number): Promise<void> {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, seconds * 1000);
      });
    }

    (async () => {
      if (!state.hasBeenSetup) {
        console.log("Loading web worker...");
        setDisplayText("Loading web worker...");

        const zkappWorkerClient = new ZkappWorkerClient();
        await timeout(5);

        setDisplayText("Done loading web worker");
        console.log("Done loading web worker");

        await zkappWorkerClient.setActiveInstanceToBerkeley();

        const mina = (window as any).mina;

        if (mina == null) {
          setState({ ...state, hasWallet: false });
          return;
        }

        const publicKeyBase58: string = (await mina.requestAccounts())[0];
        const publicKey = PublicKey.fromBase58(publicKeyBase58);

        console.log(`Using key:${publicKey.toBase58()}`);
        setDisplayText(`Using key:${publicKey.toBase58()}`);

        setDisplayText("Checking if fee payer account exists...");
        console.log("Checking if fee payer account exists...");

        const res = await zkappWorkerClient.fetchAccount({
          publicKey: publicKey!,
        });
        const accountExists = res.error == null;

        await zkappWorkerClient.loadContract();

        console.log("Compiling zkApp...");
        setDisplayText("Compiling zkApp...");
        await zkappWorkerClient.compileContract();
        console.log("zkApp compiled");
        setDisplayText("zkApp compiled...");

        const zkappPublicKey = PublicKey.fromBase58(ZKAPP_ADDRESS);

        await zkappWorkerClient.initZkappInstance(zkappPublicKey);

        console.log("Getting zkApp state...");
        setDisplayText("Getting zkApp state...");
        await zkappWorkerClient.fetchAccount({ publicKey: zkappPublicKey });

        setState({
          ...state,
          zkappWorkerClient,
          hasWallet: true,
          hasBeenSetup: true,
          publicKey,
          zkappPublicKey,
          accountExists,
        });
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (state.hasBeenSetup && !state.accountExists) {
        for (; ;) {
          setDisplayText("Checking if fee payer account exists...");
          console.log("Checking if fee payer account exists...");
          const res = await state.zkappWorkerClient!.fetchAccount({
            publicKey: state.publicKey!,
          });
          const accountExists = res.error == null;
          if (accountExists) {
            break;
          }
          await new Promise((resolve) => setTimeout(resolve, 5000));
        }
        setState({ ...state, accountExists: true });
      }
    })();
  }, [state.hasBeenSetup]);

  async function setRootState() {
    const root = calculateMerkleRoot([Field(1), Field(2), Field(3)]);
    console.log("root: ", root);

    await state.zkappWorkerClient!.setRoot(root);

    await state.zkappWorkerClient?.provePublishTransaction();

    console.log(state.zkappWorkerClient!.getRoot());
  }

  async function postMessage() {
    console.log("Publish");

    const signResult = await (window as any).mina
      ?.signMessage({
        message: MESSAGE,
      })
      .catch((err: any) => err);

    console.log(signResult);

    const tree = createTree(signaturesMock.map((item) => Field(item)));

    const pos = signaturesMock.findIndex(signResult.signature.field);

    const calculatedRoot = getRootFromWitness(
      tree,
      BigInt(pos),
      signResult.signature.field
    );

    const pub = await state.zkappWorkerClient!.publishMessage(
      signResult.signature.field,
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
      {displayText}
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
        <button type="button" onClick={postMessage}>
          postMessage
        </button>
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
    </div>
  );
}
