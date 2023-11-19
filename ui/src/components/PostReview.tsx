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
import styled from "styled-components";
import {
  Card,
  Input,
  Checkbox,
  Textarea,
  Button,
  Heading,
  Spinner,
  Typography,
} from "@ensdomains/thorin";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const ContinueButton = styled(Button)`
  width: 100%;
`;

const signaturesMock = [
  "226737914325023845218636111057251780156036265551267936159326931770235510744",
  "226737914325023845218636111057251780156036265551267936159326931234234510744",
  "123737914325023845218636111057251780156036265551267936159326931770235510744",
  "16800499555793692526894213099480938382511091338422244196866733508727794867668",
];

const MESSAGE = "Hello";

export default function PostReview({
  state,
}: {
  state: ReturnType<typeof useZKSetup>;
}) {
  const [loading, setLoading] = useState(false);
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

    const req = await fetch(
      `/api/oracle?signature=${signResult.signature.field}`
    );
    const oracleData = await req.json();

    const pub = await state.zkappWorkerClient!.publishMessage(
      newMessageCid,
      oracleData.data,
      oracleData.signature
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
    const body = data.get("body") as string;

    const newCid = await updateReviews([...reviewContent, { position, body }]);
    const newCidAsFields = stringToFields(newCid).map((item) =>
      item.toString()
    );

    console.log({
      newCid,
      newCidAsFields,
    });

    postMessage(newCidAsFields);
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Input
        id="position"
        name="position"
        required
        label="Position at Subvisual"
        placeholder="Position at Subvisual"
      />
      <Textarea
        id="body"
        name="body"
        required
        label="Describe your experience"
        placeholder="Write about your experience contributing to this DAO"
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "24px",
        }}
      >
        <ContinueButton colorStyle="accentSecondary" loading={loading}>
          Review
        </ContinueButton>
        <ContinueButton type="submit">Review</ContinueButton>
      </div>
    </Form>
  );
}
