import styled from "styled-components";
import { useUserRole } from "../hooks/useUserRole";
import { useAccount } from "wagmi";
import SelectRole from "../components/SelectRole";
import { useRouter } from "next/navigation";
import {
  Button,
  Heading,
  Input,
  MagnifyingGlassSimpleSVG,
  Typography,
} from "@ensdomains/thorin";
import Flex from "../components/Flex";

import { NotificationItem, chainNameType } from "@pushprotocol/uiweb";
import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";
import { ethers } from "ethers";
import { useEffect, useRef, useState } from "react";

const H1 = styled(Heading)`
  text-wrap: nowrap;
  background: -webkit-linear-gradient(
    330.4deg,
    #44bcf0 4.54%,
    #7298f8 59.2%,
    #a099ff 148.85%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  padding: 0 40px;
`;

const Text = styled(Typography)`
  text-align: center;
`;

export default function Home() {
  const userRole = useUserRole();
  const { isConnected } = useAccount();
  const router = useRouter();

  if (userRole) router.push("/" + userRole);

  if (!isConnected)
    return (
      <Flex
        width="min-content"
        direction="column"
        margin="100px auto"
        gap="32px"
        style={{ flex: "1 0 auto" }}
      >
        <H1>A magnifying glass for DAOs</H1>
        <Text color="greyPrimary">
          Search for a DAO to see their contributors and anonymous reviews on
          what&apos;s really like to be a part of them.
        </Text>
        <Input
          icon={<MagnifyingGlassSimpleSVG />}
          label="search for DAOs or contributors"
          placeholder="Search for a DAO or contributor"
          hideLabel
        />
      </Flex>
    );

  return <SelectRole />;
}
