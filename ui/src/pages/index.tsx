import Link from "next/link";
import ConnectMetaMask from "@/components/ConnectMetaMask";
import { Button, Heading } from "@ensdomains/thorin";
import styled from "styled-components";

const Main = styled.main`
  padding: 20px 40px;
`;
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: fit-content;
  margin: 40px auto;
`;

export default function Home() {
  return (
    <Main>
      <Heading align="center">GlassDAO</Heading>
      <Wrapper>
        <ConnectMetaMask />
        <Button
          as="a"
          href="/review"
          colorStyle="background"
          shape="rounded"
          width="45"
        >
          Add review
        </Button>
      </Wrapper>
    </Main>
  );
}
