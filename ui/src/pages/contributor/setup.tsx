import styled from "styled-components";
import { useAccount } from "wagmi";
import { redirect } from "next/navigation";
import { useUserRole } from "../../hooks/useUserRole";
import {
  Button,
  Card,
  Checkbox,
  Heading,
  Input,
  Tag,
  Textarea,
  Typography,
} from "@ensdomains/thorin";
import Flex from "../../components/Flex";
import { FormEvent, useState } from "react";

const STEPS = 3;

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

type FormData = {
  name: string;
  hideName?: boolean;
  role: string;
  location: string;
  bio: string;
};

const initialFormData: FormData = {
  name: "",
  hideName: false,
  role: "",
  location: "",
  bio: "",
};

export default function ContributorSetup() {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [minaAddr, setMinaAddr] = useState<string>();

  const nextStep = () => setStep((prev) => Math.min(prev + 1, STEPS));

  const saveFormData = (data: FormData) => {
    setFormData(data);
    nextStep();
  };
  const saveMinaAddress = (data: string) => {
    setMinaAddr(data);
    nextStep();
  };

  const submit = () => {
    //do something with formData and minaAddr
  };

  switch (step) {
    case 1:
      return <Step1 saveFormData={saveFormData} />;
    case 2:
      return <Step2 saveMinaAddress={saveMinaAddress} />;
    case 3:
      return <Step3 formData={formData} />;
  }
}

const Step1 = ({
  saveFormData,
}: {
  saveFormData: (data: FormData) => void;
}) => {
  const submit = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    const data = new FormData(ev.currentTarget);
    const name = data.get("name")?.toString() || "";
    const role = data.get("role")?.toString() || "";
    const location = data.get("location")?.toString() || "";
    const bio = data.get("bio")?.toString() || "";
    const hideName = !!data.get("hideName")?.toString;

    saveFormData({ name, role, location, bio, hideName });
  };

  return (
    <FormWrapper>
      <Form onSubmit={submit}>
        <Input
          id="name"
          name="name"
          required
          label="Name"
          placeholder="Your name"
        />
        <Checkbox
          id="hideName"
          name="hideName"
          label="Don't want to use my name"
        />
        <Input
          id="role"
          name="role"
          required
          label="Role"
          placeholder="Your role"
        />
        <Input
          id="location"
          name="location"
          required
          label="Location"
          placeholder="Your location"
        />
        <Textarea
          id="bio"
          name="bio"
          required
          label="Bio"
          placeholder="A brief description of yourself, your skills and experience"
        />
        <ContinueButton type="submit">Continue</ContinueButton>
      </Form>
    </FormWrapper>
  );
};

const Step2 = ({
  saveMinaAddress,
}: {
  saveMinaAddress: (data: string) => void;
}) => {
  const minaConnect = () => {
    //connect
    //get address ??
    //save address
    saveMinaAddress("fake-address");
  };
  return (
    <FormWrapper>
      <Flex direction="column" gap="30px">
        <Heading>Connect your Mina wallet</Heading>
        <Typography color="greyPrimary" weight="light">
          You need to have a Mina Protocol address to be able to anonymously
          review the DAOs you’re contributing to. The Mina address is different
          from your ETH address.
        </Typography>
        <Flex gap="20px">
          <Button colorStyle="accentSecondary" onClick={() => {}}>
            Get a Mina Wallet
          </Button>
          <Button onClick={minaConnect}>Connect</Button>
        </Flex>
      </Flex>
    </FormWrapper>
  );
};

const Step3 = ({ formData }: { formData: FormData }) => {
  return (
    <Flex direction="column">
      <FormWrapper>idCard</FormWrapper>
      <FormWrapper>
        <Typography>About</Typography>
        <Flex justifyContent="start">
          <Tag>{formData.role}</Tag>
          <Tag colorStyle="greySecondary">{formData.location}</Tag>
        </Flex>
        <Typography>{formData.bio}</Typography>
      </FormWrapper>
    </Flex>
  );
};
