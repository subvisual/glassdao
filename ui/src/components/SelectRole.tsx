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
    <>
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
            As a DAO, you can prevent outsiders from posing as contributors and
            let members review their experience.
          </Typography>
          <ButtonWrapper>
            <Button as="a" href="/dao/setup">
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
            As a contributor, you can easily prove which DAOs you have been
            contributing to and anonymously review them. I’m a contributor
          </Typography>
          <ButtonWrapper>
            <Button as="a" href="/contributor/setup">
              I&apos;m a contributor
            </Button>
          </ButtonWrapper>
        </Card>
      </Flex>
    </>
  );
}

export default SelectRole;
