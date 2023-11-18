import styled from "styled-components";
import { useAccount } from "wagmi";
import { redirect } from "next/navigation";
import { useUserRole } from "../../hooks/useUserRole";
import {
  Card,
  Input,
  Checkbox,
  Textarea,
  Button,
  Heading,
} from "@ensdomains/thorin";
import { FormEvent } from "react";
import { useRouter } from "next/router";

const FormWrapper = styled(Card)`
  width: 70%;
  margin: 50px auto 0;
  padding: 40px 50px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const ContinueButton = styled(Button)`
  width: fit-content;
  align-self: end;
`;

export default function DAOSetup() {
  const router = useRouter();
  const { address } = useAccount();

  const submit = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    const data = new FormData(ev.currentTarget);
    const name = data.get("name")?.toString() || "";
    const role = data.get("sector")?.toString() || "";
    const location = data.get("creationDate")?.toString() || "";
    const bio = data.get("bio")?.toString() || "";

    // createDAO({ name, sector, creationDate, bio });
    router.push(address!);
  };

  return (
    <FormWrapper>
      <Form onSubmit={submit}>
        <Heading>Create DAO</Heading>
        <Input
          id="name"
          name="name"
          required
          label="Name"
          placeholder="DAO name"
        />
        <Input
          id="sector"
          name="sector"
          required
          label="Sector"
          placeholder="Select sector"
        />
        <Input
          id="creationDate"
          name="creationDate"
          required
          label="Creation Date"
          placeholder="Creation Date"
        />
        <Textarea
          id="bio"
          name="bio"
          required
          label="Bio"
          placeholder="A brief description of your DAO"
        />
        <ContinueButton type="submit">Continue</ContinueButton>
      </Form>
    </FormWrapper>
  );
}
