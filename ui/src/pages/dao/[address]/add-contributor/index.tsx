import styled from "styled-components";
import {
  useAccount,
  useContractEvent,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import {
  Card,
  Input,
  Checkbox,
  Textarea,
  Button,
  Heading,
} from "@ensdomains/thorin";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { address as linkAddress } from "@/lib/abis/contracts/link/address";
import linkAbi from "@/lib/abis/contracts/link/abi.json";

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
  const [formData, setFormData] = useState<Record<string, string>>({});

  const localData = JSON.parse(
    localStorage.getItem(daoAddress as string) || "{}"
  );
  const { config } = usePrepareContractWrite({
    address: linkAddress,
    abi: linkAbi,
    functionName: "addEmployee",
    args: [localData.companyId, formData.address],
    enabled: localData.companyId && formData.address,
  });

  const { data, write } = useContractWrite(config);

  const { data: txData } = useWaitForTransaction({
    hash: data?.hash,
  });

  useEffect(() => {
    if (!txData) return;

    localStorage.setItem(
      daoAddress as string,
      JSON.stringify({
        ...localData,
        contributors: [...(localData.contributors || []), formData],
      })
    );

    router.push("/dao/" + address);
  }, [txData]);

  const submit = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    write?.();
  };

  return (
    <FormWrapper>
      <Form onSubmit={submit}>
        <Heading>Add Contributor</Heading>
        <Input
          id="address"
          name="address"
          required
          label="Contributor Address"
          placeholder="Address"
          onChange={(ev) =>
            setFormData((prev) => ({ ...prev, address: ev.target.value }))
          }
        />
        <Input
          id="startDate"
          name="startDate"
          required
          label="Start Date"
          placeholder="Start Date"
          onChange={(ev) =>
            setFormData((prev) => ({ ...prev, startDate: ev.target.value }))
          }
        />
        <Input
          id="endDate"
          name="endDate"
          label="End Date"
          placeholder="End Date"
          onChange={(ev) =>
            setFormData((prev) => ({ ...prev, endDate: ev.target.value }))
          }
        />
        <Textarea
          id="role"
          required
          name="role"
          placeholder="Role"
          label="role"
          onChange={(ev) =>
            setFormData((prev) => ({ ...prev, role: ev.target.value }))
          }
        />
        <ContinueButton disabled={!address} type="submit">
          Continue
        </ContinueButton>
      </Form>
    </FormWrapper>
  );
}
