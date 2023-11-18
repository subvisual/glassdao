import { Avatar, Button, Card, Heading, Typography } from "@ensdomains/thorin";
import React from "react";
import styled from "styled-components";

const Wrapper = styled(Card)`
  flex-direction: row;
  justify-content: start;
  gap: 10px;
`;

function IdCard({
  avatar,
  name,
  ensName,
}: {
  avatar?: string;
  name?: string;
  ensName?: string;
}) {
  return (
    <Wrapper>
      <div style={{ maxWidth: "70px", flexGrow: 1 }}>
        <Avatar label={`${name || ensName}'s avatar`} src={avatar} />
      </div>
      <div>
        <Heading>{name}</Heading>
        <Typography color="greyPrimary">{ensName}</Typography>
      </div>
    </Wrapper>
  );
}

export default IdCard;
