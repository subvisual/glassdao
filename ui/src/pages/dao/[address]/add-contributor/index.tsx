import styled from "styled-components";
import { useAccount } from "wagmi";
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

export default function AddContributor() {
  const router = useRouter();
  const { address } = useAccount();
  const { address: daoAddress } = router.query;

  const submit = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    const data = new FormData(ev.currentTarget);
    const address = data.get("address")?.toString() || "";
    const startDate = data.get("startDate")?.toString() || "";
    const endDate = data.get("endDate")?.toString() || "";
    const role = data.get("role")?.toString() || "";

    // addContributor({ name, startDate, endDate, role });
    daoAddress && router.push("/dao/" + daoAddress);
  };

  return (
    <FormWrapper>
      <Form>
        <Heading>Add Contributor</Heading>
        <Input
          id="address"
          name="address"
          required
          label="Contributor Address"
          placeholder="Address"
        />
        <Input
          id="startDate"
          name="startDate"
          required
          label="Start Date"
          placeholder="Start Date"
        />
        <Input
          id="endDate"
          name="endDate"
          label="End Date"
          placeholder="End Date"
        />
        <Textarea
          id="role"
          required
          name="role"
          placeholder="Role"
          label="role"
        />
        <ContinueButton type="submit">Continue</ContinueButton>
      </Form>
    </FormWrapper>
  );
}
