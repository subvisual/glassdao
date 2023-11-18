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
  Spinner,
  Tag,
  Textarea,
  Typography,
} from "@ensdomains/thorin";
import Flex from "../../components/Flex";
import { FormEvent, useState } from "react";
import IdCard from "../../components/IdCard";
import { useEnsName, useEnsAvatar } from "wagmi";
import { useRouter } from "next/router";
import { CheckCircleSVG } from "@ensdomains/thorin";

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

type Status = {
  loading: boolean;
  success: boolean;
};

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
  const [status, setStatus] = useState<{ loading: boolean; success: boolean }>({
    loading: false,
    success: false,
  });

  const nextStep = () => setStep((prev) => Math.min(prev + 1, STEPS));

  const saveFormData = (data: FormData) => {
    setFormData(data);
    nextStep();
  };
  const submit = async (data: string) => {
    setStatus((prev) => ({ ...prev, loading: true }));
    nextStep();
    //do something with formData and minaAddr
    await new Promise((res) =>
      setTimeout(() => {
        res("yay");
      }, 1000)
    );
    setStatus((prev) => ({ success: true, loading: false }));
  };

  switch (step) {
    case 1:
      return <Step1 saveFormData={saveFormData} />;
    case 2:
      return <Step2 submit={submit} />;
    case 3:
      return <Step3 formData={formData} status={status} />;
    default:
      return null;
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

const Step2 = ({ submit }: { submit: (data: string) => void }) => {
  // const { address: ethAddress } = useAccount();

  const minaConnect = () => {
    //connect
    //get address ??
    submit("fake-address");
  };
  return (
    <FormWrapper>
      <Flex direction="column" gap="30px">
        <Heading>Connect your Mina wallet</Heading>
        <Typography color="greyPrimary" weight="light">
          You need to have a Mina Protocol address to be able to anonymously
          review the DAOs you&apos;re contributing to. The Mina address is
          different from your ETH address.
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

const Step3 = ({
  formData,
  status,
}: {
  formData: FormData;
  status: Status;
}) => {
  const { address } = useAccount();
  const { data: ensName, isLoading: ensNameLoading } = useEnsName({ address });
  const { data: avatar, isLoading: avatarLoading } = useEnsAvatar({
    name: ensName,
  });

  return (
    <Flex direction="column">
      <FormWrapper>
        {ensNameLoading && avatarLoading ? (
          <Spinner />
        ) : (
          <IdCard
            avatar={avatar || undefined}
            name={formData.name}
            ensName={ensName || undefined}
          />
        )}
      </FormWrapper>
      <FormWrapper>
        <Typography>About</Typography>
        <Flex justifyContent="start">
          <Tag>{formData.role}</Tag>
          <Tag colorStyle="greySecondary">{formData.location}</Tag>
        </Flex>
        <Typography>{formData.bio}</Typography>
      </FormWrapper>
      <div style={{ marginTop: "30px" }}>
        {status.loading && (
          <Card>
            <Flex gap="20px">
              <Spinner />
              <Typography>Saving contributor...</Typography>
            </Flex>
          </Card>
        )}
        {!status.loading && status.success && (
          <Card>
            <Flex gap="20px">
              <CheckCircleSVG />
              <Typography>Contributor saved</Typography>
            </Flex>
          </Card>
        )}
      </div>
    </Flex>
  );
};
