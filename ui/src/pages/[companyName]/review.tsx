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
import { useZKSetup } from "@/lib/useZkSetup";
import PostReview from "@/components/PostReview";

const FormWrapper = styled(Card)`
  width: 50%;
  margin: 50px auto 0;
  padding: 40px 50px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const ContinueButton = styled(Button)`
  width: 100%;
`;

export default function ReviewCompany() {
  const state = useZKSetup();

  return (
    <FormWrapper>
      <Heading>Review Subvisual</Heading>

      {state.hasBeenSetup ? (
        <PostReview state={state} />
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "24px 0",
            gap: "24px",
          }}
        >
          <Spinner />
          <Typography weight="light">Loading Mina contract</Typography>
        </div>
      )}
    </FormWrapper>
  );
}
