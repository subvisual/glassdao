import styled from "styled-components";
import {
  useAccount,
  useContractEvent,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { Card, Input, Textarea, Button, Heading } from "@ensdomains/thorin";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { address as linkAddress } from "../../lib/abis/contracts/link/address";
import linkAbi from "../../lib/abis/contracts/link/abi.json";

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
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [companyId, setCompanyId] = useState<string>();

  const { config } = usePrepareContractWrite({
    address: linkAddress,
    abi: linkAbi,
    functionName: "createCompany",
    args: [formData.name],
    enabled: !!formData.name,
  });

  const { write, data } = useContractWrite(config);

  const { isLoading } = useWaitForTransaction({
    hash: data?.hash,
  });

  const unwatch = useContractEvent({
    address: linkAddress,
    abi: linkAbi,
    eventName: "CompanyCreated",
    listener(log: any) {
      if (log[0].args.company_id) {
        setCompanyId(parseInt(log[0].args.company_id).toString());
        unwatch?.();
      }
    },
  });

  useEffect(() => {
    if (!companyId) return;

    localStorage.setItem(
      address as string,
      JSON.stringify({
        ...formData,
        companyId: companyId.toString(),
      })
    );

    router.push("/dao/" + address);
  }, [companyId]);

  const submit = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    write?.();
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
          onChange={(ev) =>
            setFormData((prev) => ({ ...prev, name: ev.target.value }))
          }
        />
        <Input
          id="sector"
          name="sector"
          label="Sector"
          placeholder="Select sector"
          required
          onChange={(ev) =>
            setFormData((prev) => ({ ...prev, sector: ev.target.value }))
          }
        />
        <Input
          id="creationDate"
          name="creationDate"
          label="Creation Date"
          placeholder="Creation Date"
          required
          onChange={(ev) =>
            setFormData((prev) => ({ ...prev, creationDate: ev.target.value }))
          }
        />
        <Textarea
          id="bio"
          name="bio"
          label="Bio"
          placeholder="A brief description of your DAO"
          required
          onChange={(ev) =>
            setFormData((prev) => ({ ...prev, bio: ev.target.value }))
          }
        />
        <ContinueButton loading={isLoading} disabled={!address} type="submit">
          Continue
        </ContinueButton>
      </Form>
    </FormWrapper>
  );
}
