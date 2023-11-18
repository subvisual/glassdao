import {
  Button,
  Card,
  Heading,
  Tag,
  Typography,
  HouseSVG,
  PersonSVG,
} from "@ensdomains/thorin";
import React from "react";
import styled from "styled-components";
import Flex from "./Flex";

const CardTitle = styled.div`
  display: flex;
  gap: 10px;
`;

const ButtonWrapper = styled.div`
  margin-top: 35px;
`;

function SelectRole() {
  return (
    <div>
      <Heading align="center">What is your role?</Heading>
      <Flex gap="30px" margin="50px 0">
        <Card>
          <CardTitle>
            <Tag size="medium">
              <HouseSVG />
            </Tag>
            <Typography asProp="h2">DAO</Typography>
          </CardTitle>
          <Typography weight="light">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </Typography>
          <ButtonWrapper>
            <Button as="a" href="/dao">
              I&apos;m representing a DAO
            </Button>
          </ButtonWrapper>
        </Card>
        <Card>
          <CardTitle>
            <Tag size="medium">
              <PersonSVG />
            </Tag>
            <Typography asProp="h2">Contributor</Typography>
          </CardTitle>
          <Typography weight="light">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </Typography>
          <ButtonWrapper>
            <Button as="a" href="/contributor">
              I&apos;m a contributor
            </Button>
          </ButtonWrapper>
        </Card>
      </Flex>
    </div>
  );
}

export default SelectRole;
